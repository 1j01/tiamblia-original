
entitytypes = [];
Thing = function(/*o1,o2,o3,...*/){
	var th={
		x:0,y:0,
		w:10,h:10,
		vx:0,vy:0,
		stepdraw: function(ctx){
			this.step();
			if(this.x+this.w+30>view.x)
			if(this.y+this.h+30>view.y)
			if(this.x-30<view.x+window.innerWidth)
			if(this.y-30<view.y+window.innerHeight){
				this.draw(ctx);
			}
		},
		draw: function(ctx){
			ctx.fillStyle="#F0F";
			ctx.fillRect(this.x,this.y,this.w,this.h);
		},
		step: function(){
			var thoust = this;
			function col(x,y){
				return collisionRectangle(x-thoust.w/2,y,thoust.w,thoust.h);
			}
			if(col(this.x,this.y)){
				if(this.goDown){
					this.y+=50;
				}else{
					this.y-=50;
					if(this.y<0){
						this.goDown=true;
					}
				}
			}else this.goDown=false;
			
			this.vx = Math.min( 8,Math.max( -8,this.vx*0.9));
			this.vy = Math.min(10,Math.max(-10,this.vy+0.5));
			
			if(!col(this.x+this.vx,this.y)){
				this.x+=this.vx;
			}else{
				for(var mx=this.vx;Math.abs(mx)>0;mx-=Math.min(1,Math.max(-1,mx))){
					if(col(this.x+mx,this.y)){
						if(!col(this.x+mx,this.y-1)){
							this.y--;
							this.x+=Math.min(1,Math.max(-1,mx));
						}else if(!col(this.x+mx,this.y-2)){
							this.y-=2;
							this.x+=Math.min(1,Math.max(-1,mx));
						}else if(!col(this.x+mx,this.y-3)){
							this.y-=3;
							this.x+=Math.min(1,Math.max(-1,mx));
						}
					}else{
						this.x+=Math.min(1,Math.max(-1,mx));
					}
				}
			}
			if(!col(this.x,this.y+this.vy)){
				this.y+=this.vy;
			}else{
				for(var my=this.vy;Math.abs(my)>0;my-=Math.min(1,Math.max(-1,my))){
					if(col(this.x,this.y+my)){
						this.vy*=0.1;
					}else{
						this.y+=Math.min(1,Math.max(-1,my));
					}
				}
			}
			/*
			var prec=100;
			if(!collisionRectangle(this.x,this.y+this.vy,this.w,this.h)){
				this.y+=this.vy;
			}else for(var i=1/prec;i<1;i+=1/prec){
				if(collisionRectangle(this.x,this.y+this.vy*i,this.w,this.h)){
					//if(!collisionRectangle(this.x-1,this.y+this.vy*i,this.w,this.h)){
					//	this.x--;//this.vu*=0.9;
					//}else if(!collisionRectangle(this.x+1,this.y+this.vy*i,this.w,this.h)){
					//	this.x++;//this.vu*=0.9;
					//}else{
						i-=1/prec;
						this.y+=this.vy*i;
						this.vy=0;
						break;
					//}
				}
			}
			if(!collisionRectangle(this.x+this.vx,this.y,this.w,this.h)){
				this.x+=this.vx;
			}else for(var i=1/prec;i<1;i+=1/prec){
				if(collisionRectangle(this.x+this.vx*i,this.y,this.w,this.h)){
					if(!collisionRectangle(this.x+this.vx*i,this.y-1,this.w,this.h)){
						this.y-=2;//this.vx*=0.95;
						this.vy=-1;
						i-=1/prec;
					}else if(!collisionRectangle(this.x+this.vx*i,this.y-2,this.w,this.h)){
						this.y-=3;//this.vx*=0.9;
						this.vy=-2;
						i-=1/prec;
					}else{
						i-=1/prec;
						this.x+=this.vx*i;
						this.vx*=0.9;
						break;
					}
				}
			}*/
			/*if(collisionRectangle(this.x,this.y+2,this.w,this.h)){
				if(!collisionRectangle(this.x+1,this.y+1,this.w,this.h)){
					this.x++;this.y++;
				}
				if(!collisionRectangle(this.x-1,this.y+1,this.w,this.h)){
					this.x--;this.y++;
				}
			}*/
		}
	};
	for(var a=0;a<arguments.length;a++){
		var o=arguments[a];
		for(var i in o){
			if(o.hasOwnProperty(i)){
				th[i]=o[i];
			}
		}
	}
	things.push(th);
	return th;
};

