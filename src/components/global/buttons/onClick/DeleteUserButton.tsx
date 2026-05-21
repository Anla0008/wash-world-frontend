"use client";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user_pk: string;
  onDeleted?: () => void;
}

export default function DeleteUserButton({ user_pk, onDeleted }: Props) {
  const { deleteUser } = useAuth();

  return (
    <button
      onClick={async () => {
        await deleteUser(user_pk);
        onDeleted?.();
      }}
      className="bg-(--error-red-transparent) pt-1 pb-1 pr-6 pl-6 rounded-4xl"
    >
      Slet konto
    </button>
  );
}
