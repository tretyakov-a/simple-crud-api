
import http, { IncomingMessage, ServerResponse } from 'http';
import { Router } from './router.js';

export class App {
  private readonly router: Router;
  private readonly server: http.Server;
  static readonly defaultPort: string = '3000';

  constructor(userService: Router) {
    this.router = userService;
    this.server = http.createServer(this.router.process);
  }

  public listen(port: string = App.defaultPort, cb: () => void): void {
    this.server.listen(port, cb);
  }
}