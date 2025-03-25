const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    console.log('Notify event body:', event.body);
    const { subscribers, title, content } = JSON.parse(event.body);

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
      subject: `New Article: ${title}`,
      text: `Hey there,\n\nI just posted a new article: "${title}"\n\n${content}\n\nCheck it out: https://theroycollection.com\n\nThanks for subscribing!\nTerry Roy`
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