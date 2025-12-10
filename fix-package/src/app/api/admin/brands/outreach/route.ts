import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Get outreach emails for a brand
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const emails = await prisma.outreachEmail.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: emails,
    });
  } catch (error) {
    console.error('Get outreach emails error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

// POST - Create and optionally send outreach email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      brandId,
      templateId,
      subject,
      body: emailBody,
      sendNow,
    } = body;

    if (!brandId || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Brand ID, subject, and body are required' },
        { status: 400 }
      );
    }

    // Get brand for variable replacement
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Replace template variables
    const processedSubject = replaceVariables(subject, brand);
    const processedBody = replaceVariables(emailBody, brand);

    // Create email record
    const email = await prisma.outreachEmail.create({
      data: {
        brandId,
        templateId,
        subject: processedSubject,
        body: processedBody,
        status: sendNow ? 'SENT' : 'DRAFT',
        sentAt: sendNow ? new Date() : null,
      },
    });

    // If sending, update brand status and last contacted
    if (sendNow) {
      await prisma.brand.update({
        where: { id: brandId },
        data: {
          status: brand.status === 'LEAD' ? 'CONTACTED' : brand.status,
          lastContactedAt: new Date(),
        },
      });

      // TODO: Actually send email via SendGrid/Resend/etc
      // For now, we just mark it as sent
      console.log(`[OUTREACH] Email would be sent to ${brand.contactEmail}:`);
      console.log(`Subject: ${processedSubject}`);
      console.log(`Body: ${processedBody.substring(0, 200)}...`);
    }

    return NextResponse.json({
      success: true,
      data: email,
      message: sendNow ? 'Email sent successfully' : 'Draft saved',
    });
  } catch (error) {
    console.error('Create outreach email error:', error);
    return NextResponse.json(
      { error: 'Failed to create email' },
      { status: 500 }
    );
  }
}

// PATCH - Update email (mark as opened, replied, etc)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, responseBody } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'OPENED') {
        updateData.openedAt = new Date();
      } else if (status === 'REPLIED') {
        updateData.repliedAt = new Date();
        
        // Also update brand status to RESPONDED
        const email = await prisma.outreachEmail.findUnique({
          where: { id },
          select: { brandId: true },
        });
        
        if (email) {
          await prisma.brand.update({
            where: { id: email.brandId },
            data: { status: 'RESPONDED' },
          });
        }
      }
    }

    if (responseBody) {
      updateData.responseBody = responseBody;
    }

    const email = await prisma.outreachEmail.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: email,
    });
  } catch (error) {
    console.error('Update outreach email error:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

// Helper function to replace template variables
function replaceVariables(text: string, brand: any): string {
  const variables: Record<string, string> = {
    '{{brand_name}}': brand.name || '',
    '{{contact_name}}': brand.contactName || 'there',
    '{{shop_name}}': brand.tiktokShopName || brand.name || '',
    '{{current_rate}}': brand.currentOpenRate 
      ? `${(parseFloat(brand.currentOpenRate) * 100).toFixed(0)}%` 
      : 'standard',
    '{{proposed_rate}}': brand.targetRate 
      ? `${(parseFloat(brand.targetRate) * 100).toFixed(0)}%` 
      : '20%',
    '{{category}}': brand.category || 'your category',
    '{{follower_count}}': brand.followerCount?.toLocaleString() || '',
    '{{product_count}}': brand.productCount?.toString() || '',
  };

  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  
  return result;
}
