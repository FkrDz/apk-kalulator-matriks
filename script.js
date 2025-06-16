// Variabel Global
let currentSize = 3;
let currentOperation = 'add';

// Event Listeners dan Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kalkulator Matriks - Fikri Dzakwan (411241032)');
    initializeApp();
});

// Fungsi Inisialisasi Aplikasi
function initializeApp() {
    generateMatrices();
    setupEventListeners();
    addMatrixInputAnimations();
}

// Setup Event Listeners
function setupEventListeners() {
    const matrixSizeSelect = document.getElementById('matrixSize');
    matrixSizeSelect.addEventListener('change', handleMatrixSizeChange);
    
    // Tambahkan keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle Matrix Size Change
function handleMatrixSizeChange(event) {
    currentSize = parseInt(event.target.value);
    generateMatrices();
    clearResult();
    clearError();
    
    // Animasi transisi
    animateMatrixTransition();
}

// Fungsi untuk membuat animasi transisi matriks
function animateMatrixTransition() {
    const matrixSections = document.querySelectorAll('.matrix-section');
    matrixSections.forEach(section => {
        section.style.transform = 'scale(0.9)';
        section.style.opacity = '0.7';
        
        setTimeout(() => {
            section.style.transform = 'scale(1)';
            section.style.opacity = '1';
        }, 200);
    });
}

// Fungsi untuk menambahkan animasi pada input matriks
function addMatrixInputAnimations() {
    setTimeout(() => {
        const inputs = document.querySelectorAll('.matrix-cell');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.opacity = '0';
                input.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    input.style.transition = 'all 0.3s ease';
                    input.style.opacity = '1';
                    input.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }, 100);
}

// Handle Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
    if (event.ctrlKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                performOperation('add');
                break;
            case '2':
                event.preventDefault();
                performOperation('subtract');
                break;
            case '3':
                event.preventDefault();
                performOperation('multiply');
                break;
            case 'r':
                event.preventDefault();
                clearMatrices();
                break;
            case 'e':
                event.preventDefault();
                fillExampleValues();
                break;
        }
    }
}

// Fungsi untuk membuat matriks input
function generateMatrices() {
    generateMatrix('matrixA');
    generateMatrix('matrixB');
}

function generateMatrix(matrixId) {
    const container = document.getElementById(matrixId);
    container.innerHTML = '';

    // Buat wrapper untuk matriks
    const matrixWrapper = document.createElement('div');
    matrixWrapper.className = 'matrix-wrapper';

    for (let i = 0; i < currentSize; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';

        for (let j = 0; j < currentSize; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `${matrixId}_${i}_${j}`;
            input.value = '0';
            input.step = '0.01';
            input.placeholder = '0';
            
            // Event listeners untuk validasi dan animasi
            setupInputEventListeners(input);
            
            row.appendChild(input);
        }

        matrixWrapper.appendChild(row);
    }

    container.appendChild(matrixWrapper);
}

// Setup Event Listeners untuk Input
function setupInputEventListeners(input) {
    // Validasi input
    input.addEventListener('input', function() {
        validateInput(this);
    });

    // Animasi focus
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.3)';
    });

    // Animasi blur
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });

    // Navigation dengan arrow keys
    input.addEventListener('keydown', function(event) {
        handleInputNavigation(event, this);
    });
}

// Validasi Input
function validateInput(input) {
    let value = input.value;
    
    // Hapus karakter non-numerik kecuali titik dan minus
    value = value.replace(/[^0-9.-]/g, '');
    
    // Pastikan hanya satu titik desimal
    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
        value = value.replace(/\.(?=.*\.)/g, '');
    }
    
    // Pastikan minus hanya di awal
    if (value.indexOf('-') > 0) {
        value = value.replace(/-/g, '');
    }
    
    input.value = value;
    
    // Set default jika kosong
    if (value === '' || value === '-') {
        input.value = '0';
    }
}

