// Create simple icons for the extension
// This script generates basic icons for the Privacy Please extension

const fs = require('fs');
const { createCanvas } = require('canvas');

// Create icons of different sizes
const sizes = [16, 48, 128];

// Function to create a simple privacy-themed icon
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#3498db'; // Blue background
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Privacy shield symbol
  ctx.fillStyle = '#ffffff'; // White shield
  
  // Draw shield
  const shieldWidth = size * 0.6;
  const shieldHeight = size * 0.7;
  const shieldX = (size - shieldWidth) / 2;
  const shieldY = (size - shieldHeight) / 2;
  
  ctx.beginPath();
  ctx.moveTo(shieldX, shieldY + shieldHeight * 0.3);
  ctx.lineTo(shieldX, shieldY);
  ctx.lineTo(shieldX + shieldWidth, shieldY);
  ctx.lineTo(shieldX + shieldWidth, shieldY + shieldHeight * 0.3);
  ctx.bezierCurveTo(
    shieldX + shieldWidth, shieldY + shieldHeight * 0.7,
    shieldX + shieldWidth * 0.5, shieldY + shieldHeight,
    shieldX + shieldWidth * 0.5, shieldY + shieldHeight
  );
  ctx.bezierCurveTo(
    shieldX + shieldWidth * 0.5, shieldY + shieldHeight,
    shieldX, shieldY + shieldHeight * 0.7,
    shieldX, shieldY + shieldHeight * 0.3
  );
  ctx.fill();
  
  // Draw arrow (redirect symbol)
  ctx.fillStyle = '#2c3e50'; // Dark arrow
  const arrowSize = size * 0.3;
  const arrowX = size/2 - arrowSize/2;
  const arrowY = size/2 - arrowSize/4;
  
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX + arrowSize, arrowY);
  ctx.lineTo(arrowX + arrowSize/2, arrowY + arrowSize/2);
  ctx.closePath();
  ctx.fill();
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon${size}.png`, buffer);
  
  console.log(`Created icon${size}.png`);
}

// Create icons for each size
sizes.forEach(size => createIcon(size));

console.log('Icon generation complete!');
