#!/usr/bin/env node

/**
 * Module dependencies.
 */

var util = require('util');
var fwk = require('fwk');
var express = require('express');
var http = require('http');
var Mu = require('mu');

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
  
  var email_count = Math.floor(Math.random() * 9999) + 1;
  var ref_count = Math.floor(Math.random() * 999) + 1;;

  var html = '';
  html += '<span class="l1-signature" l1="signature"';
  html +=       'style="color: #aaa; font-weight: bold;" >';
  html += '  <span style="color: #ddd">';
  html += '    L43: ';
  html += '  </span>';
  html += '  <span style="color: #888">';
  html += '    ' + email_count + ' emails';
  html += '  </span>';
  html += '  donated & ';
  html += '  <span style="color: #888">';
  html += '    ' + ref_count + ' referrals: ';
  html += '  </span>';
  html += '  <a href="http://1-line.org" target="_blank"';
  html += '     style="color: #4f9Bd1; text-decoration: none">';
  html += '      A small Donation Today. A better World Tomorrow!';
  html += '  </a>';
  html += '  <br/>';
  html += '</span>';
  
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ ok: true,
             html: html });
});



/* home */
app.get('/', function(req, res, next) {
  var locals = {};
  res.render('index', {
    locals: locals
  });
});


/* 404 */
app.get('/404', function(req, res, next) {
  res.json({ok: false, page: 404}, 404);
});


app.listen(8080);

app.on('listening', function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

