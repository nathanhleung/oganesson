import { tokenize, countElements, getMass } from '../../src/index';

/**
 * Get elements data
 */

document.getElementById('atoms').addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const resultEl = document.getElementById('result');
  const tokens = tokenize(e.target.formula.value);
  const counts = countElements(tokens);

	resultEl.innerHTML =
	  `Counts: ${JSON.stringify(counts)}\n` +
	  `Mass: ${getMass(counts)}`
}

window.Oganesson = {
  tokenize,
  countElements,
  getMass,
};
