let request = new XMLHttpRequest();
request.open('POST', `localhost:6969/`)
request.send({'elName': 'Helium'});
request.addEventListener('load', function(){
  const responseObj = JSON.parse(this.responseText);
  console.log(responseObj);
});