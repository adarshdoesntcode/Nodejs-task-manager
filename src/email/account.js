const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail =(email, name)=>{
  sgMail.send({
    to:email,
    from:'adarshdas@mail.com',
    subject:'Welcome to Task Manager',
    text:`Welcome ${name}. Hope you enjoy our service.`
  })
}
const sendGoodbyeEmail =(email, name)=>{
  sgMail.send({
    to:email,
    from:'adarshdas@mail.com',
    subject:'Sad to see you go..',
    text:`Goodbye ${name}. Hope to see you again soon.`
  })
}
module.exports = { 
  sendWelcomeEmail,
  sendGoodbyeEmail
}