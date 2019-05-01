class Dot {

    constructor(c, src, s){
        this.color = c;         // the dot's color
        this.img_src = src;     // the url for the dot
        this.size = s;          // number of pixels in length of the dot image
    }

    print(size){
        return "<img class='data_dot' src='" + this.img_src + "' style='height:" + this.size + "px; width:" + this.size + "px;'/>";
    }

}

class Slot {

    constructor(ratio, c, posX, posY){
        this.ratio = ratio;             // ratio of the size of the current image vs the original
        this.color = c;                 // color of the dot required
        this.x = posX * ratio;          // x-coordinate
        this.y = posY * ratio;          // y-coordinate
    }

    print(){
        return "<div class='data_slot' style='position: absolute; margin-left: " + this.x + "px; margin-top: " + this.y + "px; z-index: 1;'></div>";
    }

}