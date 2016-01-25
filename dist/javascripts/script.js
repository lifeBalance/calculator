$(document).ready(function () {
  $(function() {
    $("#calculator").draggable();
  });

  // Some states
  var signState;

  // Once decimalState is enabled, the user cannot
  // introduce more decimal points.
  var decimalState;
  var operationState;

  var buffer;

  var operand;
  var operator;

  // Set the display to '0' at the beginning.
  // (Comment following line to test 'AC' button)
  initialize();

  // Also triggered when the 'All Clear' is clicked.
  function initialize(refreshDisplay) {
    console.clear();
    operand = '0';

    decimalState = false;
    operationState = false;
    signState = '';
    operator = '';

    return refresh(operand);
  }

  // `key` is an object, key.num or key.op
  function calculate(key) {
    if (key.num) {
      buildOperand(key, refresh);
    } else if (key.op === 'ac') {
      initialize(refresh);
    } else if (!operationState){ // We have pressed any other operator key (not AC)
      operationState = true;

      buffer = Number(operand);

      if (key.op === 'percentage') refresh(buffer = buffer / 100);

      // We set the operator for later, when the new operand is introduced
      operator = key.op;

      // The operand is set to '0' to leave space to the next one,
      // but the display is not refreshed. As we start introducing
      // the next operand the display will be refreshed.
      operand = '0';
    } else {
      switch (operator) {
        case 'division':
        refresh(buffer = divide(buffer, Number(operand)));
        break;

        case 'multiplication':
        if (key.op === 'percentage') {
          var percent = Number(operand) / 100;
          refresh(buffer = buffer * percent);
        } else {
          refresh(buffer = buffer * Number(operand));
        }
        break;

        case 'substraction':
        refresh(buffer = buffer - Number(operand));
        break;

        case 'addition':
        refresh(buffer = buffer + Number(operand));
        break;

        case 'equals':
        refresh(buffer);
        break;
      }

      operand = '0';
      operator = key.op; // Renewing the operator
    }
  } // function calculate

  function buildOperand(key, refreshDisplay) {
    // When we have only 0 in the display.
    if (operand.length === 1 && operand[0] === '0') {
      // If user presses 0 or tries to change sign
      // we just return.
      if (key.num === 0 || key.num === 'sign') {
        return;
        // If user presses the decimal point
      } else if (key.num === '.') {
        addDot(refresh);
      // If user presses another number
      } else {
        // Overwrite the first digit
        operand = key.num;
        return refreshDisplay(operand);
      }
    }

    // If there's more than 1 digit in the display
    if (operand.length >= 1){
      if (key.num === '.') {
        addDot(refresh);
      } else if (key.num === 'sign') {
        toggleSign(refresh);
      } else {
        // Append the digit(as a string) to the buffer string
        operand += key.num;
        return refreshDisplay(operand);
      }
    }
  }

  // Add decimal point
  function addDot(refreshDisplay) {
    // If decimalState is true we just return
    if (decimalState) {
      return;
    } else {
      // Add the decimal point.
      operand += '.';
      // And toggle decimalState
      decimalState = true;
      return refreshDisplay(operand);
    }
  }

  // Toggle sign
  function toggleSign(refreshDisplay) {
    if (signState === '' && operand.length === 1 && operand[0] !== '0') {
      signState = '-';
      return refreshDisplay(operand = signState + operand);
    } else if (signState === '' && operand.length > 1){
      signState = '-';
      return refreshDisplay(operand = signState + operand);
    } else if (signState === '-') {
      signState = '';
      operand = operand.replace('-', signState);
      return refreshDisplay(operand);
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

  function percentage(num, refreshDisplay) {
    return refreshDisplay(num / 100);
  }

  // Refresh and format display (maximum 11 digits)
  function refresh(num) {
    if (num.toString().length <= 11) {
      $('#display').val((num));
    } else {
      var wholePart = Math.floor(num).toString.length; // number of whole digits
      $('#display').val((num.toFixed(11 - wholePart)));
    }
    return num;
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
