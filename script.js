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
    // ⚠️ アドウェイズ限定URL（/a/macros/adways.net/ を含むもの）
    const url = "https://script.google.com/a/macros/adways.net/s/AKfycbxUDSQJcqCu9Pq9FQkN7GNZQdN7REYP624coE9hJrP7/dev; 
    
    const playerName = prompt("クリア！名前を入力してください：") || "Anonymous";

    const body = new URLSearchParams({
        "name": playerName,
        "moves": moves
    }).toString();

    try {
        // mode: "cors" で送る。ブラウザにアドウェイズのアカウントでログインしていれば
        // 自動的に認証情報が添えられます。
        await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });
        
        alert("アドウェイズ・ランキングに登録しました！");
    } catch (error) {
        console.error("詳細:", error);
        alert("送信失敗。adways.netにログインしているか確認してください。");
    }
}
