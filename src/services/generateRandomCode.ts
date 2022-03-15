const chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";

export const generateRandomCode = (length: number) => {
  let code = "";

  for (let i = 0; i < length; i++) {
    code = code + chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};
