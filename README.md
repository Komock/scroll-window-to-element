# scroll-window-to-element

Simple ES6 Class for scroll window to DOM element with smooth animation

## Usage

```js
import scrollToElement from './scroll-to-element.js';
let scroll = new scrollToElement({
		anchors: '.nav a'
	});
scroll.init();
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| anchors | string (html) | 'a[href*="#"]' | Selector for anchor (links) |
| duration | number | 350 | Animation duration |
| easing | string | 'easeInOut' | Animation easing. Available: linear, quad, easeInOut |