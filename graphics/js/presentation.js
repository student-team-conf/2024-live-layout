const presSpeakerInfoElement = document.getElementById("pres-speaker-info");
const presTitleElement = document.getElementById("pres-title");
const presSpeakerDetailInfoElement = document.getElementById("pres-speaker-detail-info");

const initSpeakerInfo = () => {
    presSpeakerInfoElement.innerText = presentationData[Number(speakerNum)].name;
    presTitleElement.innerText = presentationData[Number(speakerNum)].title;
}

const initSpeakerDetailInfo = () => {
    presSpeakerDetailInfoElement.innerHTML = "";
    presSpeakerDetailInfoElement.appendChild(generateSpeakerDetailInfoLi(0));
}

const updateData = () => {
    loadData().then(() => {
        initSpeakerInfo();
        if (!presSpeakerDetailInfoElement.hasChildNodes() || !infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
            initNotice();
            initSpeakerDetailInfo();
        }
    });
}

updateData();   // 初回のデータ取得
nodecg.listenFor("reloadData", updateData);

nodecg.Replicant("presentationNum").on("change", (newValue, oldValue) => {
    speakerNum = newValue;
    initSpeakerInfo();
    initNotice();
    initSpeakerDetailInfo(); // 即座に画面の全情報を更新
});

const showNextSpeakerInfo = () => {
    showNextDOM(presSpeakerDetailInfoElement, generateSpeakerDetailInfoLi);
}

setInterval(showNextSpeakerInfo, 5000);