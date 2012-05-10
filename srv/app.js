#!/usr/bin/env node

/**
 * Module dependencies.
 */

var util = require('util');
var fwk = require('fwk');
var express = require('express');
var http = require('http');

var app = module.exports = express.createServer();

// cfg
var cfg = fwk.populateConfig(require("./config.js").config);

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
  
  app.enable("jsonp callback"); 

  express.session.ignore.push('/robots.txt');    
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

// Routes

app.get('/signature', function(req, res, next) {

  console.log('USER: ' + req.param('email'));
  var email_count = 3210;
  var ref_count = 27;

  var html = '';
  html += '<span class="layer43-signature" layer43="signature"';
  html +=       'style="color: #aaa; font-weight: bold;" >';
  html += '  <span style="color: #888">';
  html += '    ' + email_count + ' emails';
  html += '  </span>';
  html += '  donated & ';
  html += '  <span style="color: #888">';
  html += '    ' + ref_count + ' referrals: ';
  html += '  </span>';
  //html += '  <br/>';
  html += '  <a href="http://layer43.prg" target="_blank"';
  html += '     style="color: #4f9Bd1; text-decoration: none">';
  html += '    Today is the Day we Reshape Tomorrow!';
  html += '  </a>';
  html += '  <br/>';
  html += '</span>';
  
  res.json({ ok: true,
             html: html });
});

app.listen(8080);

app.on('listening', function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

