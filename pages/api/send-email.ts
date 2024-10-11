import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { formData, error } = req.body;

  // Ensure environment variables are defined
  const emailHost = process.env.EMAIL_HOST || '';
  const emailPort = Number(process.env.EMAIL_PORT) || 587; // Default to 587 if undefined
  const emailUser = process.env.EMAIL_USER || '';
  const emailPass = process.env.EMAIL_PASS || '';

  // Configure your email transport
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailUser,
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
