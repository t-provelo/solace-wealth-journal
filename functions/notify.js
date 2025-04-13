const nodemailer = require('nodemailer');

// Configure Nodemailer with hardcoded Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theroycollection@gmail.com', // Hardcoded email
    pass: 'qrkovvmormijqwii', // Hardcoded app password
  },
});

exports.handler = async (event) => {
  try {
    const { subscribers, title, content } = JSON.parse(event.body);

    const mailOptions = {
      from: '"Terry Roy" <theroycollection@gmail.com>', // Hardcoded sender
      subject: 'New Reads from The Roy Collection',
      text: `Expand your mind with today's read! Check out: theroycollection.com\n\nThank you for subscribing!\n\nTerry Roy`,
    };

    const sendPromises = subscribers.map(email => {
      return transporter.sendMail({ ...mailOptions, to: email });
    });

    await Promise.all(sendPromises);
    return { statusCode: 200, body: JSON.stringify({ message: 'Emails sent successfully' }) };
  } catch (error) {
    console.error('Error sending emails:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};