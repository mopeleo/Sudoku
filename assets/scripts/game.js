// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var sudoku = require("sudoku");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        block:{
            default:null,
            type:cc.Sprite
        },

        key:{
            default:null,
            type:cc.Sprite
        },

        finish:{
            default:null,
            type:cc.Sprite
        },

        cellPrefab:{
            default:null,
            type:cc.Prefab
        },

        whiteSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },

        graySpriteFrame:{
            default: null,
            type: cc.SpriteFrame
        },

        exitButton:{
            default:null,
            type:cc.Button
        },

        saveButton:{
            default:null,
            type:cc.Button
        },

        cellEventFlag:true,  //单元格事件开关
        // keyExistFlag:false,   //键盘弹出标志
        clickCell:null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initKey();
        this.initFinish();
        this.exitButton.node.on(cc.Node.EventType.TOUCH_END, this.exitGame, this);
        this.saveButton.node.on(cc.Node.EventType.TOUCH_END, this.saveGame, this);
        sudoku.init();
        sudoku.create();

        for(var i = 0; i < sudoku.game.length; i++){
            for(var j = 0; j < sudoku.game[i].length; j++){
                var cell = cc.instantiate(this.cellPrefab);
                var px = 30*(j - 4);
                var py = 30*(4 - i);
                //调整对齐像素
                if(px > 0){
                    px++;
                }
                if(py < 0){
                    py--;
                }
                cell.setPosition(cc.p(px, py));
                if(sudoku.game[i][j] == 0){
                    cell.getChildByName("num").getComponent(cc.Label).string = " ";
                    cell.on(cc.Node.EventType.TOUCH_END, this.clickCellEvent, this);
                }else{
                    cell.getChildByName("num").color = cc.Color.BLACK;
                    cell.getChildByName("num").getComponent(cc.Label).string = sudoku.game[i][j];
                }

                //额外添加属性
                cell._row = i;
                cell._col = j;
                cell._block = sudoku.getBlock(i, j);
                this.block.node.addChild(cell);          //添加到场景
            }
        }
    },

    // clickCellEvent: function(event){
    //     if(this.clickCell != null){
    //         this.clickCell.on(cc.Node.EventType.TOUCH_END, this.clickCellEvent, this);
    //     }
    //     this.key.node.x=0;
    //     this.clickCell = event.target;
    //     this.clickCell.off(cc.Node.EventType.TOUCH_END);
    // },

    clickCellEvent: function(event){
        if(this.cellEventFlag){
            this.cellEventFlag = false;
            this.key.node.x=0;
            this.clickCell = event.target;
            this.clickCell.getComponent(cc.Sprite).spriteFrame = this.graySpriteFrame;
        }else{
            this.cellEventFlag = true;
            this.key.node.x=1000;
            this.clickCell.getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
            this.clickCell = null;
        }
    },

    fillNumberEvent: function(event){
        var clickNum = event.target.getComponent(cc.Label).string;
        this.clickCell.getChildByName("num").getComponent(cc.Label).string = clickNum;
        // this.clickCell.on(cc.Node.EventType.TOUCH_END, this.clickCellEvent, this);
        this.cellEventFlag = true;

        if(sudoku.check(this.clickCell._row, this.clickCell._col, clickNum) != 0){
            this.clickCell.getChildByName("num").color = cc.Color.RED;
        }else{
            this.clickCell.getChildByName("num").color = cc.Color.BLUE;
        }
        sudoku.game[this.clickCell._row][this.clickCell._col] = clickNum;
        sudoku.rowExistNumber[this.clickCell._row][clickNum - 1] = true;
        sudoku.colExistNumber[this.clickCell._col][clickNum - 1] = true;
        sudoku.blockExistNumber[this.clickCell._block][clickNum - 1] = true;

        this.key.node.x = 1000;

        if(sudoku.finishCheck()){
            this.finish.node.x = 0;
        }
    },

    initKey:function(){
        this.key.node.x = 1000;
        var num = 0;
        for(var i = 1; i < 4; i++){
            for(var j = 1; j < 4; j++){
                num++;
                /* 动态新增LABEL */
                var numberLabel = new cc.Node("numberLabel");
                numberLabel.x = 40*(j - 2);
                numberLabel.y = 40*(2 - i);
                numberLabel.color = cc.Color.WHITE;
                var label = numberLabel.addComponent(cc.Label);
                label.fontSize = 30;
                label.string = num;

                numberLabel.on(cc.Node.EventType.TOUCH_END, this.fillNumberEvent, this);

                this.key.node.addChild(numberLabel);
                /* 动态新增LABEL END*/
            }
        }
    },

    initFinish:function(){
        this.finish.node.x = 1000;
        // this.finish.node.getChildByName("again").getComponent(cc.Label).string = "test";
        this.finish.node.getChildByName("again").on(cc.Node.EventType.TOUCH_END, function(){
            sudoku.again();
            cc.director.loadScene("index");
        }, this);
    },

    exitGame:function(){
        cc.director.end();
    },

    saveGame:function(){
        cc.sys.localStorage.setItem('game', sudoku.game);
        cc.sys.localStorage.setItem('fixedNum', sudoku.fixedNum);
    },

    // update (dt) {},
});
