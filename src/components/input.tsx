import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";


export default function Input({className, type, label, max, min, register, ...props}: {className: string, type: string, label : string, max: number, min: number, register: UseFormRegisterReturn<string>, props: any}) {
  return (
  <div className={clsx("flex flex-col items-start justify-start", className)}> 
    <label htmlFor={label}>{label}</label>
    <input type={type} max={max} min={min} {...register} {...props} className="w-full  p-2 rounded-md border-2 border-gray-300" />
  </div>
  )
}
