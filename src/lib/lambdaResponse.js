/**
 * Unwrap AWS Lambda Function URL response envelope.
 * Lambda can return { statusCode, body, headers }; body may be a string (JSON or plain).
 */
export function unwrapLambdaResponse(data) {
  if (data == null || typeof data !== "object") return data;
  if (typeof data.body === "string") {
    try {
      return JSON.parse(data.body);
    } catch (_) {
      return data.body;
    }
  }
  return data;
}
