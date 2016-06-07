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
	 * 二次元オブジェクト
	 * @param {type} x
	 * @param {type} y
	 * @param {type} width
	 * @param {type} height
	 * @returns {undefined}
	 */
	Position = function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};


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
	 * 全体的な描画を管理
	 * @constructor
	 */
	Screen = function(domId){
		this.width = 800;
		this.height = 600;
		this.areaManager = new AreaManager(600, 0, 200, this.height);
//		this.forwardAreas = [];

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

	Screen.prototype.addForward = function(name, percentage){
		this.areaManager.addForwardPosition(name, percentage);
	};

	Screen.prototype.drawForward = function(){
		this.areaManager.drawForwardArea(this.stage);
	};
	
	/**
	 * 目的地となるエリア
	 * @param {type} name
	 * @param {type} percentage
	 * @returns {main_L1.ForwardArea}
	 */
	ForwardArea = function(name, percentage){
		this.name = name;
		this.percentage = percentage;
		
		// テキストオブジェクトを作る
		var name = this.name;
		var style = {font:'bold 14pt Arial', fill:'white'};
		this.textObject = new PIXI.Text(name, style);		
	};
	
	ForwardArea.prototype.drawArea = function(x, y){
		this.textObject.position.x = x;
		this.textObject.position.y = y;

		return this.textObject;
	};
	
	ForwardArea.prototype.getPercentage = function(){
		return this.percentage;
	};
	
	ForwardArea.prototype.getX = function(){
		return this.textObject.position.x;
	};
	ForwardArea.prototype.getY = function(){
		return this.textObject.position.y;
	};



	AreaManager = function(x, y, width, height){
		this.forwardAreas = [];
		this.position = new Position(x, y, width, height);
	};
	
	AreaManager.prototype.addForwardPosition = function(name, percentage){
		this.forwardAreas.push( 
				new ForwardArea(name, percentage)
		);
	};

	AreaManager.prototype.drawForwardArea = function(stage){
		var areaY = 0;
		
		for(var i = 0; i < this.forwardAreas.length; i++){
			// テキストオブジェクトをステージに乗せる
			stage.addChild( this.forwardAreas[i].drawArea(this.position.x, areaY ));
			areaY += this.position.height * this.forwardAreas[i].getPercentage() / 100;
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

		// 目的地の追加
		screen.addForward('aaa', 10);
		screen.addForward('bbb', 10);
		screen.addForward('ccc', 50);
		screen.addForward('ddd', 10);
		// エリア表示
		screen.drawForward();

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
