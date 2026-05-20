import { ReactNode } from "react";

export type FormProps = {
  label: ReactNode; // react node for at kunne bruge både tekst og ikoner som label
  error?: boolean;
  validated?: boolean;
  placeholder: string;
  value: string; // så der huskes det udfyldte i input når man går tilbage på pil
  type: string;
  errorMessage?: string; // til at vise en fejlbesked under inputfeltet, hvis error er true
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // callback funktion der kaldes når input ændres i forældrekomponenten
  onTextAreaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
};
