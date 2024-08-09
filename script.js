let matrices = [];

// Function to create a new matrix
function createMatrix() {
    const rows = prompt("Enter the number of rows for the matrix");
    const cols = prompt("Enter the number of columns for the matrix");
    let matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = parseInt(prompt(`Enter entry for the matrix at row ${i + 1}, column ${j + 1}`), 10);
        }
    }
    matrices.push(matrix);
    updateMatrixDropdowns();
    displayAllMatrices();
}

// Update matrix dropdowns when a new matrix is added
function updateMatrixDropdowns() {
    const matrixOneDropdown = document.getElementById("matrix-one");
    const matrixTwoDropdown = document.getElementById("matrix-two");
    matrixOneDropdown.innerHTML = '<option value="" disabled selected>Select a matrix</option>';
    matrixTwoDropdown.innerHTML = '<option value="" disabled selected>Select a matrix</option>';
    matrices.forEach((matrix, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `Matrix ${index + 1}`;
        matrixOneDropdown.add(option.cloneNode(true));
        matrixTwoDropdown.add(option.cloneNode(true));
    });
    // Add change event listeners for both dropdowns
    matrixOneDropdown.addEventListener("change", (event) => handleMatrixSelection(event, "selected-matrix-display"));
    matrixTwoDropdown.addEventListener("change", (event) => handleMatrixSelection(event, "second-matrix-display"));
}

// Handle matrix selection and display
function handleMatrixSelection(event, containerId) {
    const selectedMatrixIndex = event.target.value;
    displayMatrix(matrices[selectedMatrixIndex], containerId, selectedMatrixIndex);
}

// Display all matrices in the designated areas
function displayAllMatrices() {
    const allMatricesDisplay = document.getElementById("all-matrices-display");
    const secondAllMatricesDisplay = document.getElementById("all-matrices-display-second");

    allMatricesDisplay.innerHTML = '';
    secondAllMatricesDisplay.innerHTML = '';

    matrices.forEach((matrix, index) => {
        allMatricesDisplay.innerHTML += `<div class="matrix-container"><h3>Matrix ${index + 1}</h3>${matrixToTable(matrix, index)}</div>`;
        secondAllMatricesDisplay.innerHTML += `<div class="matrix-container"><h3>Matrix ${index + 1}</h3>${matrixToTable(matrix, index)}</div>`;
    });
}

// Display the selected matrix in the specified container
function displayMatrix(matrix, containerId, matrixIndex) {
    const matrixDisplay = document.getElementById(containerId);
    matrixDisplay.innerHTML = matrixToTable(matrix, matrixIndex);
}

// Convert a matrix to an HTML table format
function matrixToTable(matrix, matrixIndex) {
    let html = '<table border="1" class="matrix-table">';
    matrix.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            html += `<td data-row="${rowIndex}" data-col="${colIndex}" data-matrix="${matrixIndex}" onclick="editCell(event)">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

// Prompt the user to edit a cell value
function editCell(event) {
    const cell = event.target;
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const matrixIndex = cell.getAttribute('data-matrix');
    
    // Prompt user for new value
    const newValue = prompt("Enter new value:", cell.innerText);
    
    // Update matrix and cell value if valid
    if (newValue !== null) {
        const parsedValue = parseInt(newValue, 10);
        if (!isNaN(parsedValue)) {
            matrices[matrixIndex][row][col] = parsedValue;
            cell.innerText = parsedValue;
            updateMatrixDisplays(); // Update all matrix displays
        } else {
            alert("Please enter a valid number.");
        }
    }
}

// Update matrix displays to reflect changes
function updateMatrixDisplays() {
    const matrixOneIndex = document.getElementById("matrix-one").value;
    const matrixTwoIndex = document.getElementById("matrix-two").value;

    if (matrixOneIndex !== "" && matrixOneIndex !== null) {
        displayMatrix(matrices[matrixOneIndex], "selected-matrix-display", matrixOneIndex);
    }
    if (matrixTwoIndex !== "" && matrixTwoIndex !== null) {
        displayMatrix(matrices[matrixTwoIndex], "second-matrix-display", matrixTwoIndex);
    }
    
    displayAllMatrices(); // Ensure all matrices are updated
}

// Perform the selected matrix operation
function performMatrixOperation() {
    const selectedOperation = document.getElementById("operation-select").value;
    const matrix1Index = document.getElementById("matrix-one").value;
    const matrix2Index = document.getElementById("matrix-two").value;
    let resultMatrix;

    if (selectedOperation === "") {
        alert("Please select an operation.");
        return;
    }

    if (selectedOperation === "+" || selectedOperation === "-" || selectedOperation === "*" || selectedOperation === "transpose") {
        if (selectedOperation !== "transpose" && (matrix1Index === "" || matrix2Index === "")) {
            alert("Please select both matrices.");
            return;
        }
        const matrix1 = matrices[matrix1Index];
        const matrix2 = matrices[matrix2Index];
        switch (selectedOperation) {
            case "+":
                resultMatrix = addMatrices(matrix1, matrix2);
                break;
            case "-":
                resultMatrix = subtractMatrices(matrix1, matrix2);
                break;
            case "*":
                resultMatrix = multiplyMatrices(matrix1, matrix2);
                break;
            case "transpose":
                resultMatrix = transposeMatrix(matrix1);
                break;
        }
        if (resultMatrix) {
            displayMatrix(resultMatrix, "result-display");
        } else {
            alert("Operation could not be performed. Check the dimensions of the matrices.");
        }
    } else {
        alert("Please select a valid operation.");
    }
}

// Add matrices element-wise
function addMatrices(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        alert("Matrices must have the same dimensions for addition.");
        return null;
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix1[0].length; j++) {
            result[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
    return result;
}

// Subtract matrices element-wise
function subtractMatrices(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        alert("Matrices must have the same dimensions for subtraction.");
        return null;
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix1[0].length; j++) {
            result[i][j] = matrix1[i][j] - matrix2[i][j];
        }
    }
    return result;
}

// Multiply matrices
function multiplyMatrices(matrix1, matrix2) {
    if (matrix1[0].length !== matrix2.length) {
        alert("Number of columns of the first matrix must equal the number of rows of the second matrix for multiplication.");
        return null;
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
            result[i][j] = 0;
        }
    }
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix2[0].length; j++) {
            for (let k = 0; k < matrix1[0].length; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

// Transpose a matrix
function transposeMatrix(matrix) {
    let transpose = [];
    for (let i = 0; i < matrix[0].length; i++) {
        transpose[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            transpose[i][j] = matrix[j][i];
        }
    }
    return transpose;
}

// Listen for changes in the operation dropdown
document.getElementById("operation-select").addEventListener("change", performMatrixOperation);

// Add event listener for the create matrix button
document.getElementById("create-matrix-btn").addEventListener("click", createMatrix);
