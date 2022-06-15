import { IncomingMessage, ServerResponse } from 'http';
import { IProcessResult, Router } from "../router.js";
import { UserDB } from './user-db.js';
import Url from '../url.js';
import { readRequestBody } from '../common/utils.js';
import { UserResult } from 'users/user-service.interface.js';

const urlBase = '/api/users';
const userService = new UserDB();
userService.initDb('users.json');

const userRouter = new Router();
userRouter.get(urlBase, async (req: IncomingMessage, res: ServerResponse): Promise<IProcessResult<UserResult>> => {
  const data: UserResult = await userService.getAllUsers();
  return { data, responseCode: 200 };
});

userRouter.get(`${urlBase}/{userId}`, async (req: IncomingMessage, res: ServerResponse, url: Url): Promise<IProcessResult<UserResult>> => {
  const data: UserResult = await userService.getAllUsers();
  return { data, responseCode: 200 };
});

userRouter.post(urlBase, async (req: IncomingMessage, res: ServerResponse): Promise<IProcessResult<UserResult>> => {
  const body = await readRequestBody(req);
  const { username, age, hobbies } = JSON.parse(body);
  if (!username || !age || !hobbies) {
    throw new Error(`Request should contain username, age and hobbies fields`);
  }
  const data: UserResult = await userService.postUser({ username, age, hobbies });
  return { data, responseCode: 201 };
});

export default userRouter;
