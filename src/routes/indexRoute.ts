import { Router, Request, Response, NextFunction } from "express";
const indexRoute = Router();

indexRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Welcome to string analyser. Navigate to /strings to get started",
    documentation: "https://github.com/Moluno-xiii/string_analyzer_ts/",
  });
});

export default indexRoute;
