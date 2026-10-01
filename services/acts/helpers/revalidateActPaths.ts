import { revalidatePath } from 'next/cache';

export const revalidateActPaths = () => {
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
};
