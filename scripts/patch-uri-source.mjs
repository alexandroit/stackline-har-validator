// Apply to upstream source before bundling, never to generated output alone.
export function patchUriSource (source) {
  const original = String.raw`uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/)`
  if (source.split(original).length !== 2) {
    throw new Error('uri-js legacy port fallback changed; review the linear compatibility patch.')
  }
  return "var hasLegacyEmptyPort = require('stackline:legacy-uri-port');\n" +
    source.replace(original, 'hasLegacyEmptyPort(uriString)')
}
