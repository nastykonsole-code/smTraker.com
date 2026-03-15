

export async function bottomSectionConstructor(API_KEY, channelInfo) {
    const bottomSection = document.createElement("div");
    bottomSection.classList.add("bottomSection");
    result.appendChild(bottomSection);
    const playlistH1div = document.createElement('div');
    playlistH1div.classList.add('titleh1div');
    const playlistH1 = document.createElement('h1');
    playlistH1.textContent = "Latest video's:";
    playlistH1div.appendChild(playlistH1);
    bottomSection.appendChild(playlistH1div);

    // Fetch uploads playlist
    const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelInfo.id}&key=${API_KEY}`;
    const channelDetailsResponse = await fetch(channelDetailsUrl);
    const channelDetailsData = await channelDetailsResponse.json();
    const playlistID = channelDetailsData.items[0].contentDetails.relatedPlaylists.uploads;

    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistID}&maxResults=10&key=${API_KEY}`;
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    const videosPlaylist = playlistData.items;

    for (let i = 0; i < videosPlaylist.length; i++) {
        const videoId = videosPlaylist[i].snippet.resourceId.videoId;

        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
        const videoDetailsResponse = await fetch(videoDetailsUrl);
        const videoData = await videoDetailsResponse.json();
        const videoObject = videoData.items[0];

        // Create the card as a link 
        const videoLink = document.createElement("a");
        videoLink.href = `https://www.youtube.com/watch?v=${videoObject.id}`;
        videoLink.target = "_blank";
        videoLink.classList.add("divSecVidList"); // CSS card style applied
        bottomSection.appendChild(videoLink);

        // Video title
        const videoTitleEl = document.createElement("p");
        videoTitleEl.textContent = videoObject.snippet.title;
        videoLink.appendChild(videoTitleEl);

        // Views
        const videoViewsEl = document.createElement("p");
        videoViewsEl.textContent = `Views: ${videoObject.statistics.viewCount}`;
        videoLink.appendChild(videoViewsEl);

        // Likes
        const videoLikesEl = document.createElement("p");
        const likeIcon = document.createElement("i");
        likeIcon.classList.add("fa-regular", "fa-thumbs-up");
        videoLikesEl.appendChild(likeIcon);
        videoLikesEl.appendChild(document.createTextNode(` ${videoObject.statistics.likeCount}`));
        videoLink.appendChild(videoLikesEl);

        // Comments
        const videoCommentEl = document.createElement("p");
        const commentIcon = document.createElement("i");
        commentIcon.classList.add("fa-regular", "fa-comment");
        videoCommentEl.appendChild(commentIcon);
        videoCommentEl.appendChild(document.createTextNode(` ${videoObject.statistics.commentCount}`));
        videoLink.appendChild(videoCommentEl);

        // Upload date
        const uploadDateEl = document.createElement("p");
        const calendarIcon = document.createElement("i");
        calendarIcon.classList.add("fa-regular", "fa-calendar");
        uploadDateEl.appendChild(calendarIcon);
        const formattedDate = new Date(videoObject.snippet.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        uploadDateEl.appendChild(document.createTextNode(` ${formattedDate}`));
        videoLink.appendChild(uploadDateEl);
    }
}