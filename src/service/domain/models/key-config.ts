export type KeyConfig = {
  origin: string;
  factor: KeyFactor;
};

export type KeyFactor = "first" | "second" | "either";
