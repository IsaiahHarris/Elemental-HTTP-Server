const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

http.createServer((request, response) => {
  //handle request
  let url = request.url;
  if (request.method === 'GET') {
    getFunc(request, response);
  } else if (request.method === 'POST') {
    postFunc(request, response);
  } else if (request.method === 'DELETE') {
    deleteFunc(request, response);
  } else if (request.method === 'PUT') {
    putFunc(request, response);
  }
  //functions 




  ////////////////////////////////////////////////



  //functions
  function deleteFunc() {
    fs.unlink('public/' + url, (err) => {
      if (err) {
        response.end(url + ' does not exist');
      } else {
        response.end(url + 'was deleted');
      }
    })
  }

  function getFunc() {

    fs.readFile('./public/' + url, function (err, data) {
      if (err) {
        fs.readFile('./public/404.html', 'utf8', (err, data) => {
          response.write(data);
          response.end();
        })
      } else {
        response.writeHead(200, { 'Content-Type': `text/${url.substring(url.lastIndexOf('.')+1)}` });
        response.write(data.toString().trim())
        response.end((() => {
          console.log('request fulfilled');
        }));
      }
    });
  }

  function postFunc() {
    collectRequestData(request, result => {

      let fileName = result.elName + '.html';

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

      fs.writeFile('./public/' + fileName, datas, (err) => {
        if (err) {

          response.end('404 not found');
        } else {

          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ "success": true }));
        }
      });
      fs.readFile('./public/index.html', (err, data) => {
        if (err) {

          response.end('404 not found');

        } else {
          generateLinks(result.elName, (elementList) => {
            let updateData = `<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <title>The Elements</title>
              <link rel="stylesheet" href="/css/styles.css">
            </head>
            
            <body>
              <h1>The Elements</h1>
              <h2>These are all the known elements.</h2>
              <h3>These are 2</h3>
              <ol>
               ${elementList}
              </ol>
            </body>
            
            </html>`;
            fs.writeFile('./public/index.html', updateData, (err) => {
              if (err) {
                response.end('404 not found');
              } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "success": true }));
              }
            })

          });

        }
      })

    });
  }
  function generateLinks(name, cb) {

    fs.readdir('./public/', (err, files) => {
      if (err) {
        response.end()
      }
      elementList = '';
      files.forEach(file => {
        console.log(file);
        if(file !== 'css' && file!== 'index.html' && file !=='404.html'){
          elementList += `
        <li>
          <a href="/${file}">${file}</a>
        </li>`
        }
        
      })
      return cb(elementList);
    })

  }

  function putFunc() {
    collectRequestData(request, result => {
      let findFileName = request.url;
      let updateData = `<!DOCTYPE html>
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
      fs.readFile('./public/' + url, function (err, stat) {
        if (err) {

          response.writeHead(500, { 'Content-Type': 'application/json', });
          response.end(JSON.stringify({ "error": "resource /carbon.html does not exist" }));
        } else {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          fs.readFile(`./public` + url, (err, data) => {
            response.write(data.toString().trim())
            response.end((() => {
              console.log('request fulfilled');
            }));
          })
        }
      });
    });
  }




}).listen(6969, '0.0.0.0', () => {
  console.log('server is listening to port 6969');
});



function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      callback(parse(body));
    });
  }
  else {
    callback(null + 'hi');
  }
}





