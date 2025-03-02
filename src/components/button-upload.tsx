'use client'
import { useState } from 'react';

export default function ButtonUpload() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={() => console.log(file)}>Upload</button>
    </div>
  );
}
