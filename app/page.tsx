import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';

const Home = async () => {
  const session = await getSession();

  if (!session) redirect('/login');

  if (session.user.role === 'ADMIN') redirect('/admin/clients');

  redirect('/client');
};

export default Home;
