var colors,strokes;
var ncolor,nstroke,ngraph;
var action;
var draw;
var checked = false;
var record = new Array();
var cs_left,cs_top;
$(function(){
	
	cs_left = $("#canvases").offset().left;
	cs_top = $("#canvases").offset().top;
	colors = ['red', 'yellow', 'blue'];
	strokes = [5, 10, 14];
	graphes = ['rect', 'round', 'polygon', 'triangle', 'star' , 'line'];
	draw = new drawer($('#canvases'));
	
	//創造基本元件
	
	for(i = 0; i <= 9; i++){
		
		var img = $('<img/>');
		img.addClass('other');
		type = (i >= 6)?('seal'):('graph');
		img.attr({'width':'50px',
				'height':'50px',
				'src':'source/img/other1/0'+(i+1)+'.png',
				"onmousedown":"changes(type,"+i+")",
				'type':i
		});
		$("#other").append(img);
		$("#other").append("<br>");
		
	}
	
	for(i = 0; i <= 2; i++){
		
		var color = $('<div></div>').addClass('sdivs').css("background",colors[i]).attr("onmousedown", "changes('color',"+i+")");
		var stroke = $('<div></div>').addClass('sdivs').attr("onmousedown", "changes('stroke',"+i+")");
		var color_div = $('<div></div>').css({
				"background":colors[0],
				"width":strokes[i],
				"height":strokes[i],
				"margin":(20-strokes[i])/2+"px"
			});
		
		stroke.append(color_div);
		
		$('#colors').append(color);
		$('#strokes').append(stroke);
		
	}
	
	changes('color', 0);
	changes('stroke', 0);
	changes('graph', 5);
	
	//創造基本元件end
	
	$("#sk").attr('onmousedown','action = new doc(this)');
	
})

function check(ts){
	if($(ts).prop('checked') == true)
		checked = true;
	else
		checked = false;
}

function changes(type, key){
	
	switch(type){
		
		case 'color':
			$("#colors > div").removeClass('sdivs_active');
			$("#strokes > div > div").css("background",colors[key]);
			$($("#colors > div")[key]).addClass('sdivs_active');
			ncolor = key;
		break;
		
		case 'stroke':
			$("#strokes > div").removeClass('sdivs_active');
			$($("#strokes > div")[key]).addClass('sdivs_active');
			nstroke = key;
		break;
		
		case 'graph':
			$("#other > img").removeClass('graph_active');
			$($("#other > img")[key]).addClass('graph_active');
			ngraph = key;
		break;
		
		case 'seal':
			$("#other > img").removeClass('graph_active');
			$($("#other > img")[key]).addClass('graph_active');
			ngraph = key;
		break;
		
	}
	
}

function doc(ts){
	
	var obj = $(ts);
	var width = $("#draw").attr('width')*1;
	var height = $("#draw").attr('height')*1;
	var left = $(ts).offset().left*1;
	var top = $(ts).offset().top*1;
	var start = true;
	
	$(document).mousemove(function(e){
		if(start == true)
			$("#draw").attr({
				'width': width + (e.clientX - left),
				'height': height + (e.clientY - top),
			});
	});
	
	$(document).mouseup(function(e){
		start = false;
	});
	
}

function drawer(ts){
	
	var obj = ts;
	
	obj.mousedown(function(e){
		
		var canvas = document.createElement('canvas');
		$('canvas').css('border','');
		$('#skk').hide();
		if(checked == true){
			
			var et = e.target;
			
			if(et.className == 'images lines'){
				$('.lines').hide();
				et = document.elementFromPoint(e.clientX,e.clientY);
				$('.lines').show();
			}
			if(et.className == 'images graphs' || et.className == 'images seals'){
				
				$(et).css('border','2px dashed black');
				actionGraph(et,e);
				
			}
			else
				$('canvas').css('border');
			
		}
		else if(ngraph == 5){
			
			$(canvas).addClass('images');
			$(canvas).addClass('lines');
			$(canvas).attr({'width':$('#draw').width(), 'height':$('#draw').height(), 'num':$('.images').length});
			
			obj.append($(canvas));
			new drawing(canvas,e);
			
		}
		else{
			
			$(canvas).addClass('images');
			
			if(ngraph >= 6)
				$(canvas).addClass('seals');
			else
				$(canvas).addClass('graphs');
				
			$(canvas).attr({'width':0, 'height':0, 'num':$('.images').length});
			
			obj.append($(canvas));
			new drawing(canvas,e);
				
		}
		
	})
	
}

