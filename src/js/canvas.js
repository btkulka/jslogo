
// Variables =============================================
var CANVAS;                                                 // our canvas object
var cvsSTARTED = false;                                     // a flag signaling if we've started the canvas solution
var ELEMENTS = [];                                          // a list of our elements that will need to be constantly redrawn
var cvsSLOTS = [];                                          // an array of the coordinates where the dots need to be dropped
var cvsCORRECT_COUNT = 0;                                   // a running count of the number of dots in correct positions

// mousedown variables
var cvsMouseDragging = false;                               // a flag signaling if a drag is in progress
var cvsMouseElementIndex = -1;                              // the index of the current element in the parent ELEMENTS array

// Utility Functions =====================================

function getClickedDotIndex(event){
    var rect = CANVAS.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    for(var i = 0; i < ELEMENTS.length; i++){
        if(isWithinElementBounds(ELEMENTS[i], x, y) && ELEMENTS[i].elData.type == "dot"){
            return i;
        }
    }

    // if we found nothing, return null
    return null;
}

function isWithinElementBounds(element, qX, qY){
    var minX = element.elData.currX;
    var maxX = element.elData.currX + element.elData.size;
    var minY = element.elData.currY;
    var maxY = element.elData.currY + element.elData.size;

    return qX >= minX && qX <= maxX && qY >= minY && qY <= maxY;
}

function resetDot(){
    // return the dragged dot to its original position
    var dragEl = ELEMENTS[cvsMouseElementIndex];
    dragEl.elData.currX = dragEl.elData.orgX;
    dragEl.elData.currY = dragEl.elData.orgY;
    ELEMENTS[cvsMouseElementIndex] = dragEl;
    cvsMouseElementIndex = -1;
    drawCanvas();
}

function cvsReset(){
    // reset all elements coordinates and re-draw
    for(var i = 0; i < ELEMENTS.length; i++){
        var el = ELEMENTS[i];
        el.elData.currX = el.elData.orgX;
        el.elData.currY = el.elData.orgY;
        ELEMENTS[i] = el;
    }

    drawCanvas();
}

// Logic =================================================

