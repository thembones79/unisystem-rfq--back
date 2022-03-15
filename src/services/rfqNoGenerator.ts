import { generateRandomCode } from "./generateRandomCode";
import { concatZeros } from "./concatZeros";

export const generateRfqCode = (customerId: string) => {
  return `RVF_RFQ_${concatZeros(customerId, 6)}_${generateRandomCode(6)}`;
};
