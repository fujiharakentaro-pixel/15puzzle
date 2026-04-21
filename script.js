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
    // ⚠️ デプロイURL（adways.net限定版）
    const url = "https://script.google.com/a/macros/adways.net/s/AKfycbzq3BVw_zgKdZwtBBbuVbxJxAnY9P9yxxNUKApXDTrrSI-LqsfGwaRybYnJVWTrKRz5gg/exec"; 
    
    const playerName = prompt("クリア！名前を入力してください：") || "Anonymous";

    // GAS側で受け取りやすいようにURLエンコードしたデータを作成
    const body = new URLSearchParams({
        "name": playerName,
        "moves": moves
    }).toString();

    try {
        console.log("アドウェイズ認証で送信開始...");
        
        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // 組織認証を通すために必須
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });

        // 成功判定
        if (response.ok) {
            alert("アドウェイズ・ランキングに登録成功！");
        } else {
            console.error("Status:", response.status);
            throw new Error("認証に失敗しました。");
        }
        
    } catch (error) {
        console.error("詳細エラー:", error);
        alert("エラー：アドウェイズアカウントでログインした「本物のブラウザ」で開いてください。");
    }
}