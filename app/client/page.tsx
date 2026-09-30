import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/services/auth/getSession';
import { getClientCabinet } from '@/services/clients/getClientCabinet';
import { getClientProjectEstimate } from '@/services/estimates/getClientProjectEstimate';
import { ClientCabinet } from '@/components/client-cabinet';

const ClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');

  const data = await getClientCabinet();
  const estimate = data?.project ? await getClientProjectEstimate() : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ClientCabinet userName={session.user.name} data={data} estimate={estimate} />
    </Suspense>
  );
};

export default ClientPage;
