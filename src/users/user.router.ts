import { IProcessResult, Router } from "../router.js";
import { UserDB } from './user-db.js';
import { readRequestBody } from '../common/utils.js';
import { UserInfo, UserResult } from './user.interface.js';
import { InvalidRequestError } from '../errors.js';
import { HttpCodes } from '../common/constants.js';

const baseUrl = '/api/users';
const userService = new UserDB();
userService.initDb('users.json');

const userRouter: Router<UserResult> = new Router();

userRouter.get(baseUrl, async (): Promise<IProcessResult<UserResult>> => {
  const data = await userService.getAllUsers();
  return { data, responseCode: HttpCodes.OK };
});

userRouter.get(`${baseUrl}/{userId}`, async function(): Promise<IProcessResult<UserResult>> {
  const data = await userService.getUserById(this.url?.getUserId());
  return { data, responseCode: HttpCodes.OK };
});

userRouter.post(baseUrl, async function(): Promise<IProcessResult<UserResult>> {
  const body = await readRequestBody(this.request);
  const { username, age, hobbies }: Partial<UserInfo> = JSON.parse(body);
  if (!username || !age || !hobbies) {
    throw new InvalidRequestError();
  }
  const data = await userService.postUser({ username, age, hobbies });
  return { data, responseCode: HttpCodes.CREATED };
});

userRouter.put(`${baseUrl}/{userId}`, async function(): Promise<IProcessResult<UserResult>> {
  const body = await readRequestBody(this.request);
  const { username, age, hobbies }: Partial<UserInfo> = JSON.parse(body);
  const userData: Partial<UserInfo> = {};
  if (username) userData.username = username;
  if (age) userData.age = age;
  if (hobbies) userData.hobbies = hobbies;
  const data = await userService.putUser(this.url?.getUserId(), { ...userData });
  return { data, responseCode: HttpCodes.OK };
})

userRouter.delete(`${baseUrl}/{userId}`, async function(): Promise<IProcessResult<UserResult>> {
  const data = await userService.deleteUser(this.url?.getUserId());
  return { data, responseCode: HttpCodes.NO_CONTENT };
})

export default userRouter;
