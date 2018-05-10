# abstract-cache-levelup

`abstract-cache` over `levelup`

## Usage

```javascript
const cache = require('abstract-cache')({
  useAwait: true,
  driver: {
    name: '@seangenabe/abstract-cache-levelup',
    options: {
      location: './db'
    }
  }
})
```

OR

```javascript
const db = level('./db')
const client = new require('@seangenabe/abstract-cache-levelup/client')({
  db
})
const cache = require('abstract-cache')({
  useAwait: true,
  client
})
```

## Options

These are the options for both the function and the client class.

* `db`: The `levelup` instance to use. Overrides `location` and `options`.
* `location`: Location to be passed to `level`.
* `options`: Options to be passed to `level`.
