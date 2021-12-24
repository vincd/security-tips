---
title: "Chrome"
date: 2021-12-24T18:02:52+01:00
tags:
 - browser
 - chrome
 - javascript
 - debug
---

## Chrome console

Here is two lines to help find vulnerable postMessage calls.

### Break on weak postMessage

```javascript
debug(postMessage, "arguments[1] == '*'")
```

### Log post message events

```javascript
monitorEvents(windows, 'message')
```

## Download manager

Go to `about://download-internals` to download a file manually.


## Builtin file explorer

If you have a chromium based explorer, go to `file:///C:/` to list the content
of the `C:`.
