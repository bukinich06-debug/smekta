'use client';

import type { IClientCardDetails } from '@/domain/clients';
import type { IClientProjectEstimate } from '@/domain/estimates';
import { CardHeader } from '@/components/client-card';
import { CabinetTabs } from './cabinetTabs';
import { UnlinkedAccount } from './unlinkedAccount';
import { ClientCabinetShell } from './clientCabinetShell';

interface IClientCabinetProps {
  userName: string;
  data: IClientCardDetails | null;
  estimate: IClientProjectEstimate | null;
}

export const ClientCabinet = ({ userName, data, estimate }: IClientCabinetProps) => {
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

  return (
    <ClientCabinetShell userName={userName}>
      <CardHeader data={data} showProjectName />
      <CabinetTabs estimate={estimateData} />
    </ClientCabinetShell>
  );
};
