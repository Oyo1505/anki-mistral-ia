'use client'

import clsx from "clsx";
interface SelectLevelProps {
  className?: string;
  //eslint-disable-next-line no-unused-vars
  handleChangeSelectLevel: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
export default function SelectLevel({className, handleChangeSelectLevel}: SelectLevelProps) {
  const levels = [
    { value: "N1-Avancé", label: "N1 - Avancé (Maîtrise complète)" },
    { value: "N2-Pré-avancé", label: "N2 - Pré-avancé (Niveau courant)" },
    { value: "N3-Intermédiaire", label: "N3 - Intermédiaire" },
    { value: "N4-Pré-intermédiaire", label: "N4 - Pré-intermédiaire (Basique)" },
    { value: "N5-Débutant", label: "N5 - Débutant (Élémentaire)" }
  ]
  return (
  <div className={clsx("flex flex-col items-start justify-start", className)}>
    <label htmlFor="level">Niveau</label>
    <select className="w-full h-full p-2 rounded-md border-2 border-gray-300" onChange={handleChangeSelectLevel}>
      {levels.reverse().map((level) => (
        <option key={level.value} value={level.value}>
          {level.label}
        </option>
      ))}
    </select>
  </div>
  );
}

