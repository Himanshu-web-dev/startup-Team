const twilio = require('twilio');

// Initialize Twilio client
let twilioClient;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } else {
    console.warn('⚠️  Twilio credentials not configured. WhatsApp notifications will be disabled.');
  }
} catch (error) {
  console.error('Twilio initialization error:', error.message);
}

// Send application accepted notification via WhatsApp
exports.sendApplicationAccepted = async (memberPhone, startupName, founderContact) => {
  if (!twilioClient) {
    console.log('WhatsApp notification skipped: Twilio not configured');
    return;
  }

  try {
    // Format phone number (ensure it has country code)
    const formattedPhone = memberPhone.startsWith('+') ? memberPhone : `+${memberPhone}`;

    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${formattedPhone}`,
      body: `🎉 Congratulations!\n\nYour application to ${startupName} has been ACCEPTED!\n\nThe founder will contact you at: ${founderContact}\n\nGood luck with your new venture!\n\n- StartupTeam`
    });

    console.log('WhatsApp message sent:', message.sid);
    return message;
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    // Don't throw error, just log it
  }
};

// Send role match alert via WhatsApp
exports.sendRoleMatchAlert = async (memberPhone, startupName, roleTitle) => {
  if (!twilioClient) {
    console.log('WhatsApp notification skipped: Twilio not configured');
    return;
  }

  try {
    const formattedPhone = memberPhone.startsWith('+') ? memberPhone : `+${memberPhone}`;

    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${formattedPhone}`,
      body: `🚀 New Role Match!\n\n${startupName} is looking for:\n${roleTitle}\n\nThis matches your profile! Check it out now on StartupTeam.\n\nDon't miss this opportunity!`
    });

    console.log('WhatsApp message sent:', message.sid);
    return message;
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
  }
};
