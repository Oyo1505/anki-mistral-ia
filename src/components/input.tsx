import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className: string;
  type: string;
  label: string;
}

export default function Input({className, type, label, ...props}: InputProps) {
  return (
    <div className={clsx("flex flex-col items-start justify-start", className)}> 
      <label htmlFor={label}>{label}</label>
      <input type={type} {...props} className="w-full p-2 rounded-md border-2 border-gray-300" />
    </div>
  );
}