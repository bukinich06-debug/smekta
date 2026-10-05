import { FileTab as PrismaFileTab } from '@prisma/client';
import { dbClient } from '@/data/shared/dbClient';
import type {
  IFileRepository,
  IFile,
  ICreateReceiptFileInput,
  ICreateActFileInput,
  ICreateTzFileInput,
  ICreatePhotoFileInput,
  IUpdatePhotoFileInput,
} from '@/domain/files';
import { PhotoAlbum as PrismaPhotoAlbum } from '@prisma/client';

const mapFile = (row: {
  id: number;
  projectId: number;
  tab: PrismaFileTab;
  receiptId: number | null;
  paymentId: number | null;
  actId: number | null;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: number;
  uploadedBy: { name: string };
  uploadedAt: Date;
  isPhoto: boolean;
  caption: string | null;
  album: PrismaPhotoAlbum | null;
  isVisibleToClient: boolean;
}): IFile => ({
  id: row.id,
  projectId: row.projectId,
  tab: row.tab,
  receiptId: row.receiptId,
  paymentId: row.paymentId,
  actId: row.actId,
  storageKey: row.storageKey,
  originalName: row.originalName,
  mimeType: row.mimeType,
  size: row.size,
  uploadedById: row.uploadedById,
  uploadedByName: row.uploadedBy.name,
  uploadedAt: row.uploadedAt,
  isPhoto: row.isPhoto,
  caption: row.caption,
  album: row.album,
  isVisibleToClient: row.isVisibleToClient,
});

export const fileRepository: IFileRepository = {
  async getById(id: number): Promise<IFile | null> {
    const row = await dbClient.file.findUnique({
      where: { id },
      include: { uploadedBy: { select: { name: true } } },
    });

    if (!row) return null;

    return mapFile(row);
  },

  async listByReceiptId(receiptId: number): Promise<IFile[]> {
    const rows = await dbClient.file.findMany({
      where: { receiptId, tab: 'RECEIPTS' },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return rows.map(mapFile);
  },

  async listByActId(actId: number): Promise<IFile[]> {
    const rows = await dbClient.file.findMany({
      where: { actId, tab: 'ACTS' },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return rows.map(mapFile);
  },

  async listByProjectIdTz(projectId: number): Promise<IFile[]> {
    const rows = await dbClient.file.findMany({
      where: { projectId, tab: 'TZ' },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return rows.map(mapFile);
  },

  async listByProjectIdPhotos(projectId: number): Promise<IFile[]> {
    const rows = await dbClient.file.findMany({
      where: { projectId, tab: 'PHOTOS' },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return rows.map(mapFile);
  },

  async create(input: ICreateReceiptFileInput): Promise<IFile> {
    const row = await dbClient.file.create({
      data: {
        projectId: input.projectId,
        tab: 'RECEIPTS',
        receiptId: input.receiptId,
        paymentId: input.paymentId ?? null,
        storageKey: input.storageKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
        uploadedById: input.uploadedById,
        isPhoto: input.isPhoto,
        isVisibleToClient: true,
      },
      include: { uploadedBy: { select: { name: true } } },
    });

    return mapFile(row);
  },

  async createActFile(input: ICreateActFileInput): Promise<IFile> {
    const row = await dbClient.file.create({
      data: {
        projectId: input.projectId,
        tab: 'ACTS',
        actId: input.actId,
        storageKey: input.storageKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
        uploadedById: input.uploadedById,
        isPhoto: input.isPhoto,
        isVisibleToClient: true,
      },
      include: { uploadedBy: { select: { name: true } } },
    });

    return mapFile(row);
  },

  async createTzFile(input: ICreateTzFileInput): Promise<IFile> {
    const row = await dbClient.file.create({
      data: {
        projectId: input.projectId,
        tab: 'TZ',
        storageKey: input.storageKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
        uploadedById: input.uploadedById,
        isPhoto: input.isPhoto,
        isVisibleToClient: true,
      },
      include: { uploadedBy: { select: { name: true } } },
    });

    return mapFile(row);
  },

  async createPhotoFile(input: ICreatePhotoFileInput): Promise<IFile> {
    const row = await dbClient.file.create({
      data: {
        projectId: input.projectId,
        tab: 'PHOTOS',
        storageKey: input.storageKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
        uploadedById: input.uploadedById,
        isPhoto: true,
        album: input.album,
        caption: input.caption ?? null,
        isVisibleToClient: input.album !== 'HIDDEN',
      },
      include: { uploadedBy: { select: { name: true } } },
    });

    return mapFile(row);
  },

  async updatePhotoFile(id: number, input: IUpdatePhotoFileInput): Promise<IFile> {
    const data: {
      caption?: string | null;
      album?: PrismaPhotoAlbum;
      isVisibleToClient?: boolean;
    } = {};

    if (input.caption !== undefined) data.caption = input.caption;
    if (input.album !== undefined) {
      data.album = input.album;
      data.isVisibleToClient = input.album !== 'HIDDEN';
    }

    const row = await dbClient.file.update({
      where: { id },
      data,
      include: { uploadedBy: { select: { name: true } } },
    });

    return mapFile(row);
  },

  async delete(id: number): Promise<void> {
    await dbClient.file.delete({ where: { id } });
  },
};
