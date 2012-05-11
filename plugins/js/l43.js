
var L43 = {};

L43.build_signature = function(email, cont_) {
  var endpoint = 'https://layer43.nodejitsu.com/signature';
  var args = '?email=' + encodeURIComponent(email);
  $.ajax({ url: endpoint + args })
    .done(function(data) {
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
