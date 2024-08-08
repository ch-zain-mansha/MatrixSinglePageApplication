// CREATING MATRIX
let matrices = [];
document.getElementById("create_single_matrix").addEventListener("click", () => {
    const rows = prompt("Enter the number of rows for the matrix");
    const cols = prompt("Enter the number of columns for the matrix");
    let matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = parseInt(prompt(`Enter entry for the matrix at row ${i + 1}, column ${j + 1}`));
        }}
    matrices.push(matrix);
    updateDropdowns();
    displayAllMatrices();
});




// UPDATE DROPDOWN IF NEW MATRIX IS ADDED
function updateDropdowns() {
    const dropdown1 = document.getElementById("first");
    const dropdown2 = document.getElementById("second");
    dropdown1.innerHTML = '<option value="" disabled selected>Select a matrix</option>';
    dropdown2.innerHTML = '<option value="" disabled selected>Select a matrix</option>';
    matrices.forEach((matrix, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `Matrix ${index + 1}`;
        dropdown1.add(option.cloneNode(true));
        dropdown2.add(option.cloneNode(true));
    });
    // WHEN SOMEONE CHANGE SELECTED MATRIX
    dropdown1.addEventListener("change", (event) => {
        const selectedMatrixIndex = event.target.value;
        displayMatrix(matrices[selectedMatrixIndex], "matrix_display");
    });
    dropdown2.addEventListener("change", (event) => {
        const selectedMatrixIndex = event.target.value;
        displayMatrix(matrices[selectedMatrixIndex], "second_matrix_display");
    });
}



// DISPLAY MATRIX
function displayAllMatrices() {
    const allMatricesDisplay = document.getElementById("all_matrices_display");
    const secondAllMatricesDisplay = document.getElementById("all_matrices_display_second");

    allMatricesDisplay.innerHTML = '';
    secondAllMatricesDisplay.innerHTML = '';

    matrices.forEach((matrix, index) => {
        allMatricesDisplay.innerHTML += `<div class="matrix-container"><h3>Matrix ${index + 1}</h3>${writingMatrixInTable(matrix)}</div>`;
        secondAllMatricesDisplay.innerHTML += `<div class="matrix-container"><h3>Matrix ${index + 1}</h3>${writingMatrixInTable(matrix)}</div>`;
    });
}




// DISPLAYING MATRIX WHICH IS SELECTED
function displayMatrix(matrix, containerId) {
    const matrixDisplay = document.getElementById(containerId);
    matrixDisplay.innerHTML = writingMatrixInTable(matrix);
}





// FOR WRITING MATRIX IN TABLE FORM
function writingMatrixInTable(matrix) {
    let html = '<table border="1" class="matrix-table">';
    matrix.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}




//MATRIX OPERATION TO CHECK IF BOTH MATRIX IS SELECTED OR FOR DOING OPERATION
function performOperation() {
    const selectedOperation = document.getElementById("default_icon").value;
    const matrix1Index = document.getElementById("first").value;
    const matrix2Index = document.getElementById("second").value;
    let resultMatrix;
    if (selectedOperation === "+" || selectedOperation === "-" || selectedOperation === "*" || selectedOperation === "transpose") {
        if (selectedOperation !== "transpose" && (matrix1Index === "" || matrix2Index === "")) {
            alert("Please select both matrices.");
            return;
        }
        const matrix1 = matrices[matrix1Index];
        const matrix2 = matrices[matrix2Index];
        switch (selectedOperation) {
            case "+":
                resultMatrix = matrixAddition(matrix1, matrix2);
                break;
            case "-":
                resultMatrix = matrixSubtraction(matrix1, matrix2);
                break;
            case "*":
                resultMatrix = matrixMultiplication(matrix1, matrix2);
                break;
            case "transpose":
                resultMatrix = matrixTranspose(matrix1);
                break;
        }
        if (resultMatrix) {
            displayMatrix(resultMatrix, "result_matrix_display");
        } else {
            alert("Operation could not be performed. Check the dimensions of the matrices.");
        }
    } else {
        alert("Please select a valid operation.");
    }
}








// MATRIX OPERATIONS
function matrixAddition(matrix1, matrix2) {
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








function matrixSubtraction(matrix1, matrix2) {
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



function matrixMultiplication(matrix1, matrix2) {
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





function matrixTranspose(matrix) {
    let transpose = [];
    for (let i = 0; i < matrix[0].length; i++) {
        transpose[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            transpose[i][j] = matrix[j][i];
        }
    }
    return transpose;
}




// ICONS DROPDOWN & SELECTION
const iconsDropdown = document.getElementById("icons");
const iconsDropdownArrowDown = document.getElementById("icons_dropdown_down_button");
const iconsDropdownArrowUp = document.getElementById("icons_dropdown_up_button");
const selectedIcons = document.getElementById("selected_icon");
const defaultIcon = document.getElementById("default_icon");

const iconButtons = [
    document.getElementById("plus"),
    document.getElementById("minus"),
    document.getElementById("multiply"),
    document.getElementById("transpose")
];

//ICON SELECTION
iconButtons.forEach(icon => {
    icon.addEventListener("click", () => {
        selectedIcons.innerHTML = icon.innerHTML;
        selectedIcons.value = icon.value;
        defaultIcon.innerHTML = icon.innerHTML;
        defaultIcon.value = icon.value;
        updateIconsVisibility();
        defaultIcon.click();
    });
});


iconsDropdown.style.display = "none";
iconsDropdownArrowUp.style.display = "none";

iconsDropdownArrowDown.addEventListener("click", () => {
    iconsDropdown.style.display = "block";
    iconsDropdownArrowDown.style.display = "none";
    iconsDropdownArrowUp.style.display = "block";
});

iconsDropdownArrowUp.addEventListener("click", () => {
    iconsDropdown.style.display = "none";
    iconsDropdownArrowDown.style.display = "block";
    iconsDropdownArrowUp.style.display = "none";
});



function updateIconsVisibility() {
    iconButtons.forEach(icon => {
        if (icon.innerHTML === defaultIcon.innerHTML) {
            icon.style.display = "none";
        } else {
            icon.style.display = "inline-block";
        }
    });
}



const default_icon = document.getElementById("default_icon");
const selected_icon = document.getElementById("selected_icon");
if (default_icon.innerHTML == selected_icon.innerHTML) {
    selected_icon.style.display = "none";
}



updateIconsVisibility();
defaultIcon.addEventListener("click", performOperation);