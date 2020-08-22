const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const Contact = require("./contacts/contactModel");
//using local database
const db = mongoose.connect("mongodb://localhost/contact", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//set the template engine
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//parser middlware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setting a static folder
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const customerDetails = `
        <h1>Customer Enquiry</h1>
        <ul>
            <li>Name: ${req.body.username}</li>
            <li>Telephone: ${req.body.telephone}</li>
            <li>Customer's email: ${req.body.email}</li>
            <h3> Message is: </h3> <p> ${req.body.message}</p>
            
        </ul>    
    `;

  // mongoDB intergration
  const contact = new Contact(req.body);
  contact.save((err, success) => {
    if (err) {
      return console.log(err);
    }
    return res.status(201);
    console.log("Data Succesfully added");
  });

  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "miltonbedah@gmail.com",
        accessToken:
          "ya29.a0AfH6SMDXDC0nnCOnzZe-rcM0eyouScRz-gBSXqu0XwTbmt4cUNtxDArRD2U9HguYDpjzrQL6U8YUEot0gHQR67CgEkbAQOs8MGlYRG5oR9vfUzV0k5YaG0s2-q6jDlX5lnEGk5joIdFwgcsHTxSVwSLltjW_8C3EuT8",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Mars Rocks🥨" miltonbedah1485@gmail.com', // sender address
      to: "miltonbedah@gmail.com",
      subject: "Contact Details", // Subject line
      html: customerDetails, // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email sent" });
  }

  main().catch(console.error);
});

app.listen(PORT, () => `App running on port ${PORT}`);
