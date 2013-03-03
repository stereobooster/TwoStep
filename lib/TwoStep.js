(function (m) {
  "use strict";

  // Module systems magic dance.

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = m;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return m;
    });
  } else {
    // Other environment (usually <script> tag)
    window.TwoStep = m;
  }
}(function () {
  "use strict";

  var slice = Array.prototype.slice;

  function Group(callback) {
    this.args = [null];
    this.left = 0;
    this.callback = callback;
    this.isDone = false;
  }

  Group.prototype.done = function done() {
    if (this.isDone) return;
    this.isDone = true;
    this.callback.apply(null, this.args);
  };

  Group.prototype.error = function error(err) {
    if (this.isDone) return;
    this.isDone = true;
    var callback = this.callback;
    callback(err);
  };

  // Simple utility for passing a sync value to the next step.
  Group.prototype.pass = function pass() {
    var values = slice.call(arguments);
    for (var i = 0, l = values.length; i < l; i++) {
      this.args.push(values[i]);
    }
  };

  // Register a slot in the next step and return a callback
  Group.prototype.slot = function slot() {
    var group = this;
    var index = group.args.length;
    group.args.length++;
    group.left++;
    return function (err, data) {
      if (err) return group.error(err);
      group.args[index] = data;
      if (--group.left === 0) group.done();
    };
  };

  // Creates a nested group where several callbacks go into a single array.
  Group.prototype.makeGroup = function makeGroup() {
    var group = this;
    var index = this.args.length;
    this.args.length++;
    group.left++;
    return new Group(function (err) {
      if (err) return group.error(err);
      var data = slice.call(arguments, 1);
      group.args[index] = data;
      if (--group.left === 0) group.done();
    });
  };

  // Expose just for fun and extensibility
  TwoStep.Group = Group;

  // Stepper function
  function exec(steps, args, callback) {
    var pos = 0;
    var next = function() {
      var step = steps[pos++];
      // no steps left
      if (!step) {
        // calling callback (if available) passing arguments from `next`
        if (callback) callback.apply(null, arguments);
        return;
      }
      // create default group
      var group = new Group(next);
      // executing step
      try {
        // expose group to step as this. So `slot`, `pass` and `makeGroup` available
        step.apply(group, arguments);
        // ensure group.done() is called
        // if none of group functions was called (so `left` counter is 0)
        if (group.left === 0) group.done();
      } catch (e) {
        group.error(e);
      }
    };
    next.apply(null, args);
  }

  // Execute steps immedietly
  function TwoStep() {
    exec(slice.call(arguments), []);
  }

  // Create a composite function with steps built-in
  TwoStep.fn = function () {
    var steps = slice.call(arguments);
    return function () {
      var args = slice.call(arguments);
      var callback = args.pop();
      exec(steps, args, callback);
    };
  };

  return TwoStep;
}()));