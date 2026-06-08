/**
 * Decap CMS — GitHub OAuth broker for Cloudflare Workers
 * ------------------------------------------------------
 * This lets the /admin panel log in with GitHub even though the site is
 * hosted on static GitHub Pages. Deploy this as a Cloudflare Worker.
 *
 * SETUP (one time):
 *
 * 1. Create a GitHub OAuth App:
 *    GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
 *      - Application name:  Portfolio CMS
 *      - Homepage URL:      https://sam9239.github.io/Portfolio/
 *      - Authorization callback URL:  https://<your-worker>.workers.dev/callback
 *    Click Register, then "Generate a new client secret".
 *    Copy the Client ID and Client Secret.
 *
 * 2. Create the Worker:
 *    Cloudflare dashboard → Workers & Pages → Create → Worker.
 *    Paste this entire file as the Worker code and Deploy.
 *    Note the worker URL, e.g. https://portfolio-cms.<account>.workers.dev
 *
 * 3. Add the secrets to the Worker:
 *    Worker → Settings → Variables and Secrets → add two SECRETS:
 *      OAUTH_CLIENT_ID      = <your GitHub Client ID>
 *      OAUTH_CLIENT_SECRET  = <your GitHub Client Secret>
 *
 * 4. Update the GitHub OAuth App's callback URL to match the real worker URL:
 *      https://portfolio-cms.<account>.workers.dev/callback
 *
 * 5. In admin/config.yml set:
 *      backend:
 *        name: github
 *        repo: Sam9239/Portfolio
 *        branch: main
 *        base_url: https://portfolio-cms.<account>.workers.dev
 *
 * Then visit https://sam9239.github.io/Portfolio/admin/ and "Login with GitHub".
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step A: kick off the OAuth flow
    if (url.pathname === "/auth") {
      const redirectUri = `${url.origin}/callback`;
      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set("client_id", env.OAUTH_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "repo,user");
      authUrl.searchParams.set("state", crypto.randomUUID());
      return Response.redirect(authUrl.toString(), 302);
    }

    // Step B: GitHub redirects back here with a code; exchange it for a token
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();
      const token = data.access_token;
      const status = token ? "success" : "error";
      const payload = token ? { token, provider: "github" } : data;

      // Hand the token back to the Decap CMS popup window
      const body = `<!DOCTYPE html><html><body><script>
        (function () {
          function send(msg) { window.opener && window.opener.postMessage(msg, "*"); }
          window.addEventListener("message", function () {
            send('authorization:github:${status}:${JSON.stringify(payload)}');
          }, false);
          send("authorizing:github");
        })();
      </script></body></html>`;

      return new Response(body, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Decap CMS OAuth broker. Use /auth to begin.", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
