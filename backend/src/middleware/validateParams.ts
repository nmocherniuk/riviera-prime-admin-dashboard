import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validateParams(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid params",
        errors: parsed.error.flatten(),
      });
    }

    Object.assign(req.params as Record<string, unknown>, parsed.data);
    return next();
  };
}
