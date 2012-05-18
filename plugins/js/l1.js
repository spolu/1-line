
var L1 = {};

L1.build_signature = function(email, cont_) {
  var endpoint = 'https://1-line.nodejitsu.com/signature';
  var args = '?email=' + encodeURIComponent(email);
  $.ajax({ url: endpoint + args })
    .done(function(data) {
      if(typeof data !== 'object') {
        try {
          data = JSON.parse(data);
        }
        catch(err) {
          cont_(err);
        }
      }
      //console.log(data);
      if(data.ok) {
        //console.log('OK');
        //console.log(data.html);
        cont_(null, data.html);
      }
      else {
        cont_(new Error(data.error));
      }
    }).fail(function() {
      cont_(new Error('Ajax Error'));
    });   
};

