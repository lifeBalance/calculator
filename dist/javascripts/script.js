$(document).ready(function () {
  var display = 0;
  var signState = '';
  var str;

  // Set the display to '0' at the beginning.
  // Comment following line to test 'AC' button
  initialize();

  // Also triggered when the 'All Clear' is clicked.
  function initialize() {
    str = '0';
    $('#display').val(str);
  }

  // Building up the operands
  function buildOperand(num) {
    if (str[0] === '0' && num === '0') {
      return;
    } else if (str[0] === '0' && num !== '0' && str.length === 1){
      str = '';
      str += num.toString();
      display = Number(str);
      $('#display').val(str);
    } else {
      str += num.toString();
      display = Number(str);
      $('#display').val(str);
    }
  }

  // Add minus sign
  function addMinus(cb) {
    signState = '-';
    str = signState + str;
    cb();
  }

  // Remove minus sign
  function removeMinus(cb) {
    signState = '';
    str = str.replace('-', '');
    cb();
  }

  // Toggle sign
  function toggleSign() {
    var arr = [];

    if (signState === '' && display > 0) {
      addMinus(function () {
        $('#display').val(str);
      });
    } else {
      removeMinus(function () {
        $('#display').val(str);
      });
    }
  }

  // Listening for 'click' events.
  $('#calculator').on('click', 'a', function (event) {
    event.preventDefault();
    if ($(this).data('op') === 'ac') {
      initialize();
    } else if ($(this).data('key') !== undefined) {
      buildOperand($(this).data('key'));
      console.log($(this).data('key'), $(this).data('op'));
    } else if ($(this).data('op') === 'sign') {
      console.log($(this).data('key'), $(this).data('op'));
      toggleSign();
    }

    console.log(str);
  });
});
