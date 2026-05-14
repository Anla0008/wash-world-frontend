// user oplysninger
export type User = {
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_hashed_password: string;
  user_repeat_hashed_password: string;
  plate_number: string;
  has_sub?: boolean;
};

// redigering af brugeroplysninger i wrapper
export type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "plateNumber"
  | "cardNumber"
  | "cardholderName"
  | "expiryDate"
  | "cvc";
