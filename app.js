const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const os = require('os');
const path = require('path');

const hostName = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  if (req.method === 'POST') {
  const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: ${filename}, encoding: ${encoding}, mimeType: ${mimeType}}`,
        filename,
        encoding,
        mimeType
      );

      const saveTo = path.join(`${os.homedir()}/Downloads`, `${filename}`);
      console.log(`File [${name}] is saving to ${saveTo}`)
      file.pipe(fs.createWriteStream(saveTo));

      file.on('data', (data) => {
        console.log(`File [${name}] got ${data.length} bytes`);
      }).on('close', () => {
        console.log(`File [${name}] done`);
      });
    });
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: `, val);
    });
    bb.on('close', () => {
      console.log('Done parsing form!');
      // res.writeHead(303, { Connection: 'close', Location: '/' });
      
      res.end('Done parsing form!');
    });
    req.pipe(bb);
  }
});

server.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});