// static variables ============================
var FEED = [];
var IMGS = [];

// static functions ============================
function addToFeed(message, type = "basic"){

    var bullet = "<li>" + Date.getTime() + ": " + message + "</li>";

    if(type == "error"){
        bullet.addClass("text-danger");
    }

    FEED.unshift(bullet)
}

// logic =======================================

// Initialize
$(document).ready(function(){

    // set up listeners
    $(FEED).onchange(function(){
        
    })

    // load images
   

    // Begin list
   addToFeed("Began application. Good luck!");

});
