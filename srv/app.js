#!/usr/bin/env node

/**
 * Module dependencies.
 */

var util = require('util');
var fwk = require('fwk');
var express = require('express');
var http = require('http');
var Mu = require('mu');
var mixpanel = require('mixpanel');

var app = module.exports = express.createServer();

// cfg
var cfg = fwk.populateConfig(require("./config.js").config);

// DynamoDB
var ddb = require('dynamodb').ddb({ accessKeyId: cfg['L1_DYNAMODB_ACCESSKEYID'],
                                    secretAccessKey: cfg['L1_DYNAMODB_SECRETACCESSKEY'] });

// Mixpanel
var mp = new mixpanel.Client('80ea26f0f4c848646e7d68c993cc2162');

// Configuration

app.configure(function() {
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/views');
  app.register(".mustache", require('stache'));
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  express.session.ignore.push('/robots.txt');    
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

// Routes

/* signature */
app.get('/signature', function(req, res, next) {

  var email = req.param('email');

  res.header('Access-Control-Allow-Origin', '*');
  
  var echk = /^[A-Za-z0-9_\-\.\+]+@[A-Za-z0-9\-]+\.[A-Za-z\.]+$/.test(email);
  if(!echk) {
    res.json({ ok: false,
               error: 'Invalid Email: ' + email });
    return;
  }

  mp.track("srv-signature", { email: email },
           function(err) {
             if(err)
               console.log(err);
           });    

  ddb.getItem(cfg['L1_DYNAMODB_TABLE'], email, null, {}, function(err, user) {
    if(err) {
      console.log(err);
      res.json({ ok: false,
                 error: err.message });
    }        
    else {
      if(typeof user === 'undefined') {
        user = { email: email };
        mp.track("srv-create", { email: email },
                 function(err) {
                   if(err)
                     console.log(err);
                 });    
      }
      user.email_count = user.email_count || 0;
      user.visit_count = user.visit_count || 0;
      
      ++user.email_count;
      mp.track("srv-email", { email: email },
               function(err) {
                 if(err)
                   console.log(err);
               });    

      ddb.putItem(cfg['L1_DYNAMODB_TABLE'], user, {}, function(err) {
        if(err) {
          console.log(err);
        }
      });
      

      var html = '';
      html += '<span class="l1-signature" l1="signature"';
      html +=       'style="color: #aaa; font-weight: bold;" >';
      html += '  <span style="color: #ddd">';
      html += '    1-L: ';
      html += '  </span>';
      html += '  I donated ';
      html += '  <span style="color: #888">';
      html += '    ' + user.email_count + ' emails';
      html += '  </span>';
      html += '  & generated ';
      html += '  <span style="color: #888">';
      html += '    ' + user.visit_count + ' visits: ';
      html += '  </span>';
      html += '  <a href="https://1-line.org?ref=' + encodeURIComponent(email) + '" target="_blank"';
      html += '     style="color: #4f9Bd1; text-decoration: none">';
      html += '      Donate Now!';
      html += '  </a>';
      html += '  <br/>';
      html += '</span>';
  
      res.json({ ok: true,
                 html: html });

      console.log(req.headers['user-agent']);
      console.log('USER +EMAIL:');
      console.log(user);
    }
  });  
});



/* home */
app.get('/', function(req, res, next) {

  var email = req.param('ref');

  res.header('Access-Control-Allow-Origin', '*');

  mp.track("srv-home", { ref: email },
           function(err) {
             if(err)
               console.log(err);
           });    
  
  var echk = /^[A-Za-z0-9_\-\.\+]+@[A-Za-z0-9\-]+\.[A-Za-z\.]+$/.test(email);
  if(echk) {
    ddb.getItem(cfg['L1_DYNAMODB_TABLE'], email, null, {}, function(err, user) {
      if(err) {
        console.log(err);
      }        
      else {
        if(typeof user === 'undefined') {
          user = { email: email };
          mp.track("srv-create", { email: email },
                   function(err) {
                     if(err)
                       console.log(err);
                   });    
        }
        user.email_count = user.email_count || 0;
        user.visit_count = user.visit_count || 0;
        
        ++user.visit_count;  
        mp.track("srv-visit", { email: email },
                 function(err) {
                   if(err)
                     console.log(err);
                 });    
        
        ddb.putItem(cfg['L1_DYNAMODB_TABLE'], user, {}, function(err) {
          if(err) {
            console.log(err);
          }
        });        
        
        console.log(req.headers['user-agent']);
        console.log('USER +VISIT:');
        console.log(user);
      }
    });  
  }
    
  var locals = { ref: email };
  res.render('index', {
    locals: locals
  });
});


/* 404 */
app.get('/404', function(req, res, next) {
  res.json({ok: false, page: 404}, 404);
});


app.get('/support_safari', function(req, res, next) {
  var locals = {};
  res.render('support_safari', {
    locals: locals
  });  
});

app.get('/support_chrome', function(req, res, next) {
  var locals = {};
  res.render('support_chrome', {
    locals: locals
  });  
});


app.listen(8080);

app.on('listening', function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

