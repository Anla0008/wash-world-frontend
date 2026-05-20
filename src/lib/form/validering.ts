// Regex mønster der tjekker om en email er gyldig (samme regler som i backend)
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regex mønster der tjekker om et navn er mellem 2 og 20 tegn
const nameRegex = /^.{2,20}$/;

// Regex mønster der tjekker om en kode er mellem 8 og 255 tegn
const passwordRegex = /^.{8,255}$/;

// Regex mønster der tjekker om en nummerplade er 2 store bogstaver + 5 cifre (fx "AB12345")
const plateNumberRegex = /^[A-Z]{2}\d{5}$/;

// Returnerer true hvis emailen er gyldig, false hvis ikke
export const validateEmail = (value: string) => emailRegex.test(value);

// Returnerer true hvis navnet er mellem 2 og 20 tegn, false hvis ikke
export const validateName = (value: string) => nameRegex.test(value);

// Returnerer true hvis koden er mellem 8 og 255 tegn, false hvis ikke
export const validatePassword = (value: string) => passwordRegex.test(value);

// Returnerer true hvis nummerpladen er gyldig (2 store bogstaver + 5 cifre)
export const validatePlateNumber = (value: string) =>
  plateNumberRegex.test(value);

// Backend-fejl tjek - returnerer hvilket felt der fejlede, eller null
export const getBackendFieldError = (response: any) => {
  if (response?.error_code === "email_taken") return "email";
  if (response?.error_code === "plate_taken") return "plate_number";
  return null;
};
