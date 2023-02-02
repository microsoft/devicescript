const webfont = require('webfont');
const fs = require('fs');
const path = require('path');

const svgs = [
  "jacdac.svg",
].map(name => path.join('.', 'icons', name));

async function generateFont() {

  try {
    const result = await webfont.webfont({
      files: svgs,
      formats: ['woff'],
      startUnicode: 0xE000,
      verbose: false,
      normalize: true,
      sort: false
    });
    const dest = path.join('.', 'built', 'devicescript.woff')
    fs.writeFileSync(dest, result.woff, 'binary');
    console.log(`Font created at ${dest}`);
  } catch (e) {
    console.error('Font creation failed.', e);
  }
}

generateFont();