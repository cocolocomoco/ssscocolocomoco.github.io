
// when clicking on a team member info button, add an overlay, showing the bio
(function(window, $) {

  $(function() {
    $('.circle a').on('click', function(e) {
      e.preventDefault();

      // remove any other existing overlays
      $('.overlay').remove();

      var $member = $(this).closest('.member');

      // find the scrollTop of the member we clicked on
      var position = $member.position();

      // add an overlay with employee data
      var $overlay = $('<div class="overlay col-md-6 center"></div>');
      var close = '<div class="icon icon-close"></div>';
      var html = close + $member.html();

      // append to the overlay all of the markup from the member
      $overlay.append($(html));

      // if left is > 3/4s of the .row.meet-the-team wrapper
      var max = parseInt($member.parent().css('width'), 10);
      var left = position.left;

      // then find the left of the immediate sibling
      if (left >= (max * 0.75)) {
        left = $member.prev().position().left;
      }

      // apply top left style
      $overlay.css({ top: position.top, left: left });

      $('.row.meet-the-team').append($overlay);
    });

    // hide overlay
    $(document).on('click', '.meet-the-team .icon-close', function() {
      $('.overlay').remove();
    });

  });

})(window, jQuery); // eslint-disable-line no-undef
