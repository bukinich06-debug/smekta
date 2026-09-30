import { getSession } from '@/services/auth/getSession';
import { getClientByInviteToken } from '@/services/clients/getClientByInviteToken';
import { InvitePage } from '@/components/invite-page';

interface IPageProps {
  params: Promise<{ token: string }>;
}

const InviteTokenPage = async ({ params }: IPageProps) => {
  const { token } = await params;
  const session = await getSession();
  const client = await getClientByInviteToken(token);

  return <InvitePage token={token} session={session} client={client} />;
};

export default InviteTokenPage;
