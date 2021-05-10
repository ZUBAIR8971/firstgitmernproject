require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
require("./db/conn");
const hbs = require("hbs");
const path = require("path");
const Register = require("./models/registers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialsPath);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render('index');
});
app.get("/login", (req, res) => {
    res.render('login');
});
app.get("/register", (req, res) => {
    res.render('register');
});
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password === confirmPassword) {
           const rigesterUser = new Register({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password,
            confirmPassword,    
           }); 
            console.log(rigesterUser);

            const token = await rigesterUser.generateAuthToken(); // Generate Token, to use cookies and JsonWebToken
            console.log(token);
            
           const registeration = await rigesterUser.save();
           res.status(201).render('login');

        } else {
            // res.render('index', {errorMsg: {innerHTML: '<span>Your passwords do not match<span>'}});
            res.send({errMsg: "Your passwords do not match"});
        }

    } catch (err) {
        res.status(400).send(err);
    }
});

app.post("/login", async (req, res) => {
    try { 
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        // console.log(`Email is ${userEmail} and Password is ${userPassword}`);
        const emailVerify = await Register.findOne({email:userEmail});
        // res.send(emailVerify);
        // res.send(emailVerify.password);

        // <<<To compare the user entered password with database store bcrypt password>>>
        const isPasswordMatch = await bcrypt.compare(userPassword, emailVerify.password);

        const token = await emailVerify.generateAuthToken(); // Generate Token, to use cookies and JsonWebToken
        console.log(`The token part ${token}`);

        // if (emailVerify.password === userPassword) {
        if (isPasswordMatch) {
            res.status(200).render('register');   
        } else {
            res.send("Invalid Login Password");
        }
    } catch (err) {
        res.status(400).send("Invalid Login Details");
    }
});

app.listen(port, (err) => {
    console.log(`App running at port ${port}`);
});

 /*  // <<<Json Web Token>>>
   const createToken = async() => {
    const token = await jwt.sign({_id:"60938b6411f35d1e101bf2f1"}, "mynameismuhammadzubairkhalidiamfromhasilpur", {expiresIn: "2 minutes"});
    console.log(token);
    const userVer = await jwt.verify(token, "mynameismuhammadzubairkhalidiamfromhasilpur");
    console.log(userVer);
  }
  createToken(); */


      // <<<Bcrypt data>>>
/* const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    
    const passwordMatch = await bcrypt.compare("zk@123", passwordHash);
    console.log(passwordMatch);
}
securePassword("zk@123"); */