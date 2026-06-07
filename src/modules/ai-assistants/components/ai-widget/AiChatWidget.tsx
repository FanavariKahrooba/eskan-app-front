"use client";

import { useState } from "react";
import { WidgetButton } from "./WidgetButton";
import { WidgetPanel } from "./WidgetPanel";

export function AiChatWidget({
  tenantId,
  userId,
}: {
  tenantId: number;
  userId: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <WidgetButton open={open} onClick={() => setOpen((v) => !v)} />

      <WidgetPanel
        open={open}
        tenantId={tenantId}
        userId={userId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
