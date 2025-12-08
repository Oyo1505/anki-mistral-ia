import {
  ErrorCode,
  AppError,
  createError,
  isAppError,
  logError,
  type ApiError,
} from "../logError";

describe("ErrorCode", () => {
  it("devrait contenir tous les codes d'erreur nécessaires", () => {
    expect(ErrorCode.INTERNAL_SERVER_ERROR).toBe("INTERNAL_SERVER_ERROR");
    expect(ErrorCode.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
    expect(ErrorCode.NOT_FOUND).toBe("NOT_FOUND");
    expect(ErrorCode.UNAUTHORIZED).toBe("UNAUTHORIZED");
    expect(ErrorCode.FORBIDDEN).toBe("FORBIDDEN");
    expect(ErrorCode.BAD_REQUEST).toBe("BAD_REQUEST");
  });

  it("devrait contenir les codes d'erreur de base de données", () => {
    expect(ErrorCode.DATABASE_CONNECTION_ERROR).toBe(
      "DATABASE_CONNECTION_ERROR"
    );
    expect(ErrorCode.DATABASE_QUERY_ERROR).toBe("DATABASE_QUERY_ERROR");
    expect(ErrorCode.DUPLICATE_ENTRY).toBe("DUPLICATE_ENTRY");
  });

  it("devrait contenir les codes d'erreur d'authentification", () => {
    expect(ErrorCode.INVALID_CREDENTIALS).toBe("INVALID_CREDENTIALS");
    expect(ErrorCode.TOKEN_EXPIRED).toBe("TOKEN_EXPIRED");
  });

  it("devrait contenir les codes d'erreur API externes", () => {
    expect(ErrorCode.EXTERNAL_API_ERROR).toBe("EXTERNAL_API_ERROR");
    expect(ErrorCode.GOOGLE_DRIVE_ERROR).toBe("GOOGLE_DRIVE_ERROR");
    expect(ErrorCode.MISTRAL_API_ERROR).toBe("MISTRAL_API_ERROR");
  });
});

describe("AppError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devrait créer une instance d'AppError avec tous les paramètres", () => {
    const details = { userId: "123", action: "delete" };
    const error = new AppError(
      ErrorCode.NOT_FOUND,
      "Utilisateur introuvable",
      404,
      details,
      "/api/users"
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("AppError");
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.message).toBe("Utilisateur introuvable");
    expect(error.statusCode).toBe(404);
    expect(error.details).toEqual(details);
    expect(error.path).toBe("/api/users");
    expect(error.timestamp).toBeInstanceOf(Date);
    expect(error.stack).toBeDefined();
  });

  it("devrait créer une instance d'AppError sans détails ni path", () => {
    const error = new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Erreur serveur",
      500
    );

    expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    expect(error.message).toBe("Erreur serveur");
    expect(error.statusCode).toBe(500);
    expect(error.details).toBeUndefined();
    expect(error.path).toBeUndefined();
  });

  it("devrait utiliser 500 comme statusCode par défaut", () => {
    const error = new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Erreur");

    expect(error.statusCode).toBe(500);
  });

  describe("toApiError", () => {
    it("devrait convertir AppError en ApiError avec tous les champs", () => {
      const details = { field: "email", reason: "invalid format" };
      const error = new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Email invalide",
        400,
        details,
        "/api/auth"
      );

      const apiError: ApiError = error.toApiError();

      expect(apiError).toEqual({
        code: ErrorCode.VALIDATION_ERROR,
        message: "Email invalide",
        statusCode: 400,
        details,
        timestamp: error.timestamp,
        path: "/api/auth",
      });
    });

    it("devrait convertir AppError en ApiError sans détails ni path", () => {
      const error = new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Erreur serveur"
      );

      const apiError = error.toApiError();

      expect(apiError.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(apiError.message).toBe("Erreur serveur");
      expect(apiError.statusCode).toBe(500);
      expect(apiError.details).toBeUndefined();
      expect(apiError.path).toBeUndefined();
      expect(apiError.timestamp).toBeInstanceOf(Date);
    });
  });
});

