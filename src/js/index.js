// static variables ============================
var FEED = [];

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

    // Begin list
   addToFeed("Began application. Good luck!");

});
