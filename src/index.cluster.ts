import cluster, { Worker } from 'cluster';
import os from 'os';
import process from 'process';
import { UserDB } from './users/user.database.js';
import { App } from './app.js';
import { config } from './common/config.js';
import userRouter from './users/user.router.js';
import { IUserService, UserInfo, UserResponseData } from './users/user.interface.js';
import { PrimaryRequestMessage, UserClusterDB } from './users/user.cluster.database.js';

if (cluster.isPrimary) {
  let requestsNumber = 0;
  const userService: IUserService = new UserDB();
  cluster.setupPrimary({
    silent: true,
  });

  const cpusNumber = os.cpus().length;

  for (let i = 0; i < cpusNumber; i++) {
    const worker = cluster.fork();
    worker.process?.stdout?.pipe(process.stdout);
  }

  async function messageHandler(msg: PrimaryRequestMessage, worker: Worker | undefined) {
    const { cmd, args } = msg;
    if (cmd) {
      requestsNumber += 1;
      const id = args.id || '';
      const userInfo = args.userInfo || {};

      let result: UserResponseData = [];
      try {
        switch(cmd) {
          case 'getAllUsers': result = await userService.getAllUsers(); break;
          case 'deleteUser': result = await userService.deleteUser(id); break;
          case 'getUserById': result = await userService.getUserById(id); break;
          case 'postUser': result = await userService.postUser(userInfo as UserInfo); break;
          case 'putUser': result = await userService.putUser(id, userInfo); break;
        }
      } catch (err) {
        return worker?.send({ err });
      }
      return worker?.send({ data: result });
    }
  }

  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    worker?.on('message', (msg) => {
      messageHandler(msg, worker)
    });
  }

} else {
  const { PORT } = config;

  userRouter.userService = new UserClusterDB();
  const app = new App(userRouter);

  app.listen(PORT, (): void => {
    console.log(`Worker: ${cluster.worker?.id} is running on port ${PORT}. Go to http://localhost:${PORT}/`);
  })
}
