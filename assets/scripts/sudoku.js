var sudoku = new Object();

sudoku.level = 1;
sudoku.block = 9;
sudoku.game = null;
sudoku.rowExistNumber = null;
sudoku.colExistNumber = null;
sudoku.blockExistNumber = null;
sudoku.fixedNumber = null;

sudoku.again = function(){
    sudoku.game = null;
    sudoku.rowExistNumber = null;
    sudoku.colExistNumber = null;
    sudoku.blockExistNumber = null;
    sudoku.fixedNumber = null;
};

sudoku.init = function() {
    if(this.game != null){
        return;
    }

    this.game = new Array();
    this.rowExistNumber = new Array();
    this.colExistNumber = new Array();
    this.blockExistNumber = new Array();
    this.fixedNumber = new Array();
    for(var i = 0; i < this.block; i++){
        this.game[i] = new Array();
        this.rowExistNumber[i] = new Array();
        this.colExistNumber[i] = new Array();
        this.blockExistNumber[i] = new Array();
        this.fixedNumber[i] = new Array();
        for(var j = 0; j < this.block; j++){
            this.game[i][j] = 0;
            this.rowExistNumber[i][j] = false;
            this.colExistNumber[i][j] = false;
            this.blockExistNumber[i][j] = false;
            this.fixedNumber[i][j] = false;
        }
    }

    //随机初始化1-9的数字
    for(var i = 0; i < this.block; i++){
        var row = this.getRandomBetween(0, this.block);
        var col = this.getRandomBetween(0, this.block);
        if(this.game[row][col] > 0){
            continue;
        }
        this.game[row][col] = i + 1;
        this.rowExistNumber[row][i] = true;
        this.colExistNumber[col][i] = true;
        var _block = this.getBlock(row, col);
        this.blockExistNumber[_block][i] = true;
    }

    while(!this.fillNumber(this.game, this.rowExistNumber, this.colExistNumber, this.blockExistNumber)){}
};

sudoku.create = function() {
    if(this.level < 1 || this.level > 4){
        return false;
    }
    var blank = 0;
    if(this.level == 1){
        blank = this.getRandomBetween(45, 50);
        while(blank > 0){
            var row = this.getRandomBetween(0, this.block);
            var col = this.getRandomBetween(0, this.block);
            var number = this.game[row][col];
            var count = 0;
            if(number != 0){
                for(var i = 0; i < this.block; i++){
                    if(this.game[row][i] > 0){
                        count++;
                    }
                }
                if(count == 3){     //每行至少保留3个数字
                    continue;
                }
                var _block = this.getBlock(row, col);
                this.rowExistNumber[row][number-1] = false;
                this.colExistNumber[col][number-1] = false;
                this.blockExistNumber[_block][number-1] = false;
                this.game[row][col] = 0;
                blank--;
            }
        }
    }else if(this.level == 2){
        blank = this.getRandomBetween(50, 57);
        var math = this.totalJumpNumber();     //奇数偶数间隔共挖个数，小于总空白
        var sub = blank - math;
        while(blank > 0){
            var row = this.getRandomBetween(0, this.block);
            var col = this.getRandomBetween(0, this.block);
            if(sub - blank < 0){     //间隔挖完后，随机挖剩下的空白
                if(row % 2 == 0){
                    if(col % 2 != 0){       //同为偶数
                        col = col - 1 > 0 ? col - 1 : col + 1;
                    }
                }else{
                    if(col % 2 == 0){       //同为奇数
                        col = col - 1 > 0 ? col - 1 : col + 1;
                    }
                }
            }
            var number = this.game[row][col];
            var count = 0;
            if(number != 0){
                for(var i = 0; i < this.block; i++){
                    if(this.game[row][i] > 0){
                        count++;
                    }
                }
                if(count == 2){     //每行至少保留2个数字
                    continue;
                }
                var _block = this.getBlock(row, col);
                this.rowExistNumber[row][number-1] = false;
                this.colExistNumber[col][number-1] = false;
                this.blockExistNumber[_block][number-1] = false;
                this.game[row][col] = 0;
                blank--;
            }
        }
    }else if(this.level == 3){
        blank = this.getRandomBetween(55, 60);
        while(blank > 0){
            var row = this.getRandomBetween(0, this.block);
            var col = this.getRandomBetween(0, this.block);
            var number = this.game[row][col];
            var count = 0;
            if(number != 0){
                for(var i = 0; i < this.block; i++){
                    if(this.game[row][i] > 0){
                        count++;
                    }
                }
                if(count == 1){     //每行至少保留1个数字
                    continue;
                }
                var _block = this.getBlock(row, col);
                this.rowExistNumber[row][number-1] = false;
                this.colExistNumber[col][number-1] = false;
                this.blockExistNumber[_block][number-1] = false;
                this.game[row][col] = 0;
                blank--;
            }
        }
    }else{
        // 每行数字不能多于2个，81-2*9 至少要挖63个洞
        blank = this.getRandomBetween(58, 63);
        while(blank > 0){
            var row = this.getRandomBetween(0, this.block);
            var col = this.getRandomBetween(0, this.block);
            var number = this.game[row][col];
            var count = 0;
            if(number != 0){
                for(var i = 0; i < this.block; i++){
                    if(this.game[row][i] > 0){
                        count++;
                    }
                }
                if(count > 2){     //每行数字不能多于2个
                    var _block = this.getBlock(row, col);
                    this.rowExistNumber[row][number-1] = false;
                    this.colExistNumber[col][number-1] = false;
                    this.blockExistNumber[_block][number-1] = false;
                    this.game[row][col] = 0;
                    blank--;
                }
            }
        }
    }

    for(var i = 0; i < this.block; i++){
        for(var j = 0; j < this.block; j++){
            if(this.game[i][j] > 0){
                this.fixedNumber[i][j] = true;
            }
        }
    }

    return true;
};

