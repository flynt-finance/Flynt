import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .min(9, "Password must be at least 9 characters")
    .max(50, "Password must not exceed 50 characters"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  name: yup.string().required("Full name is required").trim(),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .min(9, "Password must be at least 9 characters")
    .max(50, "Password must not exceed 50 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .trim()
    .matches(
      /^\+[1-9]\d{6,14}$/,
      "Please enter a valid international phone number"
    ),
  countryCode: yup.string().optional(),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;

const emailField = yup
  .string()
  .email("Please enter a valid email address")
  .required("Email address is required");

const newPasswordField = yup
  .string()
  .required("Password is required")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
  .min(9, "Password must be at least 9 characters")
  .max(50, "Password must not exceed 50 characters");

/** Forgot password: email only */
export const forgotPasswordSchema = yup.object({
  email: emailField,
});

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;

/** Reset password: email, otp, newPassword, confirmPassword */
export const resetPasswordSchema = yup.object({
  email: emailField,
  otp: yup
    .string()
    .required("Verification code is required")
    .length(6, "Code must be 6 digits")
    .matches(/^\d+$/, "Code must be digits only"),
  newPassword: newPasswordField,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;

/** Change password: currentPassword, newPassword, confirmPassword */
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: newPasswordField,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

/** Validate only the phone field (full international number e.g. +2348012345678). */
export const validatePhone = (fullPhone: string): string | null => {
  try {
    registerSchema.pick(["phone"]).validateSync({ phone: fullPhone });
    return null;
  } catch (err) {
    const yupErr = err as { errors?: string[] };
    return yupErr.errors?.[0] ?? "Please enter a valid international phone number";
  }
};