describe("createError", () => {
  describe("notFound", () => {
    it("devrait créer une erreur NOT_FOUND avec ID", () => {
      const error = createError.notFound("Utilisateur", "123");

      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.message).toBe("Utilisateur avec l'ID 123 introuvable");
      expect(error.statusCode).toBe(404);
    });

    it("devrait créer une erreur NOT_FOUND sans ID", () => {
      const error = createError.notFound("Ressource");

      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.message).toBe("Ressource  introuvable");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("validation", () => {
    it("devrait créer une erreur VALIDATION_ERROR avec détails", () => {
      const details = { field: "email", constraint: "format" };
      const error = createError.validation("Validation échouée", details);

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe("Validation échouée");
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });

    it("devrait créer une erreur VALIDATION_ERROR sans détails", () => {
      const error = createError.validation("Données invalides");

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe("Données invalides");
      expect(error.statusCode).toBe(400);
      expect(error.details).toBeUndefined();
    });
  });

  describe("unauthorized", () => {
    it("devrait créer une erreur UNAUTHORIZED avec message personnalisé", () => {
      const error = createError.unauthorized("Token invalide");

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.message).toBe("Token invalide");
      expect(error.statusCode).toBe(401);
    });

    it("devrait créer une erreur UNAUTHORIZED avec message par défaut", () => {
      const error = createError.unauthorized();

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.message).toBe("Non autorisé");
      expect(error.statusCode).toBe(401);
    });
  });

  describe("forbidden", () => {
    it("devrait créer une erreur FORBIDDEN avec message personnalisé", () => {
      const error = createError.forbidden("Permissions insuffisantes");

      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.message).toBe("Permissions insuffisantes");
      expect(error.statusCode).toBe(403);
    });

    it("devrait créer une erreur FORBIDDEN avec message par défaut", () => {
      const error = createError.forbidden();

      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.message).toBe("Accès interdit");
      expect(error.statusCode).toBe(403);
    });
  });

  describe("badRequest", () => {
    it("devrait créer une erreur BAD_REQUEST avec détails", () => {
      const details = { parameter: "limit", issue: "must be positive" };
      const error = createError.badRequest("Paramètre invalide", details);

      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.message).toBe("Paramètre invalide");
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });

    it("devrait créer une erreur BAD_REQUEST sans détails", () => {
      const error = createError.badRequest("Requête invalide");

      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.message).toBe("Requête invalide");
      expect(error.statusCode).toBe(400);
      expect(error.details).toBeUndefined();
    });
  });

  describe("internal", () => {
    it("devrait créer une erreur INTERNAL_SERVER_ERROR avec message et détails", () => {
      const details = { operation: "database query", error: "timeout" };
      const error = createError.internal("Erreur base de données", details);

      expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(error.message).toBe("Erreur base de données");
      expect(error.statusCode).toBe(500);
      expect(error.details).toEqual(details);
    });

    it("devrait créer une erreur INTERNAL_SERVER_ERROR avec message par défaut", () => {
      const error = createError.internal();

      expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(error.message).toBe("Erreur interne du serveur");
      expect(error.statusCode).toBe(500);
      expect(error.details).toBeUndefined();
    });
  });

  describe("database", () => {
    it("devrait créer une erreur DATABASE_QUERY_ERROR avec détails", () => {
      const details = { query: "SELECT * FROM users", error: "syntax" };
      const error = createError.database("Erreur requête SQL", details);

      expect(error.code).toBe(ErrorCode.DATABASE_QUERY_ERROR);
      expect(error.message).toBe("Erreur requête SQL");
      expect(error.statusCode).toBe(500);
      expect(error.details).toEqual(details);
    });

    it("devrait créer une erreur DATABASE_QUERY_ERROR sans détails", () => {
      const error = createError.database("Erreur BDD");

      expect(error.code).toBe(ErrorCode.DATABASE_QUERY_ERROR);
      expect(error.message).toBe("Erreur BDD");
      expect(error.statusCode).toBe(500);
    });
  });

  describe("duplicate", () => {
    it("devrait créer une erreur DUPLICATE_ENTRY", () => {
      const error = createError.duplicate("Email");

      expect(error.code).toBe(ErrorCode.DUPLICATE_ENTRY);
      expect(error.message).toBe("Email existe déjà");
      expect(error.statusCode).toBe(409);
    });
  });

  describe("externalApi", () => {
    it("devrait créer une erreur EXTERNAL_API_ERROR", () => {
      const error = createError.externalApi("Mistral", "Rate limit exceeded");

      expect(error.code).toBe(ErrorCode.EXTERNAL_API_ERROR);
      expect(error.message).toBe("Erreur API Mistral: Rate limit exceeded");
      expect(error.statusCode).toBe(502);
    });
  });
});

