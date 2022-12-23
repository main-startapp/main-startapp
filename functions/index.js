// The Firebase Admin SDK to access Firestore.
import admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import * as functions from "firebase-functions";

// 3rd party
import { createTransport } from "nodemailer";

// https://firebase.google.com/docs/functions/config-env
// google account credentials used to send email
// https://kinsta.com/blog/gmail-smtp-server/
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// start with scheduled functions
// https://www.freecodecamp.org/news/how-to-schedule-a-task-with-firebase-cloud-functions/
// https://crontab.guru/#0_8-8/2_*_*_*
// https://firebase.google.com/docs/functions/schedule-functions
// https://stackoverflow.com/questions/62759093/how-to-invoke-firebase-schedule-functions-locally-using-pubsub-emulator/65759654#65759654
export const sendUnreadEmails = functions.pubsub
  .schedule("0 20 * * 1-5")
  .timeZone("America/Vancouver") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const chatsCollectionRef = db.collection("chats");
    const chatsSnapshot = await chatsCollectionRef
      .where("has_unread", "==", true)
      .get();
    // get a set of uids that need to get notified
    const uidMap = new Map();
    chatsSnapshot.forEach((doc) => {
      const chat = doc.data();
      const uid1 = chat.chat_user_ids[0];
      const uid2 = chat.chat_user_ids[1];
      if (chat[uid1 + "_unread"] > 0) {
        uidMap.has(uid1)
          ? uidMap.get(uid1).push(chat[uid2 + "_name"])
          : uidMap.set(uid1, [chat[uid1 + "_name"], chat[uid2 + "_name"]]);
      }
      if (chat[uid2 + "_unread"] > 0) {
        uidMap.has(uid2)
          ? uidMap.get(uid2).push(chat[uid1 + "_name"])
          : uidMap.set(uid2, [chat[uid2 + "_name"], chat[uid1 + "_name"]]);
      }
    });
    // get email and send msg
    for (let [uidStr, nameArr] of uidMap) {
      const userRecord = await admin.auth().getUser(uidStr);
      if (!userRecord?.email) continue;
      // email is okay, send
      const myName = nameArr[0];
      const msgCount = nameArr.length - 1;
      let partnerNames = "";
      for (let i = nameArr.length - 1; i > 0; i--) {
        // skip nameArr[0] as that's user's name
        partnerNames += nameArr[i] + ", ";
      }
      partnerNames = partnerNames.slice(0, -2) + ".";
      const now = new Date().toDateString();
      const mailOptions = {
        from: "Edium <contact@edium.ca>",
        to: userRecord.email,
        subject: "Unread messages on Edium",
        html: `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<!-- this ensures Gmail doesn't trim the email -->
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #5d77a9; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:15px;padding-top:15px;width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Edium Icon" src="https://i.imgur.com/92QRior.png" style="display: block; height: 48px; border: 0; width: auto;" title="Edium"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #cbdbef; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 20px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:70px;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Check Icon" src="https://i.imgur.com/4ITOCZi.png" style="display: block; height: auto; border: 0; width: 96px; max-width: 100%;" title="Check Icon" width="96"/></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:25px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="font-family: Georgia, 'Times New Roman', serif">
<div class="" style="font-size: 14px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 16.8px; color: #2f2f2f; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:42px;">Unread Messages</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:80px;padding-left:30px;padding-right:30px;padding-top:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 21px; color: #2f2f2f; line-height: 1.5;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Hi ${myName},</span></p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"/>&nbsp;</p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">You got <strong><span style="">${msgCount}</span></strong> unread message(s) on the platform.</span></p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Sent by ${partnerNames}</span></p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"/>&nbsp;</p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#000000;font-size:14px;">Visit <a href="https://edium.ca/" target="_blank">edium.ca</a> to respond.</span></p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #5d77a9; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div class="alignment" style="text-align:center;">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
<tr>
<td style="padding:0 16px 0 0;"><a href="https://www.instagram.com/edium.stu/" target="_blank"><img alt="Instagram Icon" src="https://i.imgur.com/UXejwyZ.png" style="display: block; height: 32px; border: 0;" title="Instagram"/></a></td>
<td style="padding:0 0 0 0;"><a href="https://www.linkedin.com/company/edium/" target="_blank"><img alt="Linkedin Icon" src="https://i.imgur.com/9uyUqAk.png" style="display: block; height: 32px; border: 0;" title="Linkedin"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="5" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #f9f9f9; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">edium.ca</span></p>
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">contact@edium.ca</span></p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #5d77a9; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 10px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="5" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; mso-line-height-alt: 14.4px; color: #cfceca; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">2022 © All Rights Reserved</span></p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
<span style="opacity: 0"> ${now} </span>
</body>
</html>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
      });
    }

    return null;
  });
