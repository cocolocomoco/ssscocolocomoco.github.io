
// allow clicking on work overlay items
(function(window, $) {

  $(function() {
    $('.work').on('click', function() {
      $(this).toggleClass('hover');
    });
  });

})(window, jQuery); // eslint-disable-line no-undef
