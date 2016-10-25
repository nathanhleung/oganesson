export default function countElements(tokens, elements = {}) {
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