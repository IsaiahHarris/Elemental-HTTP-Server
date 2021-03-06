const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
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

    if (!fs.existsSync('./public/'+url)) {
      response.writeHead(404,{ 'Content-Type': 'text/html' });
      fs.createReadStream('./public/404.html').pipe(response);
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream('./public/' + url).pipe(response);
    }
  }else if (request.method === 'POST') {
    collectRequestData(request, result => {

        let fileName = result.elName+'.html';

        let datas = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>The Elements - ${result.elTitle}</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <h1>${result.elName}</h1>
          <h2>${result.symbol}</h2>
          <h3>${result.atomicNum}</h3>
          <p>${result.elDescription}</p>
          <p><a href="/">back</a></p>
        </body>
        </html>`;
        fs.readFile('./public/index.html', (err,data)=>{
          if(err){
            console.log('error');
          }else {
            
          }
        })
        fs.writeFile('./public/' + fileName, datas, (err)=>{
          if(err){
            console.log('error');
          }else {
            response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Body': '{ "success" : true }'});
            response.end();
          }
        }); 

    });
}


}).listen(6969,'0.0.0.0', () => {
  console.log('server is listening to port 6969');
});

function collectRequestData(request, callback) {
  console.log(request.headers['content-type']);
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
      let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          callback(parse(body));
      });
  }
  else {
      callback(null+ 'hi');
  }
}