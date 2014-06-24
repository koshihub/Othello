
function Player(_type, _turn) {

    this.type = _type;
    this.turn = _turn;

}

Player.prototype = {
    getType: function() {
        return this.type;
    },

    think: function (board, callback) {
        if (this.type == PLAYER_CPU) {
            var list = board.putable(this.turn);

            callback(list[Math.floor(Math.random() * list.length)]);
        }
    }
}