// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin";
initializeApp();

// create Cloud Functions and set up triggers.
import { firestore } from "firebase-functions";

// 3rd party
import { createTransport } from "nodemailer";

// https://firebase.google.com/docs/functions/config-env
// google account credentials used to send email
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = firestore
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
