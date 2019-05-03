
// Variables =============================================
var CANVAS;    // our canvas object
var cvsSTARTED = false;                                     // a flag signaling if we've started the canvas solution
var ELEMENTS = [];                                          // a list of our elements that will need to be constantly redrawn

// Logic =================================================
function cvs_start(){
    cvsSTARTED = true;
    CANVAS = document.getElementById("cstm_mainCanvas");
    var cvsRatio = CANVAS.width / CONFIG.workspaceWidth; // a ratio of our canvas space relative to our basic workspace

    if(cvsRatio > 1){   // we never want this bigger than the workspace
        cvsRatio = 1;
    }

    var context = CANVAS.getContext("2d");
    var index = 0;

    // CONFIG values translated to canvas
    var cvsPadding = (CONFIG.padding * cvsRatio);
    var cvsLogoSize = (CONFIG.logoSize * cvsRatio);
    var cvsDotSize = (CONFIG.dotSize * cvsRatio);
    var cvsDotSpacing = (cvsLogoSize - (5 * cvsDotSize)) / 4;

    // Draw images
    $(DOTS).each(function(){
        // draw dots across the top of the canvas
        var dot = new Image();
        dot.src = this.img_src;
        dot.dotData = {x: (index * (cvsDotSize + cvsDotSpacing)) + cvsPadding, y: cvsPadding, size: cvsDotSize };
        dot.onload = function(){
            context.drawImage(this, this.dotData.x, this.dotData.y, this.dotData.size, this.dotData.size);
        }
        index = index + 1;
    });

    var logo = new Image();
    logo.src = CONFIG.logo;
    logo.onload = function(){
        context.drawImage(logo, cvsPadding, cvsDotSize+ ( 2 * cvsPadding), cvsLogoSize, cvsLogoSize);
    }

}