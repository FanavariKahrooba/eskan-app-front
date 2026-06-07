// components/forms/form-actions.tsx
export default function FormActions({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end items-center gap-3 pt-4 border-t">{children}</div>
}
