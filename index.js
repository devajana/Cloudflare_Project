addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
const COOKIE_NAME = 'variant'
let response
async function handleRequest(request) {
  if (request.method === 'GET') {
    let cookieValue = getCookie(request, COOKIE_NAME)
    if (cookieValue != null) {
      response = new Response('cookie present', { status: 200 })
    } else {
      let respons = await generate(request, response)
      response = Response.redirect(respons)
    }
  } else {
    response = new Response('Expected GET', { status: 500 })
  }
  return response
}

async function generate(request) {
  const links = await getLinks()
  let fooValue = foo()
  if (fooValue === 'false') {
    setCookie(0)
    return links[0];
  }
  if (fooValue === 'true') {
    setCookie(1)
    return links[1];
  }
}

function foo() {
  if( typeof foo.counter === 'undefined' ) {
    foo.counter = 'false';
  } else
  if( foo.counter === 'false' ) {
    foo.counter = 'true';
  } else
  if( foo.counter === 'true' ) {
    foo.counter = 'false';
  }
  console.log(foo.counter)
  return foo.counter
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
  console.log(jsonObj.variants)
  return jsonObj.variants
}

function setCookie(value) {
  const created_cookie = `variant=`+ value +`; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Path='/';`
  response.headers.set('Set-Cookie', created_cookie)
}

async function getCookie(request, name) {
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