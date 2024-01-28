class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = '') {
    super(400, message);

    this.name = 'BadRequestError';
  }
}
