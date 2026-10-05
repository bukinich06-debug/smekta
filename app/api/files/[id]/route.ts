import { get } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { getSession } from '@/services/auth/getSession';
import { assertReceiptFileReadAccess } from '@/services/files/helpers/assertReceiptFileAccess';

interface IRouteContext {
  params: Promise<{ id: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await getSession();
  if (!session) return new Response('Не авторизован', { status: 401 });

  const { id } = await context.params;
  const fileId = parseInt(id, 10);
  if (isNaN(fileId)) return new Response('Не найдено', { status: 404 });

  const file = await fileRepository.getById(fileId);
  if (!file) return new Response('Не найдено', { status: 404 });

  const access = await assertReceiptFileReadAccess(session, file);
  if (!access.ok) return new Response(access.error || 'Нет доступа', { status: 403 });

  const blobResult = await get(file.storageKey, { access: 'private' });
  if (!blobResult || blobResult.statusCode !== 200 || !blobResult.stream)
    return new Response('Файл недоступен', { status: 404 });

  const download = new URL(request.url).searchParams.get('download') === '1';
  const disposition = download ? 'attachment' : 'inline';
  const encodedName = encodeURIComponent(file.originalName);

  const headers = new Headers();
  headers.set('Content-Type', file.mimeType);
  headers.set('Content-Disposition', `${disposition}; filename*=UTF-8''${encodedName}`);

  if (blobResult.blob.size) headers.set('Content-Length', String(blobResult.blob.size));

  return new Response(blobResult.stream, { headers });
};
