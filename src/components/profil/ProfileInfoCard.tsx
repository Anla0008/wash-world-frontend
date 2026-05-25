"use client";
import { useState } from "react";
import { FieldKey } from "@/types/user";

const ProfileInfoCard = ({ section }: { section: SectionType }) => {
  const [activeField, setActiveField] = useState<FieldKey | null>(null);

  // fieldkey gør at ikke alle inputs ændrer state ved activefield - tages fra types

  const editToggle = (fieldKey: FieldKey) => {
    setActiveField((current) => (current === fieldKey ? null : fieldKey));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* mapping af fields kommer fra editmode.js under mockupData */}
      {edit[section].fields.map((field) => {
        const isFieldActive = activeField === field.key;
        const FieldIcon = field.icon;

        return (
          <div
            key={field.key}
            className={`rounded-md p-3 border transition-colors w-full ${isFieldActive ? "border-(--brand-green) bg-foreground/8" : "border-foreground/12 bg-foreground/4"}`}
          >
            <div>
              {/* INPUT */}
              <div className="flex items-center gap-2">
                {FieldIcon ? <FieldIcon size={20} /> : null}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-foreground/65">
                    {field.label}
                  </label>
                  <input
                    // hvis brugeren ikke er i editmode, kan der ikke skrives i input
                    disabled={!isFieldActive}
                    placeholder={field.placeholder}
                    className={`px-3 py-2 rounded-sm border w-full ${isFieldActive ? "border-(--brand-green) bg-(--gray-80)" : "border-foreground/20 bg-(--gray-80)/60"}`}
                    // toggle af farve på input efter activeMode
                  />

                  {field.hasMultiple ? (
                    <button
                      // TODO: sørg for onclick mapper dette card under sig selv
                      className="text-sm text-foreground/70 light"
                    >
                      + Tilføj
                    </button>
                  ) : null}
                </div>

                {/* EDIT TOGGLE */}
                <button
                  className="underline ml-15 text-sm text-(--gray-10)"
                  onClick={() => editToggle(field.key as FieldKey)}
                >
                  {isFieldActive ? "Annuler" : "Rediger"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileInfoCard;
