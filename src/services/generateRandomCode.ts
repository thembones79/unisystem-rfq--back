/**
 * Accepted values: "L" - for letters content or "D" - for digits content.
 */
type ContentType = "L" | "D";

/**
 * Optional content argument accepts: "L" - for letters content or "D" - for digits content. When not provided, generated code will consist digits and letters.
 */
export const generateRandomCode = (length: number, content?: ContentType) => {
  let chars = "";

  const all = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  const letters = "QWERTYUIOPASDFGHJKLZXCVBNM";
  const digits = "1234567890";

  if (!content) {
    chars = all;
  }

  if (content === "L") {
    chars = letters;
  }

  if (content === "D") {
    chars = digits;
  }

  let code = "";

  for (let i = 0; i < length; i++) {
    code = code + chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};
