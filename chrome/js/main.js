
var L43 = {};

L43.build_signature = function() {
  var email_count = 3210;
  var ref_count = 27;

  // TODO: DO SERVER SIDE
  
  var sign = $('<span/>')
    .addClass('layer43-signature')
    .attr('layer43', 'signature')
    .css({ 'color': '#aaa',
           'font-weight': 'bold' })
    .append($('<span/>')
            .css({ 'color': '#888' })
            .html(email_count + ' emails '))
    .append(' donated & ')
    .append($('<span/>')
            .css({ 'color': '#888' })
            .html(ref_count + ' referrals: '))
  //.append('<br/>')
    .append($('<a/>')
            .attr('href', 'http://layer43.org')
            .attr('target', '_blank')
            .css({ 'color': '#4f9Bd1',
                   'text-decoration': 'none' })
            .append('Today is the Day we Reshape Tomorrow!'))
    .append('<br>');
  
  return sign;
}


setInterval(function() {  

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
      if(L43.email !== $(this).val()) {
        L43.email = $(this).val();
        
        // REMOVE EXISTING
        
        $(el).contents().find('.editable').contents().find('body').each(function() {
          
          $(this).parent().find('body > span.layer43-signature').remove();
          $(this).parent().find('.layer43-format').remove();
          $(this).attr('layer43-done', 'false');
          
          $(this).parent().find('body > span').each(function() {
            if(/layer43\.org/.test($(this).html()))
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
      if($(this).parent().find('body > span.layer43-signature').length === 0 &&
         $(this).attr('layer43-done') !== 'true') {
        
        // PRELUDE
        
        $(this).attr('layer43-done', 'true') ;
        var has_signature = false;
        var skip = false;

        if($(this).parent().find('body > br[clear="all"]').length > 0) {
          has_signature = true;  
        }
        
        $(this).parent().find('body > span').each(function() {
          if(/layer43\.org/.test($(this).html()))
            skip = true;
        });        
        if(skip)
          return;

        if(!L43.email || L43.email.length === 0)
          return;

        // SIGNATURE INJECTION

        if($(this).find('.gmail_quote:first').length > 0) {          
          if(!has_signature) {
            $(this).find('.gmail_quote:first').prev()
              .before($('<br/>').addClass('layer43-format'))
              .before($('<br/>').addClass('layer43-format'))
              .before(L43.build_signature())
              .before($('<br/>').addClass('layer43-format'));
          }
          else {
            $(this).find('.gmail_quote:first').prev().prev()
              .before(L43.build_signature());
          }
        }        
        else {          
          if(!has_signature)
            $(this)
            .append($('<br/>').addClass('layer43-format'))
            .append($('<br/>').addClass('layer43-format'));
          
          $(this).append(L43.build_signature());
        }
        
      }
    });
  });
  
}, 200);
