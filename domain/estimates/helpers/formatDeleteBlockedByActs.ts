const formatActNumbers = (actNumbers: string[]): string => {
  const unique = [...new Set(actNumbers.filter(Boolean))];
  return unique.map((number) => `№${number}`).join(', ');
};

export const formatItemDeleteBlockedByActs = (actNumbers: string[]): string => {
  const formatted = formatActNumbers(actNumbers);
  if (!formatted)
    return 'Позицию нельзя удалить: она входит в акт. Сначала уберите её из акта.';

  return `Позицию нельзя удалить: она входит в акт ${formatted}. Сначала уберите её из акта.`;
};

export const formatSectionDeleteBlockedByActs = (actNumbers: string[]): string => {
  const unique = [...new Set(actNumbers.filter(Boolean))];
  if (unique.length === 0)
    return 'Раздел нельзя удалить: позиции входят в акты. Сначала уберите их из актов.';

  const formatted = formatActNumbers(unique);
  if (unique.length === 1)
    return `Раздел нельзя удалить: позиции входят в акт ${formatted}.`;

  return `Раздел нельзя удалить: позиции входят в акты ${formatted}.`;
};
