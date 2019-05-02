
// Variables =============================================
var CANVAS;    // our canvas object
var cvsSTARTED = false;                                     // a flag signaling if we've started
                                                                // the canvas solution

// Logic =================================================
function cvs_start(){
    cvsSTARTED = true;
    CANVAS = document.getElementById("cstm_mainCanvas");
    var context = CANVAS.getContext("2d");
    var index = 0;

    // Draw images
    $(DOTS).each(function(){
        // draw dots across the top of the canvas
        var dot = new Image();
        dot.src = this.img_src;
        dot.onload = function(){
            context.drawImage(dot, CANVAS.height - ((index * this.size) + CONFIG.padding), CONFIG.padding, this.size, this.size);
        }
        index = index + 1;
    });

    var logo = new Image();
    logo.src = CONFIG.logo;
    logo.onload = function(){
        context.drawImage(logo, CONFIG.padding, CONFIG.dotSize + CONFIG.padding, CONFIG.logoSize, CONFIG.logoSize);
    }

}