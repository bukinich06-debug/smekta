interface ITzTextDisplayProps {
  text: string | null;
  emptyLabel?: string;
}

export const TzTextDisplay = ({ text, emptyLabel = 'Текст ТЗ пока не заполнен.' }: ITzTextDisplayProps) => {
  if (!text?.trim()) {
    return <p className="text-gray-500">{emptyLabel}</p>;
  }

  return (
    <div className="text-gray-900 whitespace-pre-wrap break-words">{text}</div>
  );
};
