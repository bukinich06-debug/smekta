import type { ICreateSectionInput, IUpdateSectionInput, ICreateItemInput, IUpdateItemInput } from './types';

export const validateCreateSection = (input: ICreateSectionInput): string | null => {
  if (!input.name || input.name.trim().length < 1)
    return 'Название раздела обязательно';
  
  if (input.name.length > 200)
    return 'Название раздела не может превышать 200 символов';
  
  return null;
};

export const validateUpdateSection = (input: IUpdateSectionInput): string | null => {
  if (!input.name || input.name.trim().length < 1)
    return 'Название раздела обязательно';
  
  if (input.name.length > 200)
    return 'Название раздела не может превышать 200 символов';
  
  return null;
};

export const validateCreateItem = (input: ICreateItemInput): string | null => {
  if (!input.name || input.name.trim().length < 1)
    return 'Наименование позиции обязательно';
  
  if (input.name.length > 500)
    return 'Наименование позиции не может превышать 500 символов';
  
  if (!input.unit || input.unit.trim().length < 1)
    return 'Единица измерения обязательна';
  
  if (input.unit.length > 50)
    return 'Единица измерения не может превышать 50 символов';
  
  const quantity = parseFloat(input.quantity);
  if (isNaN(quantity) || quantity < 0)
    return 'Количество должно быть положительным числом';
  
  const unitPrice = parseFloat(input.unitPrice);
  if (isNaN(unitPrice) || unitPrice < 0)
    return 'Цена за единицу должна быть положительным числом';
  
  if (input.comment && input.comment.length > 1000)
    return 'Комментарий не может превышать 1000 символов';
  
  return null;
};

export const validateUpdateItem = (input: IUpdateItemInput): string | null => {
  if (input.name !== undefined) {
    if (!input.name || input.name.trim().length < 1)
      return 'Наименование позиции обязательно';
    
    if (input.name.length > 500)
      return 'Наименование позиции не может превышать 500 символов';
  }
  
  if (input.unit !== undefined) {
    if (!input.unit || input.unit.trim().length < 1)
      return 'Единица измерения обязательна';
    
    if (input.unit.length > 50)
      return 'Единица измерения не может превышать 50 символов';
  }
  
  if (input.quantity !== undefined) {
    const quantity = parseFloat(input.quantity);
    if (isNaN(quantity) || quantity < 0)
      return 'Количество должно быть положительным числом';
  }
  
  if (input.unitPrice !== undefined) {
    const unitPrice = parseFloat(input.unitPrice);
    if (isNaN(unitPrice) || unitPrice < 0)
      return 'Цена за единицу должна быть положительным числом';
  }
  
  if (input.comment !== undefined && input.comment !== null && input.comment.length > 1000)
    return 'Комментарий не может превышать 1000 символов';
  
  return null;
};
