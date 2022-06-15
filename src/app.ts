
import http from 'http';
import { Router } from './router.js';
import { UserResult } from 'users/user.interface.js';

export class App {
  private readonly router: Router<UserResult>;
  private readonly server: http.Server;

  constructor(userService: Router<UserResult>) {
    this.router = userService;
    this.server = http.createServer(this.router.process);
  }

  public listen(port: number, cb: () => void): void {
    this.server.listen(port, cb);
  }
}