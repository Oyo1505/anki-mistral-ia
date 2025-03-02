'use client'

export default function Checkbox({label, handleChangeCheckbox}: {label: string, handleChangeCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <div className="flex w-full gap-2 justify-between">
     <label htmlFor={label}>{label}</label>
     <input className="ml-2" type="checkbox" onChange={handleChangeCheckbox}>
    </div>
  )
}
