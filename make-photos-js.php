<?php

/*
 * Recursively loop through the photos folder and generate a file called js/photos.js with a list of file paths.
 */

function readDirectory($path) {
	$files = array();
	$directoryHandle = opendir($path);
	while (false !== ($filename = readdir($directoryHandle))) {
		if (substr($filename, 0, 1) != '.') {
			if (is_dir($path . '/' . $filename)) {
				$files = array_merge($files, readDirectory($path . '/' . $filename));
			} else {
				// Make sure the file extension is jpg
				if (strtolower(substr($filename, -4)) == '.jpg') {
					$files[] = $path . '/' . $filename;
				}
			}
		}
	}
	return $files;
}

$files = readDirectory('photos');

chmod('js/photos.js', 0777);
$fp = fopen('js/photos.js', 'w');
fwrite($fp, 'var THESE_DAYS_10_YEAR_PHOTOS = ' . json_encode($files) . ';');
fclose($fp);

