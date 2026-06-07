"use client";

import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Check,
  Edit3,
  FileText,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { AnalysisConversation } from "../../types/ai-analysis";
import { cn } from "../../lib/utils";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface AnalysisConversationListProps {
  conversations: AnalysisConversation[];
  currentConversationId?: string | null;
  loading?: boolean;
  onSelectConversation: (id: string) => void | Promise<void>;
  onRenameConversation: (id: string, title: string) => void | Promise<void>;
  onArchiveConversation: (id: string) => void | Promise<void>;
  onUnarchiveConversation: (id: string) => void | Promise<void>;
  onDeleteConversation: (id: string) => void | Promise<void>;
}

export function AnalysisConversationList({
  conversations,
  currentConversationId,
  loading,
  onSelectConversation,
  onRenameConversation,
  onArchiveConversation,
  onUnarchiveConversation,
  onDeleteConversation,
}: AnalysisConversationListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No analysis conversations found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === currentConversationId}
          onSelect={() => onSelectConversation(conversation.id)}
          onRename={onRenameConversation}
          onArchive={onArchiveConversation}
          onUnarchive={onUnarchiveConversation}
          onDelete={onDeleteConversation}
        />
      ))}
    </div>
  );
}

interface ConversationRowProps {
  conversation: AnalysisConversation;
  active?: boolean;
  onSelect: () => void | Promise<void>;
  onRename: (id: string, title: string) => void | Promise<void>;
  onArchive: (id: string) => void | Promise<void>;
  onUnarchive: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

function ConversationRow({
  conversation,
  active,
  onSelect,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
}: ConversationRowProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(conversation.title || "");

  const title = conversation.title?.trim() || "Untitled analysis";
  const archived = Boolean(conversation.archived_at);

  return (
    <div
      className={cn(
        "rounded-2xl border p-3 transition-colors",
        active
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-background hover:bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        <button className="flex min-w-0 flex-1 items-start gap-3 text-left" onClick={onSelect}>
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-2">
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onRename(conversation.id, value.trim() || "Untitled analysis");
                      setEditing(false);
                    }}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(false);
                      setValue(conversation.title || "");
                    }}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{title}</p>
                  {archived && (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                      Archived
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {conversation.updated_at
                    ? new Date(conversation.updated_at).toLocaleString()
                    : "No timestamp"}
                </p>
                <p className="mt-1 break-all text-[11px] text-muted-foreground/80">
                  {conversation.id}
                </p>
              </>
            )}
          </div>
        </button>

        {!editing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>

              {archived ? (
                <DropdownMenuItem onClick={() => onUnarchive(conversation.id)}>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onArchive(conversation.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(conversation.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
