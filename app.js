import { topSectionConstructor } from "./topSection.js";
import { middleSectionConstructor } from "./middleSection.js";
import { bottomSectionConstructor } from "./bottomSection.js";
import { formatNumbers } from "./formatnumbers.js";
import { estimateMonthlySubsUniversal } from "./estSubsPerMonth.js";

const API_KEY = "AIzaSyBEQ3myFwJGEIaRE1fJPWv2VlGwYsYA9Zk";

const channelInput = document.getElementById("channelInput");
const trackChannel = document.getElementById("trackChannel");
const result = document.getElementById("result");
const footer = document.querySelector("footer");
footer.classList.add('footer');
// Helper function: estimate last 30 days views of a video
function estimateViewsThisMonth(video) {
    const today = new Date();
    const videoDate = new Date(video.snippet.publishedAt);
    const totalViews = Number(video.statistics.viewCount);
    footer.classList.remove('footer');
    const ageInDays = (today - videoDate) / (1000 * 60 * 60 * 24);
    if (ageInDays <= 30) {
        return totalViews; // fully new video
    } else {
        return totalViews * (30 / ageInDays); // approximate last 30 days
    }
}

// Helper function: estimate earnings
function earnings(views, rate) {
    return (views / 1000) * rate;
}

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

    const creatorsStatistics = document.createElement('div');
    result.appendChild(creatorsStatistics);
    creatorsStatistics.classList.add('creatorsStatistics');

    const topCS = document.createElement('div');
    topCS.classList.add('topCS');
    creatorsStatistics.appendChild(topCS);

    const bottomCS = document.createElement('div');
    bottomCS.classList.add('bottomCS');
    creatorsStatistics.appendChild(bottomCS);


    const title = document.createElement('h1');
    title.textContent = "Creator's statistics:";
    topCS.appendChild(title);

    function createStat(titleText, valueText) {
        const container = document.createElement("div");
        container.classList.add("stats");

        const title = document.createElement("h2");
        title.textContent = titleText;

        const value = document.createElement("h2");
        value.textContent = valueText;

        container.appendChild(title);
        container.appendChild(value);
        return container;
    }

    const channelId = channelInfo.id;

    // --- Fetch uploads playlist ---
    const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
    const channelDetailsResponse = await fetch(channelDetailsUrl);
    const channelDetailsData = await channelDetailsResponse.json();
    const uploadsPlaylistId = channelDetailsData.items[0].contentDetails.relatedPlaylists.uploads;

    let nextPageToken = "";
    let totalViewsLastMonth = 0;
    let totalViewsLastYear = 0;

    const dateMonthAgo = new Date();
    dateMonthAgo.setMonth(dateMonthAgo.getMonth() - 1);

    const dateYearAgo = new Date();
    dateYearAgo.setFullYear(dateYearAgo.getFullYear() - 1);

    let stopFetching = false;

    while (!stopFetching) {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
        const playlistResponse = await fetch(playlistUrl);
        const playlistData = await playlistResponse.json();

        if (!playlistData.items || playlistData.items.length === 0) break;

        const videoIds = playlistData.items.map(v => v.snippet.resourceId.videoId);
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(",")}&key=${API_KEY}`;
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();

        for (const video of videosData.items) {
            const videoDate = new Date(video.snippet.publishedAt);

            // Yearly views
            if (videoDate >= dateYearAgo) totalViewsLastYear += Number(video.statistics.viewCount);

            // Monthly views: proportional estimate
            totalViewsLastMonth += estimateViewsThisMonth(video);
        }

        // Stop if the last video is older than a year and a month
        const lastVideoDate = new Date(videosData.items[videosData.items.length - 1].snippet.publishedAt);
        if (lastVideoDate < dateYearAgo && lastVideoDate < dateMonthAgo) stopFetching = true;

        nextPageToken = playlistData.nextPageToken;
        if (!nextPageToken) break;
    }

    // Earnings calculation
    const minMonthErning = earnings(totalViewsLastMonth, 0.25);
    const maxMonthErning = earnings(totalViewsLastMonth, 4);
    const minYearErning = earnings(totalViewsLastYear, 0.25);
    const maxYearErning = earnings(totalViewsLastYear, 4);

    // Display statistics
    bottomCS.appendChild(createStat(
        "Monthly Subs",
        `${formatNumbers(estimateMonthlySubsUniversal(totalViewsLastMonth))}`
    ));

    bottomCS.appendChild(createStat(
        "Monthly Views",
        `${formatNumbers(Math.round(totalViewsLastMonth))}`
    ));

    bottomCS.appendChild(createStat(
        "Monthly Estimated Earnings",
        `$${formatNumbers(minMonthErning.toFixed(2))} - $${formatNumbers(maxMonthErning.toFixed(2))}`
    ));

    bottomCS.appendChild(createStat(
        "Yearly Estimated Earnings",
        `$${formatNumbers(minYearErning.toFixed(2))} - $${formatNumbers(maxYearErning.toFixed(2))}`
    ));

    bottomSectionConstructor(API_KEY, channelInfo);
});