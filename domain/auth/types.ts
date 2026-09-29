export interface IAuthUser {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  isActive: boolean;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthSession {
  user: IAuthUser;
  session: {
    id: string;
    expiresAt: Date;
  };
}
