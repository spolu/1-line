
var L1 = {};

L1.build_signature = function(email, cont_) {
  
  var ua = 'unknown';
  if(navigator && typeof navigator.userAgent === 'string') {
    if(navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
      ua = 'chrome';
    }
    else if(navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
      ua = 'safari';
    }
    else if(navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      ua = 'firefox';
    }
  }  
  
  var endpoint = 'https://1-line.org/signature';
  var args = '?email=' + encodeURIComponent(email) + 
    '&ua=' + encodeURIComponent(ua);

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
      if(data.ok) {
        cont_(null, data.html);
      }
      else {
        cont_(new Error(data.error));
      }
    }).fail(function() {
      cont_(new Error('Ajax Error'));
    });   
};

