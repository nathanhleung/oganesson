# Chemistry Parser
Parses chemical formulas

## API
In progress

### `parseInitial(formula)`

Parses formula

`parseInitial('Ba(NO3)2');`

```
{
  "status": "SUCCESS",
  "tokens": [
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
}
```
