import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {

  extensionId: '',

  listenToPort: function(port) {
    port.addEventListener('message', function(event) {
      chrome.extension.sendMessage(this.get('extensionId'), event.data);
    }.bind(this));

    function onMessageListener(message) {
      if (message.from === 'devtools') {
        port.postMessage(message);
      }
    }
    chrome.extension.onMessageExternal.addListener(onMessageListener);

    port.start();
  },

  init: function(emberInspectorId) {
    this.set('extensionId', emberInspectorId);

    window.addEventListener('message', function(event) {
      if (event.data === 'debugger-client') {
        var port = event.ports[0];
        this.listenToPort(port);

        //register this extension with the inspector
        var manifestData = chrome.runtime.getManifest();
        Ember.run.once(this, function() {
          chrome.extension.sendMessage(this.get('extensionId'), {
            from: 'external',
            type: 'registerExtension',
            extension: {
              id: chrome.runtime.id,
              name: manifestData.name,
              version: manifestData.version
            }
          });
        });
      } else if (event.data && event.data.type) {
        chrome.extension.sendMessage(this.get('extensionId'), event.data);
      }
    }.bind(this));



    // let ember-debug know that content script has executed
    document.documentElement.dataset.emberExtension = 1;


    // clear a possible previous Ember icon
    chrome.extension.sendMessage(this.get('extensionId'), { type: 'resetEmberIcon' });

    // inject JS into the page to check for an app on domready
    var libraries = window.Ember && window.Ember.libraries;
    if (libraries) {
      // Ember has changed where the array of libraries is located.
      // In older versions, `Ember.libraries` was the array itself,
      // but now it's found under _registry.
      if (libraries._registry) {
        libraries = libraries._registry;
      }

      var versions = Array.prototype.slice.call(libraries, 0);
      window.setTimeout(function() {
        window.postMessage({
          type: 'emberVersion',
          versions: versions
        }, '*');
      }, 500);
    }


    var iframes = document.getElementsByTagName('iframe');
    var urls = [];
    for (var i = 0, l = iframes.length; i < l; i ++) {
      urls.push(iframes[i].src);
    }

    // FIXME
    Ember.run.later(this, function() {
      chrome.extension.sendMessage(this.get('extensionId'), {type: 'iframes', urls: urls});
    }, 500);

  }

});
