import { topSectionConstructor } from "./topSection.js";
import { middleSectionConstructor } from "./middleSection.js";
import { bottomSectionConstructor } from "./bottomSection.js";
// JavaScript
const API_KEY = "AIzaSyBEQ3myFwJGEIaRE1fJPWv2VlGwYsYA9Zk";

const channelInput = document.getElementById("channelInput");
const trackChannel = document.getElementById("trackChannel");
const result = document.getElementById("result");

trackChannel.addEventListener("click", async function () {
  result.innerHTML = ""; // Clear previous results
  const channelHandle = channelInput.value.trim();
  if (!channelHandle) return;

  // --- Fetch channel info ---
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${channelHandle}&key=${API_KEY}`;
  const channelResponse = await fetch(url);
  const channelData = await channelResponse.json();

  if (!channelData.items || channelData.items.length === 0) {
    console.log("Channel not found");
    return;
  }

  const channelInfo = channelData.items[0];
  const stats = channelInfo.statistics;
  const snippet = channelInfo.snippet;
  const channelLogoUrl = snippet.thumbnails.high.url;

    topSectionConstructor(result, channelLogoUrl, channelHandle, snippet);
    middleSectionConstructor(result, stats, channelInfo);
    bottomSectionConstructor(API_KEY, channelInfo);

});