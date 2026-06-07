"use client"

export default function LogoUploader({ value, onChange }: any) {
  function upload(e: any) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Logo</label>

      <input type="file" accept="image/*" onChange={upload} />

      {value && <img src={value} alt="Logo Preview" className="w-20 h-20 object-contain mt-2 border rounded" />}
    </div>
  )
}
