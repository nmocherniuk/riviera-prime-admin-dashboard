import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid query",
        errors: parsed.error.flatten(),
      });
    }

    Object.assign(req.query as Record<string, unknown>, parsed.data);
    return next();
  };
}
