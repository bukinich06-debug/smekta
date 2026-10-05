interface IDisconnectConfirmModalProps {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DisconnectConfirmModal = ({
  open,
  loading,
  onCancel,
  onConfirm,
}: IDisconnectConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Закрыть"
        onClick={onCancel}
        disabled={loading}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disconnect-client-title"
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
      >
        <h3 id="disconnect-client-title" className="text-lg font-semibold text-gray-900 mb-3">
          Отключить заказчика
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Вы уверены, что хотите отключить заказчика от проекта? Он потеряет доступ к смете, финансам и
          документам.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Отключение...' : 'Отключить'}
          </button>
        </div>
      </div>
    </div>
  );
};
