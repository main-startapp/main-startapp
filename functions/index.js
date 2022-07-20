// create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// 3rd party
const nodemailer = require("nodemailer");

// https://firebase.google.com/docs/functions/config-env
// google account credentials used to send email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendEmail = functions.firestore
    .document("chats/{chat}")
    .onUpdate((snap, context) => {
      const mailOptions = {
        from: "Edium",
        to: "main.startapp@gmail.com",
        subject: "Sending it from Cloud Function",
        html: `<h1>Hello</h1>
                <p>
                  <b>Edium</b>
                </p>`,
      };

      return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log("Sent!");
      });
    });
