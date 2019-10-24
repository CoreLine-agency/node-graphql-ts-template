export class ServerError extends Error {
  constructor(msg: string, public readonly httpResponseCode = 500) {
    super(msg);
  }
}
