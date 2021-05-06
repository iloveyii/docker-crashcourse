const express = require('express')


const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    console.log('path::/');
    res.send('Hello world !!! from PORT ' + port);
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
}); 

