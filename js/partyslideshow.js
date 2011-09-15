/*! Full screen image slideshow for the These Days 10 year party */
/*global THESE_DAYS_10_YEAR_PHOTOS */
(function() {
	var SCALE_SMALL_IMAGES_UP = true,
		DURATION_PER_PHOTO = 5 * 1000,
		RANDOMIZE_ORDER = true,
		slideshow, fileselect;

	slideshow = function(photos) {
		var container = document.createElement('div'),
			len = photos.length,
			positionImage,
			currentImage,
			currentIndex = 0,
			nextImage,
			showNextImage,
			showImageNow,
			timeoutTransitionComplete, timeoutShowNextImage;

		if (RANDOMIZE_ORDER) {
			photos.sort(function() { return 0.5 - Math.random(); });
		}

		// Scale and center an image
		positionImage = function(img) {
			var h, w, t, l, ratio;
			ratio = img.height / img.width;
			w = (!SCALE_SMALL_IMAGES_UP && img.width < window.innerWidth) ? img.width : window.innerWidth;
			h = w * ratio;
			if (h > window.innerHeight) {
				h = window.innerHeight;
				w = h / ratio;
			}
			t = (window.innerHeight - h) / 2;
			l = (window.innerWidth - w) / 2;
			img.style.width  = w.toString() + 'px';
			img.style.height = h.toString() + 'px';
			img.style.top    = t.toString() + 'px';
			img.style.left   = l.toString() + 'px';
		};

		// Show the next image
		showNextImage = function() {
			var nextImageImg, transitionComplete, imageLoaded;
			timeoutShowNextImage = null;
			currentIndex += 1;
			if (currentIndex >= len) {
				currentIndex = 0;
			}
			console.log('Loading ' + photos[currentIndex]);

			imageLoaded = function(e) {
				nextImageImg.removeEventListener('load', imageLoaded, false);
				positionImage(nextImageImg);
				nextImage.style.opacity = '1';
			};

			transitionComplete = function() {
				timeoutTransitionComplete = null;
				if (currentImage) {
					container.removeChild(currentImage);
				}
				nextImage.style.zIndex = '10';
				currentImage = null;
				currentImage = nextImage;
				nextImage = null;

				timeoutShowNextImage = setTimeout(showNextImage, DURATION_PER_PHOTO);
			};

			// Create a DIV holder for the image (with a black background)
			nextImage = document.createElement('div');
			nextImage.style.opacity = '0';
			nextImage.style.zIndex = '20';
			timeoutTransitionComplete = setTimeout(transitionComplete, 2000);

			// Create the image itself
			nextImageImg = document.createElement('img');
			nextImageImg.addEventListener('load', imageLoaded, false);
			nextImageImg.src = photos[currentIndex];
			nextImage.appendChild(nextImageImg);
			container.appendChild(nextImage);
		};

		// Show an image right now without a transition
		showImageNow = function() {
			var nextImageImg, imageLoaded;
			console.log('Going straight to ' + photos[currentIndex]);

			if (timeoutTransitionComplete) {
				clearTimeout(timeoutTransitionComplete);
				timeoutTransitionComplete = null;
			}
			if (timeoutShowNextImage) {
				clearTimeout(timeoutShowNextImage);
				timeoutShowNextImage = null;
			}

			imageLoaded = function(e) {
				nextImageImg.removeEventListener('load', imageLoaded, false);
				positionImage(nextImageImg);
				nextImageImg.style.visibility = 'visible';
				timeoutShowNextImage = setTimeout(showNextImage, DURATION_PER_PHOTO);
			};

			nextImageImg = document.createElement('img');
			nextImageImg.addEventListener('load', imageLoaded, false);
			nextImageImg.style.visibility = 'hidden';
			nextImageImg.src = photos[currentIndex];
			if (nextImage) {
				container.removeChild(nextImage);
				nextImage = null;
			}
			currentImage.removeChild(currentImage.firstChild);
			currentImage.appendChild(nextImageImg);
		};

		document.addEventListener('keyup', function(e) {
			//console.log(e);
			if (!currentImage) {
				return;
			}
			if (e.keyCode === 37) {
				// Left arrow key
				currentIndex -= 1;
				if (currentIndex < 0) {
					currentIndex = photos.length - 1;
				}
				showImageNow();
			} else if (e.keyCode === 39) {
				// Right arrow key
				currentIndex += 1;
				if (currentIndex >= photos.length) {
					currentIndex = 0;
				}
				showImageNow();
			}
		}, false);

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

