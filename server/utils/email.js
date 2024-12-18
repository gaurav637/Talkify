const Sib = require("sib-api-v3-sdk");
const emailConfig = require("../config/email")();

module.exports.sendEmail = async (recipient, subject, message) => {
  if (recipient !== "" || recipient) {
    const sender = {
      email: "aman722003@gmail.com",
      name: "Gaurav Negi",
    };

    const recievers = [];
    recievers.push({
      email: recipient,
    });

    const mailData = {
      sender,
      to: recievers,
      subject: subject,
      textContent: message,
    };
// console.log("mailData-> ",mailData);
    emailConfig.sendTransacEmail(mailData, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  }
};