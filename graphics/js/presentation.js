const presSpeakerInfoElement = document.getElementById("pres-speaker-info");
const presTitleElement = document.getElementById("pres-title");
const presImgElement = document.getElementById("pres-img");
const presSpeakerDetailInfoElement = document.getElementById("pres-speaker-detail-info");

const initSpeakerInfo = () => {
    presSpeakerInfoElement.innerText = presentationData[Number(speakerNum)].name;
    const presTitleBudouxElement = document.createElement("budoux-ja");
    presTitleElement.innerHTML = "";
    presTitleBudouxElement.innerText = presentationData[Number(speakerNum)].title;
    presTitleElement.appendChild(presTitleBudouxElement);
    if (presentationData[Number(speakerNum)].img != undefined) {
        presImgElement.src = presentationData[Number(speakerNum)].img;
        presImgElement.classList.add("show");
    }
    else {
        presImgElement.src = "";
        presImgElement.classList.remove("show");
    }
}

const initSpeakerDetailInfo = () => {
    presSpeakerDetailInfoElement.innerHTML = "";
    presSpeakerDetailInfoElement.appendChild(generateSpeakerDetailInfoLi(0));
}

nodecg.Replicant("presentationData").on("change", (newValue, oldValue) => {
    presentationData = newValue;
    initSpeakerInfo();
    if (!presSpeakerDetailInfoElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
        initSpeakerDetailInfo();
    }
});

nodecg.Replicant("noticeData").on("change", (newValue, oldValue) => {
    noticeData = newValue;
    if (!infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
        initNotice();
    }
});

nodecg.Replicant("presentationNum").on("change", (newValue, oldValue) => {
    speakerNum = newValue;
    initSpeakerInfo();
    initNotice();
    initSpeakerDetailInfo(); // 即座に画面の全情報を更新
});

const showNextSpeakerInfo = () => {
    showNextDOM(presSpeakerDetailInfoElement, generateSpeakerDetailInfoLi, presentationData[Number(speakerNum)].info.length);
}

setInterval(showNextSpeakerInfo, 5000);