import type { ICreateActInput, IUpdateActInput } from './types';

const MAX_NUMBER_LENGTH = 50;
const MAX_STAGE_LENGTH = 500;
const MAX_COMMENT_LENGTH = 2000;

export const validateCreateAct = (input: ICreateActInput): string | null => {
  if (!input.number || input.number.trim().length < 1) return 'Номер акта обязателен';
  if (input.number.length > MAX_NUMBER_LENGTH) return 'Номер акта не может превышать 50 символов';

  if (!input.date || isNaN(input.date.getTime())) return 'Укажите корректную дату';

  if (input.stage && input.stage.length > MAX_STAGE_LENGTH)
    return 'Этап работ не может превышать 500 символов';

  if (input.comment && input.comment.length > MAX_COMMENT_LENGTH)
    return 'Комментарий не может превышать 2000 символов';

  if (!input.estimateItemIds.length) return 'Выберите хотя бы одну позицию сметы';

  return null;
};

export const validateUpdateAct = (input: IUpdateActInput): string | null => {
  if (input.number !== undefined) {
    if (!input.number || input.number.trim().length < 1) return 'Номер акта обязателен';
    if (input.number.length > MAX_NUMBER_LENGTH) return 'Номер акта не может превышать 50 символов';
  }

  if (input.date !== undefined && isNaN(input.date.getTime())) return 'Укажите корректную дату';

  if (input.stage !== undefined && input.stage && input.stage.length > MAX_STAGE_LENGTH)
    return 'Этап работ не может превышать 500 символов';

  if (input.comment !== undefined && input.comment && input.comment.length > MAX_COMMENT_LENGTH)
    return 'Комментарий не может превышать 2000 символов';

  if (input.estimateItemIds !== undefined && !input.estimateItemIds.length)
    return 'Выберите хотя бы одну позицию сметы';

  return null;
};
