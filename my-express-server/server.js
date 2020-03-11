const express = require('express');

const app = express();

app.get('/', function(request, response) {
    // console.log(request);
    response.send('<h1>Hello World!</h1>');
});

app.get('/contact', function(req, res) {
    res.send('Contact me at jack@gmail.com');
});

app.get('/about', function(req, res) {
    res.send(`
        <h1>About me</h1>
        <p>Jack Lee</p>
        <p>Brasilian</p>
        <p>Programmer</p>
    `);
});

app.listen(3000, function() {
    console.log('Server started at 3000');
});

// After installing nodemon (npm install -g nodemon), if any problem occurs...
// npm i pstree.remy@1.1.0 -D