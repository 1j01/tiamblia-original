
entitytypes.push("Frog");
Frog = function(o){
	return new Thing({
		stepdraw: function(ctx){
			if(collisionRectangle(this.x,this.y+1,this.w,this.h)){
				this.vx*=0.1;
				if(Math.random()<0.1){
					//jmup
					this.vy = Math.random()*-5;
					this.dir = r();
					this.t=0;
				}
			}else{
				this.vx += this.dir *= 2;
				if(this.xp === this.x){
					this.t++;
					if(this.t>5){
						this.dir = r();
					}
				}else{
					this.t=0;
				}
			}
			this.xp=this.x;
			this.step();
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.save();
				ctx.translate(this.x,this.y);
				ctx.rotate(this.vx/5);
				ctx.fillStyle=this.c;
				//ctx.fillRect(this.x,this.y,this.w,this.h);
				ctx.beginPath();
				ctx.arc(this.w/2,this.h/4-this.vy,this.h/2,0,Math.PI,false);
				ctx.arc(this.w/2,this.h,this.h/2,Math.PI,Math.PI*2,false);
				ctx.fill();
			ctx.restore();
		},
		w: 8, h: 8,
		xp: 0, t: 0,
		dir: 0,
		c: "hsla("+(150-Math.random()*50)+","+(50+Math.random()*50)+"%,"+(50-Math.random()*20)+"%,1)",
	},o);
};

entitytypes.push("Rabbit");
Rabbit = function(o){
	return new Thing({
		stepdraw: function(ctx){
			if(collisionRectangle(this.x,this.y+4,this.w,this.h)){
				//this.vx*=0.99;
				if(Math.random()<0.1){
					this.dir = r();
				}
				if(Math.random()<0.1){
					this.vy = -5;
				}
			}else{
				if(Math.abs(this.xp-this.x)<1){
					this.t++;
					if(this.t>15){
						this.dir = r();
					}
				}else{
					this.t=0;
				}
			}
			this.vx += (this.dir *= 1.1)/5;
			this.xp=this.x;
			this.step();
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.save();
				ctx.translate(this.x+this.w/2,this.y+this.h/2);
				ctx.rotate(this.vx/15);
				ctx.fillStyle=this.c;
				ctx.fillRect(this.x,this.y,this.w,this.h);
				ctx.beginPath();
				ctx.arc(0,0,this.h/2,Math.PI,Math.PI*2.2,false);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(this.dir*this.w/2,0,this.h/3,Math.PI,Math.PI*2.2,false);
				ctx.fill();
			ctx.restore();
		},
		w: 8, h: 8,
		xp: 0, t: 0,
		dir: 0,
		c: "#FFF",
	},o);
};

entitytypes.push("Lemon");
Lemon = function(o){
	return new Thing({
		stepdraw: function(ctx){
			if(collisionRectangle(this.x,this.y+4,this.w,this.h)){
				//this.vx*=0.99;
				if(Math.random()<0.1){
					this.dir = r();
				}
			}else{
				if(Math.abs(this.xp-this.x)<1){
					this.t++;
					if(this.t>15){
						this.dir = r();
					}
				}else{
					this.t=0;
				}
			}
			this.vx += (this.dir *= 1.1)/5;
			this.xp=this.x;
			this.step();
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.save();
				ctx.translate(this.x,this.y+8);
				ctx.rotate(this.vx/-5);
				ctx.fillStyle=this.c;
				//ctx.fillRect(this.x,this.y,this.w,this.h);
				ctx.beginPath();
				ctx.arc(0,0,this.h/2,0,Math.PI,false);
				ctx.arc(0,this.h/2,this.h/2,Math.PI,Math.PI*2,false);
				ctx.fill();
			ctx.restore();
		},
		w: 18, h: 18,
		xp: 0, t: 0,
		dir: 0,
		c: "hsla("+(20+Math.random()*50)+","+(100)+"%,"+(50+Math.random()*20)+"%,1)",
	},o);
};

