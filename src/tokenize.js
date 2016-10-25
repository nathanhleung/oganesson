function tokenizeInitial(formula, tokens = []) {
	if (formula.length === 0) {
  	return tokens;
  }
  
  // Tokenize parentheses
  if (formula[0] === '(') {
  	return tokenizeInitial(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'open',
      },
    ]);
  }
  if (formula[0] === ')') {
  	return tokenizeAfterElement(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'close',
      },
    ]);
  }
  // Tokenize hydrate separator
  if (formula[0] === '.') {
    return tokenizeInitial(formula.substr(1), [
      ...tokens, {
        type: 'operator',
        value: 'hydrate',
      },
    ]);
  }
	
  // Tokenize coefficient
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
    return tokenizeInitial(formula.substr(num.length), [
    	...tokens, {
      	type: 'coefficient',
      	value: Number(num),
      },
    ]);
  }

  // Tokenize element
  // Check if current char is uppercase letter
  const char = formula[0];
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    // If next char is a lowercase letter
    if (formula.length > 1) {
      const nextChar = formula[1];
      const nextCode = nextChar.charCodeAt(0);
      if (nextCode >= 97 && nextCode <= 122) {
      	return tokenizeAfterElement(formula.substr(2), [
        	...tokens, {
          	type: 'element',
            value: char + nextChar,
          },
        ]);
      }
    }
    return tokenizeAfterElement(formula.substr(1), [
    	...tokens, {
      	type: 'element',
        value: char,
      },
    ]);
  }
  
  // If it doesn't match anything
  console.error(
    `There was an error parsing your formula. We were able to get to here:\n${JSON.stringify(tokens, null, 2)}`,
    `\n\nRemaining formula: ${formula}`
  );
  throw Error('See message above');
}

function tokenizeAfterElement(formula, tokens) {
	if (formula.length === 0) {
  	return tokenizeInitial(formula, tokens);
  }
  
  // Tokenize subscript
  // This is repeated from tokenizeInitial, perhaps
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
    return tokenizeInitial(formula.substr(num.length), [
    	...tokens, {
      	type: 'subscript',
      	value: Number(num),
      },
    ]);
  }
  
  // If it's not anything, then pass back to tokenizeInitial
  return tokenizeInitial(formula, tokens);
}

export default function tokenize(formula) {
  return tokenizeInitial(formula);
}