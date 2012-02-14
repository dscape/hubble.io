
var fs = require('fs');
var Plates = require('plates');
var marked = require('marked');
var assets = module.exports;

//
// each asset contains two members. One is a `composer` function with special 
// instructions on what to do with the other property, the raw html value.
//
assets['article.html'] = {
  raw: fs.readFileSync('./public/assets/article.html').toString(),
  compose: function(repo) {

    var html = this.raw;
    var output = '';

    if (repo.markup) {
      var data = {
        "orgname": 'Orgname', // conf['orgname']
        "title": repo.meta.title || repo.github.title,
        "main": marked(repo.markup)
      };
    }
    
    return repo.composed = Plates.bind(html, data);
  }
};

assets['contributors.html'] = {
  raw: fs.readFileSync('./public/assets/contributers.html').toString(),
  compose: function(repos) {
    var output = '';
    return output;
  }
};

assets['listing.html'] = {
  raw: fs.readFileSync('./public/assets/listing.html').toString(),
  compose: function(repos) {

    var html = this.raw;


    var map = new Plates.Map();

    map.class('description').to('description');
    //m.class('repo').to
    map.class('fork').to('fork');
    map.class('like').to('like');
    map.class('created').to('created');
    map.class('updated').to('updated');
    map.class('name').to('name').as('href');
    map.class('title').to('title');

    var data = {};
    var output = '';

    Object.keys(repos).forEach(function(name, index) {
      var repo = repos[name];

      if (repo.meta && repo.github) {

        data = {
          "description": repo.meta.description || repo.github.description,
          "fork": repo.github.forks,
          "like": repo.github.watchers,
          "created": repo.github.created_at,
          "updated": repo.github.updated_at,
          "name": '/article/' + repo.github.name,
          "title": repo.meta.title || repo.github.title
        };

        output += Plates.bind(html, data, map);
      }
          
    });

    return output;
  }
};

assets['index.html'] = {
  raw: fs.readFileSync('./public/assets/index.html').toString(),
  compose: function(repos) {

    //
    // this comp function takes the entire repos because the index
    // should be built considering all of the repos in the org.
    //
    var html = this.raw;
    var listing = assets['listing.html'];

    var data = {
      "orgname": 'Orgname', // conf['orgname']
      "title": 'Tagline', // conf['tagline']
      "articles": listing.compose(repos),
      //"contributors": assets['contributors.html'].compose(json)
    };
    
    return repos['repository-index'].composed = Plates.bind(html, data);

  }
};
