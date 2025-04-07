
/**
 * Generates a unique 4-digit access code for user authentication
 */
export const generateAccessCode = (): string => {
  // Generate a random 4-digit number
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  return code;
};

/**
 * Validates if a given code matches the required format
 */
export const validateAccessCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};
