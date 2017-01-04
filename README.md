
                        ,adPPYYba, 888888888  ,adPPYba,
                        ""     `Y8      a8P" a8P_____88
                        ,adPPPPP88   ,d8P'   8PP"""""""
                        88,    ,88 ,d8"      "8b,   ,aa
                        `"8bbdP"Y8 888888888  `"Ybbd8"'

Javascript utility collection

## Installation

    npm install --save aze

or

    npm install --save git+https://github.com/svvac/aze.js.git

Then

    const aze = require('aze');

## API

### ``aze.get(obj, key, def)``
Lookup `key` in `obj` and return `def` if not found.

`key` can be a dot-separated path to recursively lookup in `obj`, or an array of
keys. The separator can be changed at `aze.get.SEPARATOR`.

    let timeout = aze.get(config, 'timeout', 1000);

