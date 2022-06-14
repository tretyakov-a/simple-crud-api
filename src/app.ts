
import { IncomingMessage, ServerResponse } from 'http';
import { IUserService, UserInfo } from './users/user-service.interface.js';
import { readRequestBody } from './common/utils.js';
import { IUser } from 'users/user.inteface.js';

export class App {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  public async getAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const data = await this.userService.getAllUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: data,
        })
      );
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: (err as Error).message,
        })
      );
    }
  };

  public async postUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await readRequestBody(req);
      const { username, age, hobbies } = JSON.parse(body);
      if (!username || !age || !hobbies) {
        throw new Error(`Request should contain username, age and hobbies fields`);
      }
      await this.userService.postUser({ username, age, hobbies });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(body);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: (err as Error).message,
        })
      );
    }
  }

  public async getUserById(req: IncomingMessage, res: ServerResponse, id: string = ''): Promise<void> {
    try {
      const user: IUser | null = await this.userService.getUserById(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: (err as Error).message,
        })
      );
    }
  }
}