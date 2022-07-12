const fs = require('fs');

const parseHeaders = (headersString) => {
  const headersRaw = headersString.split('\r\n').join(';');
  const headers = {};
  const _headers = headersRaw.split(';').slice(1);
  
  _headers.forEach(header => {
    let [name, value] = header.split(':');
    
    if (!value) {
      [name, quoted] = header.split('=');
      value = quoted.replaceAll('"', '');
    }
    headers[name.trim()] = value.trim();
  })

  return headers;
};

const parseFormInputs = (body, boundary) => {
  const inputs = [];
  const crlf2Buffer = Buffer.from('\r\n\r\n');

  let from = 0;
  
  while (from >= 0) {    
    const start = body.indexOf(boundary, from) + boundary.length;
    const upto = body.indexOf(boundary, start);
    
    const content = body.slice(start, upto);
    
    const headerEnd = content.indexOf(crlf2Buffer);
    const headers = parseHeaders(content.slice(0, headerEnd).toString());
    
    const valueStart = headerEnd + crlf2Buffer.length;
    const value = content.slice(valueStart, -2);
    
    from = upto;
    inputs.push({ content, headers, value });
  }

  return inputs;
};

const getBoundary = (header) => {
  const [_, boundary] = header.split(';');
  return `--${boundary.split('=')[1]}`;
};

const uploadHandler = (req, res, next) => {
  const { pathname } = req.url;
  if (pathname !== '/upload') {
    next();
    return;
  }
  
  const body = req.body;
  const boundary = getBoundary(req.headers['content-type']);
  const inputs = parseFormInputs(body, Buffer.from(boundary));
  
  console.log(inputs);
  inputs.forEach(input => {
    if (!input.headers.filename) {
      return;
    }
    const { value, headers: { filename } } = input;
    fs.writeFileSync(`downloads/${filename}`, value);
  })
  
  next();
};

module.exports = { uploadHandler };
