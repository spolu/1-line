const main = require("main");

exports.test_l43_server = function(test) {
  L43.build_signature("test@test.com", function() {
    test.assert(!err);    
  });
}

exports.test_test_run = function(test) {
  test.pass("Unit test running!");
};

exports.test_id = function(test) {
  test.assert(require("self").id.length > 0);
};

