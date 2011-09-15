<?php

/*
 * Recursively loop through the originals folder and recompile each image into the photos folder.
 */

ini_set('memory_limit', '1200M');

define(MAX_WIDTH, 2048);
define(MAX_HEIGHT, 1080);

function optimisePicture($input, $output) {
	if (false !== ($image = @imagecreatefromjpeg($input))) {
		$h = $originalHeight = imagesy($image);
		$w = $originalWidth = imagesx($image);
		$ratio = $h / $w;
		if ($w > MAX_WIDTH) {
			$w = MAX_WIDTH;
			$h = $ratio * $w;
		}
		if ($h > MAX_HEIGHT) {
			$h = MAX_HEIGHT;
			$w = $h / $ratio;
		}
		$newImage = imagecreatetruecolor($w, $h);
		imagecopyresampled($newImage, $image, 0, 0, 0, 0, $w, $h, $originalWidth, $originalHeight);
		imagejpeg($newImage, $output, 85);
		chmod($output, 0777);
	} else {
		echo "We ran into a bit of strife processing $input\n";
	}
}

function readDirectory($path, $outputPath) {
	$files = array();
	$directoryHandle = opendir($path);
	while (false !== ($filename = readdir($directoryHandle))) {
		if (substr($filename, 0, 1) != '.') {
			if (is_dir($path . '/' . $filename)) {
				mkdir($outputPath . '/' . $filename, 0777);
				readDirectory($path . '/' . $filename, $outputPath . '/' . $filename);
			} else {
				// Make sure the file extension is jpg
				if (strtolower(substr($filename, -4)) == '.jpg') {
					optimisePicture($path . '/' . $filename, $outputPath . '/' . $filename);
				}
			}
		}
	}
}

$directoryHandle = opendir('photos');
while (false !== ($filename = readdir($directoryHandle))) {
	if (substr($filename, 0, 1) != '.') {
		echo 'Cannot generate photos because the photos folder is not empty.';
		exit;
	}
}

readDirectory('originals', 'photos');

