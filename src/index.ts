import { App } from './app.js';
import { UserDB } from './users/user-db.js';
import { config } from './common/config.js';
import userRouter from './users/user.router.js';

async function initApp() {
  const { PORT } = config;
  const userService: UserDB = new UserDB();
  await userService.initDb('users.json');

  const app = new App(userService);

  app.use('/', userRouter);

  app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`);
  })
}

initApp();
