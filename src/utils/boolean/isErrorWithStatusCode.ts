const isErrorWithStatusCode = (e: unknown): e is { statusCode?: number } => {
  return (
    typeof e === "object" &&
    e !== null &&
    "statusCode" in e &&
    typeof (e as any).statusCode === "number"
  );
};

export default isErrorWithStatusCode;
