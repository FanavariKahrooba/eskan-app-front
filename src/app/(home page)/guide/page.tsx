import type { Metadata } from "next";
import { Suspense } from "react";
import GuidePage from "./GuidePage";

export const metadata: Metadata = {
  title: "راهنمای استفاده از سامانه | سامانه اسکان سراهای محله",
  description:
    "راهنمای کامل استفاده از سامانه اسکان سراهای محله؛ مشاهده سراها، ثبت درخواست، دریافت کد رهگیری و پیگیری وضعیت درخواست.",
};

export default function GuideEPage() {
  return (
    <Suspense fallback={null}>
      <GuidePage />
    </Suspense>
  );
}
