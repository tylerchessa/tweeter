/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


let $tweetError1 = `
<div class="error1">You must enter at least 1 character to tweet with Tweeter</div>
`
let $tweetError2 = `
<div class="error2">You must enter less than 140 characters to tweet with Tweeter</div>
`
const escape = function (str) {
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
`
return markup
};


const renderTweets = (tweets) => {
  for (let tweet of tweets) {
    createTweetElement(tweet)
    const $tweet = createTweetElement(tweet);
    $('#tweets').prepend($tweet);
  }
};


// renderTweets(data);

const loadTweets = () => {
  $.ajax('/tweets', { method: 'GET' })
  .then(function (tweets) {
    $('#tweets').empty();
    renderTweets(tweets);
  });
}
loadTweets();


$("#tweet-form").submit(function(event) {
  event.preventDefault();
  const tweet = $('#tweet-text').val()
  if (!tweet) {
    $('.error1').slideDown(1000)
    return;
  }
  if (tweet.length > 140) {
    $('.error2').slideDown(1000)
    return;
  }
  $('.error1').slideUp(1000)
  $('.error2').slideUp(1000)
$.post( "/tweets", $(this).serialize() )
.then(function () {
  loadTweets();
  $('#tweet-text').val('')
  $('#tweet-text').parent().find('.counter').text(140);
})
});

$('.navDiv').on('click', function() {
  $('#tweet-form').slideToggle(1000);
  $('#tweet-text').focus()
});

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
  $('#tweet-text').focus()
});

});
