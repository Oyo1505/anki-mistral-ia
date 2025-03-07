import React from 'react'
const CsvViewer = ({ csvFile }: { csvFile: object[] }) => {

  return (
    <div className='relative w-full md:max-h-[95vh] overflow-y-auto md:w-1/2 lg:w-2xl bg-white p-4 rounded-md transition-all duration-300 ease-in-out'>
      <h3 className='text-2xl font-bold text-center'>Vue des cartes</h3>
      <div className='w-full flex justify-between  flex-col gap-6'>
          <div className='w-full grid grid-cols-2 gap-4'>
            {Object.keys(csvFile[0] || {}).map((header, index) => (
              <div key={index} className='font-bold text-left'>{header.charAt(0).toUpperCase() + header.slice(1)}</div>
            ))}
          </div>
          {csvFile.map((row, rowIndex) => (
            <div key={rowIndex} className='grid grid-cols-2 gap-6 text-left'>
              {Object.values(row).map((cell, cellIndex) => (
                <div className='text-left' key={cellIndex}>{rowIndex + 1} : {String(cell)}</div>
              ))}
            </div>
          ))}
      </div>
  
     
    </div>
  )
}

export default CsvViewer