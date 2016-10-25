# Chemistry Parser
Parses chemical formulas

## API
In progress

### `parseInitial(formula)`

Parses formula

Example output:

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

## todo
- be careful with them while loops!