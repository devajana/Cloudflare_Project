addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
const COOKIE_NAME = 'variant'

var count1 = 0
var count2 = 0

async function handleRequest(request) {
  let response
  if (request.method === 'GET') {
    let cookieValue = getCookie(request, COOKIE_NAME)
    if (cookieValue) {
      response = await fetch(cookieValue)
      response = await new Response(response.body)
      response.headers.set('Set-Cookie', setCookie(cookieValue))
    } else {
      count1 = await COUNTER1.get('count1')
      if (count1 == null)
      count1 = 0
      count2 = await COUNTER1.get('count2')
      if (count2 == null)
        count2 = 0
      response = await generate(request)
      await COUNTER1.put('count1', count1)
      await COUNTER1.put('count2', count2)
    }
    response = rewriteHTML(response)
  } else {
    response = new Response('Expected GET', { status: 500 })
  }
  return response
}

async function generate(request) {
  const links = await getLinks()
  var link
  if (count1 < count2) {
    count1++
    link = links[0]
  } else {
    count2++
    link = links[1]
  }
  var response = await fetch(link)
  var res = await new Response(response.body)
  res.headers.set('Set-Cookie', setCookie(link))
  return res
}

function rewriteHTML(res) {
  res = new HTMLRewriter().on('title', new RewriteHandler("Testing: "+ count1 +"\t" +count2)).transform(res)
  res = new HTMLRewriter().on('h1#title', new RewriteHandler("Variant Viewing: "+ count1 +"\t" +count2)).transform(res)
  res = new HTMLRewriter().on('p#description', new RewriteHandler("This is the picked variant for you!")).transform(res)
  res = new HTMLRewriter().on('a#url', new RewriteHandler("www.google.com")).transform(res)
  res = new HTMLRewriter().on('a', new AttributeRewriter('href')).transform(res)
  return res
}

function setCookie(value) {
  return COOKIE_NAME + '=' + value + '; path=/; Domain=.devajana.workers.dev; HttpOnly; SameSite=Lax; Secure'
}

function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}

async function getLinks() {
  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }
  const res = await fetch('https://cfw-takehome.developers.workers.dev/api/variants', init )
  var resjson = await res.text()
  const jsonObj = JSON.parse(resjson)
  return jsonObj.variants
}

class RewriteHandler {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    element.setInnerContent(this.attributeName)
  }
}

const OLD_URL = "https://cloudflare.com"
const NEW_URL = ""

class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace(OLD_URL, NEW_URL),
      )
    }
  }
}
