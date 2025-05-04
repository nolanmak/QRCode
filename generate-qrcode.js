const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// The Discord link to encode in the QR code
const discordLink = 'https://code-coffee-philly-tech-week.devpost.com/?ref_feature=challenge&ref_medium=your-open-hackathons&ref_content=Upcoming&_gl=1*15ums70*_gcl_au*MTEzNDQwMTk1NC4xNzQ2MjE0MTQw*_ga*OTI5NjU2ODc3LjE3NDYyMTQxNDA.*_ga_0YHJK3Y10M*MTc0NjIxNDEzOS4xLjEuMTc0NjIxNDE0NS4wLjAuMA';

// Output file paths
const tempOutputPath = path.join(__dirname, 'temp-qr.png');
const outputPath = path.join(__dirname, 'discord-invite-qr.png');

// Calculate size for 330 PPI (pixels per inch)
// For a 3x3 inch QR code at 330 PPI, we need 990x990 pixels
const ppi = 330; // Minimum required PPI
const sizeInInches = 3; // Size in inches (adjust as needed)
const pixelSize = Math.ceil(ppi * sizeInInches);

// Create a buffer with the desired PPI metadata
const createMetadataBuffer = () => {
  // Create a PNG metadata chunk with physical pixel dimensions
  // This sets the proper PPI/DPI in the image metadata
  const pHYs = Buffer.alloc(9);
  // Convert PPI to pixels per meter (1 inch = 0.0254 meters)
  const pixelsPerMeter = Math.round(ppi / 0.0254);
  
  // Write the pixels per meter values (both X and Y)
  pHYs.writeUInt32BE(pixelsPerMeter, 0); // X pixels per meter
  pHYs.writeUInt32BE(pixelsPerMeter, 4); // Y pixels per meter
  pHYs.writeUInt8(1, 8); // Unit is meters (1)
  
  return pHYs;
};

// Options for QR code generation
const options = {
  errorCorrectionLevel: 'H', // High error correction capability
  type: 'image/png',
  quality: 1.0, // Maximum quality
  margin: 1,
  width: 1000, // Base size - will be upscaled further with sharp
  color: {
    dark: '#000000',  // Black dots
    light: '#FFFFFF'  // White background
  }
};

// Generate QR code with initial size
QRCode.toFile(tempOutputPath, discordLink, options, (err) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  
  // Upscale the QR code to the desired PPI using sharp
  sharp(tempOutputPath)
    .resize({
      width: pixelSize,
      height: pixelSize,
      fit: 'fill',
      kernel: 'nearest' // Preserve QR code edges during resizing
    })
    // Set the density metadata to ensure proper PPI/DPI in multiple ways
    .withMetadata({
      density: ppi
    })
    // Use custom PNG options with pHYs chunk for maximum compatibility
    .png({ 
      quality: 100,
      compressionLevel: 9,
      adaptiveFiltering: true,
      force: true,
      // Include the pHYs chunk with proper PPI metadata
      chunks: {
        pHYs: createMetadataBuffer()
      }
    })
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error('Error upscaling QR code:', err);
        return;
      }
      
      // Clean up the temporary file
      fs.unlink(tempOutputPath, (err) => {
        if (err) console.error('Error removing temporary file:', err);
      });
      
      console.log(`High-resolution QR code successfully generated at: ${outputPath}`);
      console.log(`Resolution: ${info.width}x${info.height} pixels (${ppi} PPI at ${sizeInInches}x${sizeInInches} inches)`);
      console.log(`QR code contains link to: ${discordLink}`);
    });
});
