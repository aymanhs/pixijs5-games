class Entity {
    constructor(sprite, x, y) {
        this.sprite = sprite;
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update() {
        // if this has velocity, update it
        if(this.vx) {
            this.sprite.x += this.vx;
        }
        if(this.vy) {
            this.sprite.y += this.vy;
        }
        if(this.maxy && (this.sprite.y > this.maxy)) {
            this.sprite.y = this.maxy;
        }
        if(this.maxx && (this.sprite.x > this.maxx)) {
            this.sprite.x = this.maxx;
        }
    }
}