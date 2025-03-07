import React from 'react'
import { CSVLink } from 'react-csv'
const CsvViewer = ({ csvFile }: { csvFile: object[] }) => {

  return (
    <div className='w-full overflow-y-auto md:w-1/2 bg-white p-4 rounded-md transition-all duration-300 ease-in-out'>
      <h3 className='text-2xl font-bold text-center'>Vue des cartes</h3>
      <div className='w-full flex justify-center items-center flex-col gap-6'>
          <div className='w-full grid grid-cols-2 gap-4'>
            {Object.keys(csvFile[0] || {}).map((header, index) => (
              <div key={index} className='font-bold text-center'>{header.charAt(0).toUpperCase() + header.slice(1)}</div>
            ))}
          </div>
          {csvFile.map((row, rowIndex) => (
            <div key={rowIndex} className='grid grid-cols-2 gap-6 text-left'>
              {Object.values(row).map((cell, cellIndex) => (
                <div className='w-full text-left' key={cellIndex}>{rowIndex + 1} : {String(cell)}</div>
              ))}
            </div>
          ))}
      </div>
      <div className='w-full flex justify-center items-center  mt-1.5'>
        <CSVLink className='w-full p-2 bg-green-500 text-white rounded-md text-center cursor-pointer font-semi-bold' data={csvFile}>Télécharger le fichier CSV</CSVLink>
       </div>
    </div>
  )
}

export default CsvViewer