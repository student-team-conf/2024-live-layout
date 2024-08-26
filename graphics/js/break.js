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

    for (i = speakerNum; i < speakerNum + dataItemNum; i++) {
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
        speakerElement.innerText = presentationData[i].name;
        programElement.appendChild(speakerElement);

        scheduleItemElement.appendChild(programElement);
        scheduleBoxElement.appendChild(scheduleItemElement);
    }
}

const updateData = () => {
    loadData().then(() => {
        if (/*!presSpeakerInfoElement.hasChildNodes() || */!infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
            generateSchedule();
            initNotice();
        }
    });
}

updateData();   // 初回のデータ取得
nodecg.listenFor("reloadData", updateData);

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
    nodecg.Replicant("playStop").on("change", (newValue, oldValue) => {
        if (newValue) {
            audioElement.play();
        }
        else {
            audioElement.pause();
        }
    });

    let bgmNum = 0;

    function setBGM(newValue) {
        bgmNum = newValue;
        audioElement.src = "./bgm/" + bgmList[bgmNum].file;
        audioElement.load();

        const musicElement = document.getElementById("music");
        while (musicElement.childElementCount > 1) {   // 2つ以上の要素がある場合は古いのを消す（2つ前の曲が残っている）
            musicElement.removeChild(musicElement.firstChild);
        }
        const musicItemElement = document.createElement("div");
        musicItemElement.innerText = "♪ " + bgmList[bgmNum].name;
        musicElement.appendChild(musicItemElement);
        if (musicElement.childElementCount > 1) {   // 古いのを消す（初回のみ該当せず）
            musicElement.firstChild.classList.add("out");
        }
        musicElement.lastChild.classList.add("in");
    }

    nodecg.Replicant("bgmNum").on("change", (newValue, oldValue) => {
        setBGM(newValue);
    });

    audioElement.addEventListener("ended", () => {
        bgmNum++;
        if (bgmNum >= bgmList.length) bgmNum = 0;
        nodecg.Replicant("bgmNum").value = bgmNum;

        setBGM(bgmNum);
    });
});
