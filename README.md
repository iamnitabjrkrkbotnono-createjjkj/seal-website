# Hiyori's Hangout 🦭

A tiny, responsive Hiyori-themed chatroom with a live AI personality.

## Deploy the live AI version

GitHub Pages can host the static page, but it cannot run the private server function that talks to the AI. Deploy this repository with Vercel so the `api/chat.js` function runs securely.

1. Create an API key in the [OpenAI API dashboard](https://platform.openai.com/api-keys). API usage is billed separately from a ChatGPT subscription.
2. Sign in to [Vercel](https://vercel.com/) with GitHub and import `iamnitabjrkrkbotnono-createjjkj/seal-website`.
3. In the Vercel project, open **Settings → Environment Variables**.
4. Add an environment variable named `OPENAI_API_KEY` and paste your API key as its value. Do not put the key in `index.html`, GitHub, or any browser code.
5. Optionally add `OPENAI_MODEL` with a model name available to your API account. If omitted, the function uses `gpt-5.5`.
6. Deploy the project. Open the Vercel URL it gives you; that is the live AI version of Hiyori's Hangout.

Whenever you push changes to the connected GitHub repository, Vercel can redeploy the site.

## Local preview

Opening `index.html` directly only previews the page; the live AI chat needs the Vercel server function. To test the complete app locally, use the Vercel CLI and run `vercel dev` after setting `OPENAI_API_KEY` in your local environment.

## How chat works

- The browser sends the recent conversation to `/api/chat`.
- `api/chat.js` calls the OpenAI Responses API using the server-side `OPENAI_API_KEY`.
- The browser stores a short recent transcript in local storage so Hiyori can follow the conversation in that browser.
- The API key is never sent to the browser.
- Hiyori is an AI character inspired by the real spotted seal, not the actual animal.

The Hiyori GIF is linked from its Tenor page and credited in the website footer. Original seal updates: [@aguhiyori](https://www.instagram.com/aguhiyori/).
