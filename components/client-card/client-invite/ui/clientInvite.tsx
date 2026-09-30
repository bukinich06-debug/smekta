'use client';

import { useClientInvite } from '../hooks/useClientInvite';

interface IClientInviteProps {
  clientId: number;
  hasInviteToken: boolean;
  userId: number | null;
  userEmail: string | null;
}

export const ClientInvite = ({ clientId, hasInviteToken, userId, userEmail }: IClientInviteProps) => {
  const { loading, error, inviteUrl, copied, generate, copyToClipboard } = useClientInvite({ clientId });

  const getStatus = () => {
    if (userId && userEmail) return `Подключён: ${userEmail}`;
    if (hasInviteToken || inviteUrl) return 'Ссылка выдана, активна';
    return 'Не подключён';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Доступ заказчика</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Статус: <span className="font-medium text-gray-900">{getStatus()}</span>
        </p>
      </div>

      {!userId && (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {inviteUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пригласительная ссылка
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {copied ? 'Скопировано' : 'Скопировать'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Генерация...' : 'Сгенерировать ссылку'}
          </button>
        </>
      )}
    </div>
  );
};
