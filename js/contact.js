
// ajax submission of the form
(function(window, $) {

  $(function() {
    $('form').on('submit', function(e) {
      e.preventDefault();

      var data = $(this).serialize();
      var url = window.location.href;

      $.ajax({
        method: 'post',
        url: url,
        data: data,
        success: function() {
          $('.form-wrap').css({ opacity: 0 });
          setTimeout(function() {
            $('.form-wrap').css({ display: 'none' });
            $('.thanks').css({ display: 'block', opacity: 0 });
            setTimeout(function() {
              $('.thanks').addClass('visible').css({ opacity: 1 });
            }, 10);
          }, 250);
        }
      });

      return false;
    });
  });

})(window, jQuery); // eslint-disable-line no-undef
