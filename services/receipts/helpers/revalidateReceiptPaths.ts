import { revalidatePath } from 'next/cache';
import { revalidateFinancePaths } from '@/services/finance/helpers/revalidateFinancePaths';

export const revalidateReceiptPaths = () => {
  revalidatePath('/admin/clients/[id]', 'page');
  revalidatePath('/client', 'page');
  revalidateFinancePaths();
};
