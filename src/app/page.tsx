"use client";
import { useState } from "react";
import Input from "@/components/global/forms/Input";
import TextArea from "@/components/global/forms/TextArea";

export default function Home() {
  const [inputError, setInputError] = useState(true);
  const [inputValidated, setInputValidated] = useState(false);

  const [textAreaError, setTextAreaError] = useState(false);
  const [textAreaValidated, setTextAreaValidated] = useState(true);

  return <div>
    <Input label="Label" helper="helper-text" error={inputError} validated={inputValidated} placeholder="placeholder" type="password" />
    <TextArea label="Label" helper="helper-text" error={textAreaError} validated={textAreaValidated} placeholder="placeholder"/>

  </div>;
}
