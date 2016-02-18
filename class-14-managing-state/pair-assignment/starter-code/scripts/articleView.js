(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: Populate Filters has two variables declared at the beginning: options and template.

  // options is undefined at the beginning and template is = to a template found by handlebars compiling the text at
  // the element "#option-template".
  // Article.allAuthors is run and the result is mapped by an anonymous function.
  // Article.allAuthors runs a function against each value of the Article.all array
  // and returns an array filled with the values of the author of each article.
  // It then cycles through that array with .reduce and for each element in the array,
  // it checks whether that element exists in a new array we are making.
  // If it doesn't exist in the new array it is pushed to the new array. If it does already exist,
  // it is ignored because the index is greater than -1.
  // This way we have filtered out all duplicates.
  // The returned array is than mapped by an anonymous function. This function returns an array filled with objects that have been
  // handlebars.compiled. The objects each have a val property = to the name of the author passed in by the parameter.
  // Each object's val property will be different from each other and will be = to one of the author names in the array created earlier.
  // If the option element inside #author-filter only has "filter by authors" as an option, then append to author-flter all of
  // the available options from var options.
  // Article.allCategories does a sql search for distinct categories. The anonymous callback then takes this result of this search as a
  // parameter called rows. If the option element inside #category-filter only has "filter by categories" as an option, then it appends to category-flter all of
  // the available category options from the rows parameter.
  articleView.populateFilters = function() {
    var options,
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // COMMENT:
  // handleFilters attaches an event handler that only occurs once per element per event type. Change happens when the value is changed.
  // Select occurs when text is highlighted. Resource is set to be the value of the current elements id without -filter at the end.
  // The page function is then run at the endpoint specified. An example of this would be /author/bob. author would be the value of resource and
  // bob would be the value of $(this).val();
  // Whenever articleView index is called, than midway through articleView.handleFilters is called.
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      resource = this.id.replace('-filter', '');
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // COMMENT: It shows all articles and hides the about sibling.
    // It then removes all of the articles.
    // It then appends rendered articles from the array passed in through the parameter.
    // PopulateFilters is called and we explained this up above.
    // HandleFilters is then called and we explained this up above.
    // If there is more than one article run, hide all paragraph elements after the first one
    // ArticleView.index is run whenever articlesController.index is run.

  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    // COMMENT:
    // We explained this up above
    // handleFilters attaches an event handler that only occurs once per element per event type. Change happens when the value is changed.
    // Select occurs when text is highlighted. Resource is set to be the value of the current elements id without -filter at the end.
    // The page function is then run at the endpoint specified. An example of this would be /author/bob. author would be the value of resource and
    // bob would be the value of $(this).val();
    // Whenever articleView index is called, than midway through articleView.handleFilters is called.
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
