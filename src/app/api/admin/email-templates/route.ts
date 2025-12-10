import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// Default templates to seed
const DEFAULT_TEMPLATES = [
  {
    name: 'Initial Partnership Outreach',
    category: 'initial_outreach',
    subject: 'Partnership Opportunity - Affiliate Automated x {{brand_name}}',
    body: `Hi {{contact_name}},

I'm reaching out from Affiliate Automated, a TikTok Shop MCN with 200+ active creators generating over $500K in monthly GMV.

I noticed {{shop_name}} has great products in the {{category}} space, and I think there's a strong opportunity for us to work together.

Currently, your open collaboration rate is around {{current_rate}}. We'd love to discuss offering our creators an exclusive {{proposed_rate}} commission rate in exchange for priority promotion across our network.

What this means for you:
• Access to 200+ vetted TikTok Shop creators
• Priority placement in our product alerts
• Dedicated promotion through our Discord community
• Consistent, quality content from experienced affiliates

Would you be open to a quick call this week to discuss?

Best,
Chase
Affiliate Automated
Market Mix Media LLC`,
    variables: ['brand_name', 'contact_name', 'shop_name', 'category', 'current_rate', 'proposed_rate'],
  },
  {
    name: 'Follow Up - No Response',
    category: 'follow_up',
    subject: 'Quick follow up - {{brand_name}} partnership',
    body: `Hi {{contact_name}},

Just wanted to follow up on my previous email about a potential partnership between Affiliate Automated and {{brand_name}}.

Our creators are actively looking for quality {{category}} products to promote, and {{shop_name}} seems like a great fit.

Would you have 15 minutes this week for a quick call?

Best,
Chase
Affiliate Automated`,
    variables: ['brand_name', 'contact_name', 'category', 'shop_name'],
  },
  {
    name: 'Negotiation - Counter Offer',
    category: 'negotiation',
    subject: 'Re: {{brand_name}} Commission Discussion',
    body: `Hi {{contact_name}},

Thanks for getting back to me about the partnership.

I understand {{current_rate}} is your standard rate. Here's what I can offer:

If you can meet us at {{proposed_rate}}, we'll:
• Feature {{brand_name}} products in our weekly "Hot Products" alert to all 200+ creators
• Pin your top 3 products in our Discord for 30 days
• Guarantee minimum 50 creators add your products to their showcase

This has worked really well for other brands in the {{category}} space - we've driven 2-3x the normal affiliate volume for partners at this rate.

Let me know if that works, or if there's a middle ground that makes sense.

Best,
Chase`,
    variables: ['brand_name', 'contact_name', 'current_rate', 'proposed_rate', 'category'],
  },
  {
    name: 'Welcome - Partnership Confirmed',
    category: 'onboarding',
    subject: 'Welcome to Affiliate Automated! 🎉 Next Steps for {{brand_name}}',
    body: `Hi {{contact_name}},

Excited to officially welcome {{brand_name}} to Affiliate Automated!

Here's what happens next:

1. **Product Setup** (Today)
   - Send me a list of your top 10-20 products you want promoted
   - I'll add them to our platform with the {{proposed_rate}} rate

2. **Creator Announcement** (Within 24 hours)
   - We'll announce {{brand_name}} to our creator community
   - Products will appear in our "New Partner" spotlight

3. **Ongoing**
   - Our creators will add products to their showcases
   - You'll see affiliate orders come through TikTok Shop
   - We'll check in monthly to optimize performance

If you have any product images, talking points, or content guidelines you want creators to follow, send those over and I'll include them in the announcement.

Looking forward to driving some great results together!

Best,
Chase
Affiliate Automated`,
    variables: ['brand_name', 'contact_name', 'proposed_rate'],
  },
];

// GET - List all templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    let templates = await prisma.emailTemplate.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    // If no templates exist, seed defaults
    if (templates.length === 0) {
      await prisma.emailTemplate.createMany({
        data: DEFAULT_TEMPLATES.map(t => ({
          ...t,
          isActive: true,
        })),
      });
      
      templates = await prisma.emailTemplate.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, subject, body: templateBody, category, variables } = body;

    if (!name || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    // Auto-detect variables if not provided
    const detectedVariables = variables || extractVariables(templateBody + ' ' + subject);

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body: templateBody,
        category,
        variables: detectedVariables,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PATCH - Update template
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Re-detect variables if body changed
    if (updateData.body || updateData.subject) {
      const template = await prisma.emailTemplate.findUnique({ where: { id } });
      const fullText = (updateData.body || template?.body || '') + ' ' + (updateData.subject || template?.subject || '');
      updateData.variables = extractVariables(fullText);
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete template
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    await prisma.emailTemplate.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted',
    });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

// Helper function to extract variables from text
function extractVariables(text: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}
