var Climb = function(){
	this.image = null;
	
	// When this object is done, run the next object via cal
	this.callback = function(){};
}

Climb.prototype.getFillStyle = function(dangerLevel){
	return 'rgba(0,255,0,'+dangerLevel+')';
}

/**
 *  Run this function when you want to update the map.
 */
Climb.prototype.updateCanvas = function(){
	this.image = new Image();
	this.image.onload = function(){climbMap.analyse();};
	this.image.src = this.getGMapURL();
}

/**
 * Gets the static maps URL
 */
Climb.prototype.getGMapURL = function(){
	// To get the map URL's I used: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
	// &style=feature:landscape.man_made|visibility:simplified|color:0x6E1B00 < this is buildings.
	return gStaticMapURL = 'gmap.php?url='+encodeURIComponent('size=640x400&maptype=roadmap&style=visibility:off&style=feature:landscape.natural.terrain|visibility:simplified|color:0x40ff30&sensor=false&markers='
	+'color:blue%7Clabel:S%7C%7Cshadow:false%7Cicon:http://webres.fullondesign.co.uk/img/pixel.png%7C'
	+encodeURIComponent(latLngs.start.value)
	+'&markers='
	+'color:blue%7Clabel:E%7Cshadow:false%7Cicon:http://webres.fullondesign.co.uk/img/pixel.png%7C'
	+encodeURIComponent(latLngs.end.value));
}

Climb.prototype.analyse = function(){
	this.canvas = null;
	
	// Create a tempory clean canvas.
	this.canvas = document.createElement('canvas');
	this.canvas.width = 640;
	this.canvas.height = 400;
	this.ctx = this.canvas.getContext('2d');
	
	
	// Draw the loaded on image onto the temp canvas. Load it as a pattern to get around CORS.
	this.ctx.drawImage(this.image, 0,0);
	
	//var pixles = this.ctx.createImageData(this.canvas.width, this.canvas.height, this.image);
	var pix = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
	
	pix = pix.data;
	
	//debugger;
	
	
	var popPixel = {};
	
	// Go through each of the pixles and if it's got the green we are looking for draw it on the canvas.
	for(var i = 0, n = pix.length; i < n; i += 4) {
		if(pix[i+1] == 255){ //If we are looking at the colour green, draw it on the canvas.
			;
			// Set the x & y
			pixelPos = (i / 4); // Number of pixles up to this point.
			y = parseInt(pixelPos / 640);
			x = pixelPos%640; // * Use a Modulo operation to get the remaining lines.

			canvas.ctx.fillStyle = this.getFillStyle('0.6');//set danger level
			
			// Check if there is climb around this pixel:
			if(
				pix[(i+1) - 4] == 255 &&
				pix[(i+1) + 4] == 255 &&
				pix[(i+1) - (640 * 4)] == 255 &&
				pix[(i+1) + (640 * 4)] == 255
			){
				canvas.ctx.fillStyle = this.getFillStyle('0.9');
			}
			canvas.ctx.fillRect(x, y, 1, 1);
		}
	}
	
	//debugger;
	
	this.callback();
}

Climb.prototype.initialize = function(){
	climbMap.updateCanvas();
}

var climbMap = new Climb();