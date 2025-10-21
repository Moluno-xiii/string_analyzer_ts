import { hash } from "crypto";

// import stringRoute from "../routes/stringRoute";

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
  // constructor(public value: string) {}

  is_palindrome = (input: string): boolean => {
    let leftIndex = 0;
    let rightIndex = input.length - 1;

    while (leftIndex < rightIndex) {
      if (input[leftIndex] !== input[rightIndex]) {
        return false;
      }
      leftIndex++;
      rightIndex--;
    }

    return true;
  };

  unique_characters = (input: string): number => {
    const sanitizedInput = input.replace(/\s+/g, "");
    const characters = sanitizedInput.split("");
    const uniqueCharacters = new Set(characters);
    return uniqueCharacters.size;
  };

  word_count = (input: string): number => {
    return input.split(" ").length;
  };

  character_frequency_mmap = (input: string): Record<string, number> => {
    const sanitizedInput = input.replace(/\s+/g, "").toLowerCase();
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
    return hash("sha-256", input);
  };

  length = (input: string): number => {
    return input.length;
  };

  storeAnalysedString = (input: string) => {
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

    this.stringStore.set(input, newAnalyzedString);
    return newAnalyzedString;
  };

  doesStringExist = (input: string): boolean => {
    return this.stringStore.has(input);
  };

  getString = (stringHash: string): AnalysedString | undefined => {
    return this.stringStore.get(stringHash);
  };

  getStore = (): Map<string, AnalysedString> => {
    return this.stringStore;
  };
}

const stringAnalyser = new StringAnalyzer();

export default stringAnalyser;

stringAnalyser.storeAnalysedString("string to analyze");
stringAnalyser.storeAnalysedString("what happened to virgil?");
console.log(stringAnalyser.getString("string to analyze"));
