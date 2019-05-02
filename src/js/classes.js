class Dot {

    constructor(i, c, src, s){
        this.id = i;            // a unique identifier for the dot
        this.color = c;         // the dot's color
        this.img_src = src;     // the url for the dot
        this.size = s;          // number of pixels in length of the dot image
    }

    print(){
        return  "<img class='data_dot' "
                + "id='" + this.id + "' "
                + "src='" + this.img_src + "' " 
                + "style='height:" + this.size + "px; width:" + this.size + "px;' "
                + "ondragstart='handleDrag(event, \"" + this.img_src+ "\"," + this.size + ", \"" + this.color + "\", \"" + this.id + "\")'"
                + "draggable='true'/>";
    }
}

class Slot {

    constructor(ratio, c, posX, posY, s){
        this.ratio = ratio;             // ratio of the size of the current image instance vs the original
        this.color = c;                 // color of the dot required
        this.x = posX * ratio;          // x-coordinate
        this.y = posY * ratio;          // y-coordinate
        this.size = s;                  // size of dots in the current instance
    }

    print(){
        return  "<div class='data_slot' "
                + "ondragover='handleDragOver(event)'"
                + "ondrop='handleDrop(event, \"" + this.color + "\")'"
                + "style='position: absolute; margin-left: " + this.x + "px; margin-top: " + this.y + "px; z-index: 1;"
                + "height: " + this.size + "; width: " + this.size + "'></div>";
    }

}