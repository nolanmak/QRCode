const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// The Discord link to encode in the QR code
const discordLink = 'https://code-coffee-philly-tech-week.devpost.com/?ref_feature=challenge&ref_medium=your-open-hackathons&ref_content=Upcoming&_gl=1*15ums70*_gcl_au*MTEzNDQwMTk1NC4xNzQ2MjE0MTQw*_ga*OTI5NjU2ODc3LjE3NDYyMTQxNDA.*_ga_0YHJK3Y10M*MTc0NjIxNDEzOS4xLjEuMTc0NjIxNDE0NS4wLjAuMA';

// Output file path
const outputPath = path.join(__dirname, 'discord-invite-qr.png');

// Options for QR code generation
const options = {
  errorCorrectionLevel: 'H', // High error correction capability
  type: 'image/png',
  quality: 0.92,
  margin: 1,
  color: {
    dark: '#000000',  // Black dots
    light: '#FFFFFF'  // White background
  }
};

// Generate QR code
QRCode.toFile(outputPath, discordLink, options, (err) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  
  console.log(`QR code successfully generated at: ${outputPath}`);
  console.log(`QR code contains link to: ${discordLink}`);
});
