

function stackDepth() {
    var c = stackDepth.caller, depth = 0;
    while (c) { c = c.caller; depth++; }
    return depth;
}

class Game {
    keys;
    app;

    constructor(res, options) {
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
            this._gameLoop();
        });
    }

    _gameLoop() {
        // update all sprites
        this.app.stage.children.forEach(child => {
            if (child.vx) {
                child.x += child.vx;
            }
            if (child.vy) {
                child.y += child.vy;
            }
            if (child.update) {
                child.update();
            }
        });
        this.update();
        window.requestAnimationFrame(() => {
            this._gameLoop();
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

    Sprite(txture, name, x, y) {
        let s = new PIXI.Sprite(this.sheet.textures[txture])
        s.name = name;
        s.x = x;
        s.y = y;
        this.app.stage.addChild(s);
        return s;
    }
}