// Handle Input Navigation dengan Arrow Keys
function handleInputNavigation(event, currentInput) {
    const matrixId = currentInput.id.split('_')[0];
    const row = parseInt(currentInput.id.split('_')[1]);
    const col = parseInt(currentInput.id.split('_')[2]);
    
    let newRow = row;
    let newCol = col;
    
    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault();
            newRow = Math.max(0, row - 1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            newRow = Math.min(currentSize - 1, row + 1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            newCol = Math.max(0, col - 1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            newCol = Math.min(currentSize - 1, col + 1);
            break;
        case 'Enter':
            event.preventDefault();
            newRow = (row + 1) % currentSize;
            newCol = (newRow === 0) ? (col + 1) % currentSize : col;
            break;
    }
    
    const nextInput = document.getElementById(`${matrixId}_${newRow}_${newCol}`);
    if (nextInput) {
        nextInput.focus();
        nextInput.select();
    }
}

// Fungsi untuk mendapatkan nilai matriks dari input
function getMatrixValues(matrixId) {
    const matrix = [];
    for (let i = 0; i < currentSize; i++) {
        const row = [];
        for (let j = 0; j < currentSize; j++) {
            const inputElement = document.getElementById(`${matrixId}_${i}_${j}`);
            const value = parseFloat(inputElement.value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

// Fungsi Operasi Matriks
function addMatrices(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < currentSize; i++) {
        const row = [];
        for (let j = 0; j < currentSize; j++) {
            row.push(matrixA[i][j] + matrixB[i][j]);
        }
        result.push(row);
    }
    return result;
}

function subtractMatrices(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < currentSize; i++) {
        const row = [];
        for (let j = 0; j < currentSize; j++) {
            row.push(matrixA[i][j] - matrixB[i][j]);
        }
        result.push(row);
    }
    return result;
}

function multiplyMatrices(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < currentSize; i++) {
        const row = [];
        for (let j = 0; j < currentSize; j++) {
            let sum = 0;
            for (let k = 0; k < currentSize; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

// Fungsi untuk melakukan operasi dengan animasi
function performOperation(operation) {
    currentOperation = operation;
    
    // Update tampilan operator dengan animasi
    updateOperatorDisplay(operation);
    
    try {
        // Validasi input terlebih dahulu
        if (!validateMatrixInputs()) {
            throw new Error('Harap isi semua nilai matriks dengan benar');
        }

        const matrixA = getMatrixValues('matrixA');
        const matrixB = getMatrixValues('matrixB');
        let result;

        // Animasi loading
        showLoadingAnimation();

        setTimeout(() => {
            try {
                switch (operation) {
                    case 'add':
                        result = addMatrices(matrixA, matrixB);
                        break;
                    case 'subtract':
                        result = subtractMatrices(matrixA, matrixB);
                        break;
                    case 'multiply':
                        result = multiplyMatrices(matrixA, matrixB);
                        break;
                    default:
                        throw new Error('Operasi tidak valid');
                }

                displayResult(result);
                clearError();
                
                // Log hasil untuk debugging
                console.log(`Operasi ${operation} berhasil:`, result);
                
            } catch (error) {
                showError('Terjadi kesalahan dalam perhitungan: ' + error.message);
            }
        }, 500);

    } catch (error) {
        showError(error.message);
    }
}

// Validasi input matriks
function validateMatrixInputs() {
    for (let matrixId of ['matrixA', 'matrixB']) {
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j < currentSize; j++) {
                const input = document.getElementById(`${matrixId}_${i}_${j}`);
                if (!input.value || isNaN(parseFloat(input.value))) {
                    input.focus();
                    input.style.borderColor = '#e74c3c';
                    setTimeout(() => {
                        input.style.borderColor = '#bdc3c7';
                    }, 2000);
                    return false;
                }
            }
        }
    }
    return true;
}

// Update tampilan operator
function updateOperatorDisplay(operation) {
    const operatorSymbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×'
    };
    
    const operatorElement = document.getElementById('operatorDisplay');
    operatorElement.style.transform = 'scale(0)';
    
    setTimeout(() => {
        operatorElement.textContent = operatorSymbols[operation];
        operatorElement.style.transform = 'scale(1)';
    }, 150);
}

// Animasi loading
function showLoadingAnimation() {
    const resultContainer = document.getElementById('resultMatrix');
    resultContainer.innerHTML = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p>Menghitung...</p>
        </div>
    `;
    
    // Tambahkan CSS untuk spinner jika belum ada
    if (!document.querySelector('#spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            .loading-animation {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                padding: 20px;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Fungsi untuk menampilkan hasil dengan animasi
function displayResult(matrix) {
    const container = document.getElementById('resultMatrix');
    container.innerHTML = '';

    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix';

    for (let i = 0; i < currentSize; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';

        for (let j = 0; j < currentSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            
            // Format angka dengan 2 desimal jika perlu
            const value = matrix[i][j];
            const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
            
            // Hapus trailing zeros
            cell.textContent = parseFloat(formattedValue).toString();
            
            // Animasi muncul bertahap
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                cell.style.transition = 'all 0.3s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, (i * currentSize + j) * 100);
            
            row.appendChild(cell);
        }

        matrixDiv.appendChild(row);
    }

    container.appendChild(matrixDiv);
    
    // Animasi container
    setTimeout(() => {
        container.style.transform = 'scale(1.05)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 200);
    }, 500);
}

// Fungsi untuk menampilkan error dengan animasi
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<div class="error-message">${message}</div>`;
    
    // Animasi shake
    const errorElement = errorDiv.querySelector('.error-message');
    errorElement.style.animation = 'shake 0.5s ease-in-out';
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        if (errorDiv.innerHTML.includes(message)) {
            errorDiv.style.opacity = '0.5';
            setTimeout(() => {
                errorDiv.innerHTML = '';
                errorDiv.style.opacity = '1';
            }, 500);
        }
    }, 5000);
}

// Fungsi untuk menghapus error
function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.opacity = '0';
    setTimeout(() => {
        errorDiv.innerHTML = '';
        errorDiv.style.opacity = '1';
    }, 300);
}

// Fungsi untuk reset dengan animasi
function clearMatrices() {
    // Animasi fade out
    const inputs = document.querySelectorAll('.matrix-cell');
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transition = 'all 0.2s ease';
            input.style.opacity = '0.5';
            input.value = '0';
            
            setTimeout(() => {
                input.style.opacity = '1';
            }, 100);
        }, index * 20);
    });
    
    clearResult();
    clearError();
    
    // Reset fokus ke input pertama
    setTimeout(() => {
        const firstInput = document.getElementById('matrixA_0_0');
        if (firstInput) {
            firstInput.focus();
        }
    }, 500);
    
    console.log('Matriks direset');
}

