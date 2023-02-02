export async function main(
  web_request: Object
) {
  const maxlen = 500 - 1 - 23; // https://docs.joinmastodon.org/user/posting/
  var message = web_request.head_commit.message.slice(0, maxlen);
  return `${message} ${web_request.head_commit.url}`;
}