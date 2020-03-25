// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseComponent extends cc.Component {

    _eventList = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadResource()
    }

    start() {

    }
    //加载资源
    loadResource() {
        // cc.log(this.node.getComponent(cc.Sprite))
        this._registerAllBtnClickEvent(this.node)
        this._initWidget()
    }
    //初始化组件操作
    _initWidget() {

    }
    //注册所有按钮点击事件
    _registerAllBtnClickEvent(node) {
        if (!node) {
            return;
        }
        let btn = node.getComponent(cc.Button)
        if (btn) {
            // cc.log(btn.node.name)
            btn.node.on("click", this._onBtnClickCallback, this)
        }
        let arrayRootChidden = node.children
        // cc.log(arrayRootChidden,node.name)
        for (let i = 0; i < arrayRootChidden.length; i++) {
            this._registerAllBtnClickEvent(arrayRootChidden[i])
        }
    }
    //按钮点击事件回调
    _onBtnClickCallback(sender) {
        this._onJsonBtnClickEvent(sender)
    }
    //子控件重写此方法获取回调
    _onJsonBtnClickEvent(sender) { }

    //注册所有自定义事件
    registerAllCustomEvents(array) {
        this._eventList = this._eventList || []
        for (let i = 0; i < array.length; i++) {
            if (!array[i][0] || !array[i][1]) {
                continue
            }
            if (typeof array[i][0] !== "string") {
                array[i][0] = String(array[i][0])
            }
            if (typeof array[i][1] !== "function") {
                continue
            }
            this._eventList.push(array[i])
            this.node.on(array[i][0], array[i][1], this)
        }
    }

    //注销所有自定义事件
    unregisterAllCustomEvents() {
        if (!this._eventList) {
            return
        }
        this._eventList.forEach(element => {
            this.node.off(element[0], element[1], this)
        });
        this._eventList = null
    }

    onDisable() {

    }

    onDestroy() {
        this.unregisterAllCustomEvents()
    }

    update(dt) {

    }
}
