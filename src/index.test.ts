import { UserDB } from './users/user.database.js';
import { App } from './app.js';
import userRouter from './users/user.router.js';

userRouter.userService = new UserDB();
const app = new App(userRouter);

export default app.server;
