export function topSectionConstructor(result, channelLogoUrl, channelHandle, snippet) {

    const topSide = document.createElement("div");
    topSide.classList.add("topSide");
    result.appendChild(topSide);

    const leftTopSide = document.createElement("div");
    leftTopSide.classList.add("leftTopSide");

    const rightTopSide = document.createElement("div");
    rightTopSide.classList.add("rightTopSide");

    topSide.appendChild(leftTopSide);
    topSide.appendChild(rightTopSide);

    const logo = document.createElement("img");
    logo.classList.add("logoChannel");
    logo.src = channelLogoUrl;
    leftTopSide.appendChild(logo);

    const channelHdH1 = document.createElement("h1");
    channelHdH1.textContent = "@" + channelHandle;
    rightTopSide.appendChild(channelHdH1);

    const descP = document.createElement("p");
    descP.textContent = snippet.description;
    descP.classList.add('descP')
    rightTopSide.appendChild(descP);
}