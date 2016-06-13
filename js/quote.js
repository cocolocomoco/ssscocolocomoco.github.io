
// allow focusing on different quote elements
(function(window, $) {

  // swap length - 5 seconds
  var duration = 5e3;

  // simple ui-state value to determine if the user is interacting with the ui
  var interrupted = false;

  function focus($elem) {

    // move triangle
    $elem.siblings().removeClass('focused').end().addClass('focused');

    // find index within parent
    var idx = $elem.index();

    // change the `left` on the item to animate it
    $('.quotes .inner').css({ left: (idx * -100) + '%' });
  }

  // every 3.5s, change which quote is shown
  function swap() {

    // if the user has interacted with this, bolt
    if (interrupted) return;

    var $focused = $('.face.focused');

    // find the next element to focus on
    var $next = $focused.next();
    if (!$next.length) $next = $focused.parent().children('.face:first-child');

    focus($next);
    setTimeout(swap, duration);
  }

  $(function() {

    // handle clicking on a face to swap
    $('.face').on('click', function() {
      // interrupted = true;
      focus($(this));
    });

    // kickoff sliding
    setTimeout(swap, duration);
  });

})(window, jQuery); // eslint-disable-line no-undef
