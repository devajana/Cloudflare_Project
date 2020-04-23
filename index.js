addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

const COOKIE_NAME = 'variant'
 
var count1 = 0
let count2 = 0
async function handleRequest(request) {
  let res
  // Check if the Request is a 'GET' request
  if (request.method === 'GET') {
    // Check if the cookie already exists
    let cookieValue = getCookie(request, COOKIE_NAME)
    if (cookieValue) {
      res = await fetch(cookieValue)
      res = await new Response(res.body)
      res.headers.set('Set-Cookie', setCookie(cookieValue))
    } else {
      // Cookie doesn't exist, first time call
      
      // To restart counter
      // await COUNTER1.delete('count1')
      // await COUNTER1.delete('count2')
      count1 = await COUNTER1.get('count1')
      if (count1 == null)
        count1 = 0
      count2 = await COUNTER1.get('count2')
      if (count2 == null)
        count2 = 0
      
      // generate the response using fetch
      res = await generate(request)
      console.log("Count1: "+count1+" Count2: "+count2)
      // Load the counter
      await COUNTER1.put('count1', count1)
      await COUNTER1.put('count2', count2)
    }
    // rewrite the response
    res = rewriteHTML(res)
  } else {
    return new Response('Expected GET', { status: 500 })
  }
  return res
}

function setCookie(value) {
  return COOKIE_NAME + '=' + value + '; path=/; Domain=.devajana.workers.dev; HttpOnly; SameSite=Lax; Secure'
}

function rewriteHTML(res) {
    res = new HTMLRewriter().on('title', new AttributeHandler("Cloudflare project")).transform(res)
    res = new HTMLRewriter().on('h1#title', new AttributeHandler("Demostration of the Cloudflare project")).transform(res)
    res = new HTMLRewriter().on('p#description', new AttributeHandler("Hope you have a great day! \n Don't forget to wash your hands. Stay safe!")).transform(res)
    res = new HTMLRewriter().on('a#url', new AttributeHandler("Check out this project on GitHub")).transform(res)
    res = new HTMLRewriter().on('a', new AttributeRewriter('href')).transform(res)
    return res
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

class AttributeHandler {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    element.setInnerContent(this.attributeName)

  }
}
const OLD_URL = "https://cloudflare.com"
const NEW_URL = "https://github.com/devajana/Cloudflare_Project"

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