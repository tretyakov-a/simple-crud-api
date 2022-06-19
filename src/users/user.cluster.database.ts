import { IUserService, UserInfo, UserResponseData } from './user.interface.js';

export interface PrimaryResponseMessage {
  data: UserResponseData,
  err: Error,
}

export interface PrimaryRequestMessage {
  cmd: keyof IUserService,
  args: {
    id?: string,
    userInfo?: Partial<UserInfo>,
  }
}

export class UserClusterDB implements IUserService {

  private async fetchFromPrimary(message: PrimaryRequestMessage): Promise<UserResponseData> {
    return new Promise((resolve, reject) => {
      process.send?.(message);
      const listener = (msg: PrimaryResponseMessage) => {
        process.removeListener('message', listener);
        if (msg.err) return reject(msg.err);
        resolve(msg.data);
      }
      process.on('message', listener);
    });
  }

  public async getAllUsers(): Promise<UserResponseData> {
    return await this.fetchFromPrimary({ cmd: 'getAllUsers', args: {} });
  }

  public async getUserById(id = ''): Promise<UserResponseData> {
    return await this.fetchFromPrimary({ cmd: 'getUserById', args: { id} });
  }

  public async postUser(userInfo: UserInfo): Promise<UserResponseData> {
    return await this.fetchFromPrimary({ cmd: 'postUser', args: { userInfo } });
  }

  public async putUser(id = '', userInfo: Partial<UserInfo>): Promise<UserResponseData> {
    return await this.fetchFromPrimary({ cmd: 'putUser', args: { id, userInfo } });
  }

  public async deleteUser(id = ''): Promise<UserResponseData> {
    return await this.fetchFromPrimary({ cmd: 'deleteUser', args: { id} });
  }
}