(function(){

	var log = [
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
			0x1f77b4,
			0xff7f0e,
			0x2ca02c,
			0xd62728,
			0x9467bd,
			0x8c564b,
			0xe377c2,
			0x7f7f7f,
			0xbcbd22,
			0x17becf
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
	Screen = function(domId, width, height, logData){
		this.width = width;
		this.height = height;
		this.areaManager = new AreaManager(600, 0, 200, this.height);
		this.accessObjectManager = new AccessObjectManager(logData, this.height);

		// ステージを作る
		this.stage = new PIXI.Stage(0x000000);

		// レンダラーを作る
		this.renderer = PIXI.autoDetectRenderer(this.width, this.height);

		// レンダラーのviewをDOMに追加する
		document.getElementById(domId).appendChild(this.renderer.view);
	};

	Screen.prototype.stageAddAccessObject = function(){
		this.accessObjectManager.stageAdd(this.stage);
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
	Screen.prototype.adjustArea = function(){
		this.areaManager.adjustForwardArea(this.stage);
	};
	
	Screen.prototype.moveAccessObjects = function(){
		this.accessObjectManager.move();
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


	/**
	 * エリアのオペレーター
	 * @param {type} x
	 * @param {type} y
	 * @param {type} width
	 * @param {type} height
	 * @returns {main_L1.AreaManager}
	 */
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
	
	AreaManager.prototype.adjustForwardArea = function(stage){
		var cell = this.position.height / this.forwardAreas.length;
		
		for(var i = 0; i < this.forwardAreas.length; i++){
			this.forwardAreas[i].drawArea(this.position.x, cell * i);
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
	AccessObject = function(x, y, color, info, distance){
		this.distance = distance; 
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
		if(this.pixiObj.position.x >= this.distance / 2){
			this.pixiObj.position.x = 0;
		}

		this.pixiObj.position.x += this.forwardX;
		this.pixiObj.position.y += this.forwardY;
	};
	
	AccessObject.prototype.getPixiObject = function(){
		return this.pixiObj;
	};
	
	
	AccessObjectManager = function(logData, distance){
		this.accessObjects = [];
		var colors = new Colors();

		// AccessObjectの生成
		for(var i = 0; i < logData.length; i++){
			console.log(logData.length);
		
			var accessObject = new AccessObject(0, i * 50, colors.getColor(), logData[i], distance);			
			this.accessObjects.push(accessObject);
//			screen.stageAdd(accessObject)
		}
	};

	AccessObjectManager.prototype.stageAdd = function(stage){
		for(var i = 0; i < this.accessObjects.length; i++){
			stage.addChild(this.accessObjects[i].getPixiObject());
		}
	};

	AccessObjectManager.prototype.move = function(){
//		alert(this.accessObjects.length);
		for(var i = 0; i < this.accessObjects.length; i++){
			this.accessObjects[i].move();
		}
	};

	
	
	
	/**
	 * 処理スタート
	 * @returns {undefined}
	 */
	window.onload = function(){

var graphicObj = []
		//LogDataの作成
		var logData = new LogData(log);
		console.log(logData.getCategory());

		var screen = new Screen("pixiview", 800, 600, logData);
		
		screen.stageAddAccessObject();

		// 目的地の追加
		screen.addForward('aaa', 10);
		screen.addForward('bbb', 10);
		screen.addForward('ccc', 50);
		screen.addForward('ddd', 10);
		screen.addForward('eee', 10);
		screen.addForward('fff', 10);
		screen.addForward('ggg', 10);
		screen.addForward('hhh', 10);
		screen.addForward('iii', 10);
		screen.addForward('jjj', 10);
		screen.addForward('kkk', 10);
		screen.addForward('lll', 10);
		screen.addForward('mmm', 10);
		screen.addForward('ooo', 10);
		screen.addForward('ppp', 10);
		screen.addForward('qqq', 10);
		screen.addForward('rrr', 10);
		
		// エリア表示
		screen.drawForward();

		// エリア再設定
		screen.adjustArea();

		// アニメーション関数を定義する
		function animate(){
			requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す
//			textobj.rotation += 0.01; // テキストを回転する

			// アクセスオブジェクトを動かす
			screen.moveAccessObjects();

			// 描画
			screen.render();
		}

		// 次のアニメーションフレームでanimate()を呼び出してもらう
		requestAnimationFrame(animate);
		
	}

})()
