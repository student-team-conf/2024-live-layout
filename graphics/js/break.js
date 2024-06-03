const updateData = () => {
    loadData().then(() => {
        if (/*!presSpeakerInfoElement.hasChildNodes() || */!infoBarTextBoxElement.hasChildNodes()) {   // 初回のみ。動的に動くリストに何も生成されていない場合。同じ発表者で情報更新の時はアニメーション切り替えの時に反映される。発表者交代の時は下の関数で反映される。
            initNotice();
        }
    });
}

updateData();   // 初回のデータ取得
nodecg.listenFor("reloadData", updateData);

nodecg.Replicant("breakNum").on("change", (newValue, oldValue) => {
    speakerNum = newValue;
    initNotice();
});