import 'dotenv/config';
import { createSeedUsers } from './seed/createUsers';
import { SEED_ADMIN, SEED_CLIENT_USERS, SEED_INVITE_TOKEN } from './seed/constants';
import { createSeedReport, printSeedSummary } from './seed/report';
import { seedContent } from './seed/seedContent';

const printCredentials = () => {
  console.log('Тестовые учётные записи:');
  console.log(`  Админ:     ${SEED_ADMIN.email} / ${SEED_ADMIN.password}`);
  for (const client of SEED_CLIENT_USERS) {
    console.log(`  Заказчик:  ${client.email} / ${client.password}`);
  }
  console.log('');
  console.log(`Заказчик без аккаунта: Новикова Ольга — инвайт-токен: ${SEED_INVITE_TOKEN}`);
  console.log('  (страница принятия инвайта в приложении по этому токену)');
};

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('Seed: не задан DATABASE_URL.');
    process.exit(1);
  }

  const report = createSeedReport();

  console.log('Пользователи (Better Auth)…');
  const users = await createSeedUsers(report);

  console.log('Заказчики, проекты и связанные данные…');
  await seedContent(users, report);

  printSeedSummary(report);
  printCredentials();
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Ошибка seed:', err);
    process.exit(1);
  });
