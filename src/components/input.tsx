import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className: string;
  type: string;
  label: string;
  title: string;
}

export default function Input({className, title, type, label, ...props}: InputProps) {
  return (
    <div className={clsx("flex flex-col items-start justify-start", className)}> 
      <label htmlFor={label}>{title}</label>
      <input id={label} type={type} {...props} className="w-full p-2 rounded-md border-2 border-gray-300" />
    </div>
  );
}