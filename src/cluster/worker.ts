import cluster from 'cluster';
import process from 'process';
import { App } from '../app.js';
import { config } from '../common/config.js';
import userRouter from '../users/user.router.js';
import { UserClusterDB } from '../users/user.cluster.database.js';

const { PORT } = config;

export default () => {
  userRouter.userService = new UserClusterDB();
  const app = new App(userRouter);
  
  const port = Number(process.env.workerPort || PORT);
  
  app.listen(port, (): void => {
    console.log(`Worker: ${cluster.worker?.id} is running on http://localhost:${port}/`);
  })
}