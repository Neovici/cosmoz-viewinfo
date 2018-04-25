cosmoz-viewinfo
=================

[![Build Status](https://travis-ci.org/Neovici/cosmoz-viewinfo.svg?branch=master)](https://travis-ci.org/Neovici/cosmoz-viewinfo)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/Neovici/cosmoz-viewinfo)

## &lt;cosmoz-viewinfo&gt;

**cosmoz-viewinfo** is a component to create a view with information about
available size and throttled resize events.

Example:

<!---
```
<custom-element-demo>
	<template>
		<script src="../webcomponentsjs/webcomponents-lite.js"></script>
		<link rel="import" href="cosmoz-viewinfo.html">
		<style>
			cosmoz-viewinfo {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
			}
		</style>
		<next-code-block></next-code-block>
	</template>
</custom-element-demo>
```
-->
```html
<dom-bind id="template">
	<template is="dom-bind">
		<cosmoz-viewinfo>
		</cosmoz-viewinfo>
	</template>
</dom-bind>
```