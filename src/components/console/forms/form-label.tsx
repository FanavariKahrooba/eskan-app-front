// components/forms/form-label.tsx
export default function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-medium flex items-center gap-1">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  )
}
