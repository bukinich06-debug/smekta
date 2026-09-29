import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { UserInfo } from '@/components/auth/user-info';

const Home = async () => {
  const session = await getSession();

  if (!session) redirect('/login');

  return <UserInfo user={session.user} />;
};

export default Home;
