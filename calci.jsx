import React, { useState, useCallback } from 'react';

export default function RREFCalculator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [matrix, setMatrix] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(0))
  );
  const [rref, setRref] = useState(null);
  const [rank, setRank] = useState(null);
  const [error, setError] = useState('');

  const updateDimensions = useCallback(
    (newRows, newCols) => {
      newRows = Math.max(1, Math.min(10, newRows));
      newCols = Math.max(1, Math.min(10, newCols));
      setRows(newRows);
      setCols(newCols);

      const newMatrix = Array(newRows)
        .fill(null)
        .map((_, i) =>
          Array(newCols)
            .fill(null)
            .map((_, j) => (matrix[i]?.[j] !== undefined ? matrix[i][j] : 0))
        );
      setMatrix(newMatrix);
      setRref(null);
      setRank(null);
      setError('');
    },
    [matrix]
  );

  const updateCell = (i, j, value) => {
    const num = value === '' ? 0 : parseFloat(value) || 0;
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[i][j] = num;
    setMatrix(newMatrix);
  };

  const computeRREF = () => {
    setError('');
    try {
      const mat = matrix.map((row) => [...row]);
      const m = mat.length;
      const n = mat[0].length;
      const epsilon = 1e-10;
      let rank = 0;
      let currentRow = 0;

      for (let col = 0; col < n && currentRow < m; col++) {
        // Find pivot
        let pivotRow = currentRow;
        for (let i = currentRow + 1; i < m; i++) {
          if (Math.abs(mat[i][col]) > Math.abs(mat[pivotRow][col])) {
            pivotRow = i;
          }
        }

        // Check if pivot is essentially zero
        if (Math.abs(mat[pivotRow][col]) < epsilon) {
          continue;
        }

        // Swap rows
        [mat[currentRow], mat[pivotRow]] = [mat[pivotRow], mat[currentRow]];

        // Scale pivot row
        const pivot = mat[currentRow][col];
        for (let j = 0; j < n; j++) {
          mat[currentRow][j] /= pivot;
        }

        // Eliminate all other entries in column
        for (let i = 0; i < m; i++) {
          if (i !== currentRow && Math.abs(mat[i][col]) > epsilon) {
            const factor = mat[i][col];
            for (let j = 0; j < n; j++) {
              mat[i][j] -= factor * mat[currentRow][j];
            }
          }
        }

        rank++;
        currentRow++;
      }

      // Clean up near-zero values
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (Math.abs(mat[i][j]) < epsilon) {
            mat[i][j] = 0;
          }
        }
      }

      setRref(mat);
      setRank(rank);
    } catch (err) {
      setError('Error computing RREF: ' + err.message);
    }
  };

  const fillRandom = () => {
    const newMatrix = matrix.map((row) =>
      row.map(() => Math.round(Math.random() * 10 - 5))
    );
    setMatrix(newMatrix);
    setRref(null);
    setRank(null);
  };

  const fillZero = () => {
    const newMatrix = matrix.map((row) => row.map(() => 0));
    setMatrix(newMatrix);
    setRref(null);
    setRank(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Matrix RREF Calculator</h1>
        <p style={styles.subtitle}>Reduce to Row Echelon Form & Find Rank</p>
      </header>

      <div style={styles.content}>
        {/* Dimension Control */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Matrix Dimensions</h2>
          <div style={styles.dimensionControls}>
            <div style={styles.controlGroup}>
              <label style={styles.label}>Rows</label>
              <div style={styles.inputGroup}>
                <button
                  style={styles.button}
                  onClick={() => updateDimensions(rows - 1, cols)}
                >
                  −
                </button>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) =>
                    updateDimensions(parseInt(e.target.value) || 1, cols)
                  }
                  style={styles.numberInput}
                  min="1"
                  max="10"
                />
                <button
                  style={styles.button}
                  onClick={() => updateDimensions(rows + 1, cols)}
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.label}>Columns</label>
              <div style={styles.inputGroup}>
                <button
                  style={styles.button}
                  onClick={() => updateDimensions(rows, cols - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) =>
                    updateDimensions(rows, parseInt(e.target.value) || 1)
                  }
                  style={styles.numberInput}
                  min="1"
                  max="10"
                />
                <button
                  style={styles.button}
                  onClick={() => updateDimensions(rows, cols + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Matrix Input */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Input Matrix</h2>
          <div style={styles.matrixContainer}>
            <table style={styles.table}>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={`${i}-${j}`} style={styles.tableCell}>
                        <input
                          type="number"
                          value={cell}
                          onChange={(e) => updateCell(i, j, e.target.value)}
                          style={styles.cellInput}
                          step="0.1"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.primaryButton} onClick={computeRREF}>
              Compute RREF
            </button>
            <button style={styles.secondaryButton} onClick={fillRandom}>
              Random Fill
            </button>
            <button style={styles.secondaryButton} onClick={fillZero}>
              Clear
            </button>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠</span> {error}
          </div>
        )}

        {/* Results */}
        {rref && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Results</h2>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Rank of Matrix</h3>
              <div style={styles.rankValue}>{rank}</div>
              <p style={styles.resultDescription}>
                Number of non-zero rows in RREF
              </p>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Reduced Row Echelon Form</h3>
              <div style={styles.matrixContainer}>
                <table style={styles.table}>
                  <tbody>
                    {rref.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={`${i}-${j}`} style={styles.resultTableCell}>
                            <span style={styles.resultValue}>
                              {cell.toFixed(6).replace(/\.?0+$/, '')}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.infoBox}>
              <strong>About RREF:</strong> A matrix is in reduced row echelon form when:
              <ul style={styles.infoList}>
                <li>Each leading entry (pivot) is 1</li>
                <li>Each pivot is the only non-zero entry in its column</li>
                <li>Pivots appear to the right in each successive row</li>
                <li>All zero rows are at the bottom</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#2c3e50',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '0',
    fontSize: '1rem',
    opacity: 0.9,
    fontWeight: '300',
  },
  content: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '1.5rem',
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    paddingBottom: '0.5rem',
  },
  dimensionControls: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '1.5rem',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  numberInput: {
    flex: 1,
    padding: '0.5rem',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  matrixContainer: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
  },
  table: {
    borderCollapse: 'collapse',
    margin: '0 auto',
  },
  tableCell: {
    padding: '0.5rem',
    border: '2px solid #ddd',
  },
  cellInput: {
    width: '60px',
    padding: '0.5rem',
    textAlign: 'center',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    background: '#f8f9fa',
    borderRadius: '4px',
  },
  resultTableCell: {
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    background: '#f8f9fa',
  },
  resultValue: {
    fontFamily: 'Courier New, monospace',
    fontWeight: '500',
    minWidth: '80px',
    display: 'block',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  secondaryButton: {
    background: '#e9ecef',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  errorBox: {
    background: '#ffe5e5',
    color: '#d32f2f',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #ef5350',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  errorIcon: {
    fontSize: '1.5rem',
  },
  resultCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '2px solid #667eea',
  },
  resultTitle: {
    marginTop: '0',
    marginBottom: '1rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#667eea',
  },
  rankValue: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#667eea',
    textAlign: 'center',
    padding: '1rem 0',
  },
  resultDescription: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    background: '#e3f2fd',
    border: '2px solid #667eea',
    borderRadius: '8px',
    padding: '1.5rem',
    color: '#1565c0',
    fontSize: '0.95rem',
  },
  infoList: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.5rem',
  },
};
