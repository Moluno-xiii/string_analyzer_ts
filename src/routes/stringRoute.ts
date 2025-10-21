import { Router, Request, Response, NextFunction } from "express";
import stringAnalyser, { validateSearchParam } from "../utils/analyser";
const stringRoute = Router();

stringRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  const queryData = req.query;

  const { errorMesage } = validateSearchParam(queryData);

  if (errorMesage) {
    res.status(400).json(errorMesage);
    return;
  }
  console.log("querydata", queryData);
  const filterResults = stringAnalyser.matches({
    ...queryData,
    is_palindrome: queryData.is_palindrome == "true",
    max_length: Number(queryData.max_length),
    min_length: Number(queryData.min_length),
    word_count: Number(queryData.word_count),
  });
  // const filterResults = stringAnalyser.matches({
  //   contains_character: "Bo",
  // });

  res.json({ data: filterResults, params: queryData });
});

stringRoute.get("/all", (req: Request, res: Response, next: NextFunction) => {
  res.json(Object.fromEntries(stringAnalyser.getStore()));
});

stringRoute.get("/:string", (req: Request, res: Response) => {
  const { string } = req.params;

  const stringValue = stringAnalyser.getString(string.toLowerCase());

  if (!stringValue) {
    res.status(404).send("String not found!");
  }
  res.json(stringValue);
});

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
    const analyedString = stringAnalyser.analyseString(value);
    res.status(201).json(analyedString);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

stringRoute.delete("/:string", (req: Request, res: Response) => {
  if (!stringAnalyser.doesStringExist(req.params.string)) {
    res
      .status(404)
      .json({ message: `Value : ${req.params.string} doesn't exist.` });
    return;
  }

  stringAnalyser.deleteString(req.params.string);
  res.status(204);
});

export default stringRoute;
