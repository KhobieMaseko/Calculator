
// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// DOM elements
const currentOperandElement = document.querySelector('.current-operand');
const previousOperandElement = document.querySelector('.previous-operand');
const numberButtons = document.querySelectorAll('[data-action="number"]');
const operatorButtons = document.querySelectorAll('[data-action="operator"]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const decimalButton = document.querySelector('[data-action="decimal"]');

// Update calculator display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    previousOperandElement.textContent = previousOperand + (operation ? ` ${operation}` : '');
}

// Append number to current operand
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    currentOperand += number;
}

// Add decimal point if none exists
function addDecimal() {
    if (resetScreen) {
        currentOperand = '0.';
        resetScreen = false;
        return;
    }
    if (currentOperand.includes('.')) return;
    if (currentOperand === '') currentOperand = '0';
    currentOperand += '.';
}

// Delete last digit
function deleteDigit() {
    if (resetScreen) return;
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Clear all calculator state
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
}

// Choose operation to perform
function chooseOperation(op) {
    if (currentOperand === '' && previousOperand === '') return;

    if (currentOperand === '') {
        operation = op;
        updateDisplay();
        return;
    }

    if (previousOperand !== '') {
        compute();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

// Perform calculations
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("You can't divide by zero!");
                clear();
                updateDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Round to 8 decimal places to avoid floating point errors
    computation = Math.round(computation * 100000000) / 100000000;

    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    resetScreen = true;
}

// Event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
        updateDisplay();
    });
});

// Event listeners for operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.textContent);
        updateDisplay();
    });
});

// Event listeners for other buttons
equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteDigit();
    updateDisplay();
});

decimalButton.addEventListener('click', () => {
    addDecimal();
    updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        updateDisplay();
    } else if (e.key === '.') {
        addDecimal();
        updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        chooseOperation(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        compute();
        updateDisplay();
    } else if (e.key === 'Backspace') {
        deleteDigit();
        updateDisplay();
    } else if (e.key === 'Escape') {
        clear();
        updateDisplay();
    }
});

// Initialize display
updateDisplay();
