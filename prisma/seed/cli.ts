import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

export interface ISeedCliOptions {
  reset: boolean;
  yes: boolean;
  allowRemote: boolean;
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export const parseSeedCli = (argv: string[]): ISeedCliOptions => {
  const args = argv[0] === '--' ? argv.slice(1) : argv;

  return {
    reset: args.includes('--reset'),
    yes: args.includes('--yes'),
    allowRemote: args.includes('--allow-remote'),
  };
};

export const assertSeedEnvironment = (options: ISeedCliOptions): void => {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    console.error('Seed запрещён: NODE_ENV или VERCEL_ENV равен production.');
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Seed: не задан DATABASE_URL.');
    process.exit(1);
  }

  if (options.allowRemote) return;

  let host: string;
  try {
    host = new URL(databaseUrl).hostname;
  } catch {
    console.error('Seed: не удалось разобрать DATABASE_URL.');
    process.exit(1);
  }

  const normalized = host.toLowerCase();
  if (LOCAL_HOSTS.has(normalized)) return;

  console.error(
    `Seed: хост БД «${host}» не локальный. Для удалённой базы явно передайте --allow-remote (только dev/test).`
  );
  process.exit(1);
};

export const confirmReset = async (skipPrompt: boolean): Promise<boolean> => {
  if (skipPrompt) return true;

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(
    'Будут удалены ВСЕ данные в базе. Введите «yes» или «да» для подтверждения: '
  );
  rl.close();

  const normalized = answer.trim().toLowerCase();
  return normalized === 'yes' || normalized === 'да';
};
