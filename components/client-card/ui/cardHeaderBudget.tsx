import { formatMoney } from '../helpers/formatMoney';
import { CardHeaderSection, CardHeaderField } from './cardHeaderSection';

interface ICardHeaderBudgetProps {
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
  loading?: boolean;
  error?: string | null;
}

export const CardHeaderBudget = ({
  estimateTotal,
  receivedTotal,
  masteredTotal,
  balanceOnHand,
  dueNow,
  stillNeededForWorks,
  loading = false,
  error = null,
}: ICardHeaderBudgetProps) => {
  if (loading) {
    return (
      <CardHeaderSection title="Бюджет">
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardHeaderSection>
    );
  }

  if (error) {
    return (
      <CardHeaderSection title="Бюджет">
        <p className="text-sm text-red-600">{error}</p>
      </CardHeaderSection>
    );
  }

  return (
    <CardHeaderSection title="Бюджет">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <CardHeaderField
            label="Смета работ"
            hint="Сумма позиций сметы плюс согласованные и выполненные допработы, включённые в общий бюджет. Во вкладке «Смета» показана сумма без допработ."
          >
            {formatMoney(estimateTotal)}
          </CardHeaderField>
          <CardHeaderField label="Освоено">{formatMoney(masteredTotal)}</CardHeaderField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardHeaderField label="Поступило">
            <span className="text-green-600">{formatMoney(receivedTotal)}</span>
          </CardHeaderField>
          <CardHeaderField label="Остаток на руках">
            <span className="text-blue-700">{formatMoney(balanceOnHand)}</span>
          </CardHeaderField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardHeaderField label="К доплате сейчас">
            <span className="text-red-600">{formatMoney(dueNow)}</span>
          </CardHeaderField>
          <CardHeaderField label="Нужно ещё до конца сметы">
            <span className="text-amber-700">{formatMoney(stillNeededForWorks)}</span>
          </CardHeaderField>
        </div>
      </div>
    </CardHeaderSection>
  );
};
