export const concatZeros = (stringToExpand: string, desiredLength: number) => {
  const actualLength = stringToExpand.length;
  const numberOfZerosToConcat = desiredLength - actualLength;

  if (numberOfZerosToConcat <= 0) {
    return stringToExpand;
  }

  let zeros = "";

  for (let i = 0; i < numberOfZerosToConcat; i++) {
    zeros = zeros + "0";
  }

  return zeros + stringToExpand;
};
