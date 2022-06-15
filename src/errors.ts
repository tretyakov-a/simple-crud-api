
export class MyError extends Error {
  public readonly httpResponseCode: number;

  constructor(message: string, httpResponseCode: number) {
    super(message);
    this.httpResponseCode = httpResponseCode;
  }
}

export class InvalidRequestError extends MyError {
  constructor() {
    super(`Requset should contain required fields: 'username, age, hobbies'`, 400);
  }
}

export class InvalidUserIdError extends MyError {
  public readonly userId: string;

  constructor(userId: string = '') {
    super(`Invalid userId: '${userId}'`, 400);
    this.userId = userId;
  }
}

export class NonExistentUserIdError extends MyError {
  public readonly userId: string;

  constructor(userId: string = '') {
    super(`Record with userId '${userId}' doesn't exist`, 404);
    this.userId = userId;
  }
}

export class NonExistentEndpointError extends MyError {
  public readonly url: string;

  constructor(url: string = '') {
    super(`Endpoint '${url}' doesn't exist`, 404);
    this.url = url;
  }
}

export class InternalServerError extends MyError {
  constructor() {
    super(`Internal server error`, 500);
  }
}
