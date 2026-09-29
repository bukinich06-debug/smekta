import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { RegisterForm } from '@/components/auth/register-form';

const RegisterPage = async () => {
  const session = await getSession();
  
  if (session) redirect('/');

  return <RegisterForm />;
};

export default RegisterPage;
