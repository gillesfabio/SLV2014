'use strict';

var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname));

app.listen(3000);
