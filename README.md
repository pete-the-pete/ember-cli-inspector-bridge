# Ember-cli-inspector-bridge

An ember addon that allows Chrome extensions to communication with the Ember Inspector.

***Note***: 
* At this time, ember-cli-inspector-bridge is for ***CHROME*** only.
* This is dependent on a pull request for ember-inspector.  In the meantime, [this fork](https://github.com/pete-the-pete/ember-inspector), can be used
but is pinned to 717e25ce1f05e418c1d582ed6a479277b8fde807 of ember-inspector.

## Installation

Install the ember-inspector:
* [Chrome Web Store](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi) - or - [github](https://github.com/emberjs/ember-inspector)

Install the addon
```
ember install:addon ember-cli-inspector-bridge
```

## Configuration

You'll need to add chrome-inspector's extension id to your environment.js:

```javascript
if (environment === 'development') {
    ENV.inspectorID = '{{inspector id}}';
    ...
}
```

## Explanation

The inspector-bridge sets up the message passing between your extension and the ember-inspector.  This is done by placing copy-pasted the source from two ember inspector scripts; content-scripts and in-page-script.

The content-script allows the ember-inspector to get information about your app once the devtools tab is open. The in-page-script is used toggle the tomster icon in the url bar.

When the ember inspector is used on a standard webpage its content-script is injected into the page, and then downloads the in-page-script to update the icon.  Chrome doesn't allow extensions to inject a content-script into other extensions.  The ember-cli-inspector-bridge places the content-script and in-page-script into your own extension so that it can post and receive messages, and update the icon.
