const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const Contact = require('./contacts/contactModel');
//using local database
const db = mongoose.connect('mongodb://localhost/contact',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

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
    const contact = new Contact(req.body)

    contact.save((err, success) => {
        if (err){
            return console.log(err);
        }
        if(success){
            return res.status(201);
            console.log('Data Succesfully added');
        }
    });
    console.log(details);

});

app.listen(PORT, ()=> `App running on port ${PORT}`);