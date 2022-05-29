const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const {url, method} = req;

  if (url === '/') {
    res.write(`<html>
      <head>
        <title>Registration Form</title>
      </head>
      <body>
        <form action="/singup" method="POST">
          <input type="text" name="login" />
          <input type="password" name="password" />
          <button>Sign Up</button>
        </form>
      </body>
    </html>`);

    return res.end();
  }
  if (url === '/singup' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      try {
        const data = fs.readFileSync('users.txt', 'utf8');
        const parsedBody = Buffer.concat(body).toString();
        const newData = parsedBody.replace(/\&/g, '\t') + '\n';

        fs.writeFileSync('users.txt', data + newData);
      } catch (err) {
        console.error('Error from server', err);
      }
    });

    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
});

server.listen(3000);
