const fs= require('fs');
const { server, notFoundHandler, showReq, fileHandler } =
  require('server-http');
const { mainPageHandler } = require('./mainPage.js');
const { uploadHandler } = require('./multipartParser.js');

const handers = [
  showReq,
  mainPageHandler,
  uploadHandler,
  fileHandler('.', fs),
  notFoundHandler
];

server(80, handers);
