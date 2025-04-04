class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
      this.previousOperandElement = previousOperandElement;
      this.currentOperandElement = currentOperandElement;
      this.clear();
  }

  clear() {
      this.currentOperand = '0';
      this.previousOperand = '';
      this.operation = undefined;
  }

  delete() {
      if (this.currentOperand.length === 1 || 
          (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
          this.currentOperand = '0';
      } else {
          this.currentOperand = this.currentOperand.slice(0, -1);
      }
  }

  appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      if (this.currentOperand === '0' || this.resetScreen) {
          this.currentOperand = '';
          this.resetScreen = false;
      }
      this.currentOperand += number;
  }

  chooseOperation(operation) {
      if (this.currentOperand === '') return;
      if (this.previousOperand !== '') {
          this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';
  }

  compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      
      if (isNaN(prev)) return;
      
      switch (this.operation) {
          case '+':
              computation = prev + current;
              break;
          case '-':
              computation = prev - current;
              break;
          case '*':
              computation = prev * current;
              break;
          case '/':
              computation = prev / current;
              break;
          case '%':
              computation = prev % current;
              break;
          default:
              return;
      }
      
      this.currentOperand = computation.toString();
      this.operation = undefined;
      this.previousOperand = '';
      this.resetScreen = true;
  }

  getPercent() {
      if (this.currentOperand === '') return;
      this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
  }

  updateDisplay() {
      this.currentOperandElement.innerText = this.currentOperand;
      if (this.operation != null) {
          this.previousOperandElement.innerText = 
              `${this.previousOperand} ${this.operation}`;
      } else {
          this.previousOperandElement.innerText = this.previousOperand;
      }
  }
}

// Get DOM elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-action="percent"]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

// Create calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event listeners
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      switch(action) {
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
              calculator.chooseOperation(button.innerText);
              break;
          case 'calculate':
              calculator.compute();
              break;
          case 'clear':
              calculator.clear();
              break;
          case 'delete':
              calculator.delete();
              break;
          case 'percent':
              calculator.getPercent();
              break;
      }
      calculator.updateDisplay();
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
      calculator.appendNumber(e.key);
      calculator.updateDisplay();
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      calculator.chooseOperation(e.key);
      calculator.updateDisplay();
  } else if (e.key === 'Enter' || e.key === '=') {
      calculator.compute();
      calculator.updateDisplay();
  } else if (e.key === 'Backspace') {
      calculator.delete();
      calculator.updateDisplay();
  } else if (e.key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
  } else if (e.key === '%') {
      calculator.getPercent();
      calculator.updateDisplay();
  }
});