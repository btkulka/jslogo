// static variables ============================
var CONFIG = {                                             // all hardcoded values will live in this json CONFIG object
    "logo": "../imgs/ia-logo-back.png",
    "padding": 10,
    "dots": [
        {"color":"black", "src": "../imgs/ia-logo-dot-black.png"},
        {"color":"blue", "src": "../imgs/ia-logo-dot-blue.png"},
        {"color":"green", "src": "../imgs/ia-logo-dot-green.png"},
        {"color":"red", "src": "../imgs/ia-logo-dot-red.png"}
    ],
    "slots": [
        {"x": 150, "y": 343, "color": "green"},
        {"x": 55, "y": 197, "color": "black"},
        {"x": 465, "y": 80, "color": "red"},
        {"x": 423, "y": 293, "color": "black"},
        {"x": 280, "y": 55, "color": "blue"}
    ]
};

var DOTS = [];                                              // our array of Dot objects
var SLOTS = [];                                             // our array of Slot objects
var CORRECT_COUNT = 0;                                      // running count of the correct placements

// UI functionality ============================

// Changes between the basic solution and the HTML5 Canvas solution
function SwapViews(pill){

    var navlink = $(pill).children().first();

    // if the selected pill does not have an active link child
    if(!navlink.hasClass("active")){
        if(navlink.attr("id") == "basic-pill"){
            $("#canvas-pill").removeClass("active");
            $("#canvasCol")
                .hide()
                .removeClass("d-flex")
                .addClass("d-none");
            $("#basicCol")
                .addClass("d-flex")
                .removeClass("d-none")
                .fadeIn();
            addToFeed("Swapping to basic solution...");
        }else{
            $("#basic-pill").removeClass("active");
            $("#basicCol")
                .hide()
                .removeClass("d-flex")
                .addClass("d-none");
            $("#canvasCol")
                .addClass("d-flex")
                .removeClass("d-none")
                .fadeIn();
            addToFeed("Swapping to canvas solution...");
            if(!cvsSTARTED){
                cvs_start();
            }
        }
        navlink.addClass("active");
    }
}

// static functions ============================

// Resets the Basic Workspace to its starting state
function reset(){
    addToFeed("Returning dots to their starting position...");
    DOTS = [];
    SLOTS = [];
    CORRECT_COUNT = 0;
    $("#basicWorkspace").empty();
    loadImages();
}

// adds a message to the feed. Passing "error" as second param paints text red
function addToFeed(message, type = "basic"){
    var bullet = $("<li>" + message + "</li>");

    if(type == "error"){
        bullet.addClass("text-danger");
    }

    $("#feed-list").prepend(bullet)
}

// handles drag on all Dot elements
function handleDrag(ev, src, size, color, id){
    ev.dataTransfer.setData("text/plain", JSON.stringify ({"color": color, "id": id}));
    ev.dataTransfer.setDragImage(new Image(src), size, size);
    ev.dataTransfer.dropEffect = "move";
}

// handles dragover on all Slot element
function handleDragOver(ev){
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move"
}

// handles drop on all Slot elements
function handleDrop(ev, color){
    ev.preventDefault();

    var td = JSON.parse(ev.dataTransfer.getData("text/plain"));
    try{
        if(color == td.color){
            if($(ev.target).children().length > 0 || $(ev.target).hasClass("data_dot")){
                throw "There's already a dot on this slot!"
            }else{
                CORRECT_COUNT = CORRECT_COUNT + 1;            
                var dot = document.getElementById(td.id);
                dot.draggable = false;
                ev.target.append(dot);

                if(CORRECT_COUNT == 5){
                    win();
                }else{
                    addToFeed("Correct! " + (5 - CORRECT_COUNT) + " dots left to go!");
                }
            }
        }else{
            throw "Wrong color dot for this slot!";
        }
    }catch(ex){
        reject(ex);
    }
}

// Occurs when a Dot is not on the right Slot
// creating as a function in case I want to expand functionality
function reject(ex){
    addToFeed(ex, "error");
}

// only called at the beginning of the app, used to set CONFIG values
function initialize(){
    var workspace = $("#basicWorkspace");

    // calculate space
    CONFIG.width = workspace.width();
    CONFIG.height = workspace.height();
    CONFIG.logoSize = CONFIG.height;
    CONFIG.dotSize = CONFIG.logoSize * (86 / 600);    // ratio of dots to logo currently
    CONFIG.ratio = CONFIG.logoSize / 600;
    CONFIG.workspaceWidth = workspace.width();        // used for our canvas solution

    loadImages();
}

// loads images into the basic workspace and populates global data
function loadImages(){
    var workspace = $("#basicWorkspace");
    var dotShelf = $("<div class='row d-flex justify-content-between' style='min-width:" + CONFIG.logoSize + "px; max-width:" + CONFIG.logoSize + "px'></div>");
    workspace.append(dotShelf);
    
    // increment this and assign to each dot
    var id = 1;

    // Load images
    $(CONFIG.dots).each(function(){

        var d = new Dot("dot"+id, this.color, this.src, CONFIG.dotSize);
        
        id = id + 1;

        dotShelf.append(d.print());
        DOTS.push(d);

        // we want two black dots, do this twice
        if(this.color == "black"){
            d = new Dot("dot"+id, this.color, this.src, CONFIG.dotSize);
            id = id + 1;
            dotShelf.append(d.print());
            DOTS.push(d);
        }
        
    });

    var logoWrapper = $("<div class='row d-flex justify-content-between mt-1' style='min-width:" + CONFIG.logoSize + "px; max-width:" + CONFIG.logoSize + "px'></div>");
    workspace.append(logoWrapper);
    logoWrapper.append("<img src='" + CONFIG.logo + "' style='position: absolute; height:" + CONFIG.logoSize + "px; width:" + CONFIG.logoSize + "px;' z-index: 0;/>");

    // append slots
    $(CONFIG.slots).each(function(){
        var s = new Slot(CONFIG.ratio, this.color, this.x, this.y, CONFIG.dotSize);
        SLOTS.push(s);
        logoWrapper.append(s.print());
    });

    addToFeed("Move all dots to their correct position. Good luck!");
}

// Initialize
$(document).ready(function(){
    initialize();
});

function ClaimPrize(){
    window.location.href = "https://www.youtube.com/watch?v=oHg5SJYRHA0";
}

function win(){
    addToFeed("You win! Congratulations!");
    $("#winModal").modal("show");
}