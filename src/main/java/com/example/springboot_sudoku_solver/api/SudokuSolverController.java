package com.example.springboot_sudoku_solver.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping(("/api/v1"))
public class SudokuSolverController {
    @PostMapping("/resolve")
    public int[][] resolveBoard (
            @RequestBody int[][] board
    )
    {
        Optional<int[][]> optionalBoard = SudokuSolverService.getSolvedBoard(board);
        return optionalBoard.orElse(null);

    }
}
