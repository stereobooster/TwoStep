var exception = new Error("Catch me!");

describe("TwoStep handles errors", function(){
  it("ok", function(done){
    var fulfill = sinon.spy();
    TwoStep(
      function () {
        fulfill("one");
        var slot = this.slot();
        setTimeout(function () {
          fulfill("timeout");
          slot(exception);
        }, 0);
      },
      function (err) {
        fulfill("two");
        exception.should.be.deep.equal(err);
        throw exception;
      },
      function (err) {
        exception.should.be.deep.equal(err);
        fulfill.callCount.should.be.equal(3);
        fulfill.should.be.calledWith("timeout");
        fulfill.should.be.calledWith("one");
        fulfill.should.be.calledWith("two");
        done();
      }
    );
  })
})
