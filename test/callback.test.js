var selfText = fs.readFileSync(__filename, "utf8");

describe("TwoStep passing async results and sync results to the next layer", function(){
  it("ok", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function readSelf() {
        fulfill("one");
        fs.readFile(__filename, "utf8", this.slot());
      },
      function capitalize(err, text) {
        fulfill("two");
        if (err) done(err);
        selfText.should.be.equal(text);
        this.pass(text.toUpperCase());
      },
      function showIt(err, newText) {
        if (err) done(err);
        fulfill.callCount.should.be.equal(2);
        fulfill.should.be.calledWith("one");
        fulfill.should.be.calledWith("two");
        selfText.toUpperCase().should.be.equal(newText);
        done();
      }
    );
  });
});
