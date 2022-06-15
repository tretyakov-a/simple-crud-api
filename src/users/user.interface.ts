export interface IUser {
  id: string,
  username: string,
  age: number,
  hobbies: string[],
}

export type UserInfo = Omit<IUser, 'id'>;
export type UserResult = IUser | IUser[];

export interface IUserService {
  getAllUsers: () => Promise<UserResult>;
  getUserById: (id: string) => Promise<UserResult>;
  postUser: (userInfo: UserInfo) => Promise<UserResult>;
  putUser: (id: string, userInfo: UserInfo) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}