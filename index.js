// import express from 'express';
// import cors from 'cors';
// import { createTransport } from 'nodemailer';
// import dotenv from 'dotenv';

// // Load environment variables from .env.local file
// dotenv.config({ path: '.env.local' });

// const app = express();
// const PORT = 3001; // You can use any port you like

// // Middleware
// app.use(cors()); // Enable CORS to allow requests from your Vite app
// app.use(express.json()); // To parse JSON bodies

// // Contact form submission route
// app.post('/api/contact', async (req, res) => {
//   const { name, email, whatsappNumber, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ message: 'Required fields are missing.' });
//   }

//   const transporter = createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.RECEIVER_EMAIL,
//     subject: `New Contact Form Submission from ${name}`,
//     html: `
//       <h2 style="color: #10B981;">New Contact Request</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>WhatsApp:</strong> ${whatsappNumber || 'Not provided'}</p>
//       <p><strong>Message:</strong></p>
//       <p>${message}</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Success' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from 'express';
import cors from 'cors';
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local file
dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3001; // Use environment variable for port

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // To parse JSON bodies

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Contact form submission route
app.post('/api/contact', async (req, res) => {
  const { name, email, whatsappNumber, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2 style="color: #10B981;">New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>WhatsApp:</strong> ${whatsappNumber || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// A catch-all handler to serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
