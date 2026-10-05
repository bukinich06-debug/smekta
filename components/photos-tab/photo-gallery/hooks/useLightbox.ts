'use client';

import { useCallback, useState } from 'react';
import type { IFile } from '@/domain/files';

export const useLightbox = () => {
  const [photo, setPhoto] = useState<IFile | null>(null);

  const open = useCallback((file: IFile) => {
    setPhoto(file);
  }, []);

  const close = useCallback(() => {
    setPhoto(null);
  }, []);

  return { photo, open, close };
};