// Fungsi untuk menghapus hasil
function clearResult() {
    const resultDiv = document.getElementById('resultMatrix');
    resultDiv.style.opacity = '0';
    
    setTimeout(() => {
        resultDiv.innerHTML = '<p>Pilih operasi untuk melihat hasil</p>';
        resultDiv.style.opacity = '1';
    }, 300);
    
    document.getElementById('operatorDisplay').textContent = '+';
}

// Fungsi untuk mengisi matriks dengan nilai contoh
function fillExampleValues() {
    const examples = {
        2: {
            matrixA: [[1, 2], [3, 4]],
            matrixB: [[5, 6], [7, 8]]
        },
        3: {
            matrixA: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            matrixB: [[9, 8, 7], [6, 5, 4], [3, 2, 1]]
        },
        4: {
            matrixA: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]],
            matrixB: [[16, 15, 14, 13], [12, 11, 10, 9], [8, 7, 6, 5], [4, 3, 2, 1]]
        }
    };

    const example = examples[currentSize];
    
    // Animasi pengisian
    let delay = 0;
    
    ['matrixA', 'matrixB'].forEach(matrixId => {
        const matrixData = example[matrixId];
        
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j < currentSize; j++) {
                setTimeout(() => {
                    const input = document.getElementById(`${matrixId}_${i}_${j}`);
                    if (input) {
                        input.style.transition = 'all 0.3s ease';
                        input.style.backgroundColor = '#3498db';
                        input.style.color = 'white';
                        input.value = matrixData[i][j];
                        
                        setTimeout(() => {
                            input.style.backgroundColor = 'white';
                            input.style.color = '#2c3e50';
                        }, 300);
                    }
                }, delay);
                delay += 50;
            }
        }
    });
    
    // Clear hasil setelah mengisi contoh
    setTimeout(() => {
        clearResult();
        clearError();
    }, delay + 200);
    
    console.log(`Contoh matriks ${currentSize}x${currentSize} berhasil dimuat`);
}

