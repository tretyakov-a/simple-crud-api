import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { IUserService, UserInfo, UserResponseData } from './user.interface.js';
import { IUser } from './user.interface.js';
import { InvalidRequestError, InvalidUserIdError, NonExistentUserIdError } from '../errors.js';
import { checkType } from '../common/utils.js';

type UserDatabase = {
  [key: string]: UserInfo,
};

export class UserDB implements IUserService {
  private db: UserDatabase;

  constructor() {
    this.db = {};
  }

  public getNumberOfRecords(): number {
    return Object.keys(this.db).length;
  }

  public async getAllUsers(): Promise<UserResponseData> {
    return Object.keys(this.db).map((key: string): IUser => {
      const userInfo: UserInfo = this.db[key];
      return { id: key, ...userInfo };
    });
  }

  private checkId(id: string): void {
    if (!uuidValidate(id)) {
      throw new InvalidUserIdError(id);
    }
    if (!this.db[id]) {
      throw new NonExistentUserIdError(id);
    }
  }

  private checkUserInfo(userInfo: Partial<UserInfo>): void {
    const { username, age, hobbies } = userInfo;
    if (!checkType(username, 'string')
        || !checkType(age, 'number')
        || (hobbies && !Array.isArray(hobbies))
        || (hobbies && !hobbies.every((item) => checkType(item, 'string')))) {
      throw new InvalidRequestError();
    }
  }

  public async getUserById(id = ''): Promise<UserResponseData> {
    this.checkId(id);
    const userInfo: UserInfo = this.db[id];
    return { id, ...userInfo };
  }

  public async postUser(userInfo: UserInfo): Promise<UserResponseData> {
    this.checkUserInfo(userInfo);
    const id = uuidv4();
    this.db[id] = { ...userInfo };
    return { id, ...userInfo};
  }

  public async putUser(id = '', userInfo: Partial<UserInfo>): Promise<UserResponseData> {
    this.checkId(id);
    this.checkUserInfo(userInfo);
    this.db[id] = { ...this.db[id], ...userInfo };
    return { id, ...this.db[id] };
  }

  public async deleteUser(id = ''): Promise<UserResponseData> {
    this.checkId(id);
    const deletedUser = { id, ...this.db[id] };
    delete this.db[id];
    return deletedUser;
  }
}