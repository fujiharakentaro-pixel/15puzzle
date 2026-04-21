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
        // アラートの後にスコア送信を実行
        setTimeout(() => {
            alert("Clear!");
            uploadScore(moves);
        }, 100);
    }
}

createBoard();

async function uploadScore(moves) {
    const url = "https://script.google.com/a/macros/adways.net/s/AKfycbxOB6MpQokZPLNVlJgSvHYXrV_1VIxI0UGbk5PCiKR8DccWuJHrn5f6uhct9_E7iYb7qA/exec"
    const playerName = prompt("クリアおめでとう！名前を入力してください：") || "Anonymous";

    const formData = new URLSearchParams();
    formData.append('name', playerName);
    formData.append('moves', moves);

    try {
        console.log("アドウェイズ認証で送信開始...");
        
        // mode: "no-cors" を指定
        await fetch(url, {
            method: "POST",
            mode: "no-cors", 
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });
        
        // no-cors の場合はレスポンスが取れないため、そのまま完了通知を出す
        alert("送信リクエストを完了しました！スプレッドシートを確認してください。");
        
    } catch (error) {
        console.error("詳細エラー:", error);
        alert("通信エラーが発生しました。");
    }
}
