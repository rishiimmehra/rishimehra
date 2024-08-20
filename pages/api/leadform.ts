import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { projectTypes, firstName, lastName, email, phoneNumber, projectDetails } = req.body;

  // Replace with your Zoho Bigin API endpoint URL
  const zohoBiginUrl = 'https://bigin.zoho.in/bigin/org60031646012';
  const zohoBiginAuth = `Bearer ${process.env.ZOHO_BIGIN_ACCESS_TOKEN}`;

  const contactData = {
    // Map form data to Zoho Bigin contact fields
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phoneNumber,
    // ... other fields
  };

  try {
    const response = await axios.post(zohoBiginUrl, contactData, {
      headers: {
        'Authorization': zohoBiginAuth,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting form' });
  }
}