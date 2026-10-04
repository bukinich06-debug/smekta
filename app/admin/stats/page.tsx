import { redirect } from 'next/navigation';
import type { ProjectStatus } from '@prisma/client';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';
import { AdminStats } from '@/components/admin-stats';
import { getSession } from '@/services/auth/getSession';
import { getAdminStats } from '@/services/stats/getAdminStats';

interface IPageProps {
  searchParams: Promise<{
    status?: ProjectStatus;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

const parseDateParam = (value?: string): Date | undefined => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  return value as unknown as Date;
};

const AdminStatsPage = async ({ searchParams }: IPageProps) => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const params = await searchParams;

  const data = await getAdminStats({
    status: params.status,
    dateFrom: parseDateParam(params.dateFrom),
    dateTo: parseDateParam(params.dateTo),
  });

  return (
    <AdminPageWrapper userName={session.user.name}>
      <AdminStats data={data} />
    </AdminPageWrapper>
  );
};

export default AdminStatsPage;