function drawing(ts,e){
	
	var obj = $(ts);
	var ctx = ts.getContext('2d');
	var stleft = e.clientX;
	var sttop = e.clientY;
	var start = true;
	
	obj.attr({
		'type':ngraph,
		'stroke':nstroke,
		'color':ncolor
	});
	
	ctx.beginPath();
	
	if(ngraph == 5){
		
		ctx.strokeStyle = colors[ncolor];
		ctx.lineWidth = strokes[nstroke];
		ctx.moveTo(e.clientX - cs_left,e.clientY - cs_top);
		
		obj.mousemove(function(e){
			
			if(start == true){
				ctx.lineTo(e.clientX - cs_left,e.clientY - cs_top);
				ctx.stroke();
			}
			
		});
	
	}
	else if(ngraph >= 6){
		
		img = document.getElementsByClassName('graph_active').item(0);
		obj.css({'left':(e.clientX - cs_left) - ($(img).width()/2)+"px", 'top':(e.clientY - cs_top) - ($(img).height()/2)+"px"});
		obj.attr({'width':$(img).width(),'height':$(img).height()});
		ctx.drawImage(img,0,0);
		
	}
	else{
		
		obj.css({'left':e.clientX - cs_left+"px", 'top':e.clientY - cs_top+"px"});
		
		$(document).mousemove(function(e){
			
			if(start == true){
				
				if(ngraph == 0)
					obj.attr({'width':e.clientX - stleft, 'height':e.clientY - sttop});
				else
					obj.attr({'width':e.clientX - stleft, 'height':e.clientX - stleft});
				
				
				switch(ngraph){
					case 0: strokeRect(ctx,obj,stleft,sttop,nstroke,ncolor); break;
					case 1: strokeRound(ctx,obj,stleft,sttop,nstroke,ncolor); break;
					case 2: strokeGraph(ctx,obj,stleft,sttop,6,nstroke,ncolor); break;
					case 3: strokeGraph(ctx,obj,stleft,sttop,3,nstroke,ncolor); break;
					case 4: strokeStar(ctx,obj,stleft,sttop,5,nstroke,ncolor); break;
				}
			
			}
			
		});
		
	}
	
	$(document).mouseup(function(e){
		ctx.closePath();
		if(obj.attr('type') == 5 && start == true){
			attrs = {'class':obj.attr('class'), 'width':obj.attr('width'), 'height':obj.attr('height'), 'num':obj.attr('num'), 'type':obj.attr('type'), 'stroke':obj.attr('stroke'), 'color':obj.attr('color'), 'src':ts.toDataURL(), 'draggable':false};
			img = $('<img/>').attr(attrs);
			obj.remove();
			$('#canvases').append(img);
		}
		start = false;
	})
	
}

function actionGraph(ts, e){
	
	obj = $(ts);
	ctx = ts.getContext('2d');
	stleft = e.clientX;
	sttop = e.clientY;
	var left = obj.offset().left*1 - cs_left*1;
	var top = obj.offset().top*1 - cs_top*1;
	
	start = true;
	
	if($(ts).hasClass('seals') == false)
		skkset($(ts).hasClass('seals'),obj.offset().left*1+obj.width()*1-15,obj.offset().top*1+obj.height()*1-15);
	
	$(document).mousemove(function(e){
		if(start == true){
			obj.css({'left':left + (e.clientX - stleft)+"px", 'top':top + (e.clientY - sttop)+"px"});
			skkset($(ts).hasClass('seals'),obj.offset().left*1+obj.width()*1-15,obj.offset().top*1+obj.height()*1-15);
		}
	})
	
	$(document).mouseup(function(e){
		if(start == true){
			start = false;
		}
	})
	
	$("#skk").mousedown(function(e){
		
		start2 = true;
		stleft2 = e.clientX;
		sttop2 = e.clientY;
		width = obj.width();
		height = obj.height();
		
		$(document).mousemove(function(e){
			if(start2 == true){
				if(obj.attr('type') == 0)
					obj.attr({'width':width*1 + (e.clientX - stleft2)*1, 'height':height*1 + (e.clientY - sttop2)*1});
				else
					obj.attr({'width':width*1 + (e.clientX - stleft2)*1, 'height':width*1 + (e.clientX - stleft2)*1});
					
				skkset($(ts).hasClass('seals'),obj.offset().left*1+obj.width()*1-15,obj.offset().top*1+obj.height()*1-15);
				
				switch(obj.attr('type')*1){
					case 0: strokeRect(ctx,obj,left,top,obj.attr('stroke'),obj.attr('color')); break;
					case 1: strokeRound(ctx,obj,left,top,obj.attr('stroke'),obj.attr('color')); break;
					case 2: strokeGraph(ctx,obj,left,top,6,obj.attr('stroke'),obj.attr('color')); break;
					case 3: strokeGraph(ctx,obj,left,top,3,obj.attr('stroke'),obj.attr('color')); break;
					case 4: strokeStar(ctx,obj,left,top,5,obj.attr('stroke'),obj.attr('color')); break;
				}
			}
		})
		
		$(document).mouseup(function(e){
			if(start2 == true){
				ctx.closePath();
				start2 = false;
			}
		})
		
	})
	
}

function skkset(type,x,y){
	if(type == true)
		$('#skk').hide();
	else{
		$('#skk').show();
		$('#skk').css({
			'left':x,
			'top':y
		});
	}
}

