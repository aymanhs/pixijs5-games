//Create a Pixi Application
let app = new PIXI.Application({
    width: 800,
    height: 500,
    antialiasing: true,
    transparent: false,
    resolution: 1
});

let player, entities, bulletDelay;
let dbg = document.getElementById("dbg");

document.body.appendChild(app.view);

let keys = {};
let sheet;

//load an image and run the `setup` function when it's done
PIXI.loader
    .add("images/chars.json")
    .load(setup);

//This `setup` function will run when the image has loaded
function setup() {

    sheet = PIXI.loader.resources["images/chars.json"];
    bulletDelay = 0;

    //Create the player sprite
    player = new PIXI.Sprite(sheet.textures["zk.png"]);
    player.name = "Player";
    player.vx = 0;
    player.vy = 0;

    // create the Game entities
    entities = [];
    for (let i = 0; i < 3; i++) {
        let zombie = new Entity(new PIXI.Sprite(sheet.textures["zombie1.png"]), 30 + i * 100, 30 - 100 * i);
        zombie.vy = 1;
        zombie.sprite.name = `Zombie ${i}`;
        zombie.maxy = app.view.height - 100;
        entities.push(zombie);
    }

    //Add the player to the stage
    app.stage.addChild(player);
    entities.forEach(z => app.stage.addChild(z.sprite));

    player.anchor.set(0.5);

    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    keyDiv = document.getElementById("keyDiv");

    window.addEventListener("keyup", k => {
        keys[k.code] = false;
    })

    window.addEventListener("keydown", k => {
        keys[k.code] = true;
    })

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(delta) {

    if (keys.ArrowUp) {
        player.vy = -5;
    } else if (keys.ArrowDown) {
        player.vy = 5;
    } else {
        player.vy = 0;
    }
    if (keys.ArrowLeft) {
        player.vx = -5;
    } else if (keys.ArrowRight) {
        player.vx = 5;
    } else {
        player.vx = 0;
    }
    if (keys.Space) {
        bulletDelay--;
        if (bulletDelay <= 0) {
            bulletDelay = 60;
            dbg.innerHTML = "BANG!";
            // add a bullet
            let b = new Entity(new PIXI.Sprite(sheet.textures["bullet.png"]), player.x - 60, player.y - 10);
            b.name = "bullet";
            b.vx = -5;
            b.vy = 0;
            entities.push(b);
            app.stage.addChild(b.sprite);
        }
    } else {
        dbg.innerHTML = "Move";
    }
    if (keys.ShiftLeft) {
        player.vx *= 2;
        player.vy *= 2;
    }

    player.x = clip(player.x + player.vx, 0, app.view.width);
    player.y = clip(player.y + player.vy, 0, app.view.height);
    entities.forEach(z => z.update());
    // check collission with any zombie
    // dbg.innerHTML = "Hits:";
    for (z of entities) {
        if (isCollide(player, z.sprite)) {
            z.dead = true;
            dbg.innerHTML += ` ${z.sprite.name}`;
        }
    }
    window.requestAnimationFrame(gameLoop);
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