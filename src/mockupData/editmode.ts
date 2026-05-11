import Profile from "@/components/global/icons/navbar/Profile";
import ProfileCard from "@/components/global/icons/grafik/ProfileCard";
import Mail from "@/components/global/icons/grafik/Mail";
import type { ComponentType } from "react";
import type { IconProps } from "@/types/icons";

type ProfileFieldKey =
    | "firstName"
    | "lastName"
    | "email"
    | "licensePlate";

type PaymentFieldKey =
    | "cardNumber"
    | "expiryDate"
    | "cvc";

type EditFieldBase = {
    key: ProfileFieldKey | PaymentFieldKey;
    label: string;
    placeholder: string;
    hasMultiple?: boolean;
    icon?: ComponentType<IconProps>;
};

type ProfileEditField = EditFieldBase & {
    key: ProfileFieldKey;
    icon: ComponentType<IconProps>;
};

type PaymentEditField = EditFieldBase & {
    key: PaymentFieldKey;
};

type EditData = {
    profile: {
        fields: ProfileEditField[];
    };
    payment: {
        hasMultiple: boolean;
        fields: PaymentEditField[];
    };
};

const edit: EditData = {
    profile: {
        fields: [
            {
                key: "firstName",
                label: "Fornavn",
                placeholder: "Indtast dit fornavn",
                hasMultiple: false,
                icon: Profile,
            },
            {
                key: "lastName",
                label: "Efternavn",
                placeholder: "Indtast dit efternavn",
                hasMultiple: false,
                icon: Profile,
            },
            {
                key: "email",
                label: "Email",
                placeholder: "Indtast din email",
                hasMultiple: false,
                icon: Mail,
            },
            {
                key: "licensePlate",
                label: "Nummerplade",
                placeholder: "Indtast din nummerplade",
                hasMultiple: true,
                icon: ProfileCard,
            },
        ],
    },

    payment: {
        hasMultiple: true,

        fields: [
            {
                key: "cardNumber",
                label: "Kortnummer",
                placeholder: "Indtast dit kortnummer",
            },
            {
                key: "expiryDate",
                label: "Udløbsdato",
                placeholder: "Indtast kortets udløbsdato",
            },
            {
                key: "cvc",
                label: "CVC",
                placeholder: "Indtast kortets CVC-kode",
            },
        ],
    },
};

export default edit;

export type SectionType = keyof EditData;