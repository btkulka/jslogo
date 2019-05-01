class Dot {

    constructor(c, src){
        this.color = c;          // the dot's color
        this.img_src = src;     // the url for the dot
    }

    print(size){
        return "<img src='" + this.img_src + "' style='height:" + size + "px; width:" + size + "px;'/>";
    }

}