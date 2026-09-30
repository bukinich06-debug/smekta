import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/services/auth/getSession';
import { getClientCabinet } from '@/services/clients/getClientCabinet';
import { getClientProjectEstimate } from '@/services/estimates/getClientProjectEstimate';
import { getClientProjectReceipts } from '@/services/receipts/getClientProjectReceipts';
import { getClientProjectTz } from '@/services/project-tz/getClientProjectTz';
import { getClientProjectExtraWorks } from '@/services/extra-works/getClientProjectExtraWorks';
import { ClientCabinet } from '@/components/client-cabinet';

const ClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');

  const data = await getClientCabinet();
  const [estimate, tz, receipts, extraWorks] = await Promise.all([
    data?.project ? getClientProjectEstimate() : Promise.resolve(null),
    data?.project ? getClientProjectTz() : Promise.resolve(null),
    data?.project ? getClientProjectReceipts() : Promise.resolve(null),
    data?.project ? getClientProjectExtraWorks() : Promise.resolve(null),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ClientCabinet
        userName={session.user.name}
        data={data}
        estimate={estimate}
        tz={tz}
        receipts={receipts}
        extraWorks={extraWorks}
      />
    </Suspense>
  );
};

export default ClientPage;
