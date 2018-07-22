const http = require('http');
const fs = require('fs');

//404 response

function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('error 404: page not found');
  response.end();
}



http.createServer((request, response) => {
  //handle request
  let url = request.url;
  if (request.method === 'GET') {
    if (url === '/helium.html') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream('./public/helium.html').pipe(response);

    } else if (url === '/index.html' || url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream('./public/index.html').pipe(response);

    } else if (url === '/hydrogen.html') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream('./public/hydrogen.html').pipe(response);
    } else {
      response.writeHead(200,{ 'Content-Type': 'text/html' });
      fs.createReadStream('./public/404.html').pipe(response);
    }

    if(request.method === 'POST'){
      if(url === './helium.html'){
        
      }
    }
  }


}).listen(8555, () => {
  console.log('server is listening to port 3300');
});