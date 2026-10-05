'use client';

import { ProjectPhotoGallery } from '../photo-gallery/ui/projectPhotoGallery';

interface IAdminPhotosTabProps {
  projectId: number;
}

export const AdminPhotosTab = ({ projectId }: IAdminPhotosTabProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Фото</h2>
    <p className="text-sm text-gray-600 mb-6">
      Фотографии прогресса по альбомам. Заказчик не видит альбом «Скрытые фото».
    </p>
    <ProjectPhotoGallery projectId={projectId} />
  </div>
);
