function CustomMarker(latlng, map, tooltip, args) {
	this.latlng = latlng;
	this.args = args;
	this.setMap(map);
	this.tooltip = tooltip;
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
	var self = this;
	var div = this.div;

	if (!div) {

		div = this.div = document.createElement('div');
		var label = document.createElement('div');
		var animation = document.createElement('div');
		animation.className = "animated";
		label.className = "label";
		div.appendChild(label);
		div.appendChild(animation);
		div.className = 'marker';

		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}

		google.maps.event.addDomListener(div, "click", function(event) {
			google.maps.event.trigger(self, "click");

		});

		google.maps.event.addDomListener(div, "mouseover", function(event) {
			google.maps.event.trigger(self, "mouseover");
		});

		google.maps.event.addDomListener(div, 'mouseout', function() {
			google.maps.event.trigger(self, "mouseout");
		});

		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
	}

	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	if (point) {
		div.style.left = point.x + 'px';
		div.style.top = point.y + 'px';
	}
};

CustomMarker.prototype.toggleSelected = function() {
	if ($(this.div).hasClass('marker-selected')) {
		$(this.div).removeClass('marker-selected');
	} else {
		$(this.div).addClass('marker-selected');
	}
}

CustomMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
};

CustomMarker.prototype.getPosition = function() {
	return this.latlng;
};