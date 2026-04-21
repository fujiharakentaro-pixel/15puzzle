const boardElement = document.getElementById("game-board");
let tiles = [...Array(15).keys()].map(i => i + 1).concat([null]);
let moves = 0;

// ボードの生成
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

// タイルの移動
function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        moves++;
        document.getElementById("score").textContent = `Moves: ${moves}`;
        createBoard();
        checkWin();
    }
}

// シャッフル（解ける状態でシャッフルするためにランダム移動を繰り返す）
function shuffleBoard() {
    for (let i = 0; i < 200; i++) {
        const emptyIndex = tiles.indexOf(null);
        const neighbors = [emptyIndex-1, emptyIndex+1, emptyIndex-4, emptyIndex+4].filter(n => n >= 0 && n < 16);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
    }
    moves = 0;
    document.getElementById("score").textContent = `Moves: 0`;
    createBoard();
}

// 勝利判定
function checkWin() {
    const win = tiles.slice(0, 15).every((tile, i) => tile === i + 1);
    if (win && moves > 0) {
        setTimeout(() => {
            alert("Clear!");
            uploadScore(moves);
        }, 100);
    }
}

// スコア送信（アドウェイズ認証突破版）
function uploadScore(moves) {
    // あなたの最新のGAS URLをここに貼ってください
    const url = "https://script.google.com/a/macros/adways.net/s/AKfycbzoga69hmErtkFzPY4wD8JIunepqcWSV4FbVR_nrJbJWCxfbXyEP5GOUH6jyKsJWn-Y9Q/exec";
    
    const playerName = prompt("クリアおめでとう！名前を入力してください：") || "Anonymous";

    // URLにパラメータを付与
    const finalUrl = `${url}?name=${encodeURIComponent(playerName)}&moves=${moves}`;

    // 【重要】新しいタブで開くことでアドウェイズの組織認証を通過させる
    window.open(finalUrl, '_blank');
    
    alert("ランキング登録用のタブを開きました。そちらの画面で「記録完了」と出れば成功です。");
}

createBoard();
