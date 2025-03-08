
/**
 * Generates a unique 5-digit access code for user authentication
 */
export const generateAccessCode = (): string => {
  // Generate a random 5-digit number
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  return code;
};

/**
 * Validates if a given code matches the required format
 */
export const validateAccessCode = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};
