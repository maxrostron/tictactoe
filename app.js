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
        checkTurn(input, div) {
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
            if(playerControls.player2.controller == "computer"){
                computerAI.computerMove();
            }
        } 
        else if(playerControls.player2.controller == "computer") {
            player1Container.classList.add("turn")
            player1Container.classList.add("player1")

            player2Container.classList.remove("turn")
            player2Container.classList.remove("player2")

            div.classList.add("naught")
            div.classList.remove("square:hover")
            div.addEventListener('click', function(event) {
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
         player1Container.classList.add("win")
         player2Container.classList.add("lose")
         endgameContainer.style.display = "flex"
         resetButton.style.display = "block"
         document.querySelector(".winner").innerHTML = "Player 1 Wins!"
        }
        else if(playerControls.player2.winner === true) {
         player2Container.classList.add("win")
         player1Container.classList.add("lose")
         endgameContainer.style.display = "flex"
         resetButton.style.display = "block"
         document.querySelector(".winner").innerHTML = "Player 2 Wins!"
        } 
        },
        switchPlayer2(){
            player2Container.innerHTML = ""
            if(playerControls.player2.controller == "human") {
                player2Container.innerHTML = "Player 2"
            } 
            else if (playerControls.player2.controller == "computer") {
                player2Container.innerHTML = "Computer"
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
                console.log(player1.selection)
                console.log(player2.selection)
            } else {
                player1.turn = true;
                player2.turn = false;
                console.log(player1.selection)
                console.log(player2.selection)
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
        },
        playComputer(selection){
            player2.selection.push(`${selection}`);
        },
        clearSelection(){
            player1.selection = [];
            player2.selection = [];
        },
        changeToComputer(){
            player2.controller = "computer"
        },
        changeToHuman(){
            player2.controller = "human"
        }
        
    }
})();

let computerAI = (function(){

    let selection = ''
    let selectedDiv = document.getElementById(`${selection}`)

    function testSelection() {
        if(playerControls.player2.selection.includes(selection) || playerControls.player1.selection.includes(selection)) {
            x = Math.floor(Math.random() * 9) + 1
            selection = x.toString();
            testSelection()
        }
    }

    return {
        computerMove() {
            if(playerControls.player1.selection.length < 5){
                x = Math.floor(Math.random() * 9) + 1;
                selection = x.toString();
                testSelection()
                let div = document.getElementById(`${selection}`)
                playerControls.playComputer(selection)
                squareControls.checkTurn(undefined, div)
                gameControls.winCheck()
            }
            else {
                squareControls.endGame()
            }
                   
        }, 
        toggleComputer() {
            playerControls.clearSelection()
            if(playerControls.player2.controller == "human") {
                playerControls.changeToComputer()
                squareControls.switchPlayer2()
            }
            else if (playerControls.player2.controller == "computer") {
                playerControls.changeToHuman()
                squareControls.switchPlayer2()
            }
        }, selectedDiv, selection
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
                    squareControls.endGame()
                }

                else if(winTest.every((val) => playerControls.player2.selection.includes(val))) {
                    playerControls.player2.winner = true;
                    squareControls.endGame()
                }
                
                else if (playerControls.player1.selection.length >= 5){
                    document.getElementById("end-game-container").style.display = "flex"
                    document.getElementById("game-refresh").style.display = "block"
                    document.querySelector(".winner").innerHTML = "It's a tie!"
                }
            }
        }
    }
})(); 







