import { Router, Request, Response, NextFunction } from "express";
import stringAnalyser, {
  getNaturalLanguageFilterCriteria,
  validateSearchParam,
} from "../utils/analyser";
const stringRoute = Router();

const acceptableQueryFilters = [
  "is_palindrome",
  "min_length",
  "max_length",
  "word_count",
  "contains_character",
];

stringRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  const queryData = req.query;

  for (const entry of Object.keys(queryData)) {
    if (!acceptableQueryFilters.includes(entry)) {
      return res.status(400).json({
        message: `Invalid query filter parameter: ${entry}. Acceptable filter parameters : ${acceptableQueryFilters}`,
      });
    }
  }

  const { errorMesage } = validateSearchParam(queryData);

  if (errorMesage) {
    res.status(400).json(errorMesage);
    return;
  }

  let filterResults;
  if (Object.keys(queryData).length < 1) {
    filterResults = stringAnalyser.matches({
      min_length: 1,
    });
  } else {
    filterResults = stringAnalyser.matches({
      ...queryData,
      is_palindrome:
        queryData.is_palindrome == "true"
          ? true
          : queryData.is_palindrome == "false"
          ? false
          : undefined,
      max_length: queryData.max_length
        ? Number(queryData.max_length)
        : undefined,
      min_length: queryData.min_length
        ? Number(queryData.min_length)
        : undefined,
      word_count: queryData.word_count
        ? Number(queryData.word_count)
        : undefined,
    });
  }

  res.json(filterResults);
});

stringRoute.get("/all", (req: Request, res: Response, next: NextFunction) => {
  res.json(Object.fromEntries(stringAnalyser.getStore()));
});

stringRoute.get(
  "/filter-by-natural-language",
  (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || (query && (query as string).trim().length < 1)) {
      res.status(400).send("Unable to parse natural language query.");
      return;
    }

    const filterCriteria = getNaturalLanguageFilterCriteria(query as string);

    if (filterCriteria.success === false) {
      res.status(422).send("Query parsed but resulted in conflicting filters.");
      return;
    }

    const result = stringAnalyser.matches(filterCriteria.criteria);

    res.json({
      data: result.data,
      count: result.count,
      interpreted_query: {
        // change this
        original: query,
        parsed_filters: filterCriteria.criteria,
      },
    });
  }
);

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
  const { string } = req.params;
  if (!stringAnalyser.doesStringExist(string)) {
    res.status(404).json({ message: `Value : ${string} doesn't exist.` });
    return;
  }

  stringAnalyser.deleteString(string);
  res.status(204);
});

export default stringRoute;
