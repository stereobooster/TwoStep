var selfText = fs.readFileSync(__filename, "utf8"),
    etcText = fs.readFileSync("/etc/passwd", "utf8");

describe("TwoStep parallel", function(){
  it.skip("ok", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      // Loads two files in parallel
      function loadStuff() {
        fulfill("one");
        fs.readFile(__filename, this.slot());
        fs.readFile("/etc/passwd", this.slot());
      },
      // Show the result when done
      function showStuff(err, code, users) {
        if (err) done(err);
        selfText.should.be.equal(code);
        etcText.should.be.equal(users);
        done();
      }
    );
  });

  it("Test lock functionality with N parallel calls", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function() {
        this.pass(1);
      },
      function makeParallelCalls(err, num) {
        if (err) done(err);
        fulfill(num);
        var p1 = this.slot(), p2 = this.slot(), p3 = this.slot();
        setTimeout(function(callback) { p1(null, 1); }, 100);
        p2(null, 2);
        setTimeout(function(callback) { p3(null, 3); }, 0);
      },
      function parallelResults(err, one, two, three) {
        if (err) done(err);
        fulfill(one, two, three);
        this.pass(2);
      },
      function terminate(err, num) {
        if (err) done(err);
        num.should.equal(2);
        fulfill.callCount.should.be.equal(2);
        fulfill.should.be.calledWith(1);
        fulfill.should.be.calledWith(1,2,3);
        done();
      }
    );
  });

  it("Test lock functionality with parallel calls with delay", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function parallelCalls() {
        var p1 = this.slot(), p2 = this.slot();
        process.nextTick(function() { p1(null, 1); });
        process.nextTick(function() { p2(null, 2); });
      },
      function parallelResults(err, one, two) {
        if (err) done(err);
        fulfill(one, two);
        this.pass(666);
      },
      function terminate1(err, num) {
        if (err) done(err);
        fulfill(num);
        var next = this.slot();
        setTimeout(function() { next(null, 333); }, 50);
      },
      function terminate2(err, num) {
        if (err) done(err);
        this.slot();
        num.should.be.equal(333);
        fulfill.callCount.should.be.equal(2);
        fulfill.should.be.calledWith(1,2);
        fulfill.should.be.calledWith(666);
        done();
      }
    );
  });

  it("Test lock functionality with parallel calls which return immediately", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function parallelCalls() {
        var p1 = this.slot(), p2 = this.slot();
        p1(null, 1);
        p2(null, 2);
      },
      function parallelResults(err, one, two) {
        if (err) done(err);
        fulfill(one, two);
        this.pass(666);
      },
      function terminate1(err, num) {
        if (err) done(err);
        fulfill(num);
        var next = this.slot();
        setTimeout(function() { next(null, 333); }, 50);
      },
      function terminate2(err, num) {
        if (err) done(err);
        this.slot();
        num.should.be.equal(333);
        fulfill.callCount.should.be.equal(2);
        fulfill.should.be.calledWith(1,2);
        fulfill.should.be.calledWith(666);
        done();
      }
    );
  });
});
