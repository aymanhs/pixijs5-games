

function stackDepth() {
    var c = stackDepth.caller, depth = 0;
    while (c) { c = c.caller; depth++; }
    return depth;
}

class Game {
    keys;
    app;
    tick;

    constructor(options) {
        this.keys = {};
        this.app = new PIXI.Application(options);
        document.body.appendChild(this.app.view);
    }

    load(resources) {
        const loader = PIXI.Loader.shared;
        resources.forEach(r => {
            loader.add(r)
        });
        loader.load((loader, resources) => {
            this._addKeyListeners();
            // and then do setup for the actual game
            this.setup(resources);
            this._gameLoop(0);
        });
    }

    _gameLoop(ts) {
        if(!this.tick) {
            this.tick = ts;
        }
        let delta = ts - this.tick;
        this.tick = ts;
        // update the game object
        this.update(delta);
        // then ask all sprites to update
        this.app.stage.children.forEach(child => {
            if (child.update) {
                child.update(delta);
            }
        });
        // and loop for the next frame
        window.requestAnimationFrame((ts) => {
            this._gameLoop(ts);
        });
    }

    _addKeyListeners() {
        window.addEventListener("keyup", k => {
            this.keys[k.code] = false;
        })

        window.addEventListener("keydown", k => {
            this.keys[k.code] = true;
        })
    }

    Object(txture, name, x, y) {
        let s = new PIXI.Sprite(this.sheet.textures[txture])
        s.name = name;
        s.x = x;
        s.y = y;
        this.app.stage.addChild(s);
        return s;
    }
}