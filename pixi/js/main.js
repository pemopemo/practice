(function(){
	var width = 800;
	var height = 600;

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
	 * Logオブジェクト
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

		// ステージを作る
//		var stage = new PIXI.Stage(0x000000);
		var stage = new PIXI.Stage(0xffcccc);

		// レンダラーを作る
		var renderer = PIXI.autoDetectRenderer(width, height);

		// レンダラーのviewをDOMに追加する
		document.getElementById("pixiview").appendChild(renderer.view);

//		// テキストオブジェクトを作る
//		var word = "Hello World!";
//		var style = {font:'bold 60pt Arial', fill:'white'};
//		var textobj = new PIXI.Text(word, style);
//		textobj.position.x = 60;
//		textobj.position.y = height / 2;
//
//		// テキストオブジェクトをステージに乗せる
//		stage.addChild(textobj);

		//LogDataの作成
		var logData = new LogData(obj);
		console.log(logData.getCategory());

		// AccessObjectの生成
		for(var i = 0; i < obj.length; i++){
			var ao = new AccessObject(0, i*50, colors.getColor(), obj[i]);
			
			graphicObj.push(ao);
			stage.addChild(ao.getPixiObject());
		}


		// アニメーション関数を定義する
		function animate(){
			requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す
//			textobj.rotation += 0.01; // テキストを回転する

			for(var j = 0; j < graphicObj.length; j++){
				graphicObj[j].move();
			}
			
			renderer.render(stage);   // 描画する
		}

		// 次のアニメーションフレームでanimate()を呼び出してもらう
		requestAnimationFrame(animate);
		
	}

})()
