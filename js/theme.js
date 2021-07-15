(function() {
  // from: https://unpkg.com/docsify@4.9.4/lib/docsify.js
  var $ = document,
      body = $.body,
      isMobile = body.clientWidth <= 600;

  function isFn(obj) {
    return typeof obj === 'function'
  }

  function on(el, type, handler) {
    isFn(type) ?
      window.addEventListener(el, type) :
      el.addEventListener(type, handler);
  }

  function delegate(criteria, listener) {
    return function(ev) {
      var el = ev.target;
      do {
        if (!criteria(el)) continue;
        ev.delegateTarget = el;
        listener.apply(this, arguments);
        return;
      } while((el = el.parentNode));
    };
  }

  function ready(callback) {
    var state = document.readyState;

    if (state === 'complete' || state === 'interactive') {
      return setTimeout(callback, 0)
    }

    on(document, 'DOMContentLoaded', callback);
  }

  function btn(el) {
    var toggle = function (_) { return body.classList.toggle('close'); };

    el = $.querySelector(el);
    if (el == null) {
      return
    }
    on(el, 'click', function (e) {
      e.stopPropagation();
      toggle();
    });

    isMobile &&
      on(
        body,
        'click',
        function (_) { return body.classList.contains('close') && toggle(); }
      );
  }

  // https://stackoverflow.com/a/30810322/7595472
  function fallbackCopyTextToClipboard(text, onSuccess, onError) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      setTimeout(function () {
        if (successful) {
          onSuccess();
        } else {
          onError();
        }
      }, 1);
    } catch (err) {
      setTimeout(function () {
        onError(err);
      }, 1);
    }

    document.body.removeChild(textArea);
  }

  function copyTextToClipboard(text, onSuccess, onError) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(onSuccess, function () {
        fallbackCopyTextToClipboard(text, onSuccess, onError);
      });
    } else {
      fallbackCopyTextToClipboard(text, onSuccess, onError);
    }
  }

  ready(function (_) {
    btn('button.sidebar-toggle');

    const clipboardBtnFilter = function(el) { return el.classList && el.classList.contains('clipboard-btn'); };
    const clipboardBtnHandler = function(event) {
      var clipboardButton = event.delegateTarget;
      copyTextToClipboard(clipboardButton.value, function() {
        clipboardButton.innerHTML = 'Copied!';
        clipboardButton.style = 'border: 2px solid green';
        setTimeout(function() {
          clipboardButton.innerHTML = 'Copy';
          clipboardButton.style = '';
        }, 2000);
      }, function() {
        clipboardButton.innerHTML = 'Error :(';
        clipboardButton.style = 'border: 2px solid red';
        setTimeout(function() {
          clipboardButton.innerHTML = 'Copy';
          clipboardButton.style = '';
        }, 2000);
      });
    }

    on($.querySelector('#main'), 'click', delegate(clipboardBtnFilter, clipboardBtnHandler));
  });
})();
