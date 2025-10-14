"use client";
interface CheckboxProps {
  label: string;
  title: string;
  //eslint-disable-next-line no-unused-vars
  handleChangeCheckboxAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
  label,
  title,
  handleChangeCheckboxAction,
}: CheckboxProps) {
  return (
    <div className="flex w-full gap-2 justify-between">
      <label htmlFor={label}>{title}</label>
      <input
        id={label}
        className="ml-2"
        type="checkbox"
        onChange={handleChangeCheckboxAction}
      />
    </div>
  );
}
