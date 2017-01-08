# Oganesson [![npm version](https://badge.fury.io/js/oganesson.svg)](https://www.npmjs.com/package/oganesson) [![Dependency Status](https://david-dm.org/nathanhleung/oganesson.svg)](https://david-dm.org/nathanhleung/oganesson)
A parser for chemical formula strings.

## Quick Start

```js
// ES6
import { tokenize, countElements, getMass } from 'oganesson';

tokenize(<formula>)

// ES5
const oganesson = require('oganesson');

oganesson.tokenize(<formula>)
```

## API

### `tokenize(formula)`
Tokenizes the given formula.

#### Arguments
* formula _(String)_: The chemical formula to tokenize.
  > Note: The formula does not necessarily have to be valid.

#### Returns
An object with an array of tokens.

#### Examples

#### Valid formula

```js
tokenize('Ba(NO3)2');
```

```js
[
  {
    "type": "element",
    "value": "Ba"
  },
  {
    "type": "parenthesis",
    "value": "open"
  },
  {
    "type": "element",
    "value": "N"
  },
  {
    "type": "element",
    "value": "O"
  },
  {
    "type": "subscript",
    "value": 3
  },
  {
    "type": "parenthesis",
    "value": "close"
  },
  {
    "type": "subscript",
    "value": 2
  }
]
```

##### Invalid, but parseable formula

```js
tokenize('B)(')
```

```js
[
  {
    "type": "element",
    "value": "B"
  },
  {
    "type": "parenthesis",
    "value": "close"
  },
  {
    "type": "parenthesis",
    "value": "open"
  }
]
```

##### Unparseable formula

```js
tokenize('aB)(')
```

```js
// Throws an error
```

### `countElements(tokens)`
Counts the number of each element in the given tokens.

#### Arguments
* tokens _(Array)_: An array of tokens
  > Note: The tokens should be in the format that `tokenize` returns.

#### Returns
An object with each element mapped to the number of instances it occurs in the tokenization.

#### Examples

```js
countElements(tokenize('Ba(NO3)2');
```

```js
{
  "Ba": 1,
  "N": 2,
  "O": 6
}
```

### `getMass(counts)`
Gets the total mass of the given counts.

#### Arguments
* counts _(Object)_: The counts of each element.
  > Note: The counts should be in the format that `countElements` returns.

#### Returns
The total mass of the given counts.

#### Examples

```js
getMass(countElements(tokenize('Ba(NO3)2')));
```

```js
261.33
```

## Todo
- Throw an error in either `tokenize` or `countElements` when the formula is invalid.
