import 'dotenv/config';
import { clearDatabase } from './seed/clearDatabase';
import { assertSeedEnvironment, confirmReset, parseSeedCli } from './seed/cli';
import { createSeedUsers } from './seed/createUsers';
import { hasSeedBlockingData } from './seed/dbState';
import { seedContent } from './seed/seedContent';
import { SEED_ADMIN, SEED_CLIENT_USERS, SEED_INVITE_TOKEN } from './seed/constants';

const printCredentials = () => {
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

const main = async () => {
  const options = parseSeedCli(process.argv.slice(2));
  assertSeedEnvironment(options);

  const blocked = await hasSeedBlockingData();

  if (blocked && !options.reset) {
    console.log(
      'База не пустая, сид ничего не делает. Для пересоздания: npm run db:seed -- --reset'
    );
    return;
  }

  if (blocked && options.reset) {
    const confirmed = await confirmReset(options.yes);
    if (!confirmed) {
      console.log('Сброс отменён.');
      return;
    }

    console.warn(
      '\nОчистка базы (--reset)…\n'
    );
    await clearDatabase();
  }

  console.log('Создание пользователей (Better Auth)…');
  const users = await createSeedUsers();

  console.log('Заполнение заказчиков, проектов и связанных данных…');
  await seedContent(users);

  printCredentials();
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Ошибка seed:', err);
    process.exit(1);
  });
