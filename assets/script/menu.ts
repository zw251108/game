import {_decorator, Component, Node
    , Button
    , EventMouse
    , input, Input
    , director
    , AssetManager, resources} from 'cc';

const
    { ccclass
    , property } = _decorator
    ;

@ccclass('MenuController')
export class MenuController extends Component{

    @property( Button )
    startBtn: Button;

    @property( Button )
    settingBtn: Button;

	start(){
        this.startBtn.node.on(Input.EventType.MOUSE_DOWN, this.goMap);
	}

    goMap(event){
        event.propagationStopped = true;

        resources.loadScene('cave', (e, scene)=>{
            director.runScene( scene );
        });
    }

	update(deltaTime: number){

	}
}


