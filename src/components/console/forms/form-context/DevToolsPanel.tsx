// DevToolsPanel.tsx
//-------------------------------------------
//  UI کامل DevTools Panel
//-------------------------------------------

"use client"

import { useDevTools } from "./FormDevToolsContext"
import { useFormContext } from "./FormContext"

export function DevToolsPanel() {
  const { isOpen, toggle, logs, renderCount } = useDevTools()
  const form = useFormContext()

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : -350,
        width: 350,
        height: "100vh",
        background: "#0d1117",
        color: "#ffffff",
        borderLeft: "1px solid #333",
        padding: 12,
        transition: "right 0.25s",
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      <button
        onClick={toggle}
        style={{
          position: "absolute",
          left: -40,
          top: 20,
          width: 34,
          height: 34,
          background: "#0d1117",
          border: "1px solid #333",
          borderRadius: 4,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isOpen ? "→" : "←"}
      </button>

      <h3 style={{ marginTop: 0 }}>Form DevTools</h3>

      <section>
        <h4>Values</h4>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(form.values, null, 2)}</pre>
      </section>

      <section>
        <h4>Errors</h4>
        <pre style={{ whiteSpace: "pre-wrap", color: "#ff6b6b" }}>{JSON.stringify(form.errors, null, 2)}</pre>
      </section>

      <section>
        <h4>Touched</h4>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(form.touched, null, 2)}</pre>
      </section>

      <section>
        <h4>Render Count</h4>
        <pre style={{ whiteSpace: "pre-wrap", color: "#ffd166" }}>{JSON.stringify(renderCount, null, 2)}</pre>
      </section>

      <section>
        <h4>Logs</h4>
        <div
          style={{
            overflowY: "auto",
            maxHeight: 200,
            background: "#161b22",
            padding: 8,
            borderRadius: 4,
          }}
        >
          {logs
            .slice()
            .reverse()
            .map((log, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div>{log.type}</div>
                <pre style={{ whiteSpace: "pre-wrap", color: "#aaa" }}>{JSON.stringify(log.payload, null, 2)}</pre>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
