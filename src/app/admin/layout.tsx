import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardStats } from '@/actions/analytics';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role || '')) {
    redirect('/auth/signin');
  }

  const stats = await getDashboardStats();

  return (
    <AdminLayoutClient
      initialStats={{
        totalCreators: stats.totalCreators,
        activeProducts: stats.activeProducts
      }}
    >
      {children}
    </AdminLayoutClient>
  );
}
