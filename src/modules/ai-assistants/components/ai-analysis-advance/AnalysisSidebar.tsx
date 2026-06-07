"use client";

import { Plus, RefreshCcw } from "lucide-react";
import { AnalysisConversation } from "../../types/ai-analysis";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { AnalysisConversationList } from "./AnalysisConversationList";

interface AnalysisSidebarProps {
  conversations: AnalysisConversation[];
  currentConversationId?: string | null;
  loading?: boolean;
  onSelectConversation: (id: string) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  onRenameConversation: (id: string, title: string) => void | Promise<void>;
  onArchiveConversation: (id: string) => void | Promise<void>;
  onUnarchiveConversation: (id: string) => void | Promise<void>;
  onDeleteConversation: (id: string) => void | Promise<void>;
  onNewWorkspace: () => void;
}

export function AnalysisSidebar({
  conversations,
  currentConversationId,
  loading,
  onSelectConversation,
  onRefresh,
  onRenameConversation,
  onArchiveConversation,
  onUnarchiveConversation,
  onDeleteConversation,
  onNewWorkspace,
}: AnalysisSidebarProps) {
  return (
    <aside className="hidden border-r border-border/60 bg-muted/20 xl:block">
      <div className="flex h-screen flex-col">
        <div className="border-b border-border/60 p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Analysis Sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage conversation history, reports, and archived runs.
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={onNewWorkspace}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
            <Button variant="outline" size="icon" onClick={() => onRefresh()}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            <AnalysisConversationList
              conversations={conversations}
              currentConversationId={currentConversationId}
              loading={loading}
              onSelectConversation={onSelectConversation}
              onRenameConversation={onRenameConversation}
              onArchiveConversation={onArchiveConversation}
              onUnarchiveConversation={onUnarchiveConversation}
              onDeleteConversation={onDeleteConversation}
            />
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
