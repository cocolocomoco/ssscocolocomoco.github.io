
// allow clicking on video overlays and modifying it
(function(window, $) {

  $(function() {
    $('.video .play').on('click', function(e) {
      e.preventDefault();

      var $wrapper = $(this).closest('.video');
      var $parent = $wrapper.parent();

      // append the video to the wrapper
      var src = $wrapper.data('src');
      $parent.append('<iframe allowtransparency="true" src="' + src + '" />');

      // animate the info away
      $wrapper.addClass('fade-out');
      setTimeout(function() { $wrapper.remove(); }, 500);

    });
  });

})(window, jQuery); // eslint-disable-line no-undef
