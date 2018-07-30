
var $music = new Audio();
//$music.autoplay=true;
$music.preload=true;
$music.loop=true;
$music.src="music.wav";

if(typeof io !== "undefined"){
	var socket = io();
}

function step(){
	
	gamepads = navigator.webkitGetGamepads&&navigator.webkitGetGamepads();
	gamepad = gamepads&&(gamepads[0]||gamepads[1]||gamepads[2]||gamepads[3]);
	
	if(leveledit){
		view.x += (Math.max(-200,Math.min($ground.width-$canvas.width+200,(player.x-$canvas.width/2)))-view.x)/5;
		view.y += (Math.max(-200,Math.min($ground.height-$canvas.height+200,(player.y-$canvas.height/2)))-view.y)/5;
	}else{
		view.x += (Math.max(0,Math.min($ground.width-$canvas.width,(player.x-$canvas.width/2)))-view.x)/5;
		view.y += (Math.max(0,Math.min($ground.height-$canvas.height,(player.y-$canvas.height/2)))-view.y)/5;
	}
	mouse.x = mouse.cx+view.x;
	mouse.y = mouse.cy+view.y;
	
	/// (re)size canvas
	if($canvas.width!=window.innerWidth)$canvas.width=window.innerWidth;
	if($canvas.height!=window.innerHeight)$canvas.height=window.innerHeight;
	var ctx = $canvas.getContext("2d");
	
	
	ctx.save();
		!function predass(){
			ctx.fillStyle = "rgb(50,200,255)";
			ctx.fillRect(0,0,$canvas.width,$canvas.height);
			
			//ctx.drawImage($bg,-view.x/2,$canvas.height-$bg.height-view.y/5*0);
			ctx.drawImage($bg,-view.x/2,500-view.y/5);
			
			ctx.translate(-view.x,-view.y);
			
			/// Cloudsss...
			if(Math.random()<0.01) new Cloud({x:-400,y:Math.random()*500});
		}();
		
		!function dass(){
			/// Draw and step stuff.
			//for(var i=0;i<things.length;i++){
			for(var i=things.length-1;i>=0;i--){
				var thing = things[i];
				thing.stepdraw(ctx);
				
				//ctx.fillStyle = "#F0F";
				//ctx.fillRect((thing.x),(thing.y-50),1,50);
				//ctx.fillRect((thing.x-50),(thing.y),100,1);
				
				if(thing.poof){
					things.splice(i,1);
				}
			}
		}();
		
		!function postdass(){
			/// Draw the ground.
			ctx.drawImage($ground,0,0);
			
			if(!mouse.left && leveledit){
				var x=mouse.x-50,y=-50;
				for(var i=terrain.polys.length-1;i>=0;i--){
					var p=terrain.polys[i].poly,oe=0;
					if(p.length<2)continue;
					if(lineXline(p[0].x,p[0].y,p[p.length-1].x,p[p.length-1].y, x,y,mouse.x,mouse.y)){
						oe++;
					}
					for(var j=0;j<p.length-1;j++){
						if(lineXline(p[j].x,p[j].y,p[j+1].x,p[j+1].y, x,y,mouse.x,mouse.y)){
							oe++;
						}
						if(distance(p[j].x,p[j].y,mouse.x,mouse.y)<15){
							oe=1;break;
						}
					}
					if(oe&1){
						ctx.fillStyle = "rgba(255,0,255,0.5)";
						ctx.beginPath();
						ctx.moveTo(p[0].x,p[0].y);
						for(var j=0;j<p.length;j++){
							ctx.lineTo(p[j].x,p[j].y);
						}
						ctx.closePath();
						ctx.fill();
						if(mouse.right){
							undoable();
							terrain.polys.splice(i,1);
							drawGround();
						}
						break;
					}
				}
			}
			
			if(leveledit && le_poly){
				var p=le_poly.poly;
				if(p.length>2){
					/*var grd = context.createRadialGradient(238, 50, 10, 238, 50, 300);
					grd.addColorStop(0, 'rgba(255,0,255,0.1)');
					grd.addColorStop(1, 'rgba(055,255,255,0.2)');
					cxt.fillStyle = grd;*/
					ctx.fillStyle = "rgba(0,0,0,0.5)";
					
					ctx.beginPath();
					ctx.moveTo(p[0].x,p[0].y);
					for(var j=0;j<p.length;j++){
						ctx.lineTo(p[j].x,p[j].y);
					}
					ctx.closePath();
					ctx.fill();
				}
			}
			if(leveledit){
				ctx.fillStyle="rgba(0,0,0,0.1)";
				ctx.fillRect(-200,-200,$ground.width+400,200);
				ctx.fillRect(-200,-200,200,$ground.height+400);
				ctx.fillRect($ground.width,-200,200,$ground.height+400);
				ctx.fillRect(-200,$ground.height,$ground.width+400,200);
			}
		}();
		
	ctx.restore();
	//fup(mouse.x,mouse.y);
}
function drawGroundPart(the_poly){
	setTimeout(function(){
		try{
			localStorage.terrain=JSON.stringify(terrain);
		}catch(e){
			console.warn("localStorage: "+e.message);
		}
	},200);
	
	var p=the_poly.poly;
	if(p.length<1)return;
	
	var ctx = $ground.getContext("2d");
	if(the_poly.type=="grassy"
	||(the_poly.type=="dirt")){
		ctx.fillStyle = "rgb(100,70,0)";
	}else if(the_poly.type=="sand"){
		ctx.fillStyle = "rgb(250,250,200)";
	}else if(the_poly.type=="rock"){
		ctx.fillStyle = "rgb(100,100,100)";
	}else if(terrain.polys[i].type=="water"){
		ctx.fillStyle = "rgba(0,0,100,0.5)";
	}else return;
	ctx.beginPath();
	ctx.moveTo(p[0].x,p[0].y);
	for(var j=0;j<p.length;j++){
		ctx.lineTo(p[j].x,p[j].y);
	}
	ctx.closePath();
	ctx.fill();
}
function drawGround(){
	try{
		localStorage.terrain=JSON.stringify(terrain);
	}catch(e){
		console.warn("localStorage: "+e.message);
	}
	
	var ctx = $ground.getContext("2d");
	ctx.clearRect(0,0,$ground.width,$ground.height);
	
	for(var i=0;i<terrain.polys.length;i++){
		var p=terrain.polys[i].poly;
		if(p.length<1)continue;
		if(terrain.polys[i].type=="grassy"
		||(terrain.polys[i].type=="dirt")){
			ctx.fillStyle = "rgb(100,50,10)";
		}else if(terrain.polys[i].type=="sand"){
			ctx.fillStyle = "rgb(250,250,200)";
		}else if(terrain.polys[i].type=="rock"){
			ctx.fillStyle = "rgb(100,100,100)";
		}else continue;
		ctx.beginPath();
		ctx.moveTo(p[0].x,p[0].y);
		for(var j=0;j<p.length;j++){
			ctx.lineTo(p[j].x,p[j].y);
		}
		ctx.closePath();
		ctx.fill();
		
	}
	grimda=ctx.getImageData(0,0,$ground.width,$ground.height);
	ctx.globalCompositeOperation = 'source-atop';
	ctx.drawImage($gtex,0,0); 
	ctx.globalCompositeOperation = 'source-over';
	
	for(var i=0;i<terrain.polys.length;i++){
		var p=terrain.polys[i].poly;
		if(p.length<1)continue;
		if(terrain.polys[i].type=="grassy"){
			for(var j=0;j<p.length;j++){
				for(var k=0;k<1;k+=1/distance(p[j].x,p[j].y,p[(j+1)%p.length].x,p[(j+1)%p.length].y)){
					var x=(p[(j+1)%p.length].x-p[j].x)*k+p[j].x;
					var y=(p[(j+1)%p.length].y-p[j].y)*k+p[j].y;
					if(!collisionPoint(x,y-5)){
						ctx.strokeStyle="hsla("+(160-Math.random()*50)+","+(50+Math.random()*50)+"%,"+(50-Math.random()*20)+"%,1)";
						ctx.beginPath();
						ctx.moveTo(x+r(),y+Math.random()*3);
						ctx.lineTo(x+r(),y-Math.random()*5);
						ctx.stroke();
						ctx.beginPath();
						if(Math.random()<0.01){
							var yy=y-Math.random()*15-5;
							ctx.lineTo(x,yy);
							var fp=5+Math.floor(Math.random()*2),
								rds=Math.random()*5,
								off=Math.random()*Math.PI;
							ctx.strokeStyle="hsla("+(150-Math.random()*250)+","+(50+Math.random()*50)+"%,"+(50+Math.random()*30)+"%,1)";
							for(var f=0;f<fp;f++){
								ctx.moveTo(x,yy);
								ctx.lineTo(x+Math.sin(Math.PI*2/fp*f+off)*rds,yy+Math.cos(Math.PI*2/fp*f+off)*rds);
							}
							ctx.stroke();
						}
					}
				}
			}
		}else if(terrain.polys[i].type=="water"){
			ctx.fillStyle = "rgba(0,100,200,0.5)";
			
			ctx.beginPath();
			ctx.moveTo(p[0].x,p[0].y);
			for(var j=0;j<p.length;j++){
				ctx.lineTo(p[j].x,p[j].y);
			}
			ctx.closePath();
			ctx.fill();
		}
	}
	grimda2=ctx.getImageData(0,0,$ground.width,$ground.height);
}
function drawGroundTexture(ctx){
	ctx.globalAlpha=0.4;
	ctx.fillStyle="rgba(255,255,255,0.2)";
	for(var i=0;i<50000;i++){
		ctx.fillRect($gtex.width*Math.random(),$gtex.height*Math.random(),Math.random()+1,Math.random()+1);
	}
	ctx.fillStyle="rgba(100,100,100,0.3)";
	for(var i=0;i<50000;i++){
		ctx.fillRect($gtex.width*Math.random(),$gtex.height*Math.random(),Math.random()+1,Math.random()+1);
	}
	ctx.fillStyle="rgba(0,0,0,0.2)";
	for(var i=0;i<50000;i++){
		ctx.fillRect($gtex.width*Math.random(),$gtex.height*Math.random(),Math.random()+1,Math.random()+1);
	}
}
function drawMountains(ctx,green){
	if(green){
		ctx.fillStyle="hsla(155,"+(90-Math.random()*6)+"%,"+(59-Math.random()*6)+"%,1)";
	}else{
		ctx.fillStyle="hsla(205,"+(90-Math.random()*6)+"%,"+(69-Math.random()*6)+"%,1)";
	}
	ctx.fillRect(0,100,ctx.canvas.width,ctx.canvas.height);
	for(var i=0;i<3;i+=0.1){
		//ctx.globalAlpha=0.4;
		//var y=ctx.canvas.height-(3-i)*100-200;
		if(green){
			ctx.fillStyle="hsla(155,"+(80-i*10-Math.random()*6)+"%,"+(65-i*0-Math.random()*6)+"%,1)";
		}else{
			ctx.fillStyle="hsla(205,"+(80-i*10-Math.random()*6)+"%,"+(65-i*0-Math.random()*6)+"%,1)";
		}
		for(var x=-Math.random()*50;x<ctx.canvas.width;x+=w*Math.random()){
			var y=i*100+100;
			var w=((Math.random()*50+50)*i+10)*5;
			var h=((Math.random()*50*i+10)+w/2)/2;
			
			if(Math.random()<0.2){
				if(Math.random()<0.2){
					//ctx.fillStyle="hsla(155,"+(80-i*10-Math.random()*6)+"%,"+(65-i*0-Math.random()*6)+"%,1)";
				}
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+w,y);
				ctx.lineTo(x+w/2,y-h);
				ctx.fill();
			}
		}
	}
}
/*
function drawIslands(ctx){
	
	ctx.fillStyle="hsla(205,"+(90-Math.random()*6)+"%,"+(49-Math.random()*6)+"%,1)";
	
	ctx.fillRect(0,100,ctx.canvas.width,ctx.canvas.height);
	for(var i=0;i<3;i+=0.1){
		//ctx.globalAlpha=0.4;
		//var y=ctx.canvas.height-(3-i)*100-200;
		for(var x=-Math.random()*50;x<ctx.canvas.width;x+=w*Math.random()){
			var y=i*100+100;
			var w=((Math.random()*50+50)*i+10)*5;
			var h=((Math.random()*50*i+10)+w/2)/2;
			
			if(Math.random()<0.2){
				ctx.fillStyle="hsla(155,"+(80-i*10-Math.random()*6)+"%,"+(65-i*0-Math.random()*6)+"%,1)";
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+w,y);
				ctx.lineTo(x+w/2,y-h);
				ctx.fill();
				ctx.fillStyle="hsla(205,"+(80-i*10-Math.random()*6)+"%,"+(65-i*0-Math.random()*6)+"%,1)";
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(x+w,y);
				ctx.lineTo(x+w/2,y-h);
				ctx.fill();
			}
		}
	}
}*/
function drawForest(ctx){
	
	ctx.fillStyle="hsla(155,"+(60-Math.random()*6)+"%,"+(49-Math.random()*6)+"%,1)";
	
	ctx.fillRect(0,100,ctx.canvas.width,ctx.canvas.height);
	for(var i=0;i<3;i+=0.01){
		//ctx.globalAlpha=0.4;
		//var y=ctx.canvas.height-(3-i)*100-200;
		for(var x=-Math.random()*50;x<ctx.canvas.width;x+=w*Math.random()){
			var y=i*100+100;
			var w=((Math.random()*10+10)*i+10);
			var h=((Math.random()*10*i+10)+w/2);
			
			if(Math.random()<0.2){
				ctx.strokeStyle="hsla(0,50%,50%,1)";
				ctx.beginPath();
				ctx.moveTo(x+w/2,y);
				ctx.lineTo(x+w/2,y-h*3/4);
				ctx.stroke();
				
				ctx.fillStyle="hsla(155,"+(80-i*10-Math.random()*6)+"%,"+(45-i*0-Math.random()*6)+"%,1)";
				ctx.beginPath();
				ctx.moveTo(x,y-h/4);
				ctx.lineTo(x+w,y-h/4);
				ctx.lineTo(x+w/2,y-h-h/4);
				ctx.fill();
			}
		}
	}
}
function undoable(){
	var oldterrain={polys:[],entities:[],width:terrain.width,height:terrain.height};
	for(var i=0;i<terrain.polys.length;i++){
		oldterrain.polys[i]=terrain.polys[i];
	}
	for(var i=0;i<terrain.entities.length;i++){
		oldterrain.entities[i]=terrain.entities[i];
	}
	undos.push(oldterrain);
	// console.log(redos.length);
	redos=[];
}
function undo(){
	if(undos.length<1)return false;
	redos.push(terrain);
	terrain=undos.pop();
	drawGround();
	return true;
}
function redo(){
	if(redos.length<1)return false;
	undos.push(terrain);
	terrain=redos.pop();
	drawGround();
	return true;
}
function init(){
	view = {x:0,y:0,zoom:0};
	keys = {};
	things = [];
	birds = [];
	terrain = {polys:[],entities:[],width:10000,height:1480};
	leveledit = false
	le_tti = 0;
	le_eti = 0;
	le_tool = "terrain";
	le_poly = null;
	terraintypes = ["grassy","dirt","rock","sand","water"];
	fly = false;
	
	var polyz=[];
	try{
		if(localStorage){
			if(localStorage.terrain){
				terrain=JSON.parse(localStorage.terrain||"[]")||[];
			}else{
				polyz=JSON.parse(localStorage.polys||"[]")||[];
			}
		}
	}catch(e){}
	terrain=window.terrain||{polys:polyz||[],entities:[]};
	terrain.width=terrain.width||10000;
	terrain.height=terrain.height||1480;
	undos = [];
	redos = [];
	
	$bg = document.createElement("canvas");
	$bg.width = terrain.width;
	$bg.height = 800;
	drawMountains($bg.getContext("2d"));
	
	$gtex = document.createElement("canvas");
	$gtex.width = terrain.width;
	$gtex.height = terrain.height;
	drawGroundTexture($gtex.getContext("2d"));
	
	$ground = document.createElement("canvas");
	$ground.width = terrain.width;
	$ground.height = terrain.height;
	drawGround();

	$canvas = document.createElement("canvas");
	document.body.appendChild($canvas);

	mControls = new Modal()
		.title("Controls")
		.position("bottom right");	
	mControls.$c.appendChild(document.getElementById("controls"));

	document.getElementById("toggle-edit").onclick = toggleEdit;
	document.getElementById("toggle-fly").onclick = toggleFly;

	function toggleEdit(){
		if(leveledit){
			stopEditing();
		}else{
			startEditing();
		}
		$canvas.className=leveledit?"le":"g";
	}

	function toggleFly(){
		fly=!fly;
	}

	document.body.addEventListener('keydown', function(e){
		if(!keys[e.keyCode]){
			switch(String.fromCharCode(e.keyCode)){
				case "E":
					toggleEdit();
				break;
				case "F":
					toggleFly();
				break;
				case "M":
					$music.paused?
						$music.play():$music.pause();
				break;
				case "L":
					if(!window.$music_iframe){
						$music_iframe=E("iframe");
						document.body.appendChild($music_iframe);
						$music_iframe.src="/pasta/wavetable/";
					}
					setTimeout(function(){
						if($music_iframe.className=="active"){
							$music_iframe.className="inactive";
						}else{
							$music_iframe.className="active";
						}
					},100);
				break;
				case "K":
					if(!window.$music_iframe){
						$music_iframe=E("iframe");
						document.body.appendChild($music_iframe);
						$music_iframe.src="/pasta/wavetable/";
					}
				break;
				case "Z":
					if(leveledit && e.ctrlKey){
						if(e.shiftKey){
							redo();
						}else{
							undo();
						}
					}
				break;
				case "C":
					if(leveledit){
						gui.confirm("Are you sure you want to clear the level?",function(){
							undoable();
							terrain={polys:[],entities:[],width:10000,height:1480};
							drawGround();
						});
					}
				break;
			}
		}
		keys[e.keyCode]=true;if([39,37,38,40].indexOf(e.keyCode)!=-1){e.preventDefault();return false;}
	});
	document.body.addEventListener('keyup', function(e){
		delete keys[e.keyCode];
		if([39,37,38,40].indexOf(e.keyCode)!=-1){e.preventDefault();return false;}
	});
	
	document.documentElement.onselectstart=function(e){e.preventDefault();return false;};
	
	mouse={x:3, y:3, left:false, right:false};
	addEventListener("contextmenu",function(e){
		e.preventDefault();
	});
	$canvas.addEventListener("mousemove",function(e){
		mouse.cx=e.clientX-$canvas.getBoundingClientRect().left;
		mouse.cy=e.clientY-$canvas.getBoundingClientRect().top;
		if(leveledit){
			mouse.x=mouse.cx+view.x;
			mouse.y=mouse.cy+view.y;
			if(mouse.left && le_poly){
				var p=le_poly.poly;
				if(p.length<1 || distance(p[p.length-1].x,p[p.length-1].y,mouse.x,mouse.y)>5){
					p.push({x:mouse.x,y:mouse.y});
				}
			}
		}
	});
	gui.element.addEventListener("mousemove",function(e){
		mouse.cx=mouse.cy=mouse.x=mouse.y=-100000;
	});
	$canvas.addEventListener("mousedown",function(e){
		if(e.button===0){
			mouse.left=true;
			if(leveledit){
				if(le_tool=="terrain"){
					le_poly={type:terraintypes[le_tti],poly:[]};
				}else if(le_tool=="place"){
					new window[entitytypes[le_eti]](mouse);
				}else{
					gui.msg("wut is this "+le_tool+" you speak of");
				}
			}
		}else{
			mouse.right=true;
		}
	});
	addEventListener("mouseup",function(e){
		if(e.button===0){
			mouse.left=false;
			if(leveledit && le_poly){
				if(le_poly.poly.length>2){
					undoable();
					for(var i=0;i<le_poly.poly.length-2;i++){
						var p1=le_poly.poly[i];
						var p2=le_poly.poly[i+1];
						var p3=le_poly.poly[i+2];
						if(!inbounds(p1.x,p1.y)&&!inbounds(p3.x,p3.y)){
							le_poly.poly.splice(i+1,1);
							i--;
						}
					}
					terrain.polys.push(le_poly);
					drawGround(le_poly);
				}
			}
			le_poly=null;
		}else{
			mouse.right=false;
		}
	});
}
function fup(x,y){
	var ctx=$ground.getContext("2d");
	
	ctx.globalCompositeOperation = 'source-atop';
	//var ctx=$canvas.getContext("2d");
	for(var i=0;i<100;i++){
		
		var r=Math.random()*Math.PI*2;
		var l=Math.random()*50;
		var x1=Math.floor(Math.cos(r)*l+x);
		var y1=Math.floor(Math.sin(r)*l+y);
		if(y1>=$ground.height||x1>=$ground.width||y1<0||x1<0)continue;
		var c1=grat(x1,y1);
		
		var r=Math.random()*Math.PI*2;
		var l=Math.random()*50;
		var x2=Math.floor(Math.cos(r)*l+x);
		var y2=Math.floor(Math.sin(r)*l+y);
		if(y2>=$ground.height||x2>=$ground.width||y2<0||x2<0)continue;
		var c2=grat(x2,y2);
		
		ctx.fillStyle="rgba("+c1+")";
		ctx.fillRect(x2,y2,1,2);
		ctx.fillStyle="rgba("+c2+")";
		ctx.fillRect(x1,y1,2,1);
		//console.log(ctx.fillStyle);
	}
	ctx.globalCompositeOperation = 'source-over';
	function grat(x,y){//unsafe
		var i=Math.round(Math.round(y)*$ground.width+x)*4;
		return [grimda2.data[i],grimda2.data[i+1],grimda2.data[i+2],grimda2.data[i+3]/255];
	}
}
function stopEditing(){
	leveledit=false;
	mTerrain.close();
	mEntities.close();
}
function startEditing(){
	leveledit=true;
	mTerrain=new Modal()
		.title("Terrain")
		.position("top left");
	
	for(var i=0;i<terraintypes.length;i++){
		var name=terraintypes[i];
		var $img=E("img","tt i"+((le_tool=="terrain" && le_tti==i)?" selected":""));
		$img.onclick=function(i){
			return function(){
				var $$tts=$$(".i");
				for(var j in $$tts){
					$$tts[j].className="tt i";
				}
				this.className="selected tt i";
				le_tti=i;
				le_tool="terrain";
			};
		}(i);
		$img.title=$img.alt=name;
		$img.width=$img.height=32;
		$img.src="images/terrain/"+name+".png";
		
		mTerrain.$c.appendChild($img);
	}
	mEntities=new Modal()
		.title("Entities")
		.position("bottom left");
	
	for(var i=0;i<entitytypes.length;i++){
		var name=entitytypes[i];
		var $img=E("img","et i"+((le_tool=="place" && le_eti==i)?" selected":""));
		$img.onclick=function(i){
			return function(){
				var $$ets=$$(".i");
				for(var j in $$ets){
					$$ets[j].className="et i";
				}
				this.className="selected et i";
				le_eti=i;
				le_tool="place";
			};
		}(i);
		$img.title=$img.alt=name;
		//$img.width=
		$img.height=32;
		//$img.src="images/entities/"+name+".png";
		
		mEntities.$c.appendChild($img);
	}
}
function mouseXrect(x,y,w,h){
	return (mouse.x>=x) && (mouse.y>=y) && (mouse.x<=x+w) && (mouse.y<=y+h);
}
function collisionRectangle(x,y,w,h){
	/*return collisionPoint(x,y)||collisionPoint(x,y+h)||collisionPoint(x+w,y)||collisionPoint(x+w,y+h)
		||collisionPoint(x,y+h/2)||collisionPoint(x+w/2,y)||collisionPoint(x+w/2,y+h)||collisionPoint(x+w,y+h/2)
		||collisionPoint(x,y+h/4)||collisionPoint(x+w/4,y)||collisionPoint(x+w/4,y+h)||collisionPoint(x+w,y+h/4)
		||collisionPoint(x,y+h*3/4)||collisionPoint(x+w*3/4,y)||collisionPoint(x+w*3/4,y+h)||collisionPoint(x+w,y+h*3/4);*/
	if(collisionPoint(x,y)||collisionPoint(x,y+h)||collisionPoint(x+w,y)||collisionPoint(x+w,y+h))return true;
	for(var i=0;i<w;i++){
		for(var j=0;j<h;j++){
			if(gralph(x+i,y+j)>200){
				return true;
			}
		}
	}
	return false;
}
function inbounds(x,y){
	return (y<$ground.height)&&(x<$ground.width)&&(y>=0)&&(x>=0);
}
function collisionPoint(x,y){
	if(y>=$ground.height)return true;
	if(x>=$ground.width)return true;
	if(y<0)return true;
	if(x<0)return true;
	return gralph(x,y)>200;
	/*for(var i=0;i<polys.length;i++){
		var p=polys[i],oe=0;
		if(p.length<2)continue;
		if(lineXline(p[0].x,p[0].y,p[p.length-1].x,p[p.length-1].y)){
			oe++;
		}
		for(var j=0;j<p.length-1;j++){
			if(lineXline(p[j].x,p[j].y,p[j+1].x,p[j+1].y)){
				oe++;
			}
		}
		if(oe&1){
			return true;
		}
	}*/
}
function gralph(x,y){//unsafe
	return grimda.data[Math.round(Math.round(y)*$ground.width+x)*4+3];
}
function lineXline(x1,y1,x2,y2, x3,y3,x4,y4) {
	var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	if (isNaN(x)||isNaN(y)) {
		return false;
	} else {
		if (x1>x2) {
			if (!(x2<x&&x<x1)) {return false;}
		} else {
			if (!(x1<x&&x<x2)) {return false;}
		}
		if (y1>=y2) {
			if (!(y2<y&&y<y1)) {return false;}
		} else {
			if (!(y1<y&&y<y2)) {return false;}
		}
		if (x3>=x4) {
			if (!(x4<x&&x<x3)) {return false;}
		} else {
			if (!(x3<x&&x<x4)) {return false;}
		}
		if (y3>=y4) {
			if (!(y4<y&&y<y3)) {return false;}
		} else {
			if (!(y3<y&&y<y4)) {return false;}
		}
	}
	return {x:x, y:y};
}
function r(){return Math.random()*2-1;}
function distance(x1,y1,x2,y2){
	var xs = x2-x1;
	xs *= xs;
	var ys = y2-y1;
	ys *= ys;
	return Math.sqrt(xs + ys);
}

