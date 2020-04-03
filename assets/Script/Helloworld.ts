const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.EditBox)
    edit: cc.EditBox = null;

    @property(cc.Node)
    model: cc.Node = null

    @property(cc.Button)
    button: cc.Button = null

    start() {
        // init logic
        this.label.string = this.text;

        this.edit.placeholderLabel.string = "1"
        // this.edit.placeholderLabel.node.active =false
        // this.edit.textLabel.string ="123"
        // this.edit.textLabel.node.active = true
        // cc.log(this.edit.textLabel.string)

        var scene = cc.director.getScene();
        var node = cc.instantiate(this.model);
        cc.log(this.model.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string)
        this.model.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string="789"
        cc.log(this.model.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string)
        cc.log(this.model.getChildByName("editbox").getComponent(cc.EditBox).placeholderLabel.string)

        console.log("--------------")
        cc.log(node.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string)
        cc.log(node.getChildByName("editbox").getComponent(cc.EditBox).placeholderLabel.string)
        
        node.setPosition(0, -50)
        node.parent = this.model.parent
        
        node.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string="456"
        node.getChildByName("editbox").getComponent(cc.EditBox).placeholderLabel.string="6666"
        cc.log(node.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string)
        cc.log(node.getChildByName("editbox").getComponent(cc.EditBox).placeholderLabel.string)

    }

    clickCallback(eve) {
        cc.log(eve.target.parent.getChildByName("editbox").getComponent(cc.EditBox).textLabel.string)
        cc.log(eve.target.parent.getChildByName("editbox").getComponent(cc.EditBox).placeholderLabel.string)
    }
}
