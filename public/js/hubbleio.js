;(function() {

  /*********************
   * AJAX!!!!
   *********************/

  function ajax(method, url, data, callback) {
    $.ajax({
      type: method,
      url: url,
      data: data,
      success: function(data) {
        try { data = JSON.parse(data); }
        catch(error) { }
        callback(null, data);
      },
      error: function(request, text, error) {
        var message = request.responseText || text || '';
        if (error && error.message) { message += '\n' + error.message; }
        callback(new Error(message));
      }
    });
  }

  function post(url, data, callback) {
    if (typeof data === 'function') {
      callback = data;
      data = undefined;
    }
    return ajax('POST', url, data, callback);
  }

  /*********************
   * Utility functions
   *********************/

  function waiting(elem) {

    var oldWidth = elem.css('width');
    var oldHeight = elem.css('height');

    elem.css('width', elem.width());
    elem.css('height', elem.height());
    elem.html('Wait...');

    return function(html) {
      elem.css('width', 'auto');
      elem.css('width', 'auto');
      elem.html(html);
    }

  }

  /*********************
   * Action buttons
   *********************/

  function actionButtonClickHandler(callback) {
    return function(ev) {
      ev.preventDefault();

      var button = $(this);
      var action = button.attr('data-action');
      if (! action) { return; }
      var previousContent = button.html();
      var done = waiting(button);

      post(action, function(err, result) {
        if (err) {
          alert(err.message);
          button.html(previousContent);
          return;
        }
        callback(result, done);
      });

    }
  }

  $('.like').click(actionButtonClickHandler(function(response, done) {
    done(response.watchers.toString() + ' watchers');
    ui.dialog('You\'re now watching this repo.').closable().show().hide(3000);
  }));


  $('.fork').click(actionButtonClickHandler(function(response, done) {
    done(response.forks.toString() + ' forks');
    ui.dialog('Forked repo', 'This repo has been successfully forked into your github account. ' + 
                             'Visit it <a href="' + response.url + '">here</a>.')
              .closable().show();
  }));


  /*********************
   * Menu animation
   *********************/

  $(function() {

    var menu = $('#menu');
    var moving = false;
    var hidden = false;
    var needsHiding = false;
    var needsShowing = false;

    function hide() {
      if (! moving && ! hidden) {
        moving = true;
        needsShowing = false;
        menu.animate({'left': "-=" + (menu.width() -20)}, 750, function() {
          moving = false;
          hidden = true;
          if (needsShowing) { show(); }
        });
      } else {
        needsHiding = true;
        needsShowing = false;
      }
    }

    function show() {
      if (! moving && hidden) {
        moving = true;
        needsHiding = false;
        menu.animate({'left': "0"}, 300, function() {
          moving = false;
          hidden = false;
          if (needsHiding) { hide(); }
        });
      } else {
        needsHiding = false;
        needsShowing = true;
      }
    }

    menu.hover(show, hide);

    hide();
    
  });

  /*********************
   * Discussions
   *********************/

  $('#discuss form').live('submit', function(ev) {
    console.log('submit');
    ev.preventDefault();
    var form = $(this);
    form.attr('disabled', 'disabled')
    post(form.attr('action'), form.serialize(), function(err) {
      console.log('back');
      form.attr('disabled', '');
      if (err) {
        alert(err.message);
        return;
      }
      document.location = '#discuss';
      document.location.reload();
    });
  });

  $('#discuss .reply').click(function(ev) {
    ev.preventDefault();
    var link = $(this);
    link.parent().load(link.attr('href'));
  });

}());