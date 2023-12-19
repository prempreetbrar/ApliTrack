const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

module.exports = class Email {
  #to;
  #firstName;
  #lastName;
  #url;
  #from;
  #generatedPassword;

  constructor(user, url, generatedPassword) {
    this.#to = user.Username;
    this.#firstName = user.Fname;
    this.#lastName = user.Lname;
    this.#url = url;
    this.#generatedPassword = generatedPassword;
    this.#from = `ApliTrack Inc. <${process.env.EMAIL_FROM}>`;
  }

  #newTransport() {
    if (process.env.NODE_ENV === "production") {
      // brevo
      return nodemailer.createTransport({
        service: "SendinBlue",
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async #send(template, subject) {
    // render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.#firstName,
        lastName: this.#lastName,
        url: this.#url,
        subject,
        generatedPassword: this.#generatedPassword,
      }
    );

    // define email options
    const mailOptions = {
      from: this.#from,
      to: this.#to,
      subject,
      html,
      text: convert(html),
    };

    // create a transporter and send email
    await this.#newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.#send("welcome", "Welcome to the ApliTrack Family!");
  }

  async sendPasswordReset() {
    await this.#send(
      "passwordReset",
      "Your password reset token (valid for 10 minutes)"
    );
  }

  async sendPasswordEmail() {
    await this.#send("passwordEmail", "Your new password");
  }
};
