package com.example.springboot_sudoku_solver.api;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SudokuSolverService {
    private static final int GRID_SIZE = 9;
    public static Optional<int[][]> getSolvedBoard(int[][] board) {
        if (!solveBoard(board) || !isBoardValid(board)) {
            return Optional.empty();
        }

        return Optional.of(board);
    }

    private static boolean isBoardValid(int[][] board) {
        for (int row = 0; row < GRID_SIZE; row++) {
            for (int col = 0; col < GRID_SIZE; col++) {
                int number = board[row][col];
                if (number != 0) {
                    board[row][col] = 0; // temporaneamente rimuovo il numero
                    if (!isValidPlacement(board, number, row, col)) {
                        board[row][col] = number; // ripristino
                        return false; // duplicato trovato
                    }
                    board[row][col] = number; // ripristino
                }
            }
        }
        return true;
    }

    private static boolean isNumberInColumn(int[][] grid, int number, int column) {
        for (int i = 0; i < GRID_SIZE; i++) {
            if (grid[i][column] == number) {
                return true;
            }
        }

        return false;
    }

    private static boolean isNumberInRow(int[][] grid, int number, int row) {
        for (int i = 0; i < GRID_SIZE; i++) {
            if (grid[row][i] == number) {
                return true;
            }
        }

        return false;
    }

    private static boolean isNumberInBox(int[][] grid, int number, int row, int column) {
        int localRowBox = row - row % 3;
        int localColumnBox = column - column % 3;

        for (int i = localRowBox; i < localRowBox + 3; i++) {
            for (int j = localColumnBox; j < localColumnBox + 3; j++) {
                if (grid[i][j] == number) {
                    return true;
                }
            }
        }

        return false;
    }

    private static boolean isValidPlacement(int[][] grid, int number, int row, int column) {
        return !(
                isNumberInRow(grid, number, row) ||
                        isNumberInColumn(grid, number, column) ||
                        isNumberInBox(grid, number, row, column)
        );
    }

    private static boolean solveBoard(int[][] board) {
        for (int row = 0; row < GRID_SIZE; row++) {
            for (int column = 0; column < GRID_SIZE; column++) {

                if (board[row][column] == 0) {
                    for (int numberToTry = 1; numberToTry <= GRID_SIZE; numberToTry++) {

                        if (isValidPlacement(board, numberToTry, row, column)) {
                            board[row][column] = numberToTry;

                            if (solveBoard(board)) {
                                // DEFAUTL RECURSION CASE
                                return true;
                            } else {
                                board[row][column] = 0;
                            }
                        }
                    }
                    // IMPOSSIBLE FLAG
                    return false;
                }
            }
        }
        // RESOLVED FLAG
        return true;
    }
}
