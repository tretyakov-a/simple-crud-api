import { IProcessResult, Router } from "../router.js";
import { UserDB } from './user-db.js';
import { readRequestBody } from '../common/utils.js';
import { UserResult } from './user.interface.js';

const urlBase = '/api/users';
const userService = new UserDB();
userService.initDb('users.json');

const userRouter: Router<UserResult> = new Router();

userRouter.get(urlBase, async (): Promise<IProcessResult<UserResult>> => {
  const data = await userService.getAllUsers();
  return { data, responseCode: 200 };
});

userRouter.get(`${urlBase}/{userId}`, async function(): Promise<IProcessResult<UserResult>> {
  const data = await userService.getUserById(this.url?.getUserId());
  return { data, responseCode: 200 };
});

userRouter.post(urlBase, async function(): Promise<IProcessResult<UserResult>> {
  const body = await readRequestBody(this.request);
  const { username, age, hobbies } = JSON.parse(body);
  if (!username || !age || !hobbies) {
    throw new Error(`Request should contain username, age and hobbies fields`);
  }
  const data = await userService.postUser({ username, age, hobbies });
  return { data, responseCode: 201 };
});

userRouter.put(`${urlBase}/{userId}`, async function(): Promise<IProcessResult<UserResult>> {
  const data = await userService.getUserById(this.url?.getUserId());
  return { data, responseCode: 200 };
})
export default userRouter;
