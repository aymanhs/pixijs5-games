// Create the Game object
let game = new Game({
    width: 800,
    height: 500,
    antialiasing: true,
    transparent: false,
    resolution: 1
})

let dbg = document.getElementById("dbg");
// let bang = new Audio("pew.mp3");
let bang = PIXI.sound.Sound.from('pew.mp3');

game.load(["images/chars.json"]);
game.scoreStyle = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowBlur: 5,
    dropShadowColor: "#d39797",
    dropShadowDistance: 0,
    fill: "#f5e0e0",
    stroke: "#d50b0b"
});

game.setup = function (resources) {
    this.currentScore = 0;
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
    // this.player.anchor.set(0.5);

    this.AddZombie();
    this.AddZombie();
    this.scoreSprite = new PIXI.Text("Score", game.scoreStyle);
    this.scoreSprite.x = 700;
    this.scoreSprite.y = 20;
    this.app.stage.addChild(this. scoreSprite);
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
    this.bulletDelay = 10;
    let b = this.Object("bullet.png", "bullet", this.player.x - 10, this.player.y + 20);
    b.vx = -15;
    b.vy = 0;
    bang.play();
    b.update = () => {
        // check if we collided with any zombie
        b.x += b.vx;
        b.y += b.vy;
        for (let z of this.app.stage.children) {
            if (z.name == "zombie" && isCollide(b, z)) {
                this.app.stage.removeChild(z);
                this.app.stage.removeChild(b);
                this.currentScore++;
                this.scoreSprite.text = `${this.currentScore}`
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
    let x = Math.random() * 100 - 200;
    let y = Math.random() * this.app.view.height;
    let z = this.Object("zombie1.png", "zombie", x, y);
    z.update = () => {
        let vx = game.player.x - z.x;
        let vy = game.player.y - z.y;
        z.vx = clip(vx * 0.02, -2, 2);
        z.vy = clip(vy * 0.02, -2, 2);
        // z.anchor.set(0.5);
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

function isCollide(sa, sb) {
    if (!sa.getBounds || !sb.getBounds) {
        return false;
    }
    const a = sa.getBounds(true);
    const b = sb.getBounds(true);
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}