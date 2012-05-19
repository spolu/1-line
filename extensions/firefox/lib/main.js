var pageMod = require("page-mod");
var data = require("self").data;

pageMod.PageMod({
  include: "https://mail.google.com/mail/*",
  contentScriptFile: [data.url("js/lib/jquery-1.7.2.min.js"),
                      data.url("js/l1.js"),
                      data.url("js/gmail/gmail.js")],
});

