import { IUser } from './user.inteface';

export type UserInfo = Omit<IUser, 'id'>;

export interface IUserService {
  getAllUsers: () => Promise<IUser[]>;
  getUserById: (id: string) => Promise<IUser | null>;
  postUser: (userInfo: UserInfo) => Promise<IUser>;
  putUser: (id: string, userInfo: UserInfo) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}