entitytypes.push("Player");
Player = function(o){
	return new Thing({
		control: function(gamepad){
			
			var ix=!!keys[39]-!!keys[37]+!!keys[68]-!!keys[65];
			var iy=!!keys[83]-!!keys[87]+!!keys[40]-!!keys[38];
			this.sm=(2+!!keys[16]*5)*2/3;
			if(gamepad){
				if(Math.abs(gamepad.axes[0])>0.08){
					ix+=gamepad.axes[0];
				}
				if(Math.abs(gamepad.axes[1])>0.08){
					iy+=gamepad.axes[1];
				}
				if(gamepad.buttons[9]||gamepad.buttons[8]){
					sprint=true;
				}
			}
			var yo=(this.riding||this);
			if(this.riding){
				yo.dir += Math.min(1,Math.max(-1,ix))*this.sm;
				yo.dir *= 0.9;
			}else{
				this.vx += Math.min(1,Math.max(-1,ix))*this.sm;
			}
			if(fly){
				yo.vy -= 0.55;
				yo.vy += Math.min(1,Math.max(-1,iy))/2;
				yo.vy *= 0.9;
			}
			if(!window.mountprevious){
				if(keys[40]||keys[83]||(gamepad && (gamepad.buttons[1]))){
					if(this.riding){
						this.riding.rider=null;
						this.riding=null;
					}else for(var i=0;i<things.length;i++){
						var t=things[i];
						if(t.rideable){
							if(Math.abs(this.x+this.w/2-t.x-t.w/2)<this.w/2+t.w/2){
								if(Math.abs(this.y+this.h/2-t.y-t.h/2)<this.h+t.h/2){
									this.riding=t;
									this.riding.rider=this;
									break;
								}
							}
						}
					}
				}
			}
			window.mountprevious=keys[40]||keys[83]||(gamepad && (gamepad.buttons[1]));
			if(this.riding){
				this.x=this.riding.x;
				this.y=this.riding.y-20;
				this.vx=this.riding.vx;
				this.vy=this.riding.vy-5;
			}
			
			if(keys[38]||keys[87]||(gamepad && (gamepad.buttons[0]))){
				if(collisionRectangle(yo.x-yo.w/2,yo.y+5,yo.w,yo.h)){
					//jmup
					yo.vy = -10;
				}
			}
			if(!window.startprevious){
				if(gamepad && gamepad.buttons[9]){
					fly=!fly;
				}
			}
		},
		stepdraw: function(ctx){
			window.startprevious=gamepad && gamepad.buttons[9];
			
			if(!this.riding){
				this.vx=Math.min( 5*this.sm, Math.max( -5*this.sm, this.vx*0.9));
				this.vy=Math.min(10,         Math.max(-10,         this.vy    ));
				this.step(ctx);
			}
			
			this.avy+=(this.vy-this.avy)/5;
			this.adx+=(this.x-this.xp-this.adx)/5;
			this.ady+=(this.y-this.yp-this.ady)/5;
			if(this.x<this.xp)this.fd=-1;
			if(this.x>this.xp)this.fd=1;
			this.fdl+=(this.fd-this.fdl)/50;
			this.xp=this.x;this.yp=this.y;
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.beginPath();
			ctx.save();
				//this.HAx+=(this.x-this.HAx)/2;
				//this.HAy+=(this.y-this.HAy)/2;
				ctx.translate(this.x,this.y+this.h/2);
				/*ctx.rotate(
					(this.avy<0)
					?(
						collisionRectangle(this.x-yo.w/2,this.y+4,this.w,this.h)
						?(this.vx/-55)
						:(this.vx/155)
					)
					:(this.vx/55)
				);*/
				this.rot += ((this.vx*(this.avy+(!collisionRectangle(this.x-this.w/2,this.y+4,this.w,this.h))*5)/200)-this.rot)/5;
				ctx.rotate(this.rot);
				
				
				//hair
				for(var i=this.hairxscales.length-1;i>=0;i--){
					if(i<1){
						this.hairxscales[i] += ((this.vx>0?-1:1)-this.hairxscales[i])/5;
					}else{
						this.hairxscales[i] += (this.hairxscales[i-1]-this.hairxscales[i])/5;
					}
					ctx.save();
						ctx.translate(0,-this.h*0.74);
						ctx.scale(this.hairxscales[i],1);
						ctx.fillStyle=this.haircolor;
						var r=(this.hairxscales[i])*this.vx/25-Math.max(0,this.avy/25);
						var l=5,w=1;
						ctx.rotate(r);
						ctx.fillRect(0-w,-2,5+w,l);
						ctx.translate(0,l);
						ctx.rotate(r);
						ctx.fillRect(1-w,-2,4+w,l);
						ctx.translate(0,l);
						ctx.rotate(r);
						ctx.fillRect(2-w,-2,3+w,l);
						ctx.translate(0,l);
						ctx.rotate(r);
						ctx.fillRect(3-w,-2,2+w,l);
						ctx.translate(0,l);
					ctx.restore();
				}
				/*
				ctx.moveTo(0,0);
				for(var i=0;i<this.hairs.length;i++){
					ctx.lineWidth=4-i/3;
					ctx.lineTo(this.hairs[i].x,this.hairs[i].y);
					if(i){
						this.hairs[i].vx+=(this.hairs[i-1].x-this.hairs[i].x)/5;
						this.hairs[i].vy+=(this.hairs[i-1].y-this.hairs[i].y)/5;
						this.hairs[i].x+=this.hairs[i].vx;
						this.hairs[i].y+=this.hairs[i].vy+=0.5;
					}
				}*/
					
				//ctx.restore();
				
				//legs
				this.lr+=(this.vx)/20/2 * (collisionRectangle(this.x-this.w/2,this.y+4,this.w,this.h)+0.7);
				if(fly){this.lr*=0.94;}
				//this.lr=this.lr%(Math.PI*2)
				//this.lr*=Math.abs(this.vx)/8;
				if(Math.abs(this.vx)<0.1){
					this.lr=this.lr%(Math.PI);
					this.lr=Math.PI-(Math.PI-this.lr%(Math.PI));
					this.lr*=0.9;
				}
				var llr=Math.sin(this.lr+Math.PI);
				var rlr=Math.sin(this.lr);
				var lift=5;
				
				ctx.beginPath();
				
				//legs
				//ctx.moveTo(0,this.h/50); ctx.strokeStyle="#311"; ctx.lineWidth=3;
				//ctx.lineTo(Math.sin(llr)*10,this.h/5+Math.cos(llr)*15+Math.sin(this.lr+Math.PI/2)*lift-lift);
				//ctx.stroke();
				ctx.moveTo(0,this.h/50); ctx.strokeStyle=this.skin; ctx.lineWidth=2;
				ctx.lineTo(Math.sin(llr)*10,this.h/5+Math.cos(llr)*15+Math.sin(this.lr+Math.PI/2)*lift-lift);
				ctx.stroke();
				
				//ctx.moveTo(0,this.h/50); ctx.strokeStyle="#311"; ctx.lineWidth=3;
				//ctx.lineTo(Math.sin(rlr)*10,this.h/5+Math.cos(rlr)*15+Math.sin(this.lr-Math.PI/2)*lift-lift);
				//ctx.stroke();
				ctx.moveTo(0,this.h/50); ctx.strokeStyle=this.skin; ctx.lineWidth=2;
				ctx.lineTo(Math.sin(rlr)*10,this.h/5+Math.cos(rlr)*15+Math.sin(this.lr-Math.PI/2)*lift-lift);
				ctx.stroke();
				
				//back arm
				this.drawArm(ctx,false,llr,rlr);
				
				
				this.skr=Math.max(this.skr-0.1,(rlr%Math.PI),(llr%Math.PI),0.4);
				this.skl=Math.min(this.skl+0.1,(rlr%Math.PI),(llr%Math.PI),-0.4);
				
				//body
				ctx.beginPath();
				ctx.fillStyle="#aff";
				ctx.save();
					ctx.scale(1,2);
					ctx.arc(0,-this.h/5,this.w/6,0,Math.PI*2,false);
					ctx.fill();
				ctx.restore();
				
				//dress
				ctx.beginPath();
				ctx.moveTo(this.w/7,-this.h/3);
				ctx.lineTo(-this.w/7,-this.h/3);
				ctx.lineTo(Math.sin(this.skl)*10,-this.h/5+Math.cos(this.skl)*15);
				ctx.lineTo(Math.sin(this.skr)*10,-this.h/5+Math.cos(this.skr)*15);
				ctx.fill();
				
				///head
				ctx.fillStyle=this.skin;
				ctx.beginPath();
				ctx.arc(0,-this.h*0.7,this.w/4,0,Math.PI*2,false);
				ctx.fill();
				
				//more hair
				ctx.save();
					ctx.fillStyle=this.haircolor;
					ctx.translate(0,-this.h*0.75);
					//ctx.rotate(0.1);
					ctx.beginPath();
					ctx.arc(0,0,this.w/4+1.3,Math.PI,Math.PI*2,false);
					ctx.fill();
					//ctx.
				ctx.restore();
				
				
				
				//front arm
				this.drawArm(ctx,true,llr,rlr);
				
				/*ctx.rotate(r);
				ctx.translate(2,-1);
				ctx.fillRect(0,0,3,13);
				ctx.translate(0,13);
				ctx.beginPath();
				ctx.moveTo(3,0);
				ctx.lineTo(5,0);
				ctx.lineTo(3,-4);
				ctx.fill();*/
				
				/*hat?
				
				ctx.save();
					ctx.fillStyle="#a50";
					ctx.translate(0,-this.h*0.8);
					
					ctx.beginPath();
					ctx.scale(2.4,0.8);
					ctx.arc(0,0,this.w/6,0,Math.PI*2,false);
					ctx.fill();
					
					ctx.beginPath();
					ctx.scale(0.5,1.5);
					ctx.arc(0,-1,this.w/6,0,Math.PI*2,false);
					ctx.fill();
				ctx.restore();//*/
				
			ctx.restore();
			
		},
		//HAx: o&&o.x||0,
		//HAy: o&&o.y||0,
		sm: 0,
		
		w: 15,
		h: 25,
		rot: 0,
		lr: 0, skl: 0, skr: 0,
		avy: 0, 
		adx: 0, xp: 0,
		ady: 0, yp: 0,
		ups: 0,
		fd: 1, fdl: 1,
		skin: "#855",
		haircolor: "#000",
		//hairxscales:[1],
		hairxscales:[1,1,1,1,1,1,1,1,1],
		hairs: [],
		drawArm: function(ctx,front,llr,rlr){
			var left=front;
			var al=13,r=left?llr:rlr;
			var x=Math.cos((this.fdl/2+left)*-Math.PI)*4;
			//console.log(front,llr,rlr);
			//ctx.fillStyle="#F00";
			//ctx.fillRect(0,0,5,5);
			
			ctx.strokeStyle=this.skin;
			ctx.lineWidth=2;
			
			ctx.beginPath();
			ctx.moveTo(x,-this.h/2);
			ctx.lineTo(x+Math.sin(r)*al,Math.cos(r)*al-this.h/2);
			//ctx.lineTo(Math.sin(r)*al+Math.cos(r)*al,Math.cos(r)*al+Math.sin(r)*al-this.h/2);
			
			ctx.stroke();
		}
	},o);
};

