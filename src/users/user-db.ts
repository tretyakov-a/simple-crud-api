import fsPromises from 'fs/promises'
import path from 'path';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { getConstants } from '../common/utils.js';
import { IUserService, UserInfo, UserResult } from './user.interface.js';
import { IUser } from './user.interface.js';

const { __dirname } = getConstants(import.meta.url);

type UserDatabase = {
  [key: string]: UserInfo,
};

export class UserDB implements IUserService {
  private pathToFile: string;
  private db: UserDatabase;

  constructor() {
    this.pathToFile = '';
    this.db = {};
  }

  public async initDb(filename: string): Promise<void> {
    this.pathToFile = path.resolve(__dirname, filename);
    const data = JSON.parse(await fsPromises.readFile(this.pathToFile, 'utf8'));
    this.db = data.reduce((acc: UserDatabase, item: IUser) => {
      const userInfo: UserInfo = item;
      return { ...acc, [item.id]: userInfo };
    }, {});
  }

  public async getAllUsers(): Promise<UserResult> {
    return Object.keys(this.db).map((key: string): IUser => {
      const userInfo: UserInfo = this.db[key];
      return { id: key, ...userInfo };
    });
  };

  private checkId(id: string): void {
    if (!uuidValidate(id)) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    if (!this.db[id]) {
      throw new Error(`There is no user with ID: ${id}`);
    }
  }

  public async getUserById(id: string = ''): Promise<UserResult> {
    this.checkId(id);
    const userInfo: UserInfo = this.db[id];
    return { id, ...userInfo };
  };

  public async postUser(userInfo: UserInfo): Promise<UserResult> {
    const id = uuidv4();
    this.db[id] = { ...userInfo };
    return { id, ...userInfo};
  };

  public async putUser(id: string = '', userInfo: Partial<UserInfo>): Promise<UserResult> {
    this.checkId(id);
    this.db[id] = { ...this.db[id], ...userInfo };
    return { id, ...this.db[id] };
  };

  public async deleteUser(id: string = ''): Promise<UserResult> {
    this.checkId(id);
    const deletedUser = { id, ...this.db[id] };
    delete this.db[id];
    return deletedUser;
  };
}