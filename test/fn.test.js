var myfn = TwoStep.fn(
  function (name) {
    fs.readFile(name, "utf8", this.slot());
  },
  function capitalize(err, text) {
    if (err) throw err;
    return text.toUpperCase();
  }
);

var selfText = fs.readFileSync(__filename, "utf8");

describe("TwoStep can create function to be executed later", function(){
  it("ok",function(done){
    myfn(__filename, function (err, result) {
      if (err) done(err);
      selfText.toUpperCase(),should.equal(result);
      done();
    });    
  })
})

