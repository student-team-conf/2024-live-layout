const presSpeakerElement = document.getElementById("pres-speaker");
const presTitleElement = document.getElementById("pres-title");
const presSpeakerInfoElement = document.getElementById("pres-speaker-info");

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

const updateData = () => {
    loadData().then(() => {
        initFixedContent();
        if (!presSpeakerInfoElement.hasChildNodes() || !infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
            initChangableContent();
        }
    });
}

updateData();   // 初回のデータ取得
nodecg.listenFor("reloadData", updateData);

nodecg.Replicant("presentationNum").on("change", (newValue, oldValue) => {
    presentationNum = newValue;
    initFixedContent();
    initChangableContent(); // 即座に画面の全情報を更新
});

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

setInterval(nextPresSpeakerInfo, 5000);