const fs = require('fs');
const sharp = require('sharp');

sharp('public/audiA4.png')
  .resize(32, 64)
  .png()
  .toBuffer()
  .then(buffer => {
    const b64 = buffer.toString('base64');
    const css = `/* 🚗 Cursor Audi A4 */
* {
  cursor: url('data:image/png;base64,${b64}') 32 32, auto;
}

a, button, [role='button'], select, input[type='submit'], label {
  cursor: url('data:image/png;base64,${b64}') 32 32, pointer;
}`;
    fs.writeFileSync('cursor-snippet.css', css);
    console.log('✅ cursor-snippet.css generado! Tamaño: ' + buffer.length + ' bytes');
  })
  .catch(err => console.error('❌ Error:', err));
