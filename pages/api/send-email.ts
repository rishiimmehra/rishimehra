import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { formData, error } = req.body;

  // Configure your email transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Replace with your email provider's SMTP server
    port: process.env.EMAIL_PORT, // Replace with the appropriate port
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'contact@rishimehra.in',
    subject: 'Error Submitting Contact Form',
    text: `Error: ${error}\n\nContact Details:\n${JSON.stringify(formData, null, 2)}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (emailError) {
    console.error('Error sending email:', emailError);
    res.status(500).json({ message: 'Error sending email' });
  }
}