entitytypes.push("Cloud");
Cloud = function(o){
	return new Thing({
		stepdraw: function(ctx){
			this.x++;
			this.t+=0.001;
			if(this.x>terrain.width+300){
				this.poof=true;
			}
			if(this.x+this.w+80>view.x)
			if(this.y+this.h+80>view.y)
			if(this.x-80<view.x+window.innerWidth)
			if(this.y-80<view.y+window.innerHeight){
				this.draw(ctx);
			}
		},
		draw: function(ctx){
			ctx.fillStyle="#A9D9FA";
			for(var i=0;i<20;i++){
				ctx.beginPath();
				ctx.arc(
					this.simplex.noise(5+i,this.t+i*3.92)*this.w+this.x+this.w/2,
					this.simplex.noise(26+i,this.t+i*2.576)*this.h+this.y+this.h/2,
					Math.abs(this.simplex.noise(73+i*5.2,this.t+i)*this.w),
					//this.simplex.noise(68+i,this.t)*-Math.PI*2,
					//this.simplex.noise(20+i,this.t)*Math.PI*2,
					0,Math.PI*2,
					false
				);
				ctx.fill();
			}
		},
		w: 45+Math.random()*50,
		h: 35+Math.random()*10,
		simplex: new SimplexNoise(), t:0
	},o);
};

