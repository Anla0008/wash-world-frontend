// Regex mønstre
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex = /^.{2,20}$/;
const passwordRegex = /^.{8,255}$/;
const plateNumberRegex = /^[A-Z]{2}\d{5}$/;

// Valideringsfunktioner
export const validateEmail = (value: string) => emailRegex.test(value);
export const validateName = (value: string) => nameRegex.test(value);
export const validatePassword = (value: string) => passwordRegex.test(value);
export const validatePlateNumber = (value: string) =>
  plateNumberRegex.test(value);

// Fejlbeskeder
export const errorMessages = {
  // Email
  email: "Indtast en gyldig e-mail",
  emailTaken: "Denne e-mail er allerede i brug",
  emailNotFound: "Denne e-mail findes ikke i systemet",
  emailNotVerified: "Du skal verificere din e-mail før du kan logge ind",
  // Navn
  firstName: "Fornavn skal være mellem 2 og 20 tegn",
  lastName: "Efternavn skal være mellem 2 og 20 tegn",
  // Kode
  password: "Koden skal være mindst 8 tegn",
  repeatPassword: "Koderne matcher ikke",
  loginFailed: "Forkert e-mail eller kodeord",
  // Nummerplade
  plate: "Indtast 2 bogstaver og 5 cifre (fx AB12345)",
  plateTaken: "Denne nummerplade er allerede i brug",
};

// Backend-fejl tjek
export const getBackendFieldError = (response: any) => {
  if (response?.error_code === "email_taken") return "email";
  if (response?.error_code === "plate_taken") return "plate_number";
  if (response?.error_code === "email_not_verified")
    return "email_not_verified";
  return null;
};
