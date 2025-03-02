'use client'

import { useState } from 'react';

export default function SelectLevel({handleChangeSelectLevel}: {handleChangeSelectLevel: (e: React.ChangeEvent<HTMLSelectElement>) => void} ) {
  return (
    <select onChange={(e) => handleChangeSelectLevel(e)}>
      <option value="N1">Niveau 1</option>
      <option value="N2">Niveau 2</option>
      <option value="N3">Niveau 3</option>
      <option value="N4">Niveau 4</option>
      <option value="N5">Niveau 5</option>
    </select>
  );
}
