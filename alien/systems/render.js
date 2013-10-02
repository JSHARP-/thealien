var alien = alien || {};
alien.systems = alien.systems || {};

alien.systems.RenderSystem = (function () {
    'use strict';

    var draw_frequency = 1000 / 60,
        time_since_last_draw = 0;

    var RenderSystem = {
        draw: function (canvas, scene) {
            var c = canvas.getContext('2d'),
            i;
            c.clearRect(0, 0, canvas.width, canvas.height);

            for (i = 0; i < scene.entities.length; i += 1) {
                //if the entity has a position, grab it; otherwise set to origin
                //trigger a draw event with the position and context
                scene.entities[i].draw({
                    position: scene.entities[i].position,
                    context: c
                });
            }
        },
        update: function(dt, g) {
            time_since_last_draw += dt;
            if (time_since_last_draw >= draw_frequency) {
                this.draw(g.canvas, g.scene);
                time_since_last_draw = 0;
            }
        }
    };

    alien.Entity.default_properties.position = new alien.Math.Vector();

    alien.Entity.default_properties.renderables = [];

    alien.Entity.prototype.draw = function(props) {
        for (var ren in this.renderables) {
            this.renderables[ren].draw(props);
        }
    };

    return RenderSystem;

}());