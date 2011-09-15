/*! Full screen image slideshow for the These Days 10 year party */
/*global THESE_DAYS_10_YEAR_PHOTOS */
(function() {
	var SCALE_SMALL_IMAGES_UP = true,
		DURATION_PER_PHOTO = 5 * 1000,
		slideshow, fileselect;

	slideshow = function(photos) {
		var container = document.createElement('div'),
			len = photos.length,
			currentImage,
			showNextImage;

		showNextImage = function(index) {
			var nextImage, nextImageImg, transitionComplete, imageLoaded;

			if (index >= len) {
				index = 0;
			}
			console.log('Loading ' + photos[index]);

			imageLoaded = function(e) {
				var h, w, t, l, ratio;
				nextImageImg.removeEventListener('load', imageLoaded, false);
				// Scale and position the image
				ratio = nextImageImg.height / nextImageImg.width;
				w = (!SCALE_SMALL_IMAGES_UP && nextImageImg.width < window.innerWidth) ? nextImageImg.width : window.innerWidth;
				h = w * ratio;
				if (h > window.innerHeight) {
					h = window.innerHeight;
					w = h / ratio;
				}
				t = (window.innerHeight - h) / 2;
				l = (window.innerWidth - w) / 2;
				nextImageImg.style.width  = w.toString() + 'px';
				nextImageImg.style.height = h.toString() + 'px';
				nextImageImg.style.top    = t.toString() + 'px';
				nextImageImg.style.left   = l.toString() + 'px';
				nextImage.style.opacity = '1';
			};

			transitionComplete = function() {
				if (currentImage) {
					container.removeChild(currentImage);
				}
				nextImage.style.zIndex = '10';
				currentImage = null;
				currentImage = nextImage;
				nextImage = null;

				setTimeout(function() {
					showNextImage(index + 1);
				}, DURATION_PER_PHOTO);
			};

			// Create a DIV holder for the image (with a black background)
			nextImage = document.createElement('div');
			nextImage.style.opacity = '0';
			nextImage.style.zIndex = '20';
			setTimeout(transitionComplete, 2000);

			// Create the image itself
			nextImageImg = document.createElement('img');
			nextImageImg.src = photos[index];
			nextImageImg.addEventListener('load', imageLoaded, false);
			nextImage.appendChild(nextImageImg);
			container.appendChild(nextImage);
		};

		container.id = 'slideshow';
		document.body.appendChild(container);
		showNextImage(0);
	};

	fileselect = (function() {
		var dropZone, init, handleDragEnter, handleDragOver, handleDragLeave, handleFileSelect;

		handleFileSelect = function(e) {
			var i, f, output = [], files = e.dataTransfer.files;

			e.stopPropagation();
			e.preventDefault();
			document.body.removeChild(dropZone);

			for (i = 0; !!(f = files[i]); i += 1) {
				if (f.name.substr(0, 1) !== '.' && (f.name.substr(-4, 4) === '.jpg' || f.name.substr(-4, 4) === '.JPG')) {
					output.push('photos/' + f.name);
				}
			}
			slideshow(output);
		};

		handleDragEnter = function(e) {
			dropZone.className = 'drophover';
		};

		handleDragOver = function(e) {
			e.stopPropagation();
			e.preventDefault();
		};

		handleDragLeave = function(e) {
			dropZone.className = '';
		};

		init = function() {
			dropZone = document.createElement('div');
			dropZone.id = 'drop_zone';
			dropZone.innerHTML = '<div>Chuck ya photos in the `photos` folder and drag & drop em in here.</div>';
			document.body.appendChild(dropZone);
			dropZone.addEventListener('dragenter', handleDragEnter, false);
			dropZone.addEventListener('dragover', handleDragOver, false);
			dropZone.addEventListener('dragleave', handleDragLeave, false);
			dropZone.addEventListener('drop', handleFileSelect, false);
		};

		return {
			init: init
		};
	}());

	if (typeof THESE_DAYS_10_YEAR_PHOTOS !== 'undefined') {
		slideshow(THESE_DAYS_10_YEAR_PHOTOS);
	} else {
		fileselect.init();
	}

}());

