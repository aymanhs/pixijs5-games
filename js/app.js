// Create the Game object
let game = new Game({
    width: 800,
    height: 500,
    antialiasing: true,
    transparent: false,
    resolution: 1
})

let dbg = document.getElementById("dbg");


game.load(["images/chars.json"]);

game.setup = function (resources) {
    this.sheet = resources["images/chars.json"];
    this.resources = resources;
    this.bulletDelay = 0;

    this.player = this.Object("zk.png", "player", this.app.view.width / 2, this.app.view.height / 2);
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.update = () => {
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
    }
    this.player.anchor.set(0.5);

    this.AddZombie();
    this.AddZombie();
}

game.update = function (delta) {
    // dbg.innerHTML = `${delta}`;
    this.bulletDelay--;
    if (this.keys.ArrowUp) {
        this.player.vy = -5;
    } else if (this.keys.ArrowDown) {
        this.player.vy = 5;
    } else {
        this.player.vy = 0;
    }
    if (this.keys.ArrowLeft) {
        this.player.vx = -5;
    } else if (this.keys.ArrowRight) {
        this.player.vx = 5;
    } else {
        this.player.vx = 0;
    }
    if (this.keys.Space) {
        if (this.bulletDelay <= 0) {
            this.fire();
        }
    }
}

game.fire = function () {
    this.bulletDelay = 60;
    let b = this.Object("bullet.png", "bullet", this.player.x - 60, this.player.y - 10);
    b.vx = -15;
    b.vy = 0;
    b.update = () => {
        // check if we collided with any zombie
        b.x += b.vx;
        b.y += b.vy;
        for (let z of this.app.stage.children) {
            if (z.name == "zombie" && isCollide(b, z)) {
                this.app.stage.removeChild(z);
                this.app.stage.removeChild(b);
                this.AddZombie();
                return;
            }
        }
        if (b.x < -50) {
            this.app.stage.removeChild(b);
        }
    }
}

game.AddZombie = function () {
    let x = Math.random() * 100;
    let y = Math.random() * 100 + 200;
    let z = this.Object("zombie1.png", "zombie", x, y);
    z.update = () => {
        let vx = game.player.x - z.x;
        let vy = game.player.y - z.y;
        z.vx = clip(vx * 0.02, -2, 2);
        z.vy = clip(vy * 0.02, -2, 2);
        z.x += z.vx;
        z.y += z.vy;
    }
}


function clip(x, mn, mx) {
    if (x < mn) {
        return mn;
    } else if (x > mx) {
        return mx;
    } else {
        return x;
    }
}

function isCollide(a, b) {
    if (!a instanceof PIXI.Sprite || !b instanceof PIXI.Sprite) {
        return false;
    }
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}