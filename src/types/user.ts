// user oplysninger
export type User = {
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_hashed_password: string;
  user_repeat_hashed_password: string;
  license_plate: string;
};

// redigering af brugeroplysninger i wrapper
export type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "licensePlate"
  | "cardNumber"
  | "cardholderName"
  | "expiryDate"
  | "cvc";
