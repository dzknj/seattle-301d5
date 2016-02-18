(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };
/*
  COMMENT:This method is first ran by routes when the endpoint /article/:id is hit.
  It takes context (ctx) and next as parameters. Ctx is the object that is assigned
  the properties we are working with and stored for later use. And Next is the callback
  function representing the next funtion. Article.findWhere takes the ID
  which is after /article/ and inputs it into the findWhere function.
  It than searches through the context object for where ctx.params.id matches the ID.
  It than runs articlData as a callback. articleData sets ctx.articles equal to the
  article returned by the fidWhere search, and than the next() function is called.
*/
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };
/*
  COMMENT:This method is first ran by routes when the endpoint /author/:authorName is hit.
  It takes context (ctx) and next as parameters. Ctx is the object that is assigned
  the properties we are working with and stored for later use. And Next is the callback
  function representing the next funtion. Article.findWhere takes the author
  which is after /author/ and inputs it into the findWhere function.
  It than searches through the context object for where ctx.params.authorName matches the author.
  The .replace changes the + in the data to a space for searching purposes.
  It than runs authorData as a callback. authorData sets ctx.articles equal to the
  articles returned by the findWhere search, and than the next() function is called.
*/
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

/*
  COMMENT:This method is first ran by routes when the endpoint /category/:categoryName is hit.
  It takes context (ctx) and next as parameters. Ctx is the object that is assigned
  the properties we are working with and stored for later use. And Next is the callback
  function representing the next funtion. Article.findWhere takes the category
  which is after /category/ and inputs it into the findWhere function.
  It than searches through the context object for where ctx.params.categoryName matches the category.
  It than runs categoryData as a callback. categoryData sets ctx.articles equal to the
  articles returned by the findWhere search, and than the next() function is called.
*/
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

/*
  COMMENT:This method is first ran by routes when the endpoint '/' is hit.
  It takes context (ctx) and next as parameters. Ctx is the object that is assigned
  the properties we are working with and stored for later use. And Next is the callback
  function representing the next funtion. If Articles.all has a length of greater than zero,
  ctx.articles is set to the Article.all array values and the next() callback is run.
  If the above is not true, then the Article.fetchAll function is run with articleData as the
  next callback. Article.fetchAll grabs all the articles and puts them on the page. 
*/  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
