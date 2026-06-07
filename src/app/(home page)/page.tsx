import PublicHomePage from "@/components/pages/home/PublicHomePage";
import type { Metadata, Viewport } from "next";


export const metadata: Metadata = {
  title: "سامانه اسکان سرای محله",
  description: "",
};
export default function Home() {
  return (
    <>
      <PublicHomePage />
    </>
  );
}
