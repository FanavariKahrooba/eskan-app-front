import AIAssistantWidget from "@/app/(panel)/console/ai/AIAssistantWidget"
// import AIAssistant from "../pages/home/ai-assistant"
import Sidebar from "../sidebar/sidebar"
import CommandPalette from "./command-palette"
import Header from "./header"

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-[#f6f7fb]">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>

      {/* <AIAssistant /> */}
      <AIAssistantWidget />
      <CommandPalette />
    </div>
  )
}
