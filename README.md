# The CSV Parser

The CSV Parser is a node library that converts csv to JSON and outputs either to console or file as per user preference.


## Usage

```js
node the-csv-parser.js --options
```

## Options Supported
-- help:Gives documentation on the console on how to use the library

'-' or '--in': Inline input to the library

--file: Give local file path

--out: Output to console instead of saving in local file

--tsv: Parses tab separated values (if not mentioned, input is assumed to be csv values)

Example:
```js
node the-csv-parser.js --file=csv.txt --out=true --tsv=true
```

## In Progress
- Intelligently detect separator
- Testing
- Lot of configuration options to the user

## License
[MIT](https://choosealicense.com/licenses/mit/)