'use client';

import { ProjectPhotoGallery } from '@/components/photos-tab';

interface IClientPhotosTabProps {
  projectId: number;
}

export const ClientPhotosTab = ({ projectId }: IClientPhotosTabProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Фото</h2>
    <ProjectPhotoGallery projectId={projectId} readOnly />
  </div>
);
