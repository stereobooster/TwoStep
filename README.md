# TwoStep [![Build Status](https://travis-ci.org/stereobooster/TwoStep.png?branch=master)](https://travis-ci.org/stereobooster/TwoStep)

TwoStep implementation based on [gist](https://gist.github.com/creationix/1524578) by creationix.

> After seeing all the feedback and pondering this problem, I've come to the conclusion that step is doomed to either be too specific in goal to help most situations or become so flexible and complex and it's a system unto itself.

> If people want, I can push a step update using the code above. It's simple and better than what's currently in step. I don't want to expand the scope and compete with the async lib. I would never use it myself (as it is I don't really ever use step).

> My new experiment is at https://github.com/creationix/safereturn. The general idea is to not impose structure on the programmer, but rather help them write good callback based functions.

> — creationix

Never the less I believe this is example of one of the most elegant JavaScript code.

It shows how simple and obvious JavaScript APIs can be.

## more examples of good JavaScript APIs

### [mocha](https://github.com/visionmedia/mocha/blob/master/lib/runnable.js)
 - It detects if callback is synchronous or asynchronous based on number of arguments

### [underscorejs chain](http://underscorejs.org/#chain)
 - Chainable DSL

## TODO

 - make all tests pass
 - use `docco`
 - add timeouts as in `mocha runnable`
