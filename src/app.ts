
import http from 'http';
import { Router } from './router.js';
import { UserResponseData } from './users/user.interface.js';

type RouterData = UserResponseData;

export class App {
  public router: Router<RouterData>;
  public readonly server: http.Server;

  constructor(userService: Router<RouterData>) {
    this.router = userService;
    this.server = http.createServer(this.router.process);
  }

  public listen(port: number, cb: () => void): void {
    this.server.listen(port, cb);
  }
}