entitytypes.push("Deer");
Deer = function(o){
	return new Thing({
		stepdraw: function(ctx){
			if(collisionRectangle(this.x,this.y+4,this.w,this.h)){
				if(Math.random()<0.01){
					this.dir = r();
				}
			}else{
				if(Math.abs(this.xp-this.x)<1){
					this.t++;
					if(this.t>15){
						this.dir = r();
						this.t=0;
					}
				}else{
					this.t=0;
				}
			}
			this.vx += (this.dir)/5;
			this.lr += Math.abs(this.vx)/5;
			this.xp = this.x;
			this.step();
			this.draw(ctx);
		},
		draw: function(ctx){
			if(this.dir<-0.3)this.dirp=-1;
			if(this.dir>0.3)this.dirp=1;
			this.dirpl += (this.dirp-this.dirpl)/10;
			ctx.save();
				ctx.translate(this.x,this.y+this.h*3/4);
				
				ctx.beginPath();
				ctx.fillStyle=this.c;
				ctx.arc(0,-this.h/2,this.h/3,0,Math.PI*2,true);
				ctx.fill();
				
				ctx.scale(this.dirpl,1);
				//ctx.rotate(this.vx/-10);
				//legs
				ctx.strokeStyle="#a55";
				ctx.beginPath();
				ctx.moveTo(-this.w/2,-this.h/2);
				ctx.lineTo(Math.cos(this.lr)*10-this.w/2,this.h/2+Math.sin(this.lr)*8);
				ctx.moveTo(-this.w/2,-this.h/2);
				ctx.lineTo(Math.cos(this.lr+Math.PI)*10-this.w/2,this.h/2+Math.sin(this.lr+Math.PI)*8);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.w/2,-this.h/2);
				ctx.lineTo(Math.cos(this.lr+0.1)*10+this.w/2,this.h/2+Math.sin(this.lr)*8);
				ctx.moveTo(this.w/2,-this.h/2);
				ctx.lineTo(Math.cos(this.lr+Math.PI+0.2)*10+this.w/2,this.h/2+Math.sin(this.lr+Math.PI)*8);
				ctx.stroke();
				
				ctx.fillStyle=this.c;
				ctx.save();//head
					ctx.translate(this.w/2,this.h*-3/4);
					ctx.rotate(-0.4+Math.cos(this.x/50));
					ctx.fillRect(-5,-5,15,8);
					ctx.translate(12,0);
					ctx.rotate(0.6-Math.cos(this.x/50)/2);
					//ctx.fillRect(-5,-5,15,8);
					ctx.beginPath();
					ctx.moveTo(-5,-5);
					ctx.lineTo(-5,3);
					ctx.lineTo(10,1);
					ctx.lineTo(10,-2);
					ctx.fill();
				ctx.restore();
				
				//body
				ctx.fillRect(this.w/-2,this.h/-1,this.w,this.h*3/4);
				
			ctx.restore();
		},
		w: 27, h: 18,
		xp: 0, t: 0,
		lr: 0,
		dir: 0, dirp: 1, dirpl: 1,
		rideable: true,
		c: "hsla("+(Math.random()*20)+","+(10)+"%,"+(50+Math.random()*20)+"%,1)",
	},o);
};

