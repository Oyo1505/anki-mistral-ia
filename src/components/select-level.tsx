'use client'

import clsx from "clsx";
interface SelectLevelProps {
  className?: string;
  levels: { value: string; label: string }[];
  //eslint-disable-next-line no-unused-vars
  handleChangeSelectLevelAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
export default function SelectLevel({className, levels, handleChangeSelectLevelAction}: SelectLevelProps) {
 
  return (
  <div className={clsx("flex flex-col items-start justify-start", className)}>
    <label className="font-semibold" htmlFor="level">Niveau</label>
    <select id="level" className="w-full h-full p-2 rounded-md border-2 border-gray-300" onChange={handleChangeSelectLevelAction}>
      {levels.map((level) => (
        <option key={level.value} value={level.value}>
          {level.label}
        </option>
      ))}
    </select>
  </div>
  );
}

