const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// The Discord link to encode in the QR code
const discordLink = 'https://discord.gg/q8KxNAhmEm';

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
