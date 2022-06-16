import { App } from './app.js';
import userRouter from './users/user.router.js';

const app = new App(userRouter);

export default app.server;
