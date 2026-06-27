export class CustomError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "CustomError";
  }
}
