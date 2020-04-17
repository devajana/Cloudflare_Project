addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const COOKIE_NAME = 'Variant'

var counter = 0
let count1 = 0
let count2 = 0
async function handleRequest(request) {
  let res
  if (request.method === 'GET') {
    console.log("Counter: " + ++counter)
    let cookieValue = getCookie(request, COOKIE_NAME)
    if (cookieValue) {
      res = await fetch(cookieValue)
      res = await new Response(res.body)
      res.headers.set('Set-Cookie', setCookie(cookieValue))
    } else {
      res = await generate(request)
    }
    res = new HTMLRewriter().on('title', new AttributeHandler("Testing"+counter)).transform(res)
    res = new HTMLRewriter().on('h1#title', new AttributeHandler("Variant Viewing")).transform(res)
    res = new HTMLRewriter().on('p#description', new AttributeHandler("This is the picked variant for you!")).transform(res)
    res = new HTMLRewriter().on('a#url', new AttributeHandler("www.google.com")).transform(res)
  } else {
    return new Response('Expected GET', { status: 500 })
  }
  console.log("----------------------------------------")
  return res
}

function setCookie(value) {
  return COOKIE_NAME + '=' + value + '; path=/; Domain=.devajana.workers.dev; HttpOnly; SameSite=Lax; Secure'
}

function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  // console.log("Got cookie: "+cookieString)
  if (cookieString) {
    // console.log("Incoming cookie: "+ cookieString)
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  // console.log("Cookie Result: "+result)
  return result
}

async function generate(request) {
  const links = await getLinks()
  let link
  if (count1 < count2) {
    count1++;
    console.log("count1: "+count1);
    link = links[0]
  } else {
    count2++
    console.log("count2: "+count2);
    link = links[1]
  }
  var response = await fetch(link)
  var res = await new Response(response.body)
  res.headers.set('Set-Cookie', setCookie(link))
  return res
}

async function getLinks(fooValue) {
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

class ElementHandler {

  element(element) {
    console.log(element)
    element.remove()
  }
}

class AttributeHandler {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    element.setInnerContent(this.attributeName)

  }
}
