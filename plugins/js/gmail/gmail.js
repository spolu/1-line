
setInterval(function() {  

  // avoid execution in iframes
  if (window.top !== window) {
    return;
  }

  /*
   * GMAIL
   *
   * Email structure follows the following patter:
   *
   * [<br clear="all">
   *  [<div>...</div>]*
   *  <br>]
   * <br>
   * [<br>
   *  <div class="gmail_quote"></div>]
   *
   */

  $("iframe").each(function(idx, el) {
    
    // FROM ADDRESS
    
    $(el).contents().find('select[name="from"] > option:selected').each(function() {
      if(L1.email !== $(this).val()) {
        L1.email = $(this).val();

        // REMOVE EXISTING
        
        $(el).contents().find('.editable').contents().find('body').each(function() {
          
          $(this).parent().find('body > span.l1-signature').remove();
          $(this).parent().find('.l1-format').remove();
          $(this).attr('l1-done', 'false');
          
          $(this).parent().find('body > span').each(function() {
            if(/1-line\.org/.test($(this).html()))
              $(this).remove();
          });
        });
      }
    });
    
    // SETTINGS FILTERING

    if(window.location.hash &&
       /^\#settings/.test(window.location.hash)) {
      return;
    }

    // INJECTION

    $(el).contents().find('.editable').contents().find('body').each(function() {      
      var body = $(this);

      if(body.parent().find('body > span.l1-signature').length === 0 &&
         body.attr('l1-done') !== 'true') {
        

        // PRELUDE
        
        var has_signature = false;
        var skip = false;

        if(body.parent().find('body > br[clear="all"]').length > 0) {
          has_signature = true;  
        }
        
        body.parent().find('body > span').each(function() {
          if(/1-line\.org/.test($(this).html()))
            skip = true;
        });        
        if(skip) {
          body.attr('l1-done', 'true');
          return;
        }

        if(!L1.email || L1.email.length === 0)
          return;

        // To avoid flooding the server with requests in case of errors
        body.attr('l1-done', 'true');
        

        // SIGNATURE INJECTION

        L1.build_signature(L1.email, function(err, signature_html) {
          if(err) {
            return;
          }
          else {
            var sign = $(signature_html);
            if(body.find('.gmail_quote:first').length > 0) {          
              if(!has_signature) {
                body.find('.gmail_quote:first').prev()
                  .before($('<br/>').addClass('l1-format'))
                  .before($('<br/>').addClass('l1-format'))
                  .before(sign)
                  .before($('<br/>').addClass('l1-format'));
              }            
              else {
                body.find('.gmail_quote:first').prev().prev()
                  .before(sign);
              }
            }
            else {
              if(!has_signature) {
                body
                  .append($('<br/>').addClass('l1-format'))
                  .append($('<br/>').addClass('l1-format'));            
              }
              body.append(sign);
            }
          }
        });
      }
    });
  });
  
}, 200);
