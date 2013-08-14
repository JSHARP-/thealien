var alien = alien || {};

alien.Render = function() {
	var init = false;
	var canvas;
	var entities = [];
	var canvas_dims = {};
	function draw() {
		var c = canvas.getContext('2d');
		c.clearRect(0, 0, canvas_dims.x, canvas_dims.y);
		for (entity in entities) {
			var e = entities[entity].components.all();
			c.fillStyle = e['renderable'].poly.color;
			c.beginPath();
			c.moveTo(e['position'].x + e['renderable'].poly.points[0].x, e['position'].y + e['renderable'].poly.points[0].y);
			for (var i = 1; i < e['renderable'].poly.points.length; i+=1) {
				c.lineTo(e['position'].x + e['renderable'].poly.points[i].x, e['position'].y + e['renderable'].poly.points[i].y);
			}
			c.closePath();
			c.fill();
		}
	}
	return {
		entities: function() {
			return {
				add: function(entity) {
					if (!init) {
						return false;
					}

					if (entity.components.has('renderable') &&
						entity.components.has('position')) {
						var index = entities.push(entity);
						return index;
					} else {
						return false;
					}
				},
				remove: function(index) {
					if (init && index in entities) {
						//completely remove (for memory saving reasons)
						entities.splice(index,1);
						return true;
					} else {
						return false;
					}
				}
			};
		}(),
		canvas: function() {
			if (!init) {
				return false;
			} else {
				return canvas;
			}
		},
		init: function(c) {
			init = true;
			canvas = c;
			canvas_dims = {
				x: canvas.width,
				y: canvas.height
			};
			return init;
		},
		update: function(dt) {
			if (!init) {
				return false;
			}
			draw();
		}
	}
}();

var PositionFactory = function(options) {
	options = options || {};
	options.componentname = "position";
	options.x = options.x || 50;
	options.y = options.y || 50;
	options.z = options.z || 0;
	return options;
}

var RenderableFactory = function(options) {
	options = options || {};
	options.componentname = "renderable";
	options.poly = options.poly || null;
	options.visible = options.visible || true;
	options.z = options.z || 0;
	return options;
}

var PolygonFactory = function(options) {
	options = options || {};
	options.componentname = "polygon";
	options.points = options.points || [];
	if (!options.points.length) {
		if (options.shape === "rect") {
			options.width = options.width || 50;
			options.height = options.height || 50;

			//build PolygonFactory properties
			options.points = [
			{
				x: -options.width / 2,
				y: -options.height / 2
			},
			{
				x: options.width / 2,
				y: -options.height / 2
			},
			{
				x: options.width / 2,
				y: options.height / 2
			},
			{
				x: -options.width / 2,
				y: options.height / 2
			}
			];
		}
	}
	options.color = options.color || "rgba(0,0,0,1)";
	return options;
}