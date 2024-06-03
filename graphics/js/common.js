const infoBarTextBoxElement = document.getElementById("info-bar-text-box");
let presentationData = [];
let noticeData = [];

let speakerNum = 0;

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
            const scheduleNum = Number(speakerNum) + scheduleID;
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

const initNotice = () => {
    infoBarTextBoxElement.innerHTML = "";
    infoBarTextBoxElement.appendChild(generateNoticeLi(0));
}

const loadData = () => {
    return new Promise((resolve, reject) => {
        fetch("./json/presentation.json")
        .then(response => response.json())
        .then(presentationDataBuff => {
            presentationData = presentationDataBuff;
            fetch("./json/notice.json")
                .then(response => response.json())
                .then(noticeDataBuff => {
                    noticeData = noticeDataBuff;
                    resolve();
                });
        });
    });
}

const showNextDOM = (listElement, generateFunc) => {
    // すでにoutのものを消す
    const outScreenElementsList = Array.from(listElement.getElementsByClassName("out"));
    outScreenElementsList.forEach(element => {
        element.remove();
    });

    // 今の要素を外に追いやる
    const currentElement = listElement.firstElementChild;
    currentElement.classList.remove("in");
    currentElement.classList.add("out");

    // 次の要素を追加
    let nextNum = Number(currentElement.getAttribute("data-num")) + 1;
    if (nextNum >= noticeData.length) {
        nextNum = 0;
    }
    const nextElement = generateFunc(nextNum);
    nextElement.classList.add("in");
    listElement.appendChild(nextElement);
}

const showNextNotice = () => {
    showNextDOM(infoBarTextBoxElement, generateNoticeLi);
}

setInterval(showNextNotice, 10000);