// Fungsi utility untuk format angka
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // Hapus trailing zeros
    return parseFloat(num.toFixed(6)).toString();
}

// Fungsi untuk export hasil ke clipboard
function exportResultToClipboard() {
    const resultCells = document.querySelectorAll('.result-cell');
    if (resultCells.length === 0) {
        showError('Tidak ada hasil untuk diekspor');
        return;
    }
    
    let matrixText = '';
    let cellIndex = 0;
    
    for (let i = 0; i < currentSize; i++) {
        let row = '';
        for (let j = 0; j < currentSize; j++) {
            if (cellIndex < resultCells.length) {
                row += resultCells[cellIndex].textContent;
                if (j < currentSize - 1) row += '\t';
                cellIndex++;
            }
        }
        matrixText += row;
        if (i < currentSize - 1) matrixText += '\n';
    }
    
    navigator.clipboard.writeText(matrixText).then(() => {
        showTemporaryMessage('Hasil berhasil disalin ke clipboard!', 'success');
    }).catch(() => {
        showError('Gagal menyalin ke clipboard');
    });
}

// Fungsi untuk menampilkan pesan sementara
function showTemporaryMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `temp-message temp-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Tambahkan CSS untuk animasi pesan
const messageStyle = document.createElement('style');
messageStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(messageStyle);

// Fungsi untuk print hasil
function printResult() {
    const resultMatrix = document.getElementById('resultMatrix');
    if (!resultMatrix.querySelector('.result-cell')) {
        showError('Tidak ada hasil untuk dicetak');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Hasil Kalkulator Matriks</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .matrix { text-align: center; }
                    .matrix-row { display: flex; justify-content: center; gap: 10px; margin: 5px 0; }
                    .result-cell { 
                        width: 50px; 
                        height: 30px; 
                        border: 1px solid #333; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Hasil Kalkulator Matriks</h1>
                    <p><strong>Nama:</strong> Fikri Dzakwan</p>
                    <p><strong>NIM:</strong> 411241032</p>
                    <p><strong>Operasi:</strong> ${currentOperation}</p>
                    <p><strong>Ukuran:</strong> ${currentSize}x${currentSize}</p>
                </div>
                <div class="matrix">
                    ${resultMatrix.innerHTML}
                </div>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Fungsi untuk menampilkan informasi bantuan
function showHelp() {
    const helpContent = `
        <div style="text-align: left; max-width: 500px;">
            <h3>Panduan Penggunaan</h3>
            <ul>
                <li><strong>Navigasi:</strong> Gunakan arrow keys untuk berpindah antar cell</li>
                <li><strong>Shortcut:</strong>
                    <ul>
                        <li>Ctrl+1: Penjumlahan</li>
                        <li>Ctrl+2: Pengurangan</li>
                        <li>Ctrl+3: Perkalian</li>
                        <li>Ctrl+R: Reset</li>
                        <li>Ctrl+E: Contoh</li>
                    </ul>
                </li>
                <li><strong>Input:</strong> Masukkan angka (desimal diperbolehkan)</li>
                <li><strong>Hasil:</strong> Akan muncul otomatis setelah operasi</li>
            </ul>
        </div>
    `;
    
    // Buat modal sederhana
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
    `;
    
    modalContent.innerHTML = helpContent + `
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="this.closest('.modal').remove()" style="
                padding: 10px 20px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Tutup</button>
        </div>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Tutup modal jika klik di luar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Inisialisasi tambahan setelah DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan tombol bantuan
    const controls = document.querySelector('.operation-buttons');
    if (controls) {
        const helpBtn = document.createElement('button');
        helpBtn.className = 'btn btn-primary';
        helpBtn.textContent = 'Bantuan';
        helpBtn.onclick = showHelp;
        controls.appendChild(helpBtn);
    }
    
    // Fokus ke input pertama
    setTimeout(() => {
        const firstInput = document.getElementById('matrixA_0_0');
        if (firstInput) {
            firstInput.focus();
        }
    }, 500);
    
    console.log('Kalkulator Matriks siap digunakan!');
    console.log('Shortcut: Ctrl+1 (tambah), Ctrl+2 (kurang), Ctrl+3 (kali), Ctrl+R (reset), Ctrl+E (contoh)');
});
