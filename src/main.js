const textField = document.getElementById('textField');
const signaturePrev = document.querySelector('.signature-prev');

textField.addEventListener('input', (event) => {
  const value = event.target.value.trim();
  if(value){
    signaturePrev.classList.add('active');
    signaturePrev.textContent = value;

  }
  else{
    signaturePrev.classList.remove('active');
    signaturePrev.textContent = '';
  }
})