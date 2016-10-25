/**
 * Frontend-specific code
 */
 
/**
 * Get elements data
 */
let loading = true;
const req = new XMLHttpRequest();
req.open('GET', 'ptable.json');
req.addEventListener('load', () => {
  loading = false;
  const ptable = JSON.parse(req.responseText);
  function getMass(elements) {
    let sum = 0;
    const keys = Object.keys(elements);
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < ptable.length; j++) {
        if (ptable[j].symbol === keys[i]) {
          let atomicMass;
          let data = ptable[j].atomicMass;
          if (typeof data === 'string') {
            const parenthesis = data.indexOf('(');
            atomicMass = Number(data.substr(0, parenthesis - 1));
          } else if (Array.isArray(data)) {
            atomicMass = data[0];
          }
          sum += (elements[keys[i]] * atomicMass);
        }
      }
    }
    return Math.round(sum * 100) / 100;
  }
  
  document.getElementById('atoms').addEventListener('submit', onSubmit);
  
  function onSubmit(e) {
    e.preventDefault();
    const resultEl = document.getElementById('result');
    const tokens = parseInitial(e.target.formula.value);
    const counts = countElements(tokens);
    
  	resultEl.innerHTML =
  	  `Counts: ${JSON.stringify(counts)}\n` +
  	  `Mass: ${getMass(counts)}`
  }

});
req.send();

/**
 * Actual parsing code
 */

function parseInitial(formula, tokens = []) {
	if (formula.length === 0) {
  	return tokens;
  }
  
  // Parse parentheses
  if (formula[0] === '(') {
  	return parseInitial(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'open',
      },
    ]);
  }
  if (formula[0] === ')') {
  	return parseAfterElement(formula.substr(1), [
    	...tokens, {
      	type: 'parenthesis',
        value: 'close',
      },
    ]);
  }
  // Parse hydrate separator
  if (formula[0] === '.') {
    return parseInitial(formula.substr(1), [
      ...tokens, {
        type: 'operator',
        value: 'hydrate',
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
  console.error(
    `There was an error parsing your formula. We were able to get to here:\n${JSON.stringify(tokens, null, 2)}`,
    `\n\nRemaining formula: ${formula}`
  );
  throw Error('See message above');
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

function countElements(tokens, elements = {}) {
  if (tokens.length === 0) {
    return elements;
  }
  // Create keys for each element present in the tokens array
  if (Object.keys(elements).length === 0) {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'element') {
        if (typeof elements[tokens[i].value] === 'undefined') {
          elements[tokens[i].value] = 0;
        } 
      }
    }
  }
  
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'coefficient') {
      return countInGroup(tokens.slice(1), elements, tokens[i].value);
    } else if (tokens[i].type === 'element') {
      return countInGroup(tokens, elements);
    } else if (tokens[i].type === 'operator') {
      if (tokens[i].value === 'hydrate') {
        if (
          tokens.length > (i + 1) &&
          tokens[i + 1].type === 'coefficient'
        ) {
          return countInGroup(tokens.slice(2), elements, tokens[i + 1].value);
        }
        // if it's just plan .H2O
        return countInGroup(tokens.slice(1), elements);
      }
    } else if (tokens[i].type === 'parenthesis') {
      if (tokens[i].value === 'open') {
        for (let j = i; j < tokens.length; j++) {
          if (tokens[j].type === 'parenthesis' && tokens[j].value === 'close') {
            // There will always be a subscript after a parenthetical group
            if (
              tokens.length > (j + 1) &&
              tokens[j].type === 'parenthesis' &&
              tokens[j].value === 'close'
            ) {
              if (tokens[j + 1].type === 'subscript') {
                return countInGroup(tokens.slice(1), elements, tokens[j + 1].value);
              }
            }
            console.error(JSON.stringify(tokens, null, 2));
            console.error(JSON.stringify(elements, null, 2))
            throw new Error('Parenthetical group must have subscript');
          }
        }
        return countInGroup(tokens.slice(1), elements);
      } else {
        // Skip closing parenthesis and subscript
        return countInGroup(tokens.slice(2), elements);
      }
    }
  }
  
  // If none of the above cases are covered then throw an error
  console.error('There was an error');
  console.log(JSON.stringify(tokens, null, 2));
  console.log(JSON.stringify(elements, null, 2));
  throw new Error('See message above');
}

function countInGroup(tokens, elements, coefficient = 1) {
  if (tokens.length === 0) {
    return countElements(tokens, elements);
  }
  
  if (tokens[0].type !== 'element') {
    // If this happens this is likely a mistake, pass back to countElements
    return countElements(tokens, elements);
  }
  
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i].type === 'element') {
      if (tokens.length > (i + 1) && tokens[i + 1].type === 'subscript') {
        elements[tokens[i].value] += (tokens[i + 1].value * coefficient);
        i += 2;
        continue;
      }
      elements[tokens[i].value] += coefficient;
      i++;
      continue;
    }
    break;
  }
  return countElements(tokens.slice(i), elements);
}