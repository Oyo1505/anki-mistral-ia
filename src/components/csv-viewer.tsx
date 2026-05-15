const CsvViewer = ({
  csvFile,
  setIsCsvVisible,
  isCardKanji,
}: {
  csvFile: object[];
  setIsCsvVisible: (_: boolean) => void;
  isCardKanji: string;
}) => {
  const columnKeys = Object.keys(csvFile[0] || {});
  const isKanji = isCardKanji === "kanji";

  return (
    <div
      className="ds-card"
      style={{ padding: 0, overflow: "hidden", width: "100%", maxHeight: "95vh", overflowY: "auto" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-1)",
          background: "var(--washi-50)",
        }}
      >
        <div>
          <div className="ds-eyebrow" style={{ marginBottom: 2 }}>Aperçu CSV</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            {csvFile.length} carte{csvFile.length > 1 ? "s" : ""} prête{csvFile.length > 1 ? "s" : ""}
          </h2>
        </div>
        <button
          className="ds-btn ds-btn--secondary"
          onClick={() => setIsCsvVisible(false)}
        >
          <BackIcon />
          Retour au formulaire
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-sm)",
          }}
        >
          <thead>
            <tr style={{ background: "var(--washi-100)" }}>
              {columnKeys.map((key) => (
                <th
                  key={key}
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: "var(--fs-xs)",
                    letterSpacing: "var(--tracking-caps)",
                    textTransform: "uppercase",
                    color: "var(--fg-3)",
                    borderBottom: "1px solid var(--border-1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvFile.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ borderBottom: "1px solid var(--border-1)" }}
              >
                {Object.entries(row).map(([key, cell], cellIndex) => {
                  const isKanjiCol = isKanji && cellIndex === 0;
                  return (
                    <td
                      key={cellIndex}
                      style={{
                        padding: "14px 16px",
                        verticalAlign: "top",
                        fontFamily: isKanjiCol ? "var(--font-serif)" : "var(--font-sans)",
                        fontSize: isKanjiCol ? 24 : "var(--fs-sm)",
                        fontWeight: isKanjiCol ? 700 : 400,
                        color: isKanjiCol ? "var(--hinomaru-700)" : "var(--fg-1)",
                        lineHeight: 1.5,
                        maxWidth: 360,
                      }}
                    >
                      {String(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BackIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default CsvViewer;
