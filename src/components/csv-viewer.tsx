const CsvViewer = ({
  csvFile,
  setIsCsvVisible,
  isCardKanji,
}: {
  csvFile: object[];
  setIsCsvVisible: (_: boolean) => void;
  isCardKanji: string;
}) => {
  const csvData = Object.keys(csvFile[0] || {});
  return (
    <div className="relative w-full md:max-h-[95vh] overflow-y-auto  bg-white p-4 rounded-md transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-center">Vue des cartes</h3>
        <button
          className="rounded-md bg-white p-2 border text-center font-bold text-sm text-slate-800 transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 hover:text-white active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => setIsCsvVisible(false)}
        >
          {" "}
          Retour au formulaire
        </button>
      </div>

      <div className="w-full flex justify-between  flex-col gap-6">
        <div
          className={`w-full grid ${
            isCardKanji === "basique" ? "grid-cols-2" : "grid-cols-5"
          } gap-4`}
        >
          {csvData.map((header, index) => (
            <div key={index} className="font-bold text-left">
              {header.charAt(0).toUpperCase() + header.slice(1)}
            </div>
          ))}
        </div>
        {csvFile?.length > 0 &&
          csvFile.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid ${
                isCardKanji === "basique" ? "grid-cols-2" : "grid-cols-5"
              } gap-6 text-left`}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <div className="text-left" key={cellIndex}>
                  {" "}
                  {String(cell)}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CsvViewer;
