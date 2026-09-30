import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/services/auth/getSession';
import { getClientCabinet } from '@/services/clients/getClientCabinet';
import { getClientProjectEstimate } from '@/services/estimates/getClientProjectEstimate';
import { getClientProjectReceipts } from '@/services/receipts/getClientProjectReceipts';
import { ClientCabinet } from '@/components/client-cabinet';

const ClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');

  const data = await getClientCabinet();
  const estimate = data?.project ? await getClientProjectEstimate() : null;
  const receipts = data?.project ? await getClientProjectReceipts() : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ClientCabinet userName={session.user.name} data={data} estimate={estimate} receipts={receipts} />
    </Suspense>
  );
};

export default ClientPage;
