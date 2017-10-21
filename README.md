# Mandlebrot Set renderer in JS

This was originally written in ActionScript for my blog, but since those days are long gone, I finally ported it to JS.

## Blog Entry

http://beej.us/blog/data/mandelbrot-set/

## Build

This uses Browserify, so debugging is best with a browser that supports
source maps. If not, use a debug build (which runs through Browserify
and Babel, but not Uglify), and make the best of it.

    $ npm install gulp -g
	$ npm install
	$ gulp       # debug build, or...
    $ gulp dist  # distribution build

Builds go in `build/{dist,debug}`.

## TODO

* Minify CSS
* Watchify