import {createBoard, playMove} from "./connect4.js";

window.addEventListener("DOMContentLoaded", () => {

    const board = document.querySelector(".board");
    createBoard(board);

    const websocket = new WebSocket(getWebSocketServer());
    init(websocket);
    receiveMoves(board, websocket);
    sendMoves(board, websocket);

});

function getWebSocketServer() {

  if (window.location.host === "localhost:8000") {

    return "ws://localhost:8001/";
  }
  else {

    return "wss://websockets-tutorial-a6jl.onrender.com/";
    
  }

}

function sendMoves(board, websocket) {

    board.addEventListener("click", ({target}) => {

        const column = target.dataset.column;

        if (column === undefined) {
            return;
        }

        const event = {

            type: "play",
            column: parseInt(column, 10),
        };

        websocket.send(JSON.stringify(event));
    });
}

function showMessage(message) {

    window.setTimeout(() => window.alert(message), 100);

}

function receiveMoves(board, websocket) {

    websocket.addEventListener("message", ({data}) => {
        const event = JSON.parse(data);

        switch (event.type) {

            case "play":
                playMove(board, event.player, event.column, event.row)
                break;

            case "win":
                showMessage(`Player ${event.player} wins!`);
                break;
            case "error":
                showMessage(`Error: ${event.message}`);
                break;
            case "init":
                document.querySelector(".join").href = "?join=" + event.join;
                document.querySelector(".watch").href = "?watch=" + event.watch;
                break;
            default:
                throw new Error(`Unknown event type: ${event.type}`);         
                    
        }        
    });
}

function init(websocket) {

    websocket.addEventListener("open", () => {
        
        const params = new URLSearchParams(window.location.search);
        const event = {"type": "init"};
    
        if (params.has("join")) {

            event.join = params.get("join");
            
        } else if (params.has("watch")) {

            event.watch = params.get("watch");

        }else{

        }

        websocket.send(JSON.stringify(event));

    });
}

