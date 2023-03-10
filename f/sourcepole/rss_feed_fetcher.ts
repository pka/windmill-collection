import * as wmill from "https://deno.land/x/windmill@v1.60.0/mod.ts"
import { parse } from "https://deno.land/x/xml/mod.ts";


export async function main(rss_feed: string | wmill.Resource<"c_rss_feed">) {
  const rss_feed_url = (typeof rss_feed === "string") ? rss_feed : rss_feed.url;
  let feedStates = await wmill.getInternalState() || {};
  const newestItem: Date = new Date(feedStates[rss_feed_url] || 0);

  const items = await fetch(rss_feed_url)
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
    const dates = items.map(item => item.pubDate);
    newState[rss_feed_url] = new Date(Math.max(...dates));
    await wmill.setInternalState(newState);
  }

  return items.reverse();
}

function rss2_items(feed) {
  var items = feed["rss"]["channel"]["item"] || [];
  //console.log(items);
  if (items.length === "undefined") { // Single entry
    items = [items];
  }
  return items.map(item => ({
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: new Date(item.pubDate)
  }));
}

function atom_items(feed) {
  var items = feed["feed"]["entry"] || [];
  //console.log(items);
  if (items.length === "undefined") { // Single entry
    items = [items];
  }
  return items.map(item => ({
    title: (typeof item.title === 'string') ? item.title : item.title["#text"],
    link: (item.link instanceof Array) ? item.link[0]["@href"] : item.link["@href"],
    description: (item.summary instanceof Array) ? item.summary[0]["#text"] : item.summary["#text"],
    pubDate: new Date(item.updated)
  }));
}
