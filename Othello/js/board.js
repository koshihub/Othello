
var PIECE_SIZE = 32;

function Board(_game) {

    this.game = _game;

    this.boardObj = document.createElement("div");
    this.boardObj.className = "board";
    this.pieceObj = document.createElement("div");
    this.pieceObj.className = "piece none";
    this.pieceObj.style.width = PIECE_SIZE + "px";
    this.pieceObj.style.height = PIECE_SIZE + "px";
}

Board.prototype = {
    initialize: function () {
        var self = this;

        // initialize board
        document.body.appendChild(this.boardObj);
        for (var i = 0; i < 64; i++) {
            var obj = this.pieceObj.cloneNode(false);
            obj.id = i;
            obj.style.left = (i % 8) * PIECE_SIZE + "px";
            obj.style.top = Math.floor(i / 8) * PIECE_SIZE + "px";
            obj.addEventListener("click", function (e) {
                self.game.onPieceClicked(parseInt(e.target.id, 10));
            });
            this.boardObj.appendChild(obj);
        }

        // initialize states
        this.state = [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1,  0,  1, -1, -1, -1,
            -1, -1, -1,  1,  0, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
        ]

        this.empty = [];
        for (var i = 0; i < 64; i++) {
            if (i != 27 && i != 28 && i != 35 && i != 36) {
                this.empty.push(i);
            }
        }

        this.render();
    },

    render: function () {
        for (var i = 0; i < 64; i++) {
            var name;
            if (this.state[i] == 0) {
                name = "white";
            } else if (this.state[i] == 1) {
                name = "black";
            } else {
                name = "none";
            }

            document.getElementById(i).className = "piece " + name;
        }
    },

    putPiece: function (id, turn, canPutOnly) {
        var canPut = false;

        if (this.state[id] != -1) {
            return false;
        }

        var x = id % 8, y = Math.floor(id / 8);

        for(var dx = -1; dx <= 1; dx++) {
            for(var dy = -1; dy <= 1; dy++) {
                if( dx == 0 && dy == 0) {
                    continue;
                }

                var cont = false, reverse = false;
                var xx = x + dx, yy = y + dy;
                var cache = [id];
                while (true) {
                    if (xx < 0 || xx >= 8 || yy < 0 || yy >= 8) {
                        break;
                    }

                    var s = this.state[xx + yy * 8];
                    if (!cont) {
                        if (s == 1 - turn) {
                            cont = true;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (s == turn) {
                            reverse = true;
                            if (canPutOnly) {
                                return true;
                            }
                            break;
                        }
                        else if (s != 1 - turn) {
                            break;
                        }
                    }

                    if (cont && !canPutOnly) {
                        cache.push(xx + yy * 8);
                    }

                    xx += dx;
                    yy += dy;
                }

                if (reverse) {
                    canPut = true;
                    for (var i = cache.length - 1; i >= 0; i--) {
                        this.state[cache[i]] = turn;
                    }
                }
            }
        }

        if (canPut) {
            for(var i = this.empty.length - 1; i >= 0; i--) {
                if (this.empty[i] == id) {
                    this.empty.splice(i, 1);
                    break;
                }
            }
        }

        return canPut;
    },

    putable: function (turn) {
        var list = [];

        for (var i = this.empty.length - 1; i >= 0; i--) {
            if (this.putPiece(this.empty[i], turn, true)) {
                list.push(this.empty[i]);
            }
        }

        return list;
    },
}