import { IProcessResult, Router } from "../router.js";
import { readRequestBody } from '../common/utils.js';
import { UserInfo, UserResponseData } from './user.interface.js';
import { InvalidRequestError } from '../errors.js';
import { HttpCodes } from '../common/constants.js';
import { IncomingMessage } from "http";

const baseUrl = '/api/users';

const userRouter: Router<UserResponseData> = new Router();
type ProcessResult = Promise<IProcessResult<UserResponseData>>;

userRouter.get(baseUrl, async function(): ProcessResult {
  const data = await this.userService?.getAllUsers();
  return { data, responseCode: HttpCodes.OK };
});

userRouter.get(`${baseUrl}/{userId}`, async function(): ProcessResult {
  const data = await this.userService?.getUserById(this.url?.getUserId());
  return { data, responseCode: HttpCodes.OK };
});

userRouter.post(baseUrl, async function(req?: IncomingMessage): ProcessResult {
  const { username, age, hobbies } = await readRequestBody<Partial<UserInfo>>(req);
  if (!username || !age || !hobbies) {
    throw new InvalidRequestError();
  }
  const data = await this.userService?.postUser({ username, age, hobbies });
  return { data, responseCode: HttpCodes.CREATED };
});

userRouter.put(`${baseUrl}/{userId}`, async function(req?: IncomingMessage): ProcessResult {
  const { username, age, hobbies } = await readRequestBody<Partial<UserInfo>>(req);
  const userData: Partial<UserInfo> = {};
  if (username) userData.username = username;
  if (age) userData.age = age;
  if (hobbies) userData.hobbies = hobbies;
  const data = await this.userService?.putUser(this.url?.getUserId(), { ...userData });
  return { data, responseCode: HttpCodes.OK };
})

userRouter.delete(`${baseUrl}/{userId}`, async function(): ProcessResult {
  const data = await this.userService?.deleteUser(this.url?.getUserId());
  return { data, responseCode: HttpCodes.NO_CONTENT };
})

export default userRouter;
