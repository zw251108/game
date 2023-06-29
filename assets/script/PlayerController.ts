import {_decorator, Component, Vec3, EventMouse, input, Input, EventKeyboard, KeyCode, Animation} from 'cc';

const
    { ccclass
    , property } = _decorator
    ;


const DIRECTION_MAP = ['up', 'left', 'down', 'right']
	// 模式按键功能映射
	, KEY_OP_MAP = [{
		// mode 0
		// 鼠标 + QWER + 空格
		[KeyCode.KEY_Q]: ['skill', 0]
		, [KeyCode.KEY_W]: ['skill', 1]
		, [KeyCode.KEY_E]: ['skill', 2]
		// , [KeyCode.KEY_R]: ['skill', 3]
		, [KeyCode.SPACE]: ['skill', 4]
	}, {
		// mode 1
		// wasd + JKLI + 空格
		[KeyCode.KEY_W]: ['move', 0]
		, [KeyCode.KEY_A]: ['move', 1]
		, [KeyCode.KEY_S]: ['move', 2]
		, [KeyCode.KEY_D]: ['move', 3]
		, [KeyCode.KEY_J]: ['skill', 0]
		, [KeyCode.KEY_K]: ['skill', 1]
		, [KeyCode.KEY_L]: ['skill', 2]
		// , [KeyCode.KEY_I]: ['skill', 3]
		, [KeyCode.SPACE]: ['skill', 4]
	}]
	, PLAYER_SKILL = [{
		// 战士
	}, {
		// 侦察兵
	}, {
		// 法师
	}]
	;

@ccclass('PlayerController')
export class PlayerController extends Component{

	@property(Animation)
	BodyAnim: Animation = null;

	mode = 0;   // 操作模式，0 鼠标键盘，1 键盘，2 触摸屏，3 手柄

	direction = 1;  // 面向方向，0 上，1 左，2 下，3 右

	state = '';  // 当前状态
	stateTime = 0;  // 状态持续时间
	stateRunTime = 0;   // 已进行状态持续时间

	private _curPos: Vec3 = new Vec3();
	private _targetPos: Vec3 = new Vec3();

	moveSpeed = 400;
	moveTime = 0.1;

	start(){
		this.bindEvent();
	}

	setMode(mode: number){
		this.unbindEvent();
		this.mode = mode;
		this.bindEvent();
	}

	bindEvent(){
		if( this.mode === 0 ){
			input.on(Input.EventType.MOUSE_UP, this.onMouseEvent, this);
		}

		input.on(Input.EventType.KEY_DOWN, this.onKeyEvent, this);
		input.on(Input.EventType.KEY_PRESSING, this.onKeyEvent, this);
	}

	unbindEvent(){
		if( this.mode === 0 ){
			input.off(Input.EventType.MOUSE_UP, this.onMouseEvent, this);
		}

		input.off(Input.EventType.KEY_DOWN, this.onKeyEvent, this);
		input.off(Input.EventType.KEY_PRESSING, this.onKeyEvent, this);
	}

	onMouseEvent(event: EventMouse){
		if( event.getButton() === 0 ){
			this.move(0);
		}
		else if( event.getButton() === 2 ){
			this.flash();
		}
	}

	onKeyEvent(event: EventKeyboard){
		let keyCode = event.keyCode
			, op = KEY_OP_MAP[this.mode]?.[keyCode]
			;

		if( op ){
			this[op?.[0]]( op?.[1] );
		}
	}

	moveVec3(time){
		const rs = new Vec3()
			;

		switch( this.direction ){
			case 0:
				// 上
				rs.y = this.moveSpeed * time
				break;
			case 1:
				// 左
				rs.x = -this.moveSpeed * time;
				break;
			case 2:
				// 下
				rs.y = -this.moveSpeed * time
				break;
			case 3:
				// 右
				rs.x = this.moveSpeed * time;
				break;
			default:
				break;
		}

		return rs;
	}

    move(direction: number){
		if( this.state ){
			return ;
		}

		this.state = 'moving';
		this.stateTime = this.moveTime;

	    this.node.getPosition( this._curPos );
	    this.direction = direction;

		Vec3.add(this._targetPos, this._curPos, this.moveVec3( this.moveTime ));
    }

	skill(id: number){
		if( this.state && this.state !== 'moving' ){    // 施放技能时会打断移动
			return ;
		}

		switch( id ){
			case 0:
				// 基础攻击
				this.attack();
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				this.flash();
				break;
			default:
				break;
		}
	}
    attack(){
	    this.state = 'attacking';
		this.stateTime = this.BodyAnim!.getState('attack').duration;
	    this.BodyAnim!.play('attack');
    }

	flash(){
		this.state = 'flashing';
	}

	update(deltaTime: number){
		if( this.state ){
			this.stateRunTime += deltaTime;

			if( this.stateRunTime >= this.stateTime ){
				this.state = '';
				this.stateRunTime = 0;
			}

			switch( this.state ){
				case 'moving':
					if( this.stateRunTime >= this.stateTime ){
						this.node.setPosition( this._targetPos );
					}
					else{
						// tween
						this.node.getPosition( this._curPos );

						Vec3.add(this._curPos, this._curPos, this.moveVec3( deltaTime ));
						this.node.setPosition( this._curPos );
					}
					break;
				case 'attacking':

					break
				case 'flashing':
					
					break;
				default:
					break;
			}
		}
	}
}