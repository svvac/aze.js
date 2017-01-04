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

function get(obj, key, def) {
    if (!obj || typeof obj !== 'object') return def;
    if (typeof key === 'string') return get(obj, key.split(get.SEPARATOR), def);

    if (!Array.isArray(key) || key.length < 1) {
        console.log(key);
        throw new TypeError('Key must be a string or an array of strings');
    }

    const k = key.shift().toString();

    if (key.length === 0) {
        return k in obj ? obj[k] : def;
    }

    return k in obj ? get(obj[k], key, def) : def;
}
get.SEPARATOR = '.';
module.exports = get;

