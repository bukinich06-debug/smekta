import { formatMoney } from '../helpers/formatMoney';
import { CardHeaderSection, CardHeaderField } from './cardHeaderSection';

interface ICardHeaderBudgetProps {
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
}

export const CardHeaderBudget = ({
  estimateTotal,
  receivedTotal,
  masteredTotal,
  balanceOnHand,
  dueNow,
  stillNeededForWorks,
}: ICardHeaderBudgetProps) => (
  <CardHeaderSection title="Бюджет">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <CardHeaderField label="Смета работ">{formatMoney(estimateTotal)}</CardHeaderField>
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
