import { UserDB } from './users/user.database.js';
import { App } from './app.js';
import { config } from './common/config.js';
import userRouter from './users/user.router.js';

async function initApp() {
  const { PORT } = config;
  
  userRouter.userService = new UserDB();
  const app = new App(userRouter);

  app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`);
  })
}

initApp();
