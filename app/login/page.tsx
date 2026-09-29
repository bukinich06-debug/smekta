import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { LoginForm } from '@/components/auth/login-form';

const LoginPage = async () => {
  const session = await getSession();
  
  if (session) redirect('/');

  return <LoginForm />;
};

export default LoginPage;
