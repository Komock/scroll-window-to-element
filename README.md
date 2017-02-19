# scroll-window-to-element

Simple ES6 Class for scroll window to DOM element with smooth animation

Example: [komock.github.io/scroll-window-to-element/](https://komock.github.io/scroll-window-to-element/)

## Install
```sh
npm i --save-dev scroll-window-to-element
```
## Usage

```js
// Absolute path to module 'node_modules/scroll-window-to-element/lib/scroll-window-to-element.js'
import scrollToElement from 'scroll-window-to-element';
let scroller = new scrollToElement({
		anchors: 'nav a'
	});
scroller.init();
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| anchors | string (html) | 'a[href*="#"]' | Selector for anchor (links) |
| duration | number | 350 | Animation duration |
| offset | number | 0 | Scroll offset |
| easing | string | 'easeInOut' | Animation easing. Available: linear, easeInOut |

To link section you can use 'id' or 'data-section' attribute (without '#').

## Features

1. Fast and lightweight
2. No jQuery
3. ES6 ready