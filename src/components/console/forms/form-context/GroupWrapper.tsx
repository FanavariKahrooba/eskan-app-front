"use client"

export function GroupWrapper({ label, children }: any) {
  return (
    <fieldset
      style={{
        border: "1px solid #ddd",
        padding: 16,
        marginBottom: 20,
        borderRadius: 8,
      }}
    >
      {label && (
        <legend
          style={{
            padding: "0 8px",
            fontWeight: "bold",
          }}
        >
          {label}
        </legend>
      )}

      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </fieldset>
  )
}
