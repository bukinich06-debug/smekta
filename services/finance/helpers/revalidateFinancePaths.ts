import { revalidatePath } from 'next/cache';

export const revalidateFinancePaths = () => {
  revalidatePath('/admin/clients', 'page');
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
};