// Initialize and set listeners/handlers
function cvs_start(){

    // Start Canvas process
    cvsSTARTED = true;
    CANVAS = document.getElementById("cstm_mainCanvas");
    var cvsRatio = CANVAS.width / CONFIG.workspaceWidth; // a ratio of our canvas space relative to our basic workspace
    if(cvsRatio > 1){   // we never want this bigger than the workspace
        cvsRatio = 1;
    }

    // CONFIG values translated to canvas
    var cvsPadding = (CONFIG.padding * cvsRatio);
    var cvsLogoSize = (CONFIG.logoSize * cvsRatio);
    var cvsDotSize = (CONFIG.dotSize * cvsRatio);
    var cvsDotSpacing = (cvsLogoSize - (5 * cvsDotSize)) / 4;

    // Set Canvas interaction functions
    $(CANVAS).on("mousedown", function(event){
        var i = getClickedDotIndex(event);

        // if we found something and it isn't locked
        if(i != null && !ELEMENTS[i].elData.locked){
            cvsMouseDragging = true;
            cvsMouseElementIndex = i;
        }
    });

    $(CANVAS).on("mousemove", function(event){
        // draw the object along the mouse's path
        if(cvsMouseDragging){
            var rect = CANVAS.getBoundingClientRect();
            var el = ELEMENTS[cvsMouseElementIndex];
            var elRadius = el.elData.size / 2;
            el.elData.currX = event.clientX - elRadius - rect.left;
            el.elData.currY = event.clientY - elRadius - rect.top;
            ELEMENTS[cvsMouseElementIndex] = el;
            drawCanvas();
        }
    });

    // prevent multiple mouseup calls
    $(document).ready(function () {
        $("*").mouseup(function (e) {
            e.stopPropagation();
        });
    });

    $(CANVAS).on("mouseup", function(event){
        // do logic to ensure it's in the right spot and not overlapping dots, then draw and lock
        if(cvsMouseDragging){
            cvsMouseDragging = false;
            var rect = CANVAS.getBoundingClientRect();
            var dragEl = ELEMENTS[cvsMouseElementIndex];

            // ensure we are not touching a dot
            for(var i = 0; i < ELEMENTS.length; i++){
                if(cvsMouseElementIndex != i && isWithinElementBounds(ELEMENTS[i], event.clientX - rect.left, event.clientY - rect.top) && ELEMENTS[i].elData.type == "dot"){
                    addToFeed("A dot cannot be dropped on another dot!", "error");
                    resetDot();
                    return -1; // exit
                }
            }

            // ensure the drop spot has a slot for the dot 
            var slot = null;
            for(var i = 0; i < cvsSLOTS.length; i++){
                if(isWithinElementBounds(cvsSLOTS[i], event.clientX - rect.left, event.clientY - rect.top)){
                    slot = cvsSLOTS[i];
                }
            }

            if(slot == null){
                addToFeed("The dot has to be dropped in an open white space on the logo!", "error");
                resetDot();
                return -1;  // exit
            }

            // right color?
            if(dragEl.elData.color == slot.color){
                cvsCORRECT_COUNT = cvsCORRECT_COUNT + 1;
                if(cvsCORRECT_COUNT != 5){
                    // update dot and lock it
                    dragEl.elData.currX = slot.elData.currX;
                    dragEl.elData.currY = slot.elData.currY;
                    dragEl.elData.locked = true;
                    ELEMENTS[cvsMouseElementIndex] = dragEl;
                    cvsMouseElementIndex = -1;  // reset index
                    drawCanvas();

                    addToFeed("Correct! " + (5 - cvsCORRECT_COUNT) + " dots left to go!");
                }else{
                    win();
                    return 1;
                }
            }else{
                addToFeed("Wrong color! Try again.", "error");
                resetDot();
                return -1;
            }
        }
    });
    
    // Draw images
    var context = CANVAS.getContext("2d");
    var rect = CANVAS.getBoundingClientRect();

    var logo = new Image();
    logo.src = CONFIG.logo;
    logo.elData = {type: "logo", orgX: cvsPadding, orgY: cvsDotSize + ( 2 * cvsPadding), size: cvsLogoSize };
    // current coordinates set to original coordinates 
    logo.elData.currX = logo.elData.orgX;
    logo.elData.currY = logo.elData.orgY;
    logo.onload = function(){
        context.drawImage(logo, this.elData.orgX, this.elData.orgY, this.elData.size, this.elData.size);
    }

    ELEMENTS.push(logo);

    // set slots
    for(var i = 0; i < CONFIG.slots.length; i++){
        var slot = CONFIG.slots[i];
        var slotRatio = logo.elData.size / 600;

        // have to set elData for bounding checks
        slot.elData = { size: cvsDotSize,
                        currX: (slot.x * slotRatio + logo.elData.orgX),
                        currY: (slot.y * slotRatio + logo.elData.orgY)
                    };

        cvsSLOTS.push(slot);
    }

    var index = 0;
    $(DOTS).each(function(){
        // draw dots across the top of the canvas
        var dot = new Image();
        dot.src = this.img_src;
        dot.elData = {  type: "dot", 
                        color: this.color, 
                        orgX: (index * (cvsDotSize + cvsDotSpacing)) + cvsPadding, 
                        orgY: cvsPadding, 
                        size: cvsDotSize,
                        locked: false
                    };
        // current coordinates set to original coordinates
        dot.elData.currX = dot.elData.orgX;
        dot.elData.currY = dot.elData.orgY;
        dot.onload = function(){
            context.drawImage(this, this.elData.orgX, this.elData.orgY, this.elData.size, this.elData.size);
        }
        index = index + 1;

        ELEMENTS.push(dot);
    }); 
}

function drawCanvas(){
    var context = CANVAS.getContext("2d");
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);

    for(var i = 0; i < ELEMENTS.length; i++){
        var el = ELEMENTS[i];
        context.drawImage(el, el.elData.currX, el.elData.currY, el.elData.size, el.elData.size);
    }
}