# A/B Variantion of URL using Cloudflare

This is an application deployed using Cloudflare Workers that fetches one of two webpages when the user visits, each with equal distribution. It is written using Cloudflare Workers API, managed and developed using the command-line tool Wrangler, and deployed to the free workers.dev deployment playground. 
The application can be found in https://project-cf.devajana.workers.dev

## Steps

### 1. Create a new project
Using the command `wrangler generate`, generated a new project on local machine

### 2. Request the URLs from the API and distribute requests between variants
The event handler in the script fetches the variants using the API `https://cfw-takehome.developers.workers.dev/api/variants`. The response contains an array of two URLs. 
Client requests are evenly distributed between the two urls, in A/B testing style where the script returns each variant around 50% of the time. The counter for the distribution is stored in 
[Workers KV](https://developers.cloudflare.com/workers/tooling/wrangler/kv_commands/) 

### 3. Request a variant
A `Fetch` request is made to one of the two URLs

### 4. Changing attributes and contents
In each variant page, there are a few UI elements on the page that can be customized. The following are customized using [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)
- `title`, `h1#title`, `p#description`, `a#url` 

### 5. Return a response to the client request
After the HTML modification, the response is returned to the requested client.

### 6. Persisting variants
When a user visits the site for the first time, they receive one of the two variants. The URL of that variant is stored in the session cookie. Hence when the user revisits the application, the persisted variant is displayed.

## Published domain
Using `wrangler publish` command, the application is deployed and is accessible under workers.dev subdomain.
Please visit the below link to visit the application:
    https://project-cf.devajana.workers.dev

## Reference Links
- [Workers Quick Start documentation](https://developers.cloudflare.com/workers/quickstart/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)
- [Cookie documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Workers KV](https://developers.cloudflare.com/workers/tooling/wrangler/kv_commands/)
