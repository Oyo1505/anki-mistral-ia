'use client'
interface CheckboxProps {
  label: string;
  //eslint-disable-next-line no-unused-vars
  handleChangeCheckboxAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({label, handleChangeCheckboxAction}: CheckboxProps) {
  return (
    <div className="flex w-full gap-2 justify-between">
     <label htmlFor={label}>{label}</label>
     <input className="ml-2" type="checkbox" onChange={handleChangeCheckboxAction} />
    </div>
  )
}
