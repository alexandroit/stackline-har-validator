'use strict'

// Boolean equivalent of uri-js's legacy empty-port fallback. The original
// unanchored //...: regex retries every slash on failure. Scan once instead,
// preserving its LF support and its CR / Unicode line-separator boundaries.
module.exports = function hasLegacyEmptyPort (value) {
  var authority = false
  for (var index = 0; index < value.length; index++) {
    var code = value.charCodeAt(index)
    if (code === 13 || code === 0x2028 || code === 0x2029) {
      authority = false
    } else if (!authority && code === 47 && value.charCodeAt(index + 1) === 47) {
      authority = true
      index++
    } else if (authority && code === 58) {
      var next = value.charCodeAt(index + 1)
      if (index + 1 === value.length || next === 47 || next === 63 || next === 35) return true
    }
  }
  return false
}
