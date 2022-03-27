import { generateRandomCode } from "./generateRandomCode";

export const generateClientCode = (name: string) => {
  const first = name.substring(0, 1).toUpperCase();
  return `${first}${generateRandomCode(2, "L")}`;
};