entitytypes.push("Bird");
Bird = function(o){
	var t=new Thing({
		stepdraw: function(ctx){
			for(var i=0;i<50;i++){
				var x=r()*50;
				var y=r()*70;
				if(collisionPoint(this.x+x,this.y+y)){
					this.goy-=y/30;
					this.gox-=x/(10+Math.abs(this.goy));
				}
			}
			if(this.flapt<0){
				if(this.goy<-1){
					this.vy-=5;
					this.flapt=15;
				}else{
					this.vy-=1;
					this.flapt=15;
				}
			}
			this.gox*=0.95;
			this.goy*=0.7;
			this.vx+=(this.gox-this.vx)/2;
			this.vy+=0.1;
			this.x+=this.vx;
			this.y+=this.vy;
			this.flapt--;
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.strokeStyle="#000";
			ctx.beginPath();
			var f=2.8;
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x+Math.cos(this.flap-f)*this.wingspan,this.y+Math.sin(this.flap-f)*this.wingspan);
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x-Math.cos(this.flap-f)*this.wingspan,this.y+Math.sin(this.flap-f)*this.wingspan);
			ctx.stroke();
			if(this.flapt<0)this.flapt=-1;
			this.flap+=this.flapt/20;
			this.flap+=(-this.flap-0.1)*0.1;
		},
		w: 8, h: 8,
		flap:0,flapt:r()*15,wingspan:10,
		gox: r()*5, goy: 0,
		c: "hsla("+(150-Math.random()*50)+","+(50+Math.random()*50)+"%,"+(50-Math.random()*20)+"%,1)",
	},o);
	birds.push(t);
	return t;
};

entitytypes.push("Butterfly");
Butterfly = function(o){
	return new Thing({
		stepdraw: function(ctx){
			for(var i=0;i<50;i++){
				var x=r()*50;
				var y=r()*70;
				if(collisionPoint(this.x+x,this.y+y)){
					this.goy-=y/50;
					this.gox-=x/(50+Math.abs(this.goy));
				}
			}
			if(this.flapt<0){
				if(this.goy<-1){
					this.vy-=5;
					this.flapt=15;
				}else{
					this.vy-=1;
					this.flapt=15;
				}
			}
			this.gox*=0.9;
			this.goy*=0.9;
			this.gox+=r()/2;
			this.goy+=r()/2;
			this.vx+=(this.gox-this.vx/2)/3;
			this.vy+=(this.goy-this.vy/2)/3;
			this.vy+=0.01;
			this.x+=this.vx;
			this.y+=this.vy;
			this.flap=Math.cos(this.t+=0.5);
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.beginPath();
			var f=2.8;
			
			ctx.strokeStyle=this.c1;
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x+Math.cos(this.flap-f)*this.w,this.y+Math.sin(this.flap-f)*this.w);
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x-Math.cos(this.flap-f)*this.w,this.y+Math.sin(this.flap-f)*this.w);
			ctx.stroke();
			ctx.beginPath();
			
			ctx.strokeStyle=this.c2;
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x+Math.cos(this.flap+f)*this.w,this.y+Math.sin(this.flap+f)*this.w);
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x-Math.cos(this.flap+f)*this.w,this.y+Math.sin(this.flap+f)*this.w);
			ctx.stroke();
			ctx.beginPath();
			
			if(this.flapt<0)this.flapt=-1;
			this.flap+=this.flapt/20;
			this.flap+=(-this.flap-0.1)*0.1;
		},
		w: 4, h: 4,
		gox: r()*5, goy: r()*5,
		t:r()*5,flap:r()*5,
		c1: "hsla("+(Math.random()*360)+",100%,"+(50+Math.random()*50)+"%,1)",
		c2: "hsla("+(Math.random()*360)+",100%,"+(50+Math.random()*50)+"%,1)",
	},o);
};

entitytypes.push("Bouncy");
Bouncy = function(o){
	return new Thing({
		stepdraw: function(ctx){
			for(var i=0;i<50;i++){
				var x=r()*50;
				var y=r()*50;
				if(collisionPoint(this.x+x,this.y+y)){
					this.vx-=x/50;
					this.vy-=y/30;
				}
			}
			this.x+=this.vx;
			this.y+=this.vy;
			this.draw(ctx);
		},
		draw: function(ctx){
			ctx.fillStyle="rgba(255,255,255,0.3)";
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r/2,0,Math.PI*2,true);
			ctx.fill();
		},
		r: 8*Math.random()+2,
	},o);
};