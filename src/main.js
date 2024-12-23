//signature preview
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