// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {

      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);


      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    console.log($(this).val());
   if ($(this).val()) {

var $thisVal = $(this).val();
var $article = $('article');
$article.not('[data-author = "' + $thisVal + '"]').hide();
//
//
//
    } else {

    }
         $('#category-filter').val('');
  });
 };

articleView.handleCategoryFilter = function() {
    $('#category-filter').on('change', function() {

if ($(this).val()) {
  var $thisVal = $(this).val();
  var $article = $('article');
  $article.not('[data-category = "' + $thisVal + '"]').hide();
} else {

    }
  });
};

articleView.handleMainNav = function() {

  $('.main-nav').on('click', 'li', function() {
    var $tabContent = $('.tab-content');
    $tabContent.hide();

    var $dataAttribute = $(this).data('content');
    console.log($dataAttribute);
    var $divId = '#' + $dataAttribute ;
    console.log($divId);
    $($divId).show();
  });

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.


$('article').on('click', '.read-on', function(event) {
console.log('hey');
  event.preventDefault();
  var $displayAll = $('.article-body *:nth-of-type(n+2)');
  console.log($(this).prev());
  $(this).prev().children().show();
  $(this).hide();
  })

  console.log(this);

};

$(document).ready(function() {
  articleView.populateFilters();
  articleView.handleAuthorFilter();
  articleView.handleCategoryFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
});
