import { revalidatePath } from 'next/cache';

export const revalidatePhotoPaths = () => {
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
};
