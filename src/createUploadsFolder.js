const fs = require('fs');
const path = require('path');

async function createUploadsFolder() {
    
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    await fs.promises.mkdir(uploadsDir);
  }
}

module.exports = { createUploadsFolder }