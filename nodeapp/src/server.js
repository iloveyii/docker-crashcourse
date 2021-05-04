const express = require('express')


const app = express();
app.get('/', (req, res) => {
    console.log('path::/');
    res.send('Hello world !!!');
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
}); 

