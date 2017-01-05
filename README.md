
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

## Core API

### ``aze.get(obj, key, def)``
Lookup `key` in `obj` and return `def` if not found.

`key` can be a dot-separated path to recursively lookup in `obj`, or an array of
keys. The separator can be changed at `aze.get.SEPARATOR`.

    let timeout = aze.get(config, 'timeout', 1000);


## Additional utils

### `SplitBuffer(guard, cb, repeat)`

Feed chunks of data to a `SplitBuffer` and it will emit slices when it
encounters `guard`.

Unless `repeat` is true, `cb` will only be called upon encountering `guard` the
first time.

`cb` is called with a buffer containing all data up to the guard (inclusive),
and a buffer with the remaining data.

Call the `.feed()` method to push data.

    const SplitBuffer = require('aze/split-buffer');

    function cb(slice, left) {
        console.log(`${slice.length} bytes before yolo. ${left.size} remaining`));
    }

    let buf = new SplitBuffer("yolo", cb);

    buf.feed("blah blah blah blah blah blah blah blah blah blah ");
    buf.feed("blah blah blah blah blah blah blah blah blah blah ");
    buf.feed("blah blah blah blah yolo blah blah blah blah blah ");
    // 124 bytes before yolo. 26 remaining
    buf.feed("blah blah blah blah yolo blah blah blah blah blah ");
    // If `repeat` were set on buf, it would yield:
    // 50 bytes before yolo. 26 remaining

