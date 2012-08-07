module.exports = function(html, templates, conf, bind, Map, content) {

  return function(categoryName, category) {

    var child = category;
    var parts = [];
    while (child) {
      parts.push(child.name);
      child = child.parent;
    }

    var data = {
      breadcrumb: templates('/shared/breadcrumb.html').call(this, parts),
      'level-articles': category.articles.map(function(article) {
        return templates('/article/short.html').call(this, article);
      }).join(''),
      title: categoryName
    };

    var main = bind(html, data);
    
    return templates('/layout.html').call(this, {
      main: main,
      title: categoryName
    });
  };
};