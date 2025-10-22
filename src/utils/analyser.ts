import { hash } from "crypto";
import { AnalysedString, SearchCriteria, SearchResult } from "../types";

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

const stringAnalyser = new StringAnalyzer();

export default stringAnalyser;
