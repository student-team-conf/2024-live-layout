const scheduleBoxElement = document.getElementById("schedule-box");

const generateSchedule = () => {
    const generateScheduleTime = (num, soon = false) => {
        const data = presentationData[num];

        const div = document.createElement("div");
        div.classList.add("schedule-time");
        if (soon) div.innerText = "もうすぐ";
        else div.innerText = data.time + " -";
        return div;
    }

    scheduleBoxElement.innerHTML = "";
    const dataItemNum = Number(scheduleBoxElement.getAttribute("data-item-num"));
    speakerNum = Number(speakerNum);
    for (let i = speakerNum; i < (speakerNum + dataItemNum); i++) {
        if (i >= presentationData.length) break;   // データがない場合は生成しない(スケジュールがない場合
        const scheduleItemElement = document.createElement("div");
        scheduleItemElement.classList.add("schedule-item");
        scheduleItemElement.classList.add("show");
        scheduleItemElement.appendChild(generateScheduleTime(i, (i == speakerNum)));

        const programElement = document.createElement("div");
        programElement.classList.add("program");

        const titleElement = document.createElement("div");
        titleElement.classList.add("title");
        const titleBudouxElement = document.createElement("budoux-ja");
        titleBudouxElement.innerText = presentationData[i].title;
        titleElement.appendChild(titleBudouxElement);
        programElement.appendChild(titleElement);
        const speakerElement = document.createElement("div");
        speakerElement.classList.add("speaker");
        const speakerNameElement = document.createElement("div");
        speakerNameElement.innerText = presentationData[i].name;
        speakerElement.appendChild(speakerNameElement);
        if (i == speakerNum) {
            const speakerDetailInfoElement = document.createElement("ul");
            speakerDetailInfoElement.id = "pres-speaker-detail-info";
            speakerDetailInfoElement.appendChild(generateSpeakerDetailInfoLi(0));
            speakerElement.appendChild(speakerDetailInfoElement);
        }

        programElement.appendChild(speakerElement);

        scheduleItemElement.appendChild(programElement);
        scheduleBoxElement.appendChild(scheduleItemElement);
    }
}

nodecg.Replicant("presentationData").on("change", (newValue, oldValue) => {
    presentationData = newValue;
    //if (!presSpeakerInfoElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
        generateSchedule();
    //}
});

nodecg.Replicant("noticeData").on("change", (newValue, oldValue) => {
    noticeData = newValue;
    if (!infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
        initNotice();
    }
});


nodecg.Replicant("breakNum").on("change", (newValue, oldValue) => {
    speakerNum = newValue;
    generateSchedule();
    initNotice();
});

nodecg.listenFor("breakScheduleAnimate", () => {
    const scheduleElementsList = Array.from(scheduleBoxElement.getElementsByClassName("schedule-item"));
    if (scheduleBoxElement.firstChild.classList.contains("show")) {
        scheduleElementsList.forEach((element) => {
            element.classList.remove("show");
        });
    }
    else {
        scheduleElementsList.forEach((element) => {
            element.classList.add("show");
        });
    }
});

const showNextSpeakerInfo = () => {
    const presSpeakerDetailInfoElement = document.getElementById("pres-speaker-detail-info");
    showNextDOM(presSpeakerDetailInfoElement, generateSpeakerDetailInfoLi, presentationData[Number(speakerNum)].info.length);
}

setInterval(showNextSpeakerInfo, 5000);



let bgmList = [];

const fetchBgmJson = () => {
    return new Promise((resolve, reject) => {
        fetch("./bgm/bgm.json")
            .then(response => response.json())
            .then(data => {
                bgmList = data;
                resolve();
            });
    });
}

const audioElement = document.getElementById("audio");

fetchBgmJson().then(() => {
    const playStop = (val) => {
        const musicElement = document.getElementById("music");
        if (val) {
            musicElement.volume = 0;
            let vol = 0;
            audioElement.play();
            musicElement.lastChild.classList.remove("pause");
            musicElement.lastChild.classList.add("in");
            const fadeInAudio = setInterval(() => {
                vol += 0.1;
                if (vol >= 0.5) {
                    musicElement.volume = 0.5;
                    clearInterval(fadeInAudio);
                }
                musicElement.volume = vol;
            }, 50);
        }
        else {
            musicElement.volume = 0.5;
            let vol = 0.5;
            const fadeOutAudio = setInterval(() => {
                vol -= 0.1;
                if (vol <= 0) {
                    musicElement.volume = 0;
                    audioElement.pause();
                    clearInterval(fadeOutAudio);
                }
                musicElement.volume = vol;
            }, 50);
            musicElement.lastChild.classList.add("pause");
        }
    }

    let bgmNum = 0;

    const createMusicItemElement = (num) => {
        const musicItemElement = document.createElement("div");
        musicItemElement.innerText = "♪ " + bgmList[num].name;
        musicItemElement.setAttribute("data-num", num);
        return musicItemElement;
    }

    function setBGM(val) {
        bgmNum = val;
        audioElement.src = "./bgm/" + bgmList[bgmNum].file;
        audioElement.load();

        const musicElement = document.getElementById("music");
        if (musicElement.hasChildNodes()) {
            showNextDOM(musicElement, createMusicItemElement, bgmList.length);
        }
        else {
            musicElement.appendChild(createMusicItemElement(bgmNum));
        }
        if (nodecg.Replicant('playStop').value) {
            setTimeout(() => {
                audioElement.play();
            }, 1000);
        }
        playStop(nodecg.Replicant('playStop').value);
    }

    nodecg.Replicant("bgmNum").on("change", (newValue, oldValue) => {
        setBGM(newValue);
    });

    nodecg.Replicant("playStop").on("change", (newValue, oldValue) => {
        playStop(newValue);
    });

    audioElement.addEventListener("ended", () => {
        bgmNum++;
        if (bgmNum >= bgmList.length) bgmNum = 0;
        nodecg.Replicant("bgmNum").value = bgmNum;

        // setBGM(bgmNum);
    });
});
