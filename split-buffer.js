/* Copyright 2016 Simon `svvac` Wachter (_@svvac.net)

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENaze.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class SplitBuffer {
    constructor(guard, callback, repeat, trim) {
        this.guard = guard;
        this.buf = Buffer.alloc(0);
        this.cb = callback;
        this.offset = 0;
        this.repeat = !!repeat;
        this.done = false;
        this.trim = Boolean(trim);
    }

    feed(data) {
        if (this.done) return;

        if (data) {
            data = Buffer.from(data);
            this.buf = Buffer.concat([ this.buf, data ], this.buf.length + data.length);
        } else {
            data = '';
        }

        let idx = this.buf.indexOf(this.guard, this.offset);
        if (idx > -1) {
            if (!this.trim) idx += this.guard.length;
            const slice = this.buf.slice(0, this.trim ? idx : idx + this.guard.length - 1);
            const leftover = this.buf.slice(idx + this.guard.length - 1);

            this.buf = leftover;
            this.offset = 0;

            setImmediate(() => this.cb(slice, leftover));

            if (this.repeat) {
                if (this.offset < this.buf.length) {
                    setImmediate(() => this.feed());
                }
            } else {
                this.done = true;
            }

        } else {
            this.offset = this.buf.length;
        }
    }
}

module.exports = SplitBuffer;

