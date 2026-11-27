import { AdminPageWrapper } from '@/components/admin-page-wrapper';

const LoadingPage = () => (
  <AdminPageWrapper userName="">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          <span>Заказчики / </span>
          <span className="inline-block h-4 w-32 bg-gray-200 rounded"></span>
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-36 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
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
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 w-24 bg-gray-200 rounded-t my-2"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminPageWrapper>
);

export default LoadingPage;
