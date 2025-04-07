const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    console.log('Notify event body:', event.body);
    const { subscribers } = JSON.parse(event.body);

    if (!subscribers || subscribers.length === 0) {
      throw new Error('No subscribers provided');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'terryroy@theroycollection.com',
        pass: 'bhwuisdjcvddqfzu'
      }
    });

    const mailOptions = {
      from: 'terryroy@theroycollection.com',
      subject: 'New Reads from The Roy Collection',
      text: 'Expand your mind with todays read! Check out: https://theroycollection.com\n\nThank you for subscribing!\n\nTerry Roy'
    };

    const sendPromises = subscribers.map(subscriber => 
      transporter.sendMail({ ...mailOptions, to: subscriber })
    );

    await Promise.all(sendPromises);

    console.log('Emails sent to:', subscribers);
    return { statusCode: 200, body: JSON.stringify({ message: 'Notified subscribers' }) };
  } catch (error) {
    console.error('Error sending emails:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};