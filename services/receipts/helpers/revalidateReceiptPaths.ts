import { revalidatePath } from 'next/cache';

export const revalidateReceiptPaths = () => {
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
};
