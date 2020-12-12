addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let matches = capturePathParameters(request)

  if (request.method !== "GET" || !matches.length)
    return badge("invalid", "request", "critical")

  let label = matches[1].trim(), buildTypeId = matches[2]
  let response = await buildStatusFor(buildTypeId)

  if (!response.ok) return badge(label, "status not found", "important")

  let status = await response.text()
  return badge(label, messageFor(status), colourFor(status))
}

function capturePathParameters(request) {
  let path = decodeURI(new URL(request.url).pathname)
  return path.match(/\/([\w\s-_]{2,})\/([\w-_]{5,})/) || [];
}

function badge(label, message, colour) {
  let url = `https://img.shields.io/badge/${label}-${message}-${colour}?style=flat`
  return fetch(encodeURI(url))
}

async function buildStatusFor(buildTypeId) {
  return fetch(new Request(
    `${TEAMCITY_BASE_URL}/app/rest/builds/buildType:(id:${buildTypeId})/status`,
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}`} }
  ))
}

function messageFor(status) {
  switch (status) {
    case "SUCCESS": return "passed"
    case "FAILURE": return "failed"
    default: return "unknown"
  }
}

function colourFor(status) {
  switch (status) {
    case "SUCCESS": return "success"
    case "FAILURE": return "critical"
    default: return "inactive"
  }
}
