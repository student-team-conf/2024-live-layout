const presSpeakerElement = document.getElementById("pres-speaker");
const presTitleElement = document.getElementById("pres-title");
const presSpeakerInfoElement = document.getElementById("pres-speaker-info");
const infoBarTextBoxElement = document.getElementById("info-bar-text-box");

let presentationData = [];
let noticeData = [];
let presentationNum = 0;
let breakNum = 0;

const generatePresSpeakerInfoLi = (num) => {
    const data = presentationData[Number(presentationNum)].info[num];

    const li = document.createElement("li");
    li.innerText = data.value;
    li.classList.add(data.type);
    li.setAttribute("data-num", num);
    return li;
}

const generateNoticeLi = (numBuff) => {
    let num = numBuff;
    const li = document.createElement("li");
    while (1) {   // 特殊通知の場合はその通知を行う必要があるか、行う情報があるか比較し、必要ならその通知を、なければ次の通知の確認を行う。
        if (num >= noticeData.length) { // 通知が最後まで行われた場合、最初に戻る
            num = 0;
        }

        const notice = noticeData[num];

        if (notice.indexOf("$schedule") !== -1) {  // スケジュール通知。スケジュールIDを取得し、該当するスケジュールがあるか確認する。
            const scheduleID = Number(notice.split(" ")[1]);
            const scheduleNum = Number(presentationNum) + scheduleID;
            if (scheduleNum < presentationData.length) {  // スケジュールが存在する場合、そのスケジュールの情報を取得し、出力する。
                const scheduleData = presentationData[scheduleNum];
                li.innerText = "この後のプログラム ▶ " + scheduleData.time + " - 「" + scheduleData.title + "」";
                li.setAttribute("data-num", num);
                break;
            }
        }

        else {  // 通常通知。そのまま出力する。
            li.innerText = notice;
            li.setAttribute("data-num", num);
            break;
        }
        num++;
    }
    return li;
}

const initFixedContent = () => {
    presSpeakerElement.innerText = presentationData[Number(presentationNum)].name;
    presTitleElement.innerText = presentationData[Number(presentationNum)].title;
}

const initChangableContent = () => {
    presSpeakerInfoElement.innerHTML = "";
    presSpeakerInfoElement.appendChild(generatePresSpeakerInfoLi(0));

    infoBarTextBoxElement.innerHTML = "";
    infoBarTextBoxElement.appendChild(generateNoticeLi(0));
}

const initAll = () => {
    initFixedContent();
    initChangableContent();
}

const updateData = () => {
    fetch("./json/presentation.json")
        .then(response => response.json())
        .then(presentationDataBuff => {
            presentationData = presentationDataBuff;
            fetch("./json/notice.json")
                .then(response => response.json())
                .then(noticeDataBuff => {
                    noticeData = noticeDataBuff;

                    initFixedContent();
                    if (!presSpeakerInfoElement.hasChildNodes() || !infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
                        initChangableContent();
                    }
                    return false;
                });
        });
}
nodecg.listenFor("reloadData", updateData);

nodecg.Replicant("presentationNum").on("change", (newValue, oldValue) => {
    presentationNum = newValue;
    initAll(); // 即座に画面の全情報を更新
});

updateData();   // 初回のデータ取得

const nextPresSpeakerInfo = () => {
    // すでにoutのものを消す
    const outScreenPresSpeakerInfoElementsList = Array.from(presSpeakerInfoElement.getElementsByClassName("out"));
    outScreenPresSpeakerInfoElementsList.forEach(element => {
        element.remove();
    });

    // 今の要素を外に追いやる
    const currentPresSpeakerInfoElement = presSpeakerInfoElement.firstElementChild;
    currentPresSpeakerInfoElement.classList.remove("in");
    currentPresSpeakerInfoElement.classList.add("out");

    // 次の要素を追加
    let nextNum = Number(currentPresSpeakerInfoElement.getAttribute("data-num")) + 1;
    if (nextNum >= presentationData[Number(presentationNum)].info.length) {
        nextNum = 0;
    }
    const nextPresSpeakerInfoElement = generatePresSpeakerInfoLi(nextNum);
    nextPresSpeakerInfoElement.classList.add("in");
    presSpeakerInfoElement.appendChild(nextPresSpeakerInfoElement);
}

const nextNotice = () => {
    // すでにoutのものを消す
    const outScreenNoticeElementsList = Array.from(infoBarTextBoxElement.getElementsByClassName("out"));
    outScreenNoticeElementsList.forEach(element => {
        element.remove();
    });

    // 今の要素を外に追いやる
    const currentNoticeElement = infoBarTextBoxElement.firstElementChild;
    currentNoticeElement.classList.remove("in");
    currentNoticeElement.classList.add("out");

    // 次の要素を追加
    let nextNum = Number(currentNoticeElement.getAttribute("data-num")) + 1;
    if (nextNum >= noticeData.length) {
        nextNum = 0;
    }
    const nextNoticeElement = generateNoticeLi(nextNum);
    nextNoticeElement.classList.add("in");
    infoBarTextBoxElement.appendChild(nextNoticeElement);
}

setInterval(nextPresSpeakerInfo, 5000);
setInterval(nextNotice, 10000);