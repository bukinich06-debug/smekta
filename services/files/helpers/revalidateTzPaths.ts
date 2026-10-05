import { revalidatePath } from 'next/cache';

export const revalidateTzPaths = () => {
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
};
