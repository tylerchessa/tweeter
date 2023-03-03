/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//function to prevent xss
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$(document).ready(function() {
  const createTweetElement = (eachTweet) => {
    const userT = eachTweet.user;
    let $safeHTML = escape(eachTweet.content.text);
    let markup = `
  <article class="tweet">
  <header>
    <div class="tweet-profile"><img src=${userT.avatars}></img> ${userT.name}</div>
    <div class="tweet-username">${userT.handle}</div>
   </header>
  <div class="tweet-text">${$safeHTML}</div>
  <footer>
    <div class="tweet-date">${timeago.format(eachTweet.created_at)}</div>
    <div class="tweet-actions">
      <i class="fa-regular fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-regular fa-heart"></i>
    </div>
  </footer>
</article>
`;
    return markup;
  };

  //loops through all tweets and adds it to the HTML
  const renderTweets = (tweets) => {
    for (let tweet of tweets) {
      createTweetElement(tweet);
      const $tweet = createTweetElement(tweet);
      $('#tweets').prepend($tweet);
    }
  };


  //makes a get request using AJAX (without refreshing the page)
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        $('#tweets').empty();
        renderTweets(tweets);
      });
  };
  loadTweets();

  //on submit will check to see if the user has atleast 1 character and less than 141 characters
  //errors will show if criteria is not met and will not submit
  $("#tweet-form").submit(function(event) {
    event.preventDefault();
    const tweet = $('#tweet-text').val();
    if (!tweet) {
      $('.error1').slideDown(1000);
      return false;
    }
    if (tweet.length > 140) {
      $('.error2').slideDown(1000);
      return false;
    }
    $('.error1').slideUp(1000);
    $('.error2').slideUp(1000);
    $.post("/tweets", $(this).serialize())
      .then(function() {
        loadTweets();
        $('#tweet-text').val('');
        $('#tweet-text').parent().find('.counter').text(140);
      });
  });

  //if user fixes error, the message will dissapear
  $("textarea").on("input", function() {
    const tweet = $('#tweet-text').val();
    if (tweet) {
      $('.error1').slideUp(1000);
    }
    if (tweet.length <= 140) {
      $('.error2').slideUp(1000);
    }
  });

  //upton clicking 'write a tweet' the text area will become in focus
  $('.navDiv').on('click', function() {
    $('#tweet-form').slideToggle(1000);
    $('#tweet-text').focus();
  });

  //scroll to top button (stretch)
  let $topBotton = $('#backToTop');
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 500) {
      $topBotton.fadeIn();
    } else {
      $topBotton.fadeOut();
    }
  });
  $topBotton.on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, '500');
    $('#tweet-form').slideDown(1000);
    $('#tweet-text').focus();
  });

  //will cause the nav background to be transparent for mobile devices ( < 1000 width ) 
  //nav background will become opaque once the header background leaves the screen
  let $backgroundNav = $('.nav');
  $(window).on('scroll', function() {
    if ($(window).width() < 1000) {
      if ($(window).scrollTop() > 570) {
        $backgroundNav.css("background-color", "#4056A1");
      } else {
        $backgroundNav.css("background-color", "initial");
      }
    } else {
      $backgroundNav.css("background-color", '#4056A1');
    }
  });

  //if nav background is transparent and window is resised from mobile to desktop. nav background becomes opaque. vice versa
  $(window).resize(function() {
    if ($(window).width() < 1000 && $(window).scrollTop() <= 570) {
      $backgroundNav.css("background-color", "initial");
    } else {
      $backgroundNav.css("background-color", "#4056A1");
    }
  });
  
});
