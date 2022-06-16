export interface IUser {
  id: string,
  username: string,
  age: number,
  hobbies: string[],
}

export type UserInfo = Omit<IUser, 'id'>;
export type UserResponseData = IUser | IUser[];

export interface IUserService {
  getAllUsers: () => Promise<UserResponseData>;
  getUserById: (id: string) => Promise<UserResponseData>;
  postUser: (userInfo: UserInfo) => Promise<UserResponseData>;
  putUser: (id: string, userInfo: UserInfo) => Promise<UserResponseData>;
  deleteUser: (id: string) => Promise<UserResponseData>;
}