entitytypes.push("Tree");
Tree = function(o){
	var t = new Thing({
		stepdraw: function(ctx){
			if(this.x+this.w+80>view.x)
			if(this.y+this.h+80>view.y)
			if(this.x-80<view.x+window.innerWidth)
			if(this.y-80<view.y+window.innerHeight){
				this.seedi=0;
				this.draw(ctx);
			}
		},
		draw: function(ctx){
			this.drawBranch(ctx,this.x,this.y,0,this.random()*10+5,this.trunk_w,9);
			ctx.lineWidth=1;
		},
		drawBranch: function(ctx,x,y,r,life,w,sl){
			ctx.strokeStyle="#89594A";
			ctx.lineWidth=w;
			ctx.lineCap="round";
			ctx.beginPath();
			ctx.moveTo(x,y);
			r+=(this.random()*2-1)*0.7;
			x+=Math.sin(r)*sl;
			y-=Math.cos(r)*sl;
			ctx.lineTo(x,y);
			ctx.stroke();
			//w=(life-w)/2;
			w=life;
			if((life-=0.3)>0){
			//if(w>~~~--w){
				//r+=(this.random()*2-1)/50;
				this.drawBranch(ctx,x,y,r,life,w,sl);
				if((this.random()>0.1) && (life>0.1)){
					this.drawBranch(ctx,x,y,r+(this.random()*2-1)/5,life,w,sl);
				}
			}else{
				this.drawLeaf(ctx,x,y,r,life,w+4,sl);
			}
			ctx.lineCap="butt";
		},
		drawLeaf: function(ctx,x,y,r,life,w,sl){
			ctx.save();
				var l=this.random()/2;
				ctx.fillStyle="hsla("+(150-l*50)+","+(50)+"%,"+(50+l*20)+"%,1)";
				ctx.beginPath();
				ctx.arc(x,y,10+this.random()*5,0,Math.PI*2,true);
				ctx.fill();
				for(var i=0;i<10;i++){
					var l=this.random()/2;
					ctx.fillStyle="hsla("+(150-l*50)+","+(50)+"%,"+(50+l*20)+"%,1)";
					ctx.beginPath();
					var r1=Math.PI*2*this.random();
					var r2=this.random()*15;
					ctx.arc(x+Math.sin(r1)*r2,y+Math.cos(r1)*r2,5+this.random()*5,0,Math.PI*2,true);
					ctx.fill();
				}
				/*ctx.strokeStyle="#1a5";
				ctx.lineWidth=w;
				ctx.lineCap="round";
				ctx.beginPath();
				ctx.moveTo(x,y);
				r+=(this.random()*2-1)/2;
				x+=Math.sin(r+Math.PI)*sl/4;
				y-=Math.cos(r+Math.PI)*sl/4;
				ctx.lineTo(x,y);
				ctx.stroke();*/
			ctx.restore();
		},
		species: "kaoyu",
		seedi: 0,
		trunk_w: 10+Math.floor(Math.random()*5),
		randoms: new Uint32Array(100),
		random: function(){
			var n=1024*1024;
			return ((this.randoms[this.seedi++])%n)/n;
		},
		//maybe not needed
		//w: 45+Math.random()*50,
		//h: 35+Math.random()*10,
		//simplex: new SimplexNoise()
	},o);
	crypto.getRandomValues(t.randoms);
	return t;
};

drawLightning = function(ctx,x,y,r,w){
	ctx.strokeStyle="#A9D9FA";
	ctx.beginPath();
	ctx.moveTo(x,y);
	x+=Math.random()*10-5;
	y-=5;
	ctx.lineTo(x,y);
	ctx.stroke();
	if(w-->=~0){
	//if(w>~~~--w){
		this.draw(ctx,x,y,r,w);
		if(Math.random()<0.1 && w>5){
			this.draw(ctx,x,y,r+Math.random()*1-1,w);
		}
	}
};