describe("isAppError", () => {
  it("devrait retourner true pour une instance d'AppError", () => {
    const error = new AppError(ErrorCode.NOT_FOUND, "Not found", 404);

    expect(isAppError(error)).toBe(true);
  });

  it("devrait retourner false pour une Error standard", () => {
    const error = new Error("Standard error");

    expect(isAppError(error)).toBe(false);
  });

  it("devrait retourner false pour une chaîne", () => {
    expect(isAppError("error string")).toBe(false);
  });

  it("devrait retourner false pour un objet générique", () => {
    expect(isAppError({ message: "error" })).toBe(false);
  });

  it("devrait retourner false pour null", () => {
    expect(isAppError(null)).toBe(false);
  });

  it("devrait retourner false pour undefined", () => {
    expect(isAppError(undefined)).toBe(false);
  });

  it("devrait retourner false pour un nombre", () => {
    expect(isAppError(123)).toBe(false);
  });
});

describe("logError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("devrait logger une AppError avec tous les détails", () => {
    const details = { userId: "123" };
    const error = new AppError(
      ErrorCode.NOT_FOUND,
      "User not found",
      404,
      details,
      "/api/users"
    );

    logError(error, "UserService");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[UserService\] AppError \[NOT_FOUND\]:/);
    expect(logData).toMatchObject({
      message: "User not found",
      statusCode: 404,
      details,
      path: "/api/users",
    });
    expect(logData.stack).toBeDefined();
  });

  it("devrait logger une AppError sans contexte", () => {
    const error = new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Server error"
    );

    logError(error);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage] = consoleErrorSpy.mock.calls[0];

    // Vérifie qu'il n'y a pas de contexte [nom] après la date
    expect(logMessage).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z  AppError/);
    expect(logMessage).toMatch(/AppError \[INTERNAL_SERVER_ERROR\]:/);
  });

  it("devrait logger une Error standard", () => {
    const error = new Error("Standard error");

    logError(error, "TestContext");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[TestContext\] Error:/);
    expect(logData).toMatchObject({
      name: "Error",
      message: "Standard error",
    });
    expect(logData.stack).toBeDefined();
  });

  it("devrait logger une erreur inconnue (string)", () => {
    logError("Unknown error occurred", "ErrorHandler");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, errorData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[ErrorHandler\] Unknown error:/);
    expect(errorData).toBe("Unknown error occurred");
  });

  it("devrait logger une erreur inconnue (object)", () => {
    const errorObj = { code: 500, message: "Something went wrong" };

    logError(errorObj, "API");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, errorData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[API\] Unknown error:/);
    expect(errorData).toEqual(errorObj);
  });

  it("devrait logger une erreur avec timestamp ISO", () => {
    const error = new Error("Test error");

    logError(error);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage] = consoleErrorSpy.mock.calls[0];

    // Vérifier le format ISO 8601
    expect(logMessage).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
    );
  });

  it("devrait logger plusieurs erreurs consécutives", () => {
    const error1 = new AppError(ErrorCode.NOT_FOUND, "Not found");
    const error2 = new Error("Standard error");
    const error3 = "String error";

    logError(error1, "Context1");
    logError(error2, "Context2");
    logError(error3, "Context3");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy.mock.calls[0][0]).toMatch(/\[Context1\]/);
    expect(consoleErrorSpy.mock.calls[1][0]).toMatch(/\[Context2\]/);
    expect(consoleErrorSpy.mock.calls[2][0]).toMatch(/\[Context3\]/);
  });

  it("devrait gérer les erreurs avec stack trace", () => {
    const error = new Error("Error with stack");
    Error.captureStackTrace(error);

    logError(error);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [, logData] = consoleErrorSpy.mock.calls[0];

    expect(logData.stack).toBeDefined();
    expect(typeof logData.stack).toBe("string");
  });

  it("devrait logger une erreur null", () => {
    logError(null, "NullError");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, errorData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[NullError\] Unknown error:/);
    expect(errorData).toBeNull();
  });

  it("devrait logger une erreur undefined", () => {
    logError(undefined, "UndefinedError");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, errorData] = consoleErrorSpy.mock.calls[0];

    expect(logMessage).toMatch(/\[UndefinedError\] Unknown error:/);
    expect(errorData).toBeUndefined();
  });
});
