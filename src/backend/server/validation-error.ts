export class ValidationError extends Error {
  public isValidationError = true;
  public validationErrors: object;

  constructor(msg: string, validationErrors: object, public readonly httpResponseCode = 500) {
    super(msg);
    this.validationErrors = validationErrors;
  }
}
