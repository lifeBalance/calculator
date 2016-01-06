$(document).ready(function () {
  var display = 0;
  var str;

  // Set the display to '0'.
  // Comment following line to test 'AC' button
  // initialize();

  // Also triggered when the 'All Clear' is clicked.
  function initialize() {
    str = '0';
    $('#display').val(str);
  }

  $('#calculator').on('click', 'a', function (event) {
    if ($(this).data('op') === 'ac') {
      initialize();
    }
  });
});