sudoku.fillNumber = function(full, rows, cols, blocks){
    for(var i = 0; i < this.block; i++){
        for(var j = 0; j < this.block; j++){ //循环每个单元格
            var _block = this.getBlock(i, j);
            if(full[i][j] == 0){
                for(var k = 1; k < (this.block + 1); k++ ){     //从数字1开始填数
                    var num = k - 1;
                    if(rows[i][num] == true || cols[j][num] == true || blocks[_block][num] == true){
                        continue;
                    }else{
                        full[i][j] = k;
                        rows[i][num] = true;
                        cols[j][num] = true;
                        blocks[_block][num] = true;
                        if(this.fillNumber(full, rows, cols, blocks)){
                            return true;
                        }else{
                            full[i][j] = 0;
                            rows[i][num] = false;
                            cols[j][num] = false;
                            blocks[_block][num] = false;
                        }
                    }
                }

                //1-9都循环完了还没有正确的数字，return false
                if(full[i][j] == 0){
                    return false;
                }
            }
        }
    }
    return true;
};

sudoku.check = function(row, col, number){
    var block = this.getBlock(row, col);
    var num = number - 1;
    if(this.rowExistNumber[row][num] == true){
        return 1;
    }else if(this.colExistNumber[col][num] == true){
        return 2;
    }else if(this.blockExistNumber[block][num] == true){
        return 3;
    }else {
        return 0;
    }
};

sudoku.finishCheck = function(){
    for(var i = 0; i < this.game.length; i++){
        for(var j = 0; j < this.game[i].length; j++){
            if(this.game[i][j] == 0){
                return false;
            }
            //以下J表示数字1-9
            if(this.rowExistNumber[i][j] == false){
                return false;
            }
            if(this.colExistNumber[i][j] == false){
                return false;
            }
            if(this.blockExistNumber[i][j] == false){
                return false;
            }
        }
    }
    return true;
};

sudoku.getBlock = function(row, col){
    var sqrt = Math.sqrt(this.block);
    return Math.floor(row / sqrt) * sqrt + Math.floor(col / sqrt);
};

sudoku.totalJumpNumber = function(){
    var count = 0;
    for(var i = 0; i < this.block; i++){
        for(var j = 0; j < this.block; j++){
            if(i % 2 == 0 && j % 2 == 0){
                count++;
            }else if(i % 2 != 0 && j % 2 != 0){
                count++;
            }else{
                continue;
            }
        }
    }
    return count;
};

sudoku.getRandomBetween = function(start, end){
    var n = Math.floor((Math.random() * (end-start))) + start ;
    return n;
};

module.exports = sudoku;
