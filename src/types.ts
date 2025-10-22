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

type NumberStringType = "first" | "second" | "third" | "fourth" | "fifth";
type Vowel = "a" | "e" | "i" | "o" | "u";

export type {
  SearchCriteria,
  SearchResult,
  StringProperties,
  AnalysedString,
  NumberStringType,
  Vowel,
};
