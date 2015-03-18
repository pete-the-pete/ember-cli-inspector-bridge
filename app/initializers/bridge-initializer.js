import Ember from 'ember';
import config from '../config/environment';

import ChromeExtensionBridge from 'ember-cli-inspector-bridge/ember-inspector-bridge';

export default {
  name: 'chrome-extension-bridge',
  initialize: function() {
    if(config.environment === 'development') {
      Ember.assert('You must specify the inspectorID (from chrome://extensions) for the Ember Inspector', (typeof config.inspectorID === 'string'));
      return new ChromeExtensionBridge(config.inspectorID);
    }
  }
};
