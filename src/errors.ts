import { HttpCodes } from './common/constants.js';

export class HttpError extends Error {
  public readonly httpResponseCode: number;
  public httpErrorMessage: string;

  constructor(message: string, httpResponseCode: number) {
    super(message);
    this.httpErrorMessage = message;
    this.httpResponseCode = httpResponseCode;
  }
}

export class InvalidRequestError extends HttpError {
  constructor() {
    super(`Request should contain required fields in json format: 'username, age, hobbies'`, HttpCodes.BAD_REQUEST);
  }
}

export class InvalidUserIdError extends HttpError {
  public readonly userId: string;

  constructor(userId = '') {
    super(`Invalid userId: '${userId}'`, HttpCodes.BAD_REQUEST);
    this.userId = userId;
  }
}

export class NonExistentUserIdError extends HttpError {
  public readonly userId: string;

  constructor(userId = '') {
    super(`Record with userId '${userId}' doesn't exist`, HttpCodes.NOT_FOUND);
    this.userId = userId;
  }
}

export class NonExistentEndpointError extends HttpError {
  public readonly url: string;

  constructor(url = '') {
    super(`Endpoint '${url}' doesn't exist`, HttpCodes.NOT_FOUND);
    this.url = url;
  }
}

export class InternalServerError extends HttpError {
  constructor() {
    super(`Internal server error`, HttpCodes.SERVER_ERROR);
  }
}
