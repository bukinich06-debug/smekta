'use client';

import type { IClientCardDetails } from '@/domain/clients';
import type { IClientProjectEstimate } from '@/domain/estimates';
import type { IProjectReceipts } from '@/domain/receipts';
import type { IProjectTz } from '@/domain/project-tz';
import type { IClientProjectExtraWorks } from '@/domain/extra-works';
import type { IClientProjectActs } from '@/domain/acts';
import type { IClientProjectFinance } from '@/domain/finance';
import { CardHeader } from '@/components/client-card';
import { CabinetTabs } from './cabinetTabs';
import { UnlinkedAccount } from './unlinkedAccount';
import { ClientCabinetShell } from './clientCabinetShell';

interface IClientCabinetProps {
  userName: string;
  data: IClientCardDetails | null;
  estimate: IClientProjectEstimate | null;
  tz: IProjectTz | null;
  receipts: IProjectReceipts | null;
  extraWorks: IClientProjectExtraWorks | null;
  acts: IClientProjectActs | null;
  finance: IClientProjectFinance | null;
}

export const ClientCabinet = ({
  userName,
  data,
  estimate,
  tz,
  receipts,
  extraWorks,
  acts,
  finance,
}: IClientCabinetProps) => {
  if (!data || !data.project) return (
    <ClientCabinetShell userName={userName}>
      <UnlinkedAccount />
    </ClientCabinetShell>
  );

  const estimateData: IClientProjectEstimate = estimate ?? {
    projectId: data.project.id,
    sections: [],
    total: 0,
  };

  const receiptsData: IProjectReceipts = receipts ?? {
    projectId: data.project.id,
    receipts: [],
    sections: [],
    totalDue: 0,
    totalPaid: 0,
    totalRemainder: 0,
  };

  const extraWorksData: IClientProjectExtraWorks = extraWorks ?? {
    projectId: data.project.id,
    items: [],
    total: 0,
    budgetTotal: 0,
  };

  const actsData: IClientProjectActs = acts ?? {
    projectId: data.project.id,
    acts: [],
  };

  return (
    <ClientCabinetShell userName={userName}>
      <CardHeader data={data} role="client" />
      <CabinetTabs
        estimate={estimateData}
        tz={tz}
        receipts={receiptsData}
        extraWorks={extraWorksData}
        acts={actsData}
        finance={finance}
      />
    </ClientCabinetShell>
  );
};
