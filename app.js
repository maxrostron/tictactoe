// Add some transitions to smooth it out
// Build a computer to play against

let squareControls = (function () {
    const squares = ([...document.querySelectorAll(".square")])

    const player1Container = document.getElementById("player1-score")
    const player2Container = document.getElementById("player2-score")

    const endgameContainer = document.getElementById("end-game-container")
    const resetButton = document.getElementById("game-refresh")

    squares.forEach(element => {
        element.addEventListener('click', function() {
            playerControls.addSelection(element.id)
            squareControls.checkTurn(element.id, undefined)
            gameControls.winCheck()
        })
    });
 
    return {
        checkTurn(input, computer) {
        let element = document.getElementById(`${input}`)
        if(playerControls.player1.turn === true){
            player1Container.classList.remove("turn")
            player1Container.classList.remove("player1")

            player2Container.classList.add("turn")
            player2Container.classList.add("player2")

            element.classList.add("cross")
            element.classList.remove("square:hover")
            element.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
            }, true);
            playerControls.changeTurn()
            if(computerAI.computerSelected === true){
                computerAI.computerMove();
            }
        } 
        else if(computerAI.computerSelected === true) {
            console.log(player1Container)
            // player1Container.classList.add("turn")
            // player1Container.classList.add("player1")

            player2Container.classList.remove("turn")
            player2Container.classList.remove("player2")

            computer.classList.add("naught")
            computer.classList.remove("square:hover")
            computer.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
            }, true);
            playerControls.changeTurn()   
        } 
        else if(playerControls.player2.turn === true) { 
            player1Container.classList.add("turn")
            player1Container.classList.add("player1")

            player2Container.classList.remove("turn")
            player2Container.classList.remove("player2")

            element.classList.add("naught")
            element.classList.remove("square:hover")
            element.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
            }, true);
            playerControls.changeTurn()                
        }
       },
       endGame() { 
        if(playerControls.player1.winner === true) {
         player1Container.classList.add = "win"
         player2Container.classList.add("lose")
         endgameContainer.style.display = "flex"
         resetButton.style.display = "block"
         document.querySelector(".winner").innerHTML = "Player 1 Wins!"
        }
        else if(playerControls.player2.winner === true) {
         player2Container.classList.add("win")
         player1Container.classList.add ="lose"
         endgameContainer.style.display = "flex"
         resetButton.style.display = "block"
         document.querySelector(".winner").innerHTML = "Player 2 Wins!"
        } 
        }
    }
})();

let playerControls = (function(){

    let player1 = {
        controller: "human",
        turn: true,
        symbol: "orange",
        selection: [],
        winner: false
    };

    let player2 = {
        controller: "human",
        turn: false,
        symbol: "yellow",
        selection: [],
        winner: false
    };

    return {
        player1,
        player2,
        changeTurn() {
            if(player1.turn === true){
                player1.turn = false;
                player2.turn = true;
            } else {
                player1.turn = true;
                player2.turn = false;
            }
        },
        addSelection(elementID) {
            if(player1.turn === true){
                player1.selection.push(elementID)
                player1.selection.sort(function(a,b) {
                    return a - b;
                })
            } else {
                player2.selection.push(elementID)
                player2.selection.sort(function(a,b) {
                    return a - b;
                })
            }
            console.log(player1.selection)
            console.log(player2.selection)
        },
        playComputer(selection){
            player2.controller = "computer"
            player2.selection.push(`${selection}`);
        }
    }
})();

let computerAI = (function(){

    let computerSelected = true;
    let selection = ''
    let selectedDiv = document.getElementById(`${selection}`)

    function computerSelection(div) {
        document.getElementById("player1-score").classList.add = "turn"
        document.getElementById("player1-score").add = "player1"

        div.classList.remove("turn")
        div.classList.remove("player2")

        div.classList.add("naught")
        div.classList.remove("square:hover")
        div.addEventListener('click', function(event) {
            event.stopImmediatePropagation();
        }, true);
    }

    return {
        computerMove() {
            selection = Math.floor(Math.random() * 10);
            while(playerControls.player2.selection.includes(selection) || playerControls.player1.selection.includes(selection)) {
                selection = Math.floor(Math.random() * 10)
            }
            let div = document.getElementById(`${selection}`)
            computerSelection(div)
            playerControls.playComputer(selection)
            squareControls.checkTurn(undefined, div)
            gameControls.winCheck()
            playerControls.changeTurn()                    
        }, 
        selectedDiv, selection, computerSelected


    } 
}

)();








let gameControls = (function(){

    let winCriteria = [
                //Horizontal
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                //Vertical
                ["1", "4", "7"],
                ["2", "5", "8"],
                ["3", "6", "9"],
                //Diagonal
                ["1", "5", "9"],
                ["3", "5", "7"],
    ]   

    return {
        winCheck(){
            for(let i=0; i < winCriteria.length; i++){
                let winTest = winCriteria[i];

                if(winTest.every((val) => playerControls.player1.selection.includes(val))) {
                    playerControls.player1.winner = true;
                    console.log(playerControls.player1.winner);
                    squareControls.endGame()
                }

                else if(winTest.every((val) => playerControls.player2.selection.includes(val))) {
                    playerControls.player2.winner = true;
                    console.log(playerControls.player2.winner);
                    squareControls.endGame()
                }
                
                else if (playerControls.player1.selection.length >= 5 || playerControls.player2.selection.length >= 5){
                    document.getElementById("end-game-container").style.display = "flex"
                    document.getElementById("game-refresh").style.display = "block"
                    document.querySelector(".winner").innerHTML = "It's a tie!"
                }
            }
        }
    }
})(); 









