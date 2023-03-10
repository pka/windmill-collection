export async function main(
  ref: string,
  head_commit: Object
) {
  var branch_or_tag = ref.replace(/.+\//, "");

  // Limit commit message text
  const linklen = 23;  // https://docs.joinmastodon.org/user/posting/
  const maxlen = 500 - 2 - branch_or_tag.length - 2 - linklen;
  var message = head_commit.message.slice(0, maxlen);

  return `${message} [${branch_or_tag}] ${head_commit.url}`;
}