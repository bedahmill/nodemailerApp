const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

//set the template engine
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs' }));
app.set('view engine', '.hbs');

//parser middlware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// setting a static folder
app.use('/public',express.static('public'));

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) =>{
    const details = `
        <h1>Customer Enquiry</h1>
        <ul>
            <li>Name: ${req.body.username}</li>
            <li>Telephone: ${req.body.telephone}</li>
            <li>Customer's email: ${req.body.email}</li>
            <h3> Message is: </h3> <li> ${req.body.message}</li>
            
        </ul>    
    `;
    console.log(details);
});

app.listen(PORT, ()=> `App running on port ${PORT}`);