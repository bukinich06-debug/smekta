import type { ICreateExtraWorkInput, IUpdateExtraWorkInput } from './types';

const validateDescription = (description: string): string | null => {
  if (!description || description.trim().length < 1) return 'Описание обязательно';
  if (description.length > 2000) return 'Описание не может превышать 2000 символов';
  return null;
};

const validateUnit = (unit: string): string | null => {
  if (!unit || unit.trim().length < 1) return 'Единица измерения обязательна';
  if (unit.length > 50) return 'Единица измерения не может превышать 50 символов';
  return null;
};

const validateQuantity = (quantity: string): string | null => {
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty < 0) return 'Количество должно быть неотрицательным числом';
  return null;
};

const validateUnitPrice = (unitPrice: string): string | null => {
  const price = parseFloat(unitPrice);
  if (isNaN(price) || price < 0) return 'Цена должна быть неотрицательным числом';
  return null;
};

export const validateCreateExtraWork = (input: ICreateExtraWorkInput): string | null => {
  if (!(input.date instanceof Date) || isNaN(input.date.getTime())) return 'Укажите корректную дату';

  const descriptionErr = validateDescription(input.description);
  if (descriptionErr) return descriptionErr;

  const unitErr = validateUnit(input.unit);
  if (unitErr) return unitErr;

  const quantityErr = validateQuantity(input.quantity);
  if (quantityErr) return quantityErr;

  const priceErr = validateUnitPrice(input.unitPrice);
  if (priceErr) return priceErr;

  return null;
};

export const validateUpdateExtraWork = (input: IUpdateExtraWorkInput): string | null => {
  if (input.date !== undefined && isNaN(input.date.getTime())) return 'Укажите корректную дату';

  if (input.description !== undefined) {
    const err = validateDescription(input.description);
    if (err) return err;
  }

  if (input.unit !== undefined) {
    const err = validateUnit(input.unit);
    if (err) return err;
  }

  if (input.quantity !== undefined) {
    const err = validateQuantity(input.quantity);
    if (err) return err;
  }

  if (input.unitPrice !== undefined) {
    const err = validateUnitPrice(input.unitPrice);
    if (err) return err;
  }

  return null;
};
