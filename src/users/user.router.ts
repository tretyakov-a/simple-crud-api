import { IProcessResult, Router } from "../router.js";
import { UserDB } from './user-db.js';
import { readRequestBody } from '../common/utils.js';
import { UserInfo, UserResponseData } from './user.interface.js';
import { InvalidRequestError } from '../errors.js';
import { HttpCodes } from '../common/constants.js';

const baseUrl = '/api/users';
const userService: UserDB = new UserDB();

const userRouter: Router<UserResponseData> = new Router();
type ProcessResult = Promise<IProcessResult<UserResponseData>>;

userRouter.get(baseUrl, async (): ProcessResult => {
  const data = await userService.getAllUsers();
  return { data, responseCode: HttpCodes.OK };
});

userRouter.get(`${baseUrl}/{userId}`, async function(): ProcessResult {
  const data = await userService.getUserById(this.url?.getUserId());
  return { data, responseCode: HttpCodes.OK };
});

// TODO: check parsed values types: age should be number, ...etc.
// TODO: add model User with all this checks and parsing

userRouter.post(baseUrl, async function(): ProcessResult {
  const body = await readRequestBody(this.request);
  const { username, age, hobbies }: Partial<UserInfo> = JSON.parse(body);
  if (!username || !age || !hobbies) {
    throw new InvalidRequestError();
  }
  const data = await userService.postUser({ username, age, hobbies });
  return { data, responseCode: HttpCodes.CREATED };
});

userRouter.put(`${baseUrl}/{userId}`, async function(): ProcessResult {
  const body = await readRequestBody(this.request);
  const { username, age, hobbies }: Partial<UserInfo> = JSON.parse(body);
  const userData: Partial<UserInfo> = {};
  if (username) userData.username = username;
  if (age) userData.age = age;
  if (hobbies) userData.hobbies = hobbies;
  const data = await userService.putUser(this.url?.getUserId(), { ...userData });
  return { data, responseCode: HttpCodes.OK };
})

userRouter.delete(`${baseUrl}/{userId}`, async function(): ProcessResult {
  const data = await userService.deleteUser(this.url?.getUserId());
  return { data, responseCode: HttpCodes.NO_CONTENT };
})

export default userRouter;
