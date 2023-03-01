let counter = 0;

$(document).ready(function() {
  console.log('ready')
  $('#tweet-text').on("input", function () {
    const tweetLength = $(this).val().length
    const tweetLengthRemaining = (140 - tweetLength);
    $(this).parent().find('.counter').text(`${tweetLengthRemaining}`)
    if (tweetLengthRemaining < 0) {
      $(this).parent().find('.counter').addClass('redColor')
    }
    else if (tweetLengthRemaining >= 0) {
      $(this).parent().find('.counter').removeClass('redColor')
      // $(this).parent().find('.counter').css('color', '#545149');
    }
  });
});

// css('color', 'red');