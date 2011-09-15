A locally running slideshow for the These Days 10 Year party

# Running the slideshow
To run the slideshow, open `index.html`.
The slideshow will read an array of photo filenames from `js/photos.js`.

# Preparing the slideshow
You can run `make-photos-js.php` with PHP to generate the `js/photos.js` file from all the photo files in the `photos` directory.
If your images are a bit large, you can run `optimize-photos.php` with PHP. It will read all the images from the `originals` directory and save them into the `photos` directory at a lower resolution.

