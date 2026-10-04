import 'dotenv/config';
import { clearDatabase } from './seed/clearDatabase';
import { createSeedUsers } from './seed/createUsers';
import { seedContent } from './seed/seedContent';
import { SEED_ADMIN, SEED_CLIENT_USERS, SEED_INVITE_TOKEN } from './seed/constants';

const warn = `
╔══════════════════════════════════════════════════════════════════╗
║  ВНИМАНИЕ: seed удалит ВСЕ данные в базе и заполнит её заново.   ║
║  Запускайте только на локальной / тестовой БД.                   ║
╚══════════════════════════════════════════════════════════════════╝
`;

const main = async () => {
  console.warn(warn);

  console.log('Очистка базы…');
  await clearDatabase();

  console.log('Создание пользователей (Better Auth)…');
  const users = await createSeedUsers();

  console.log('Заполнение заказчиков, проектов и связанных данных…');
  await seedContent(users);

  console.log('');
  console.log('Готово. Тестовые учётные записи:');
  console.log(`  Админ:     ${SEED_ADMIN.email} / ${SEED_ADMIN.password}`);
  for (const client of SEED_CLIENT_USERS) {
    console.log(`  Заказчик:  ${client.email} / ${client.password}`);
  }
  console.log('');
  console.log(`Заказчик без аккаунта: Новикова Ольга — инвайт-токен: ${SEED_INVITE_TOKEN}`);
  console.log(`  (страница принятия инвайта в приложении по этому токену)`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Ошибка seed:', err);
    process.exit(1);
  });
