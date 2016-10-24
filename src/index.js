document.getElementById('atoms').addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const resultEl = document.getElementById('result');
	resultEl.innerHTML = JSON.stringify(
  	parseInitial(e.target.formula.value),
    null,
    2
  );
}

function parseInitial(formula, tokens = []) {
	if (formula.length === 0) {
  	return {
    	status: 'SUCCESS',
      tokens,
    };
  }
  
  // Parse parentheses
  if (formula[0] === '(') {
  	return parseInitial(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'open'
      },
    ]);
  }
  if (formula[0] === ')') {
  	return parseAfterElement(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'close'
      },
    ]);
  }
	
  // Parse coefficient
	let num = '';
	for (let i = 0; i < formula.length; i++) {
  	// If the char is a number
  	if (!isNaN(Number(formula[i]))) {
    	num = num + formula[i];
    } else {
    	// End loop if char is not a number
    	break;
    }
  }
  // If a coefficient exists
  if (num !== '') {
    return parseInitial(formula.substr(num.length), [
    	...tokens, {
      	type: 'coefficient',
      	value: Number(num),
      },
    ]);
  }

	// Parse element
  // Check if current char is uppercase letter
  const char = formula[0];
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    // If next char is a lowercase letter
    if (formula.length > 1) {
      const nextChar = formula[1];
      const nextCode = nextChar.charCodeAt(0);
      if (nextCode >= 97 && nextCode <= 122) {
      	return parseAfterElement(formula.substr(2), [
        	...tokens, {
          	type: 'element',
            value: char + nextChar,
          },
        ]);
      }
    }
    return parseAfterElement(formula.substr(1), [
    	...tokens, {
      	type: 'element',
        value: char,
      },
    ]);
  }
  
  // If it doesn't match anything
  return {
  	status: 'ERROR',
    tokens,
    formula,
  };
}

function parseAfterElement(formula, tokens) {
	if (formula.length === 0) {
  	return parseInitial(formula, tokens);
  }
  
  // Parse subscript
  // This is repeated from parseInitial, perhaps
  // take it out
	let num = '';
	for (let i = 0; i < formula.length; i++) {
  	// If the char is a number
  	if (!isNaN(Number(formula[i]))) {
    	num = num + formula[i];
    } else {
    	// End loop if char is not a number
    	break;
    }
  }
  // If a subscript exists
  if (num !== '') {
    return parseInitial(formula.substr(num.length), [
    	...tokens, {
      	type: 'subscript',
      	value: Number(num),
      },
    ]);
  }
  
  // If it's not anything, then pass back to parseInitial
  return parseInitial(formula, tokens);
}

function makeTree(tokens) {

}