import { hash } from "crypto";

type StringProperties = {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
};

type AnalysedString = {
  id: string;
  value: string;
  properties: StringProperties;
  created_at: string;
};

class StringAnalyzer {
  private stringStore = new Map<string, AnalysedString>();

  is_palindrome = (input: string): boolean => {
    const sanitizedInput = this.sanitizeInput(input);
    let leftIndex = 0;
    let rightIndex = sanitizedInput.length - 1;

    while (leftIndex < rightIndex) {
      if (sanitizedInput[leftIndex] !== sanitizedInput[rightIndex]) {
        return false;
      }
      leftIndex++;
      rightIndex--;
    }

    return true;
  };

  private sanitizeInput = (input: string): string => {
    return input.replace(/\s+/g, "").toLowerCase();
  };

  unique_characters = (input: string): number => {
    const sanitizedInput = this.sanitizeInput(input);
    const characters = sanitizedInput.split("");
    const uniqueCharacters = new Set(characters);
    return uniqueCharacters.size;
  };

  word_count = (input: string): number => {
    return input.split(" ").length;
  };

  character_frequency_mmap = (input: string): Record<string, number> => {
    const sanitizedInput = this.sanitizeInput(input);
    const inputCharacters = sanitizedInput.split("");
    const frequencyMap: Record<string, number> = {};

    for (let char of inputCharacters) {
      if (frequencyMap.hasOwnProperty(char)) {
        frequencyMap[char] = frequencyMap[char] + 1;
        continue;
      }

      frequencyMap[char] = 1;
    }
    return frequencyMap;
  };

  sha256_hash = (input: string): string => {
    return hash("sha256", input);
  };

  length = (input: string): number => {
    return input.length;
  };

  analyseString = (input: string) => {
    if (this.doesStringExist(input)) {
      throw new Error("This string already exists");
    }

    const newAnalyzedString: AnalysedString = {
      id: this.sha256_hash(input),
      value: input,
      properties: {
        length: this.length(input),
        is_palindrome: this.is_palindrome(input),
        unique_characters: this.unique_characters(input),
        word_count: this.word_count(input),
        sha256_hash: this.sha256_hash(input),
        character_frequency_map: this.character_frequency_mmap(input),
      },
      created_at: new Date().toLocaleString(),
    };

    this.stringStore.set(input.toLowerCase(), newAnalyzedString);
    return newAnalyzedString;
  };

  doesStringExist = (input: string): boolean => {
    return this.stringStore.has(input.toLowerCase());
  };

  getString = (stringHash: string): AnalysedString | undefined => {
    return this.stringStore.get(stringHash);
  };

  deleteString = (input: string): void => {
    this.stringStore.delete(input.toLowerCase());
  };

  getStore = (): Map<string, AnalysedString> => {
    return this.stringStore;
  };

  matches = (criteria: Partial<SearchCriteria>): SearchResult => {
    let matchedResults: AnalysedString[] = [];
    this.stringStore.forEach((entry) => {
      let matches = true;

      if (
        criteria.contains_character &&
        !entry.value
          .toLowerCase()
          .includes(criteria.contains_character.toLowerCase())
      ) {
        matches = false;
      }

      if (
        typeof criteria.is_palindrome == "boolean" &&
        entry.properties.is_palindrome !== criteria.is_palindrome
      ) {
        matches = false;
      }

      if (
        criteria.min_length &&
        entry.properties.length < criteria.min_length
      ) {
        matches = false;
      }

      if (
        criteria.max_length &&
        entry.properties.length > criteria.max_length
      ) {
        matches = false;
      }

      if (
        criteria.word_count &&
        entry.properties.word_count !== criteria.word_count
      ) {
        matches = false;
      }

      if (matches) matchedResults.push(entry);
    });

    return {
      data: matchedResults,
      count: matchedResults.length,
      filters_applied: criteria,
    };
  };
}

