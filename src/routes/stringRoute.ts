import { Router, Request, Response, NextFunction } from "express";
import stringAnalyser from "../utils/analyser";
const stringRoute = Router();

stringRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Welcome to string analyzer.");
});

stringRoute.get(
  "/:stringId",
  (req: Request, res: Response, next: NextFunction) => {
    const { stringId } = req.params;

    const stringValue = stringAnalyser.getString(stringId);

    if (!stringValue) {
      res.status(404).send("String not found!");
    }
    res.json(stringValue);
  }
);

stringRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
  const { value } = req.body;
  if (!value) {
    res.status(400).send("'value' property is required.");
  }

  if (typeof value !== "string") {
    res
      .status(422)
      .send(
        `Unprocessable entity expected VALUE  to be typeof 'string' instead of ${typeof value}`
      );
    next();
  }
  if (stringAnalyser.doesStringExist(value)) {
    res.status(409).send("String already exists in the system");
    next();
  }
  try {
    const analyedString = stringAnalyser.storeAnalysedString(value);
    res.status(201).json(analyedString);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default stringRoute;