init();

var otherPlayers = {};
if(typeof io !== "undefined"){
	socket.on("position", function(pl){
		//player.pos = pos;
		// console.log("position",pl);
		if(!otherPlayers[pl.id]){
			otherPlayers[pl.id] = new Player(pl.pos);
		}
		for(var k in pl.pos){
			otherPlayers[pl.id][k] = pl.pos[k];
		}
		//otherPlayers[pl.id].x = pl.pos.x;
		//otherPlayers[pl.id].y = pl.pos.y;
	});
}

player = new Player({x:50,y:130});

for(var i=0;i<10;i++){
	new Cloud({
		x:Math.random()*(-400-640)+640,
		y:Math.random()*500,
	});
	var stuffToMake=[Frog,Bird,Bouncy,Lemon,Deer,Butterfly];
	for(var j=0;j<stuffToMake.length;j++){
		new stuffToMake[j]({x:Math.random()*$ground.width});
	}
}

setInterval(function(){
	step($canvas,true);
	player.control();
	if(typeof io !== "undefined"){
		socket.emit("position",{x:player.x,y:player.y,vx:player.vx,vy:player.vy});
	}
},20);
function E(e,c){e=document.createElement(e);if(c)e.className=c;return e;}
function $(q){return document.querySelector(q);}function $$(q){return document.querySelectorAll(q);}