import * as wmill from "https://deno.land/x/windmill@v1.60.0/mod.ts"

export async function main(channel: string, username: string, text: string,
  api: wmill.Resource<"c_slackapi">) {

  const payload = { "text": text, "username": username, "channel": channel };
  const resp = await fetch(api.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return {
    ok: resp.ok,
    status: resp.status,
    text: await resp.text(),
  };
}