export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateRegisterInput = (name, email, password) => {
  const errors = [];

  if (!validateName(name)) {
    errors.push("Name must be at least 2 characters");
  }

  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  if (!validatePassword(password)) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginInput = (email, password) => {
  const errors = [];

  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
