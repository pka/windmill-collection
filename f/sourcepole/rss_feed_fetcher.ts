import * as wmill from "https://deno.land/x/windmill@v1.60.0/mod.ts"
import { parse } from "https://deno.land/x/xml/mod.ts";

export async function main(rss_feed: wmill.Resource<"c_rss_feed">) {

  let feedStates = await wmill.getInternalState() || {};
  const newestItem: Date = new Date(feedStates[rss_feed.url] || 0);

  const items = await fetch(rss_feed.url)
    .then(response => response.text())
    .then(str => parse(str))
    .then(feed => {
      let items = [];
      if (feed["rss"]) {
        items = rss2_items(feed);
      } else if (feed["feed"]) {
        items = atom_items(feed);
      }
      const new_items = items
        .filter(item => item.pubDate > newestItem);
      return new_items;
    });

  if (items.length > 0) {
    let newState = await wmill.getInternalState() || {};
    newState[rss_feed.url] = items[0].pubDate;
    await wmill.setInternalState(newState);
  }

  return items.reverse();
}

function rss2_items(feed) {
  return feed["rss"]["channel"]["item"].map(item => ({
    title: item.title,
    link: item.link,
    pubDate: new Date(item.pubDate)
  }));
}

function atom_items(feed) {
  return feed["feed"]["entry"].map(item => ({
    title: item.title,
    link: item.link["@href"],
    pubDate: new Date(item.updated)
  }));
}
