const codeColumns = Array.from(document.querySelectorAll('tbody .code'))
const descColumns = Array.from(document.querySelectorAll('tbody .description'))
const rows = descColumns.map(({ parentNode }) => parentNode)
const descriptions = descColumns.map(({ textContent }) => textContent.toLowerCase())
const codes        = codeColumns.map(({ textContent }) => textContent.toLowerCase())

function filter(value) {
  const valueLc = value.toLowerCase()
  descriptions.forEach((desc, i) => {
    const method = (!value || desc.includes(valueLc) || codes[i].includes(valueLc)) ? "remove" : "add"
    rows[i].classList[method]('d-none');
  });
}

document.getElementById('search').addEventListener('input', ({ target: { value } }) => filter(value));
