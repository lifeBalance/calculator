$(document).ready(function () {
  var display = 0;
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
      $('#display').val(str);
    } else {
      str += num.toString();
      $('#display').val(str);
    }
  }

  // Listening for 'click' events.
  $('#calculator').on('click', 'a', function (event) {
    if ($(this).data('op') === 'ac') {
      initialize();
    } else if ($(this).data('key') !== false) {
      buildOperand($(this).data('key'));
    }

    console.log(str);
  });
});
