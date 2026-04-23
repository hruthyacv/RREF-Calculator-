#!/usr/bin/env python3
"""
Matrix RREF Calculator
Computes the Reduced Row Echelon Form and rank of a matrix
"""

import numpy as np
from fractions import Fraction
from typing import List, Tuple


class MatrixRREF:
    """Compute RREF and rank of a matrix"""

    def __init__(self, matrix: List[List[float]]):
        """Initialize with a matrix"""
        self.original_matrix = np.array(matrix, dtype=float)
        self.matrix = self.original_matrix.copy()
        self.rank = 0
        self.epsilon = 1e-10

    def compute_rref(self) -> Tuple[np.ndarray, int]:
        """
        Compute the Reduced Row Echelon Form

        Returns:
            Tuple of (RREF matrix, rank)
        """
        mat = self.matrix.copy()
        m, n = mat.shape
        current_row = 0

        for col in range(n):
            if current_row >= m:
                break

            # Find pivot
            pivot_row = current_row
            for i in range(current_row + 1, m):
                if abs(mat[i, col]) > abs(mat[pivot_row, col]):
                    pivot_row = i

            # Check if pivot is essentially zero
            if abs(mat[pivot_row, col]) < self.epsilon:
                continue

            # Swap rows
            mat[[current_row, pivot_row]] = mat[[pivot_row, current_row]]

            # Scale pivot row to make leading entry 1
            pivot = mat[current_row, col]
            mat[current_row] = mat[current_row] / pivot

            # Eliminate all other entries in this column
            for i in range(m):
                if i != current_row and abs(mat[i, col]) > self.epsilon:
                    factor = mat[i, col]
                    mat[i] = mat[i] - factor * mat[current_row]

            self.rank += 1
            current_row += 1

        # Clean up near-zero values
        mat[np.abs(mat) < self.epsilon] = 0

        self.matrix = mat
        return mat, self.rank

    def display_matrix(self, mat: np.ndarray, title: str = "Matrix", 
                      use_fractions: bool = True) -> None:
        """
        Pretty print a matrix

        Args:
            mat: Matrix to display
            title: Title for the matrix
            use_fractions: Convert decimals to fractions for cleaner display
        """
        print(f"\n{'='*60}")
        print(f"{title:^60}")
        print(f"{'='*60}\n")

        m, n = mat.shape
        
        # Calculate column widths
        col_widths = [0] * n
        
        for i in range(m):
            for j in range(n):
                val = mat[i, j]
                if use_fractions and abs(val - round(val)) < 1e-9:
                    s = str(int(round(val)))
                elif use_fractions:
                    frac = Fraction(val).limit_denominator(10000)
                    s = str(frac) if frac.denominator > 1 else str(int(frac.numerator))
                else:
                    s = f"{val:.6f}".rstrip('0').rstrip('.')
                col_widths[j] = max(col_widths[j], len(s))

        # Print matrix
        for i in range(m):
            row_str = "│ "
            for j in range(n):
                val = mat[i, j]
                if use_fractions and abs(val - round(val)) < 1e-9:
                    s = str(int(round(val)))
                elif use_fractions:
                    frac = Fraction(val).limit_denominator(10000)
                    s = str(frac) if frac.denominator > 1 else str(int(frac.numerator))
                else:
                    s = f"{val:.6f}".rstrip('0').rstrip('.')
                
                row_str += s.rjust(col_widths[j]) + " │ "
            print(row_str)

        print(f"\n{'='*60}\n")

    def print_info(self) -> None:
        """Print information about the matrix"""
        m, n = self.original_matrix.shape
        print(f"\nMatrix Dimensions: {m} × {n}")
        print(f"Rank: {self.rank}")
        print(f"Nullity: {n - self.rank}")
        
        if self.rank == min(m, n):
            print("Status: Full Rank")
        else:
            print("Status: Rank Deficient")


def get_matrix_input() -> List[List[float]]:
    """Get matrix input from user"""
    print("\n" + "="*60)
    print("MATRIX INPUT")
    print("="*60 + "\n")

    while True:
        try:
            rows = int(input("Enter number of rows: "))
            cols = int(input("Enter number of columns: "))
            
            if rows < 1 or cols < 1:
                print("Rows and columns must be at least 1")
                continue
            
            if rows > 20 or cols > 20:
                print("Maximum 20 rows and columns allowed")
                continue
                
            break
        except ValueError:
            print("Please enter valid integers")

    matrix = []
    print(f"\nEnter the matrix values ({rows}×{cols}):")
    print("(Enter values separated by spaces for each row)")
    
    for i in range(rows):
        while True:
            try:
                row_input = input(f"Row {i+1}: ").strip()
                if not row_input:
                    print("Please enter values for this row")
                    continue
                
                row = [float(x) for x in row_input.split()]
                
                if len(row) != cols:
                    print(f"Please enter exactly {cols} values")
                    continue
                
                matrix.append(row)
                break
            except ValueError:
                print("Please enter valid numbers separated by spaces")

    return matrix


def main():
    """Main function"""
    print("\n")
    print("*" * 60)
    print("*" + " " * 58 + "*")
    print("*" + "  REDUCED ROW ECHELON FORM CALCULATOR".center(58) + "*")
    print("*" + " " * 58 + "*")
    print("*" * 60)

    while True:
        matrix = get_matrix_input()

        # Create calculator and compute RREF
        calc = MatrixRREF(matrix)
        
        # Display original matrix
        calc.display_matrix(calc.original_matrix, "ORIGINAL MATRIX")
        
        # Compute and display RREF
        rref, rank = calc.compute_rref()
        calc.display_matrix(rref, "REDUCED ROW ECHELON FORM (RREF)")
        
        # Display info
        calc.print_info()

        # Additional information
        print("\nREDUCED ROW ECHELON FORM PROPERTIES:")
        print("-" * 60)
        print("• Each leading entry (pivot) is 1")
        print("• Each pivot is the only non-zero entry in its column")
        print("• The leading entry in each row is to the right of the")
        print("  leading entry in the row above")
        print("• All rows with all zeros are at the bottom")
        print("-" * 60)

        # Ask if user wants to continue
        while True:
            choice = input("\nCalculate another matrix? (y/n): ").strip().lower()
            if choice in ['y', 'n']:
                break
            print("Please enter 'y' or 'n'")

        if choice == 'n':
            print("\nThank you for using the RREF Calculator!")
            break


if __name__ == "__main__":
    main()
