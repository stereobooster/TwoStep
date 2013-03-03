var dirListing = fs.readdirSync(__dirname),
    dirResults = dirListing.map(function (filename) {
      return fs.readFileSync(__dirname + "/" + filename, 'utf8');
    });

describe("TwoStep groups", function(){
  it('ok', function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function readDir() {
        fulfill('one');
        fs.readdir(__dirname, this.slot());
      },
      function readFiles(err, results) {
        fulfill('two');
        if (err) done(err);
        // Create a new group
        dirListing.should.be.deep.equal(results);
        var group = this.makeGroup();
        results.forEach(function (filename) {
          fs.readFile(__dirname + "/" + filename, 'utf8', group.slot());
        });
      },
      function showAll(err , files) {
        if (err) done(err);
        dirResults.should.be.deep.equal(files);
        fulfill.callCount.should.be.equal(2);
        fulfill.should.be.calledWith("one");
        fulfill.should.be.calledWith("two");
        done();
      }
    );    
  })

  it.skip("When the group is empty, it should fire with an empty array", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function start() {
        var group = this.makeGroup();
        fulfill('four');
      },
      function readFiles(err, results) {
        if (err) done(err);
        fulfill.callCount.should.be.equal(1);
        fulfill.should.be.calledWith("four");
        results.should.be.deep.equal([]);
        done();
      }
    );
  })

  it.skip("Test lock functionality with N sized groups", function(done){
// Step(
//     function() {
//         return 1;
//     },
//     function makeGroup(err, num) {
//         if(err) throw err;
//         fulfill("test3: " + num);
//         var group = this.group();
        
//         setTimeout((function(callback) { return function() { callback(null, 1); } })(group()), 100);
//         group()(null, 2);
//         setTimeout((function(callback) { return function() { callback(null, 3); } })(group()), 0);
//     },
//     function groupResults(err, results) {
//         if(err) throw err;
//         fulfill("test3: " + results);
//         return 2
//     },
//     function terminate(err, num) {
//         if(err) throw err;
//         fulfill("test3: " + num);
//     }
// );
  })

  it.skip("Test lock functionality with zero sized groups", function(done){
// Step(
//     function() {
//         return 1;
//     },
//     function makeGroup(err, num) {
//         if(err) throw err;
//         fulfill("test4: " + num);
//         this.group();
//     },
//     function groupResults(err, results) {
//         if(err) throw err;
//         if(results.length === 0) { fulfill("test4: empty array"); }
//         fulfill('test4: group of zero terminated');
//         return 2
//     },
//     function terminate(err, num) {
//         if(err) throw err;
//         fulfill("test4: " + num);
//     }
// );
  })

  it.skip("Test lock functionality with groups which return immediately", function(done){
// setTimeout(function() {
// Step(
//   function parallelCalls() {
//     var group = this.group();
//     var p1 = group(), p2 = group();
//     p1(null, 1);
//     p2(null, 2);
//   },
//   function parallelResults(err, results) {
//     if(err) throw err;
//     fulfill("test5: " + results);
//     return 666;
//   },
//   function terminate1(err, num) {
//     if(err) throw err;
//     fulfill("test5 t1: " + num);
//     var next = this;
//     setTimeout(function() { next(null, 333); }, 50);
//   },
//   function terminate2(err, num) {
//     if(err) throw err;
//     fulfill("test5 t2: " + num);
//     this();
//   }
// );
// }, 1000);
  })
});

