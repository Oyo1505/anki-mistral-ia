'use client'

export default function Checkbox({label, handleChangeCheckbox}: {label: string, handleChangeCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
  
  return (
    <div>
     <label htmlFor={label}>{label}</label>
     <input type="checkbox" onChange={(e) => handleChangeCheckbox(e)} />
    </div>
  )
}
