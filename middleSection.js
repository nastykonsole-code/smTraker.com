import { formatNumbers } from "./formatnumbers.js";

export function middleSectionConstructor(result, stats, channelInfo) {

    const middleSectionSec = document.createElement("div");
    middleSectionSec.classList.add("middleSectionSec");
    result.appendChild(middleSectionSec);
    const title = document.createElement('h1');
    title.textContent = 'Channel general statistics:';
    title.classList.add('title');
    middleSectionSec.appendChild(title);
    const middleSection =  document.createElement("div");
    middleSection.classList.add('middleSection');
    middleSectionSec.appendChild(middleSection);

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

    middleSection.appendChild(createStat("Subscribers", formatNumbers(stats.subscriberCount)));
    middleSection.appendChild(createStat("Views", formatNumbers(stats.viewCount)));
    middleSection.appendChild(createStat("Videos", stats.videoCount));

    const publishedDate = new Date(channelInfo.snippet.publishedAt);

    middleSection.appendChild(
        createStat(
            "Created At",
            publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        )
    );
}