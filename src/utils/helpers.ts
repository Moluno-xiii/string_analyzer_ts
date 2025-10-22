import { NumberStringType, Vowel, SearchCriteria } from "../types";

const vowelToNumbersMap: Record<NumberStringType, Vowel> = {
  first: "a",
  second: "e",
  third: "e",
  fourth: "o",
  fifth: "u",
};

const getVowelByNumberString = (numberString: NumberStringType): Vowel => {
  return vowelToNumbersMap[numberString];
};

const getNaturalLanguageFilterCriteria = (
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

const validateSearchParam = (
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

export { validateSearchParam, getNaturalLanguageFilterCriteria };
