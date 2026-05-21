import { ReactNode } from "react";

export type FormProps = {
  label: ReactNode; // react node for at kunne bruge både tekst og ikoner som label
  error?: boolean;
  validated?: boolean;
  placeholder: string;
  type: string;
  name?: string;
  value: string;
  errorMessage?: string; // til at vise en fejlbesked under inputfeltet, hvis error er true
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // callback funktion der kaldes når input ændres i forældrekomponenten
  onTextAreaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
};
