//signature preview
const textField = document.getElementById('textField');
const signaturePrev = document.querySelector('.signature-prev');

textField.addEventListener('input', (event) => {
  const value = event.target.value.trim();
  if (value) {
    signaturePrev.classList.add('active');
    signaturePrev.textContent = value;

  }
  else {
    signaturePrev.classList.remove('active');
    signaturePrev.textContent = '';
  }
})

//export and preview tabs

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');


    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
  })
});



//font styles for signature
const fontSelect = document.getElementById('fontSelect');

function updateFont() {
  const signature = textField.value.trim();
  const selectedFont = fontSelect.value;

  if (signature) {
    signaturePrev.classList.add('active');
    signaturePrev.textContent = signature;
    signaturePrev.style.fontFamily = selectedFont;
  } else {
    signaturePrev.classList.remove('active');
    signaturePrev.textContent = '';
  }
}

textField.addEventListener('input', updateFont);
fontSelect.addEventListener('change', updateFont);


//export as files
const saveButton = document.getElementById('saveButton');
const formatSelect = document.getElementById('format');

saveButton.addEventListener('click', () => {
  const format = formatSelect.value;
  const signatureContent = signaturePrev;

  if (!signatureContent || !signatureContent.textContent.trim()) {
    alert('Please generate a signature before saving.');
    return;
  }

  if (format === 'svg') {
    saveAsSVG(signatureContent);
  } else {
    saveAsImage(signatureContent, format);
  }
});

function saveAsSVG(signatureContent) {
  const signatureText = signatureContent.textContent
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const computedStyle = window.getComputedStyle(signatureContent);

  const fontFamily = computedStyle.fontFamily.replace(/"/g, "'"); 
  const fontSize = computedStyle.fontSize;
  const textAlign = computedStyle.textAlign;
  const fillColor = computedStyle.color | "black";

  const width = signatureContent.offsetWidth || 500;
  const height = signatureContent.offsetHeight || 200;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="white" />
      <text x="${textAlign === 'center' ? '50%' : '10%'}" y="50%" 
            dominant-baseline="middle" text-anchor="${textAlign === 'center' ? 'middle' : 'start'}"
            font-family="${fontFamily}" font-size="${fontSize}" fill="${fillColor}">
        ${signatureText}
      </text>
    </svg>
  `;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  saveBlob(blob, "signature.svg");
}


function saveAsImage(signatureContent, format) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 500;
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
        alert('Failed.');
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
}