"use client";
import { useState } from "react";
import Input from "@/components/global/forms/Input";
import TextArea from "@/components/global/forms/TextArea";
import TertriaryButton from "@/components/global/buttons/onClick/TertriaryButton";
import Swipe from "@/components/global/buttons/onClick/Swipe";
import SearchBar from "@/components/global/filtering/SearchBar";
import FilterWrapper from "@/components/global/filtering/FilterWrapper";
export default function Home() {
  const [inputError, setInputError] = useState(true);
  const [inputValidated, setInputValidated] = useState(false);

  const [textAreaError, setTextAreaError] = useState(false);
  const [textAreaValidated, setTextAreaValidated] = useState(true);

  return <div className="flex flex-col align-center gap-10">
    <Input label="Label" error={inputError} validated={inputValidated} placeholder="placeholder" type="password" />
    <TextArea label="Label" error={textAreaError} validated={textAreaValidated} placeholder="placeholder"/>
    <Swipe disabled={true}>Betal noget</Swipe>
    <SearchBar/>
    <FilterWrapper/>
  </div>;
}
