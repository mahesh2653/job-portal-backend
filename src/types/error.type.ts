export enum IApiErrors {
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  PAYMENT_REQUIRED = "Payment required",
  NOT_FOUND = "Resource not found",
  METHOD_NOT_ALLOWED = "Method not allowed",
  PAYLOAD_TOO_LARGE = "Payload too large",
  UNSUPPORTED_MEDIA = "Unsupported Media",
  UPGRADE_REQUIRED = "Upgrade Required",
  TOO_MANY_REQUESTS = "Too many requests",
  UNAVAILABLE_FOR_LEGAL_REASON = "Unavailable for legal reason",
  INTERNAL_SERVER_ERROR = "Something went wrong",
  BAD_GATEWAY = "Bad Gateway",
  SERVICE_UNAVAILABLE = "Service Unavailable",
  GATEWAY_TIMEOUT = "Gateway Timeout",
  INSUFFICIENT_STORAGE = "Insufficient Storage",
  INVALID_CREDS = "Incorrect Credentials",
  DUPLICATE_ENTRY = "Duplicate Entry Found",
}

export const KeycloakErrors = new Map([
  [400, "Bad Request"],
  [401, "Unauthorized"],
  [403, "Forbidden"],
  [404, "Resource not found"],
  [405, "Method not allowed"],
  [415, "Unsupported Media"],
  [422, "Bad Request"],
]);

export enum Demo {}
// Demo
