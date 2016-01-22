$(document).ready(function () {
  // Some states
  var signState;

  // Once decimalState is enabled, the user cannot
  // introduce more decimal points.
  var decimalState;
  var operationState;

  var buffer;

  var firstOperand;
  var secondOperand;
  var operator;

  // Set the display to '0' at the beginning.
  // (Comment following line to test 'AC' button)
  initialize();

  // Also triggered when the 'All Clear' is clicked.
  function initialize(refreshDisplay) {
    console.clear();
    buffer = '0';

    decimalState = false;
    operationState = false;
    signState = '';
    operator = '';

    return refresh(buffer);
  }

  // `key` is an object, key.num or key.op
  function calculate(key) {
    if (key.num) {
      buildOperand(key, refresh);
    }

    // When the AC key is pressed, no matter what, initialize
    if (key.op === 'ac') {
      initialize(refresh);
    }

    // We have pressed an operator key, and operationState is false,
    // that means is the first time we press an operator key.
    if (key.op && key.op !== 'ac' && operationState === false) {
      // If the first operator is 'equals' we just return.
      if (key.op === 'equals') {
        return;
      }

      // Any other operator:
      // The value of buffer is stored(as a Number) in the first operand.
      firstOperand = Number(buffer);
      operationState = true;
      // The operator is also stored
      operator = key.op;

      console.log('buffer now is:', buffer);
      console.log('operating?', operationState);
      // We flush the buffer to make place for the second operand,
      // but we don't refresh the display. It will be refreshed
      // when the second operand is being introduced.
      buffer = '0';
      console.log('buffer now is:', buffer);

  // We have pressed an operator key, and operationState is true,
  // meaning it's the second time we press an operator key.
  } else if (key.op && key.op !== 'ac' && operationState === true) {
      operationState = false;
      secondOperand = Number(buffer);
      doTheMath(refresh);
    }
  }

  function buildOperand(key, refreshDisplay) {
    // When we have only 0 in the display.
    if (buffer.length === 1 && buffer[0] === '0') {
      // If user presses 0 or tries to change sign
      // we just return.
      if (key.num === 0 || key.num === 'sign') {
        return;
        // If user presses the decimal point
      } else if (key.num === '.') {
        console.log('buffer is', buffer);
        addDot(refresh);
      // If user presses another number
      } else {
        // Overwrite the first digit
        buffer = key.num;
        return refreshDisplay(buffer);
      }
    }

    // If there's more than 1 digit in the display
    if (buffer.length >= 1){
      if (key.num === '.') {
        addDot(refresh);
      } else if (key.num === 'sign') {
        toggleSign(refresh);
      } else {
        // Append the digit(as a string) to the buffer string
        buffer += key.num;
        return refreshDisplay(buffer);
      }
    }
  }

  // Add decimal point
  function addDot(refreshDisplay) {
    console.log('buffer is', buffer);
    // If decimalState is true we just return
    if (decimalState) {
      return;
    } else {
      // Add the decimal point.
      buffer += '.';
      // And toggle decimalState
      decimalState = true;
      return refreshDisplay(buffer);
    }
  }

  // Toggle sign
  function toggleSign(refreshDisplay) {
    if (signState === '' && buffer.length === 1 && buffer[0] !== '0') {
      signState = '-';
      return refreshDisplay(buffer = signState + buffer);
    } else if (signState === '' && buffer.length > 1){
      signState = '-';
      return refreshDisplay(buffer = signState + buffer);
    } else if (signState === '-') {
      signState = '';
      buffer = buffer.replace('-', signState);
      return refreshDisplay(buffer);
    }
  }

  // Doing the calculations
  function doTheMath(refreshDisplay) {
    switch (operator) {
    case 'addition':
      buffer = firstOperand + secondOperand;
      firstOperand = buffer;
      return refreshDisplay(buffer);
    case 'substraction':
      return refreshDisplay(firstOperand - secondOperand);
    case 'multiplication':
      return refreshDisplay(firstOperand * secondOperand);
    case 'division':
      return refreshDisplay(divide(firstOperand, secondOperand));
    }
  }

  // Division
  function divide(a, b) {
    if(b === 0) {
      return 0;
    } else {
      return a / b;
    }
  }

  // Refresh display
  function refresh(str) {
    $('#display').val(str);
  }

  // Listening for 'click' events.
  $('#calculator').on('click', 'a', function (event) {
    event.preventDefault();
    // This object will store something like either:
    // {num: "6"} or {op: "addition"}
    var key = {}; // initialize to {} on each key-press

    // I found that using $(this).data('num') did NOT
    // work when the pressed key was 0!!
    // A bug in jQuery??
    if ($(this).attr('data-num')) {
      key.num = $(this).attr('data-num');
      console.log('Number Key pressed: %s', key.num);
      // console.log(typeof key.num);
      // console.log(key);
      // calculate(key);
    } else if ($(this).attr('data-op')) {
      key.op = $(this).attr('data-op');
      console.log('Operator Key pressed: %s', key.op);
      // console.log(key);
    }
    calculate(key);
  });
});
