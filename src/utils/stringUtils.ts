export const isBlank = (str: string): boolean => {
  return /^(\s*)$/.test(str);
};

export function trimExtraSpaces(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}


export const checkPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long." };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one letter." };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number." };
  }

  return { valid: true, message: "Password is valid." };
};
