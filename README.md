# A/B Variantion of URL using Cloudflare

## What is it?

Using Cloudflare Workers, deployed an application that will randomly send users to one of two webpages. This project is written using Cloudflare Workers API, managed and developed using the command-line tool Wrangler, and deployed them to the free workers.dev deployment playground.

## Steps

### 1. Generated a new project using `wrangler generate` command
Using the `generate` command, generated a new project on local machine

### 2. Request the URLs from the API and distribute requests between variants
Made a fetch request inside script's event handler to the URL `https://cfw-takehome.developers.workers.dev/api/variants`. The response contains an array of two URLs. 
Client requests are be evenly distributed between the two urls, in A/B testing style where the script returns each variant around 50% of the time.

### 3. Request a variant
Make a fetch request is made to one of the two URLs

### 4. Changing attributes and contents
For each variant page, there are a number of items on the page that can be customized. The below items are customized using [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)
- `title`, `title` (header), `description`, `url` 

### 5. Return a response to the client request
After the HTML modification, the response is returned to the requested client.

### 6. Persisting variants
When a user visits the site, they receive one of the two URLs and it is persisted in the cookie. If the user revisits the application, the persisted URL is displayed.

## Published domain
Using wrangler's `publish` command, the application is deployed and made available under workers.dev subdomain.
Please visit the below link to visit the domain:
    https://project-cf.devajana.workers.dev

## Reference Links
- [Workers Quick Start documentation](https://developers.cloudflare.com/workers/quickstart/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)
- [Cookie documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
