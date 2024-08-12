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

// Handle matrix selection and display only the selected matrix
function handleMatrixSelection(event, containerId) {
    const selectedMatrixIndex = event.target.value;
    displayMatrix(matrices[selectedMatrixIndex], containerId);
}

// Display the selected matrix in the specified container
function displayMatrix(matrix, containerId) {
    const matrixDisplay = document.getElementById(containerId);
    matrixDisplay.innerHTML = matrixToTable(matrix);
}

// Convert a matrix to an HTML table format
function matrixToTable(matrix) {
    let html = '<table border="1" class="matrix-table">';
    matrix.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            html += `<td data-row="${rowIndex}" data-col="${colIndex}" onclick="editCell(event)">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

function editCell(event) {
    const cell = event.target;
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const matrixIndex = matrices.findIndex(matrix => matrix.some(r => r.includes(parseInt(cell.innerText, 10))));
    const newValue = prompt("Enter new value:", cell.innerText);
    if (newValue !== null) {
        const parsedValue = parseInt(newValue, 10);
        if (!isNaN(parsedValue)) {
            matrices[matrixIndex][row][col] = parsedValue;
            const matrixDropdown = document.getElementById("matrix-one");
            const selectedMatrixIndex = matrixDropdown.value;
            if (selectedMatrixIndex == matrixIndex) {
                displayMatrix(matrices[matrixIndex], "selected-matrix-display");
            }
            const secondMatrixDropdown = document.getElementById("matrix-two");
            const selectedSecondMatrixIndex = secondMatrixDropdown.value;
            if (selectedSecondMatrixIndex == matrixIndex) {
                displayMatrix(matrices[matrixIndex], "second-matrix-display");
            }
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
        displayMatrix(matrices[matrixOneIndex], "selected-matrix-display");
    }
    if (matrixTwoIndex !== "" && matrixTwoIndex !== null) {
        displayMatrix(matrices[matrixTwoIndex], "second-matrix-display");
    }
}

// Perform the selected matrix operation
function performMatrixOperation() {
    const operationSelectElement = document.getElementById("operation-select");
    const selectedOperation = operationSelectElement.value;
    const matrix1Index = document.getElementById("matrix-one").value;
    const matrix2Index = document.getElementById("matrix-two").value;
    let resultMatrix;

    if (!selectedOperation) {
        alert("Please select an operation.");
        return;
    }

    if (selectedOperation !== "transpose" && (matrix1Index === "" || matrix2Index === "")) {
        alert("Please select both matrices.");
        return;
    }

    const matrix1 = matrices[matrix1Index];
    let matrix2;

    // For transpose, only one matrix is needed
    if (selectedOperation !== "transpose") {
        matrix2 = matrices[matrix2Index];
    }

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
        default:
            alert("Invalid operation selected.");
            return;
    }

    if (resultMatrix) {
        // Display the result in the result-display container
        displayMatrix(resultMatrix, "result-display");
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
            for (let k = 0; k < matrix1[0].length; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

// Transpose a matrix
function transposeMatrix(matrix) {
    let result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}
