export function middleSectionConstructor(result, stats, channelInfo) {

    const middleSection = document.createElement("div");
    middleSection.classList.add("middleSection");
    result.appendChild(middleSection);

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

    middleSection.appendChild(createStat("Subscribers", stats.subscriberCount));
    middleSection.appendChild(createStat("Views", stats.viewCount));
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