export const validateSearchParam = (
  params: Partial<{
    is_palindrome: any;
    min_length: any;
    max_length: any;
    word_count: any;
    contains_character: any;
  }>
): { success: boolean; errorMesage: string | null } => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = params;

  if (is_palindrome && is_palindrome !== "true" && is_palindrome !== "false") {
    return {
      success: false,
      errorMesage: `is_palindrome should be either (true or false), not ${is_palindrome}`,
    };
  }

  if (min_length && isNaN(Number(min_length))) {
    return {
      success: false,
      errorMesage: `min_length should be a number, not ${min_length}`,
    };
  }

  if (max_length && isNaN(Number(max_length))) {
    return {
      success: false,
      errorMesage: `max_length should be a number, not ${max_length}`,
    };
  }

  if (word_count && isNaN(Number(word_count))) {
    return {
      success: false,
      errorMesage: `word_count should be a number, not ${word_count}`,
    };
  }

  if (contains_character && typeof contains_character !== "string") {
    return {
      success: false,
      errorMesage: `contains_character should be a string, not ${typeof contains_character}`,
    };
  }

  return { success: true, errorMesage: null };
};

type SearchCriteria = {
  is_palindrome: boolean;
  min_length: number;
  max_length: number;
  word_count: number;
  contains_character: string;
};

type SearchResult = {
  data: AnalysedString[];
  count: number;
  filters_applied: Partial<SearchCriteria>;
};

const stringAnalyser = new StringAnalyzer();

stringAnalyser.analyseString("a mAN a plan a canal panama");
stringAnalyser.analyseString("A dog a Panic a PagOda");
stringAnalyser.analyseString("EViL is a name of a foeman as i live");
stringAnalyser.analyseString(
  "Doc note i dissent a fast never prevents a fatness i diet on cod"
);
stringAnalyser.analyseString("step on no pets");
stringAnalyser.analyseString("never odd or even");
stringAnalyser.analyseString("you banana boy");
stringAnalyser.analyseString("madam in eden im adam");
stringAnalyser.analyseString("do geese see god");
stringAnalyser.analyseString("BoOb");
stringAnalyser.analyseString("eKITike");
stringAnalyser.analyseString("kooK");
stringAnalyser.analyseString("zeez");
stringAnalyser.analyseString("YanDHi");
stringAnalyser.analyseString("My BeAutiful dark twisted fantasy");
stringAnalyser.analyseString("Devil in a new dress");

const vowelToNumbersMap: Record<NumberStringType, Vowel> = {
  first: "a",
  second: "e",
  third: "e",
  fourth: "o",
  fifth: "u",
};

type NumberStringType = "first" | "second" | "third" | "fourth" | "fifth";
type Vowel = "a" | "e" | "i" | "o" | "u";

const getVowelByNumberString = (numberString: NumberStringType): Vowel => {
  return vowelToNumbersMap[numberString];
};

export const getNaturalLanguageFilterCriteria = (
  filterString: string
):
  | { success: true; criteria: Partial<SearchCriteria> }
  | { success: false; errorMessage: string } => {
  const lower = filterString.trim().toLowerCase();

  if (lower.includes("single word palindromic")) {
    return { criteria: { is_palindrome: true, word_count: 1 }, success: true };
  }

  if (lower.includes("strings longer than")) {
    const words = lower.split(" ");
    const number = words.at(3);
    return { criteria: { min_length: Number(number) + 1 }, success: true };
  }

  if (lower.includes("palindromic") && lower.includes("vowel")) {
    const words = lower.split(" ");
    const numberWord = words.find((w) =>
      ["first", "second", "third", "fourth", "fifth"].includes(w)
    ) as NumberStringType | undefined;

    if (numberWord) {
      const vowel = getVowelByNumberString(numberWord);
      if (vowel) {
        return {
          success: true,
          criteria: { is_palindrome: true, contains_character: vowel },
        };
      }
    }
  }

  if (lower.includes("containing the letter")) {
    const match = lower.match(/letter\s+([a-z])/);
    if (match) {
      return { success: true, criteria: { contains_character: match[1] } };
    }
  }

  return { success: false, errorMessage: "Criteria not matched" };
};

export default stringAnalyser;
