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
        level1:{
            default:null,
            type:cc.Label
        },

        level2:{
            default:null,
            type:cc.Label
        },

        level3:{
            default:null,
            type:cc.Label
        },

        level4:{
            default:null,
            type:cc.Label
        },

        startButton:{
            default:null,
            type:cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.level1.node.color = cc.Color.RED;
        sudoku.level = 1;

        this.level1.node.on(cc.Node.EventType.TOUCH_END, this.selectLevel, this);
        this.level2.node.on(cc.Node.EventType.TOUCH_END, this.selectLevel, this);
        this.level3.node.on(cc.Node.EventType.TOUCH_END, this.selectLevel, this);
        this.level4.node.on(cc.Node.EventType.TOUCH_END, this.selectLevel, this);

        this.startButton.node.on(cc.Node.EventType.TOUCH_END, function(){
            cc.director.loadScene("game");
        }, this);
    },

    selectLevel:function(event){
        // var labels = this.getComponent(cc.Label);
        var labels = this.node.getChildren();
        for(var i in labels){
            labels[i].color = cc.Color.WHITE;
        }
        event.target.color = cc.Color.RED;
        sudoku.level = event.target.name.substring(5,6);
    }
    // update (dt) {},
});
