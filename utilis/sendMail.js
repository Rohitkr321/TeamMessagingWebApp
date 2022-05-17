const mailjet = require('node-mailjet');

const trasporter = mailjet.connect(
    "4f19f827581ae90aea2d95cc8a4e0fa4",
    "71ac725fabd540b389c935f91e83eb57"
)
module.exports = function sendMail( email, title, body, html, callback )
{
  const request = trasporter.post('send').request({
  FromEmail: 'rohitkumar9122565209@gmail.com',
  FromName: 'Welcome in ChatApp',
  Subject: title,
  'Html-part': html,
  Recipients: [{ Email: email }],
})
request
  .then(result => {
    callback();
  })
  .catch(err => {
    callback("error occured")
  })
}