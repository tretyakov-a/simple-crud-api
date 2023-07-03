import cluster, { Worker } from 'cluster';
import { availableParallelism } from 'os';
import process from 'process';
import { UserDB } from '../users/user.database.js';
import { config } from '../common/config.js';
import { IUserService, UserInfo, UserResponseData } from '../users/user.interface.js';
import { PrimaryRequestMessage } from '../users/user.cluster.database.js';
import startWorker from './worker.js';
import startLoadBalancer from './load-balancer.js';

const { PORT } = config;

const messageHandler = (userService: IUserService) => async (msg: PrimaryRequestMessage, worker: Worker | undefined) => {
  const { cmd, args } = msg;
  if (cmd) {
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

if (cluster.isPrimary) {
  const userService: IUserService = new UserDB();
  cluster.setupPrimary({
    silent: true,
  });

  const messageHandlerWithUserService = messageHandler(userService);
  const numOfWorkers = availableParallelism() - 1;

  for (let i = 0; i < numOfWorkers; i++) {
    const worker = cluster.fork({ workerPort: PORT + i + 1 });
    worker.process?.stdout?.pipe(process.stdout);
    worker.on('message', (msg) => {
      messageHandlerWithUserService(msg, worker)
    });
  }

  startLoadBalancer(numOfWorkers);

} else {
  startWorker();
}
