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

const parseDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

const AdminStatsPage = async ({ searchParams }: IPageProps) => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const params = await searchParams;

  const data = await getAdminStats({
    status: params.status,
    dateFrom: parseDate(params.dateFrom),
    dateTo: parseDate(params.dateTo),
  });

  return (
    <AdminPageWrapper userName={session.user.name}>
      <AdminStats data={data} />
    </AdminPageWrapper>
  );
};

export default AdminStatsPage;
