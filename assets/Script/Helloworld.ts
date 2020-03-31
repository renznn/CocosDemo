const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.EditBox)
    edit:cc.EditBox = null;

    start () {
        // init logic
        this.label.string = this.text;
        
        this.edit.placeholderLabel.string = "1"
        // this.edit.placeholderLabel.node.active =false
        // this.edit.textLabel.string ="123"
        // this.edit.textLabel.node.active = true
        cc.log(this.edit.textLabel.string)

    }
}
