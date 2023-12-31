const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const { createListing } = require("./crud");
require('dotenv').config();

// server used to send send emails
const app = express();

app.use(
  cors({
      origin: "*",
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use("/", router);
app.listen(5001, () => console.log("Server Running on port 5001"));
// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASS);

const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri, { 
  // useNewUrlParser: true, useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const main = async () => {

  /* Create a client with options to specify Stable API Version 1, return
  errors for commands outside of the API version, and raise exceptions
  for deprecated commands */

  // try {
    // Connect to the MongoDB cluster
    await client.connect();

    // );

  // }

}

main().catch(console.error);


// const contactEmail = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "********@gmail.com",
//     pass: ""
//   },
// });

// contactEmail.verify((error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Ready to Send");
//   }
// });

// router.post("/contact", (req, res) => {
//   const name = req.body.firstName + req.body.lastName;
//   const email = req.body.email;
//   const message = req.body.message;
//   const phone = req.body.phone;
//   const mail = {
//     from: name,
//     to: "********@gmail.com",
//     subject: "Contact Form Submission - Portfolio",
//     html: `<p>Name: ${name}</p>
//            <p>Email: ${email}</p>
//            <p>Phone: ${phone}</p>
//            <p>Message: ${message}</p>`,
//   };
//   contactEmail.sendMail(mail, (error) => {
//     if (error) {
//       res.json(error);
//     } else {
//       res.json({ code: 200, status: "Message Sent" });
//     }
//   });
// });


// Get Event Poster
app.get("/api/getEventPoster", async (req, res) => {

  // console.log(client);

  try{
    const eventDoc = await client.db("turiya").collection("event_count").findOne({identifier: "turiya"});
    console.log(eventDoc);
    res.send({image_url: eventDoc.img_url});
      
  } catch(error){
    res.send(error);
  }
});



// Get Invite Links
app.get("/api/getInviteLinks", async (req, res) => {
  try{
    const inviteDoc = await client.db("turiya").collection("invite").findOne({identifier: "turiya"});
    console.log(inviteDoc);
    res.send({link1: inviteDoc.turiya2023, link2: inviteDoc.turiyaChanting, link3: inviteDoc.turiyaChannel});
      
  } catch(error){
    res.send(error);
  }
});



// Event Registration
app.post("/api/registerForEvent", async (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const rollNumber = req.body.rollNumber;

  const userData = {name, rollNumber, email, phone};

  var code = 200;

  try{
    
    // fetch the current event Number
    const eventNumberDoc = await client.db("turiya").collection("event_count").findOne({identifier: "turiya"});
    const eventNumber = eventNumberDoc.event_id;
    const event = "event" + eventNumber;

    // check if the student is already registered
    const result = await client.db("turiya").collection(event).findOne({email: email});
    if (result){
      code = 400;
    }
    else{
      // register student for event with eventId as eventNumber
      await client.db("turiya").collection(event).insertOne(userData);
    }
  
  }catch(error){
    res.send(error);
  }
  
  res.send({code: code});
  
});






// // login api endpoint
// app.post("/api/login", async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const userData = {email, password};


//   // fetch the data from database
//   const result = await client.db("turiya").collection("Users").findOne({email: email});

//   // user found
//   if (result){
//     // match the password
//     console.log(result);
//   }
//   else{
//     // Invalid Login
//   }

// });


// // register user api endpoint
// app.post("/api/registerNewUser", async (req, res) => {
//   // get user details
//   const email = req.body.email;
//   const password = req.body.password;


//   // send OTP to email after checking valid email

// });


// app.post("/api/verifyOTP", async(req, res)=>{
//   const otp = req.body.otp;

//   // fetch otp from database and match
//   // if matched, create the new user in the database
//   const result = await client.db("turiya").collection("Users").insertOne(userData);
//   console.log(`New listing created with the following id: ${result.insertedId}`);
// });




// Create a register event route
// Make a attendance marking system






