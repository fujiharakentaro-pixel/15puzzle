const boardElement = document.getElementById("game-board");
let tiles = [...Array(15).keys()].map(i => i + 1).concat([null]);
let moves = 0;

function createBoard() {
    boardElement.innerHTML = "";
    tiles.forEach((tile, index) => {
        const div = document.createElement("div");
        div.className = "tile" + (tile === null ? " empty" : "");
        div.textContent = tile;
        div.addEventListener("click", () => moveTile(index));
        boardElement.appendChild(div);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const validMoves = [index-1, index+1, index-4, index+4];
    
    if (validMoves.includes(emptyIndex)) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        moves++;
        document.getElementById("score").textContent = `Moves: ${moves}`;
        createBoard();
        checkWin();
    }
}

function shuffleBoard() {
    tiles.sort(() => Math.random() - 0.5);
    moves = 0;
    document.getElementById("score").textContent = `Moves: 0`;
    createBoard();
}

function checkWin() {
    const win = tiles.slice(0, 15).every((tile, i) => tile === i + 1);
    if (win && moves > 0) {
        setTimeout(() => {
            alert("Clear!");
            uploadScore(moves);
        }, 100);
    }
}

createBoard();

// 修正：fetchを使わず「隠しフォーム」で送信する関数
function uploadScore(moves) {
    const url = "https://script.google.com/a/macros/adways.net/s/AKfycbxOB6MpQokZPLNVlJgSvHYXrV_1VIxI0UGbk5PCiKR8DccWuJHrn5f6uhct9_E7iYb7qA/exec";
    const playerName = prompt("クリアおめでとう！名前を入力してください：") || "Anonymous";

    // 1. フォームを作成
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = 'hidden_iframe'; // ページが切り替わらないようにする

    // 2. データをセット
    const nameField = document.createElement('input');
    nameField.type = 'hidden';
    nameField.name = 'name';
    nameField.value = playerName;
    form.appendChild(nameField);

    const movesField = document.createElement('input');
    movesField.type = 'hidden';
    movesField.name = 'moves';
    movesField.value = moves;
    form.appendChild(movesField);

    // 3. ページ遷移を防ぐための見えないiframeを準備
    let iframe = document.getElementById('hidden_iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'hidden_iframe';
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // 4. 送信実行
    document.body.appendChild(form);
    form.submit();
    
    alert("アドウェイズ・ランキングに送信しました！スプレッドシートを確認してください。");
    
    // 後片付け
    setTimeout(() => document.body.removeChild(form), 1000);
}
