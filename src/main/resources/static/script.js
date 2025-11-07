const API_ENDPOINT = "/api/v1/resolve";
const gridElement = document.getElementById("sudokuGrid");

for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const input = document.createElement("input");

        input.maxLength = 1;
        input.dataset.r = r;
        input.dataset.c = c;
        input.inputMode = "numeric";

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, "");
            updatePreview();
        });

        cell.appendChild(input);
        gridElement.appendChild(cell);
    }
}

function readBoard() {
    const board = [];

    for (let r = 0; r < 9; r++) {
        const row = [];

        for (let c = 0; c < 9; c++) {
            const v = document.querySelector(
                `input[data-r="${r}"][data-c="${c}"]`
            ).value;

            row.push(v === "" ? 0 : parseInt(v, 10));
        }
        board.push(row);
    }
    return board;
}

function setBoard(matrix) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.querySelector(
                `input[data-r="${r}"][data-c="${c}"]`
            );

            const val = matrix?.[r]?.[c] || "";
            input.value = val === 0 ? "" : val;
        }
    }
    updatePreview();
}

const sample = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

document
    .getElementById("btnSample")
    .addEventListener("click", () => setBoard(sample));

document
    .getElementById("btnClear")
    .addEventListener("click", () => setBoard(null));

function updatePreview() {
    const preview = document.getElementById("preview");
    preview.innerHTML = ""; // svuota prima

    const board = readBoard();
    const frag = document.createDocumentFragment();

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement("div");
            cell.className = "bp-cell";

            // Calcola indice del blocco 3x3 (0..8)
            const blockRow = Math.floor(r / 3);
            const blockCol = Math.floor(c / 3);
            const blockIndex = blockRow * 3 + blockCol;

            // Pattern a scacchiera sui blocchi:
            // blocchi con indice pari => "scuro", dispari => "chiaro"
            if (blockIndex % 2 === 0) {
                cell.classList.add("bp-dark");
            } else {
                cell.classList.add("bp-light");
            }

            // contenuto della cella (vuoto se 0)
            const val = board[r][c];
            cell.textContent = val === 0 ? "" : String(val);

            frag.appendChild(cell);
        }
    }

    preview.appendChild(frag);
}

document.getElementById("btnSolve").addEventListener("click", async () => {
    const board = readBoard();
    const start = performance.now();
    const resultArea = document.getElementById("resultArea");

    gridElement.style.boxShadow = "none";
    resultArea.className = "result";
    resultArea.textContent = "Invio al server...";

    try {
        const res = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(board),
        });

        if (!res.ok) {
            // server error.
            resultArea.classList.add("error");
            resultArea.textContent = `Errore server (${res.status})`;
            return;
        }

        const text = await res.text();
        if (!text.trim()) {
            // not valid board.
            resultArea.classList.add("error");
            resultArea.textContent =
                "[SERVER] Sudoku non risolvibile o input board errata.";
            return;
        }

        const solved = JSON.parse(text);
        const end = performance.now();
        const time = (end - start).toFixed(1);

        setBoard(solved);
        gridElement.style.boxShadow = "0 0 0 3px var(--accent)";
        resultArea.classList.add("success");
        resultArea.textContent = `Sudoku risolto con successo in ${time} ms`;
    } 
    catch (e) {
        resultArea.classList.add("error");
        resultArea.textContent =
            "Errore di rete: impossibile raggiungere il server.";
    }
});

// theme toggle
const btn = document.getElementById("themeToggle");

btn.addEventListener("click", () => {
    const body = document.body;
    const isDark = body.getAttribute("data-theme") === "dark";

    body.setAttribute("data-theme", isDark ? "light" : "dark");
    btn.textContent = isDark ? "☀️" : "🌙";
});

updatePreview();
