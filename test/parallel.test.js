var selfText = fs.readFileSync(__filename, 'utf8'),
    etcText = fs.readFileSync('/etc/passwd', 'utf8');

describe("TwoTwoStep parallel", function(){
  it.skip('ok', function(done){
    var fulfill = sinon.spy();
    TwoStep(
      // Loads two files in parallel
      function loadStuff() {
        fulfill('one');
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
  })

  it.skip('Test lock functionality with N parallel calls', function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function() {
        this.pass(1);
      },
      function makeParallelCalls(err, num) {
        if (err) done(err);
        fulfill("test2: " + num);
        
        setTimeout((function(callback) { return function() { callback(null, 1); } })(this.slot()), 100);
        this.slot()(null, 2);
        setTimeout((function(callback) { return function() { callback(null, 3); } })(this.slot()), 0);
      },
      function parallelResults(err, one, two, three) {
        if (err) done(err);
        fulfill("test2: " + [one, two, three].join(''));
        return 2
      },
      function terminate(err, num) {
        if (err) done(err);
        fulfill("test2: " + num);
      }
    )
  });

  it.skip('Test lock functionality with parallel calls with delay', function(done){
    TwoStep(
      function parallelCalls() {
        var p1 = this.slot(), p2 = this.slot();
        process.nextTick(function() { p1(null, 1); });
        process.nextTick(function() { p2(null, 2); });
      },
      function parallelResults(err, one, two) {
        if (err) done(err);
        fulfill("test3: " + [one, two]);
        return 666;
      },
      function terminate1(err, num) {
        if (err) done(err);
        fulfill("test3 t1: " + num);
        var next = this;
        setTimeout(function() { next(null, 333); }, 50);
      },
      function terminate2(err, num) {
        if (err) done(err);
        fulfill("test3 t2: " + num);
        this.slot();
      }
    );
  })

  it.skip('Test lock functionality with parallel calls which return immediately', function(done){
    TwoStep(
      function parallelCalls() {
        var p1 = this.slot(), p2 = this.slot();
        p1(null, 1);
        p2(null, 2);
      },
      function parallelResults(err, one, two) {
        if (err) done(err);
        fulfill("test4: " + [one, two].join(' '));
        return 666;
      },
      function terminate1(err, num) {
        if (err) done(err);
        fulfill("test4 t1: " + num);
        var next = this.slot;
        setTimeout(function() { next(null, 333); }, 50);
      },
      function terminate2(err, num) {
        if (err) done(err);
        fulfill("test4 t2: " + num);
        this.slot();
      }
    );
  })
})