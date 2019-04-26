---
layout: post
title: What's dangerous about dangerouslySetInnerHTML?
date:   2019-04-26 07:28:00 +0100
tags: programming frontend security react
---
I've been working on a side project in which I need to dynamically set the inner HTML of a react component based on some text. To do this, I need to use React's `dangerouslySetInnerHTML` attribute.

Interested in whether my usage of this attribute would be a cause for concern, I researched what risks are involved in using it. Why is it dangerous?

React's [documentation on this attribute](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) graciously let's us know that

> setting HTML from code is risky because it’s easy to inadvertently expose your users to a [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) (XSS) attack.

So what exactly does this mean? And when is it safe to use?

When `dangerouslySetInnerHTML` is set on a React element, some content is
injected into the DOM. It's that content the determines whether or not you're in
danger of exposing your users to XSS attacks.


This investigation also upholds the value of naming an attribute in this way. Including `dangerous` in the attribute name itself set me on a path of education which resulted in me being appropriately confident in the security of my users' machines.
