"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  textTitle = "ویرایش",
  textLoading = "در حال بروزرسانی ...",
  className = "",
  active = false
}: {
  textTitle: string;
  textLoading: string;
  className: string;
  active: boolean;
}) {
  const status = useFormStatus();

  return (
    <button
      type="submit"
      disabled={active}
      className={`  cursor-pointer w-1/2 bg-white border rounded-xl border-primary-light text-primary-light px-4 py-2 hover:text-purple-600 hover:font-bold text-sm transition ease-in-out hover:scale-[1.06] duration-100 ${
        status.pending ? "bg-purple-600" : ""
      } ${className}`}
    >
      {status.pending ? textLoading : textTitle}
    </button>
  );
}
