(function(){

	var obj = [
		{
			from : "example.co.jp",
			category : "A",
			time : "1",
			range : 10
		},
		{
			from : "test.com",
			category : "B",
			time : "1",
			range : 20
		},
		{
			from : "sample.jp",
			category : "A",
			time : "2",
			range : 10
		},
	];
	
	
	/**
	 * Colorsオブジェクト
	 * @returns {main_L1.Colors}
	 */
	Colors = function(){
		this.index = 0;
		this.colors = [
			0xff00ff,
			0xffff00,
			0x00ffff,
			0xff0000,
			0x00ff00,
			0x0000ff
		];		
	};
	Colors.prototype.getColor = function(){
		this.index = this.index % this.colors.length
		var color = this.colors[this.index];
		this.index++;
		return color;
	};

	/**
	 * スクリーンオブジェクト
	 * @constructor
	 */
	Screen = function(domId){
		this.width = 800;
		this.height = 600;
		this.position = [];

		// ステージを作る
		this.stage = new PIXI.Stage(0x000000);

		// レンダラーを作る
		this.renderer = PIXI.autoDetectRenderer(this.width, this.height);

		// レンダラーのviewをDOMに追加する
		document.getElementById(domId).appendChild(this.renderer.view);

	};

	Screen.prototype.stageAdd = function(accessObject){
		this.stage.addChild(accessObject.getPixiObject());
	};

	Screen.prototype.render = function(){
		this.renderer.render(this.stage);   // 描画する

	};

	Screen.prototype.addForwardPosition = function(name, percentage){
		this.position.push({
			name : name,
			area : (this.height * percentage / 100)
		});
	};

	Screen.prototype.drawForwardArea = function(){
		var areaY = 0;

		for(var i = 0; i < this.position.length; i++){
			// テキストオブジェクトを作る
			var name = this.position[i].name;
			var style = {font:'bold 14pt Arial', fill:'white'};
			var textobj = new PIXI.Text(name, style);


			textobj.position.x = 600;
			textobj.position.y = areaY;
			areaY += this.position[i].area;

			// テキストオブジェクトをステージに乗せる
			this.stage.addChild(textobj);
		}
	};
	
	
	/**
	 * Logオブジェクト
	 *
	 * ログを読み込む
	 *
	 * @param {type} log
	 * @returns {main_L1.LogData}
	 */
	LogData = function(log){
		this.log = log;
		this.category = {};

		for(var i = 0; i < this.log.length; i++){
			if(!this.category[this.log[i].category]){
				this.category[this.log[i].category] = 1;
			}else{
				this.category[this.log[i].category]++;
			}
		}
	};
	LogData.prototype.getCategory = function(){
		return this.category;
	};
	
	
	
	/**
	 * Accessオブジェクト
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @param {type} info
	 * @returns {main_L1.AccessObject}
	 */
	AccessObject = function(x, y, color, info){
		this.width = 800; 
		this.pixiObj = new PIXI.Graphics();
		this.pixiObj.position.x = x;
		this.pixiObj.position.y = y;

		this.pixiObj.beginFill(color, 1);
		this.pixiObj.drawCircle(0, 0, info.range);
		this.pixiObj.endFill();

		this.forwardX = 2;
		this.forwardY = 0;
		this.from = info.from;
		this.category = info.category;
	};
	
	AccessObject.prototype.move = function(){
		if(this.pixiObj.position.x >= this.width / 2){
			this.pixiObj.position.x = 0;
		}

		this.pixiObj.position.x += this.forwardX;
		this.pixiObj.position.y += this.forwardY;
	};
	
	AccessObject.prototype.getPixiObject = function(){
		return this.pixiObj;
	};
	
	
	
	
	
	
	
	/**
	 * 処理スタート
	 * @returns {undefined}
	 */
	window.onload = function(){

		var graphicObj = [];
		var colors = new Colors();

		var screen = new Screen("pixiview");

		//LogDataの作成
		var logData = new LogData(obj);
		console.log(logData.getCategory());

		// AccessObjectの生成
		for(var i = 0; i < obj.length; i++){
			var ao = new AccessObject(0, i*50, colors.getColor(), obj[i]);
			
			graphicObj.push(ao);

			screen.stageAdd(ao)
		}

		screen.addForwardPosition('aaa', 10);
		screen.addForwardPosition('bbb', 10);
		screen.addForwardPosition('ccc', 50);
		screen.addForwardPosition('ddd', 10);
		// エリア表示
		screen.drawForwardArea();

		// アニメーション関数を定義する
		function animate(){
			requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す
//			textobj.rotation += 0.01; // テキストを回転する

			for(var j = 0; j < graphicObj.length; j++){
				graphicObj[j].move();
			}
			// 描画
			screen.render();
		}

		// 次のアニメーションフレームでanimate()を呼び出してもらう
		requestAnimationFrame(animate);
		
	}

})()
