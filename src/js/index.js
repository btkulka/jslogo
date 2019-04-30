// static variables ============================
var CANVAS = document.getElementById("cstm_mainCanvas");   // our canvas object
var CONFIG = {                                             // all hardcoded values will live in this json CONFIG object
    "logo": "../imgs/ia-logo-back.png",
    "dot_width": 86,
    "padding": 10,
    "dots": [
        {"color":"black", "src": "../imgs/ia-logo-dot-black.png"},
        {"color":"blue", "src": "../imgs/ia-logo-dot-blue.png"},
        {"color":"green", "src": "../imgs/ia-logo-dot-green.png"},
        {"color":"red", "src": "../imgs/ia-logo-dot-red.png"}
    ]
};

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

    // read in images
    for(var i = 0; i < CONFIG.dots.length; i++){
        var dotCtx = CANVAS.getContext("2d");

        var dot = new Image();
        dot.src = CONFIG.dots[i].src;
        dot.x = CONFIG.dot_width * i;

        dotCtx.drawImage(dot, (CONFIG.dot_width * i) + CONFIG.padding, CONFIG.padding);
    }

    var logoCtx = CANVAS.getContext("2d");
    var logo = new Image();
    logo.src = CONFIG.logo;
    logoCtx.drawImage(logo, CONFIG.padding + (CANVAS.width() / 2), CONFIG.padding + (CANVAS.height() /2 ));

    // Begin list
   addToFeed("Began application. Good luck!");

});
