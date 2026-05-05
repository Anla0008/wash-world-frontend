import { ReactNode } from "react";

export type FAQItem = {
  title: string;
  content: ReactNode; // ReactNode tillader os at have både tekst og HTML-elementer i content (så vi kan have links og lignende)
};
