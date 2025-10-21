import isErrorWithStatusCode from "../boolean/isErrorWithStatusCode";

describe("isErrorWithStatusCode", () => {
  it("should return true for error with statusCode", () => {
    const error = { message: "Error occurred", statusCode: 404 };
    expect(isErrorWithStatusCode(error)).toBe(true);
  });
  it("should return false for error without statusCode", () => {
    const error = { message: "Error occurred" };
    expect(isErrorWithStatusCode(error)).toBe(false);
  });
  it("should return false for non-object types", () => {
    expect(isErrorWithStatusCode("string")).toBe(false);
    expect(isErrorWithStatusCode(123)).toBe(false);
    expect(isErrorWithStatusCode(null)).toBe(false);
    expect(isErrorWithStatusCode(undefined)).toBe(false);
  });
});
