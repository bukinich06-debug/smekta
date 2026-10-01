import type { IProjectTz } from '@/domain/project-tz';
import { TzTextDisplay } from '@/components/tz-tab/ui/tzTextDisplay';
import { formatDateTime } from '@/components/tz-tab/helpers/formatDateTime';

interface IClientTzTabProps {
  tz: IProjectTz;
}

export const ClientTzTab = ({ tz }: IClientTzTabProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Техническое задание</h2>
    <TzTextDisplay text={tz.text} />
    {tz.updatedAt && (
      <p className="text-sm text-gray-500 mt-4">Обновлено: {formatDateTime(tz.updatedAt)}</p>
    )}
  </div>
);
