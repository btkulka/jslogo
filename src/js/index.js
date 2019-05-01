// static variables ============================
var CANVAS = document.getElementById("cstm_mainCanvas");   // our canvas object
var CONFIG = {                                             // all hardcoded values will live in this json CONFIG object
    "logo": "../imgs/ia-logo-back.png",
    "padding": 10,
    "dots": [
        {"color":"black", "src": "../imgs/ia-logo-dot-black.png"},
        {"color":"blue", "src": "../imgs/ia-logo-dot-blue.png"},
        {"color":"green", "src": "../imgs/ia-logo-dot-green.png"},
        {"color":"red", "src": "../imgs/ia-logo-dot-red.png"}
    ]
};

var DOTS = [];                                             // our array of Dot objects

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
        }
        navlink.addClass("active");
    }
}

// static functions ============================

function addToFeed(message, type = "basic"){

    var bullet = "<li>" + Date.getTime() + ": " + message + "</li>";

    if(type == "error"){
        bullet.addClass("text-danger");
    }

    $("#feed-list").append(bullet)
}

// logic =======================================

// Initialize
$(document).ready(function(){

    var workspace = $("#basicWorkspace");

    // calculate space
    CONFIG.width = workspace.width();
    CONFIG.height = workspace.height();
    CONFIG.logoSize = CONFIG.height;
    CONFIG.dotSize = CONFIG.logoSize * (86 / 600);    // ratio of dots to logo currently

    var dotShelf = $("<div class='row d-flex justify-content-between' style='min-width:" + CONFIG.logoSize + "px; max-width:" + CONFIG.logoSize + "px'></div>");
    workspace.append(dotShelf);
    
    // Load images
    $(CONFIG.dots).each(function(){
        
        var d = new Dot(this.color, this.src);

        dotShelf.append(d.print(CONFIG.dotSize));
        DOTS.push(d);

        // we want two black dots, do this twice
        if(this.color == "black"){
            dotShelf.append(d.print(CONFIG.dotSize));
            DOTS.push(d);
        }
        
    });

    var logoWrapper = $("<div class='row d-flex justify-content-between mt-1' style='min-width:" + CONFIG.logoSize + "px; max-width:" + CONFIG.logoSize + "px'></div>");
    workspace.append(logoWrapper);
    logoWrapper.append("<img src='" + CONFIG.logo + "' style='height:" + CONFIG.logoSize + "px; width:" + CONFIG.logoSize + "px;'/>");

});
