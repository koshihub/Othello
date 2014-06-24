
var TURN_WHITE = 0, TURN_BLACK = 1;
var PLAYER_CPU = 0, PLAYER_USER = 1;

function Game() {

    this.board = new Board(this);

}

Game.prototype = {
    initialize: function () {

        this.board.initialize();

        this.players = [new Player(PLAYER_CPU, TURN_WHITE), new Player(PLAYER_CPU, TURN_BLACK)];
        this.turn = TURN_BLACK;

        this.changeTurn();
    },

    changeTurn: function () {
        var self = this;

        this.turn = 1 - this.turn;

        // check the pass or game set conditions
        if (this.board.putable(this.turn).length == 0) {
            if (this.board.putable(1 - this.turn).length == 0) {
                console.log("game set");
                return;
            }
            console.log("pass");
            this.changeTurn();
        }
        else {
            setTimeout(
                function () {
                    self.players[self.turn].think(self.board, function (id) {
                        self.board.putPiece(id, self.turn, false);
                        self.changeTurn();
                        self.board.render();
                    });
                }
                , 10
            );
        }
    },

    onPieceClicked: function (id) {
        // user's turn
        if (this.players[this.turn].getType() == PLAYER_USER) {
            if (this.board.putPiece(id, this.turn, false)) {
                this.changeTurn();
                this.board.render();
            }
        }
    }
}
window.onload = function () {
    var game = new Game();
    game.initialize();
}