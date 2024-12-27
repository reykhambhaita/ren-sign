const textField = document.getElementById('textField');
const signaturePrev = document.querySelector('.signature-prev');
const fontSelect = document.getElementById('fontSelect');
const formatSelect = document.getElementById('format');
const signButton = document.getElementById('signButton');

//signature preview
textField.addEventListener('input', updateSignature);

// Select font from fontSelect
fontSelect.addEventListener('change', updateSignature);

// Sign button functionality
signButton.addEventListener('click', () => {
  const format = formatSelect.value;
  const signatureContent = signaturePrev;

  if (!signatureContent || !signatureContent.textContent.trim()) {
    alert('Please enter text for your signature.');
    return;
  }

  if (format === 'svg') {
    saveAsSVG(signatureContent);
  } else {
    saveAsImage(signatureContent, format);
  }
});


//render font for signature
function updateSignature() {
  const value = textField.value.trim();
  const selectedFont = fontSelect.value;

  if (value) {
    signaturePrev.classList.add('active');
    signaturePrev.textContent = value;
    signaturePrev.style.fontFamily = selectedFont;
  } else {
    signaturePrev.classList.remove('active');
    signaturePrev.textContent = '';
  }
}
//save file when clicked on signButton
function saveAsSVG(signatureContent) {
  const computedStyle = window.getComputedStyle(signatureContent);
  const fontFamily = computedStyle.fontFamily.split(',')[0].trim().replace(/"/g, '');
  const fontSize = parseFloat(computedStyle.fontSize);
  const signatureText = signatureContent.textContent
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const width = signatureContent.offsetWidth || 500;
  const height = signatureContent.offsetHeight || 200;

  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><style type="text/css">text {font-family: ${fontFamily}, cursive, serif;font-size: ${fontSize}px;fill: black;}</style></defs><rect width="100%" height="100%" fill="white"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">${signatureText}</text></svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  saveBlob(blob, "signature.svg");
}

function saveAsImage(signatureContent, format) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 250;
  canvas.height = 200;

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const signatureText = signatureContent.textContent;
  const fontFamily = window.getComputedStyle(signatureContent).fontFamily;
  const fontSize = window.getComputedStyle(signatureContent).fontSize;

  context.font = `${fontSize} ${fontFamily}`;
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(signatureText, canvas.width / 2, canvas.height / 2);

  canvas.toBlob(
    (blob) => {
      if (blob) {
        saveBlob(blob, `signature.${format}`);
      } else {
        alert('Failed to save the file.');
      }
    },
    `image/${format}`
  );
}

function saveBlob(blob, fileName) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}