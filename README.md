# Matrix RREF Calculator

A comprehensive tool for computing the **Reduced Row Echelon Form (RREF)** and **rank** of any matrix. Available in two versions: interactive web interface and command-line Python script.

## Features

✨ **Core Functionality:**
- Compute Reduced Row Echelon Form (RREF)
- Calculate matrix rank
- Support for matrices up to 10×10 (web) or 20×20 (Python)
- Clean, formatted output
- Error handling and validation

📊 **Additional Info:**
- Nullity calculation
- Full rank detection
- Detailed step-by-step documentation

---

## Version 1: React Web Interface (`rref_calculator.jsx`)

### Usage

1. **Save the file** in your React project or use it directly in a React environment
2. **Import the component:**
   ```jsx
   import RREFCalculator from './rref_calculator.jsx';
   
   export default function App() {
     return <RREFCalculator />;
   }
   ```

### Features
- 🎨 Beautiful gradient UI with intuitive controls
- ⌨️ Adjust matrix dimensions with +/- buttons
- 📝 Input values directly into the matrix grid
- 🎲 Random fill button to generate test matrices
- 🧮 One-click RREF computation
- 📋 Real-time results display with rank
- 💾 Handles floating-point numbers

### Example Walkthrough
1. Set dimensions (e.g., 3×3)
2. Enter values in the matrix grid
3. Click "Compute RREF"
4. View the result and rank
5. Optionally use "Random Fill" to test with generated values

---

## Version 2: Python Command-Line (`rref_calculator.py`)

### Requirements
```bash
pip install numpy
```

### Usage

```bash
python3 rref_calculator.py
```

### Interactive Input
The script guides you through:
1. Enter number of rows
2. Enter number of columns
3. Input matrix values (space-separated for each row)
4. View results automatically

### Example Session
```
Enter number of rows: 3
Enter number of columns: 3

Enter the matrix values (3×3):
(Enter values separated by spaces for each row)
Row 1: 1 2 3
Row 2: 4 5 6
Row 3: 7 8 9
```

### Output Includes
- Original matrix
- Reduced Row Echelon Form
- Rank of the matrix
- Nullity (dimension of null space)
- Full rank status

---

## Mathematical Background

### Reduced Row Echelon Form (RREF)

A matrix is in RREF when:

1. **Pivot Property**: Each leading entry (pivot) in a row is 1
2. **Isolation Property**: Each pivot is the only non-zero entry in its column
3. **Position Property**: The pivot in each row is to the right of the pivot in the row above
4. **Zero Row Property**: All rows consisting entirely of zeros are at the bottom

### Rank

The **rank** of a matrix is:
- The number of non-zero rows in its RREF
- The dimension of the row space
- The maximum number of linearly independent rows/columns

### Nullity

Nullity = Number of Columns - Rank

The nullity represents the dimension of the null space.

---

## Algorithm Details

### Gaussian-Jordan Elimination

The implementation uses the Gaussian-Jordan elimination algorithm:

1. **Forward Pass**: Convert matrix to row echelon form
   - For each column, find the pivot (largest absolute value below current row)
   - Swap rows if necessary
   - Scale the pivot row to make the leading entry 1
   - Eliminate all other entries below the pivot

2. **Backward Pass**: Convert to reduced row echelon form
   - Eliminate all entries above each pivot
   - Continue until all pivots are isolated

3. **Cleanup**: Round near-zero values to exactly zero

**Time Complexity**: O(m²n) where m is rows and n is columns

---

## Example Calculations

### Example 1: Full Rank 3×3
```
Original Matrix:
┌             ┐
│  1  2  3    │
│  0  1  4    │
│  0  0  1    │
└             ┘

Rank: 3 (Full rank)
```

### Example 2: Rank Deficient 3×3
```
Original Matrix:
┌             ┐
│  1  2  3    │
│  2  4  6    │
│  3  6  9    │
└             ┘

RREF:
┌             ┐
│  1  2  0    │
│  0  0  1    │
│  0  0  0    │
└             ┘

Rank: 2
Nullity: 1
```

---

## Precision & Error Handling

- **Epsilon Threshold**: 1e-10 (values below this are treated as zero)
- **Floating-Point Handling**: Automatic rounding of near-integer values
- **Fraction Display** (Python): Converts decimals to simplified fractions for clarity
- **Error Messages**: Clear feedback for invalid inputs

---

## Tips & Tricks

### React Version
- Use "Random Fill" to generate test cases
- Clear the matrix with the "Clear" button
- Adjust dimensions anytime—data will be preserved where possible
- Supports decimal and negative values

### Python Version
- Input values as space-separated numbers: `1.5 -3.2 4 0`
- Maximum practical size: 20×20 (for performance)
- Results shown with fractions for exact representation
- Press Ctrl+C to exit at any time

---

## Common Use Cases

1. **Solving Linear Systems**: RREF is key to solving Ax = b
2. **Finding Rank**: Determine if a system has a unique solution
3. **Linear Independence**: Check if vectors are linearly independent
4. **Basis Computation**: Finding basis for row/column spaces
5. **Matrix Analysis**: Understanding matrix structure and properties

---

## Troubleshooting

**Python version won't run:**
- Ensure numpy is installed: `pip install numpy`
- Use Python 3.7+

**React component won't display:**
- Ensure React is properly set up
- Check that component is imported correctly
- No external dependencies required

**Numerical precision issues:**
- Values very close to zero are automatically set to 0
- Fractions (Python) provide exact representation
- For very large or very small matrices, consider scaling first

---

## License

Free to use for educational and personal projects.

---

## Questions?

Both implementations follow standard Gaussian-Jordan elimination with numerical stability enhancements. For more information on matrix operations, consult linear algebra textbooks or online resources.