function strokeRect(ctx, obj, ssleft, sstop, sk, cr){
	
	ctx.strokeStyle = colors[cr];
	ctx.lineWidth = strokes[sk];
	ctx.rect(0,0,obj.attr('width'),obj.attr('height'));
	ctx.stroke();
	
}

function strokeRound(ctx, obj, ssleft, sstop, sk, cr){
	
	ctx.strokeStyle = colors[cr];
	ctx.lineWidth = strokes[sk]; 
	ctx.arc(obj.attr('width')/2,obj.attr('width')/2,obj.attr('width')/2 - (strokes[nstroke]/2),0,2*Math.PI,true);
	ctx.stroke();
	
}

function strokeGraph(ctx, obj , ssleft, sstop, n, sk, cr){
	
	r = obj.attr('width')/2 - (strokes[nstroke]/2);
	ang = Math.PI*2/n;
	x = (n % 2 == 0)?(-r):(0);
	y = (n % 2 == 0)?(0):(-r);
	
	ctx.strokeStyle = colors[cr];
	ctx.lineWidth = strokes[sk]; 
    ctx.translate(obj.attr('width')/2, obj.attr('width')/2);
	
	ctx.moveTo(x,y);
	
	for(i = 0;i < n; i ++)
    {
      ctx.rotate(ang);
      ctx.lineTo(x,y);
    }
    ctx.stroke();
}

function strokeStar(ctx, obj ,ssleft, sstop, n, sk, cr){
	
	r = obj.attr('width')/2 - (strokes[nstroke]/2);
	ctx.strokeStyle = colors[cr];
	ctx.lineWidth = strokes[sk]; 
    ctx.translate(obj.attr('width')/2, obj.attr('width')/2);
    ctx.moveTo(0,0-r);
	
    for (var i = 0; i < 5; i++)
    {
        ctx.rotate(Math.PI / 5);
        ctx.lineTo(0, 0 - (r*0.5));
        ctx.rotate(Math.PI / 5);
        ctx.lineTo(0, 0 - r);
    }
	
	ctx.stroke();
	
}

function saveImage(){
	
	var canvas = document.getElementById('draw');
	var cl = document.getElementsByClassName('images').length-1;
	var paintCtx = canvas.getContext('2d');
	
	for(i = 0; i <= cl; i++){
		
		var images = document.getElementsByClassName('images').item(i);
			left = $(images).offset().left*1 - cs_left*1;
			tops = $(images).offset().top*1 - cs_top*1;
			
		var img = document.createElement('img');
			url = ($(images).attr('type') == '5')?($(images).attr('src')):(images.toDataURL());
			$(img).addClass('outputs');
			$(img).attr({'width':$(images).width(), 'height':$(images).height()});
			$(img).attr('src',url);
			
		$('#output').append(img);
		output = document.getElementsByClassName('outputs').item(i);
		paintCtx.drawImage(output,left,tops);
	}
	
	url = document.getElementById('draw').toDataURL();
	a = $('<a>').attr({'download':'繪圖.jpg',"href":url});
	a[0].click();
	
}

function saveText(){
	
	var $link = $("<a>");
	var blob = new Blob([$("#canvases").html()], 
			  { type:"application/octect-stream" });
	var blobUrl = URL.createObjectURL(blob);
	var fileName = "words.txt";
	
	$link.attr({ href: blobUrl, download: fileName })
		 .text(fileName);
		 
	$link[0].click();
	
}

function readFile(e){
	
	var file = e.target.files[0];
	fileUrl = URL.createObjectURL(file);
	$("#canvases").empty();
	$.get(fileUrl, function(res) {
    	$("#canvases").append(res);
		reading();
		
    }, "text");
	
}
function reading(){
	
	cl = document.getElementsByClassName('images').length-1;
	for(var i = 0; i <= cl; i++){
		
		
		var img = document.getElementsByClassName('images').item(i);
		var obj = $(img);
		
		if(obj.attr('type') != 5){
		
			var ctx = img.getContext('2d');
			var left = obj.offset().left*1 - cs_left*1;
			var top = obj.offset().top*1 - cs_top*1;
		
			ctx.save();
			
			if(obj.attr('type')*1 < 5){
				type = obj.attr('type')*1;
				switch(type){
					case 0: strokeRect(ctx,obj,left,top,obj.attr('stroke'),obj.attr('color')); break;
					case 1: strokeRound(ctx,obj,left,top,obj.attr('stroke'),obj.attr('color')); break;
					case 2: strokeGraph(ctx,obj,left,top,6,obj.attr('stroke'),obj.attr('color')); break;
					case 3: strokeGraph(ctx,obj,left,top,3,obj.attr('stroke'),obj.attr('color')); break;
					case 4: strokeStar(ctx,obj,left,top,5,obj.attr('stroke'),obj.attr('color')); break;
				}
			}
			else{
				img = document.getElementsByClassName('other').item(obj.attr('type')*1);
				ctx.drawImage(img,0,0);
			}
			ctx.closePath();
			
		
		}
		
	}
	
}