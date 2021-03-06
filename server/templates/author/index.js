module.exports = function(html, templates, conf, bind, Map, content) {

  var map = Map();
  map['class']('orgname').to('orgname');
  map['class']('contributors-listing').to('contributors_listing');

  return function() {


    var authors = Object.keys(content.index.byAuthor).map(function(authorName) {
      return content.index.byAuthor[authorName];
    }).sort(function(a, b) {
      return b.articles.length - a.articles.length;
    }).map(function(author, idx) {
      return templates('/author/box.html').call(this, author, idx);
    }).join('');

    var data = {
      orgname: conf.orgname,
      contributors_listing: authors
    };

    return templates('/layout.html').call(this, {
      main: bind(html, data, map),
      title: 'Authors'
    });
  };
};