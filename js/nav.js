/* eslint no-var:0 */

// simple dynamic topnav placement
(function(window, $) {

  var menuShown = false;
  var windowHeight = 0;
  var buffer = 10;
  var $navigation;

  function findWindowHeight() {
    windowHeight = $('.hero').height();
  }

  function findNavigation() {
    if (!$navigation) $navigation = $('.top-nav');
  }

  function handleMenu() {
    var top = $(this).scrollTop();
    var over = (top - buffer) >= windowHeight;

    if (over && !menuShown) {
      findNavigation();
      $navigation.addClass('fixed').removeClass('fadeOut');
      menuShown = true;
    } else if (!over && menuShown) {
      findNavigation();
      $navigation.addClass('fadeOut');
      menuShown = false;
      setTimeout(function() {
        if (menuShown) return;
        $navigation.removeClass('fadeOut fixed');
      }, 490);
    }
  }

  /* global $ */
  $(function iifeNav() {
    // find window height on ready
    findWindowHeight();
    handleMenu();
    findNavigation();
  });

  // discover window height on resize
  $(window).resize(findWindowHeight);

  // handle menu on scroll
  $(window).scroll(handleMenu);

})(window, jQuery); // eslint-disable-line no-undef

// handle opening of menu
(function() {

  $(function() {
    $('.menu-button.open').on('click', function() {
      $('.menu, .top-nav').toggleClass('open');
    });
  });

})(window, jQuery); // eslint-disable-line no-undef
