/** Фиксированный токен инвайта для заказчика без аккаунта (см. README). */
export const SEED_INVITE_TOKEN = 'seed-invite-novikova-demo-2026';

export const SEED_ADMIN = {
  email: 'admin@smekta.test',
  password: 'Admin123!',
  name: 'Иван Администратор',
  phone: '+7 916 123-45-67',
};

export const SEED_CLIENT_USERS = [
  {
    email: 'client1@smekta.test',
    password: 'Client123!',
    name: 'Елена Ковалёва',
  },
  {
    email: 'client2@smekta.test',
    password: 'Client123!',
    name: 'Андрей Петров',
  },
  {
    email: 'client3@smekta.test',
    password: 'Client123!',
    name: 'Мария Сидоренко',
  },
];

export const SEED_LINKED_CLIENTS = [
  {
    fullName: 'Ковалёва Елена Владимировна',
    phone: '+7 916 123-45-67',
    email: 'client1@smekta.test',
    userEmail: 'client1@smekta.test',
  },
  {
    fullName: 'Петров Андрей Сергеевич',
    phone: '+7 903 234-56-78',
    email: 'client2@smekta.test',
    userEmail: 'client2@smekta.test',
  },
  {
    fullName: 'Сидоренко Мария Игоревна',
    phone: '+7 925 345-67-89',
    email: 'client3@smekta.test',
    userEmail: 'client3@smekta.test',
  },
] as const;

export const SEED_NOVIKOVA_CLIENT = {
  fullName: 'Новикова Ольга Петровна',
  phone: '+7 916 456-78-90',
  email: 'novikova@example.com',
};

/** Имена демо-проектов — ключ идемпотентности сида. */
export const SEED_PROJECT_KOVALEVA = 'Капитальный ремонт 2-комнатной';
export const SEED_PROJECT_PETROV = 'Ремонт студии под сдачу';
export const SEED_PROJECT_SIDORENKO = 'Дизайн-проект и ремонт кухни';
export const SEED_PROJECT_NOVIKOVA = 'Ремонт ванной комнаты';
