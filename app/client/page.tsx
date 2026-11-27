import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/services/auth/getSession';
import { getClientCabinet } from '@/services/clients/getClientCabinet';
import { getClientProjectEstimate } from '@/services/estimates/getClientProjectEstimate';
import { getClientProjectReceipts } from '@/services/receipts/getClientProjectReceipts';
import { getClientProjectTz } from '@/services/project-tz/getClientProjectTz';
import { getClientProjectExtraWorks } from '@/services/extra-works/getClientProjectExtraWorks';
import { getClientProjectActs } from '@/services/acts/getClientProjectActs';
import { getClientProjectFinance } from '@/services/finance/getClientProjectFinance';
import { ClientCabinet } from '@/components/client-cabinet';

const ClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');

  const data = await getClientCabinet(session.user.id);

  const [receiptsResult, estimateResult, tzResult, extraWorksResult, actsResult, financeResult] = await Promise.all([
    data?.project ? getClientProjectReceipts(session.user.id) : Promise.resolve({ ok: false }),
    data?.project ? getClientProjectEstimate(session.user.id) : Promise.resolve(null),
    data?.project ? getClientProjectTz(session.user.id) : Promise.resolve(null),
    data?.project ? getClientProjectExtraWorks(session.user.id) : Promise.resolve(null),
    data?.project ? getClientProjectActs(session.user.id) : Promise.resolve(null),
    data?.project ? getClientProjectFinance(session.user.id) : Promise.resolve(null),
  ]);

  const receipts = receiptsResult?.ok && receiptsResult.data ? receiptsResult.data : null;
  const estimate = estimateResult;
  const tz = (tzResult && tzResult.ok ? tzResult.data : null) ?? null;
  const extraWorks = (extraWorksResult && extraWorksResult.ok ? extraWorksResult.data : null) ?? null;
  const acts = (actsResult && actsResult.ok ? actsResult.data : null) ?? null;
  const finance = (financeResult && financeResult.ok ? financeResult.data : null) ?? null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ClientCabinet
        userName={session.user.name}
        data={data}
        estimate={estimate}
        tz={tz}
        receipts={receipts}
        extraWorks={extraWorks}
        acts={acts}
        finance={finance}
      />
    </Suspense>
  );
};

export default ClientPage;
