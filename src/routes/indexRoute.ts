import { Router, Request, Response, NextFunction } from "express";
const indexRoute = Router();

indexRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "what fuck do you want?", number: crypto.randomUUID() });
});

indexRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default indexRoute;
