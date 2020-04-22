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
      res = new HTMLRewriter().on('title', new AttributeHandler("Testing: "+ count1 +"\t" +count2)).transform(res)
      res = new HTMLRewriter().on('h1#title', new AttributeHandler("Variant Viewing: "+ count1 +"\t" +count2)).transform(res)
      res = new HTMLRewriter().on('p#description', new AttributeHandler("This is the picked variant for you!")).transform(res)
      res = new HTMLRewriter().on('a#url', new AttributeHandler("www.google.com")).transform(res)
    }
  } else {
    response = new Response('Expected GET', { status: 500 })
  }
  return response
}

async function generate(request) {
  const links = await getLinks()
  var links
  if (count1 < count2) {
    count1++
    link = links[0]
  } else {
    count2++
    link = links[1]
  }
}


function setCookie(value) {
  const created_cookie = `variant=`+ value +`; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Path='/';`
  response.headers.set('Set-Cookie', created_cookie)
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

class AttributeHandler {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    element.setInnerContent(this.attributeName)

  }
}