#include "colors.inc"

// Toggle to generate all 16 states.
#declare north = (clock >= 8);
#declare binary1 = mod(clock, 8);
#declare east = (binary1 >= 4);
#declare binary2 = mod(binary1, 4);
#declare south = (binary2 >= 2);
#declare binary3 = mod(binary2, 2);
#declare west = binary3;

#declare seed1 = seed(north * 1 + east * 2 + south * 4 + west * 8);

// Camera's angle (zoom) to keep everything in view.
#declare camera_angle = 30;

// How far back is the camera, drags the lights along with it.
#declare camera_back = 50;

#declare colour1 = color rgb <1, 1, 1>; // modules
#declare colour2 = color rgb <0.8, 0.8, 0.85>; // tunnels
#declare colour3 = color rgb <0.7, 0.7, 0.75>; // boxes

#declare hex1 = 4;
#declare hex2 = 1;

#if (north)
	// North
	cylinder { // module
	  <0, 0, 0>, <0, 11, 0>, 5
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	cylinder { // tunnel
	  <0, 0, 0>, <0, 20, 0>, 3
	  texture {pigment { colour2 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	text {
	  ttf "cyrvetic.ttf" str(rand(seed1)*100, -2, 0) .5, 0
	  pigment { Black }
	  scale 2
	  translate -1*x
	  translate -0.7*y
	  translate -5*z
	  rotate 90*z
	  translate 8*y
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, 12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, 12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <0, 60, 0>
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, 12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <0, -60, 0>
	}
#end
#if (east)
	// East
	cylinder { // module
	  <0, 0, 0>, <11, 0, 0>, 5
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	cylinder { // tunnel
	  <0, 0, 0>, <20, 0, 0>, 3
	  texture {pigment { colour2 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	text {
	  ttf "cyrvetic.ttf" str(rand(seed1)*100, -2, 0) .5, 0
	  pigment { Black }
	  scale 2
	  translate -1*x
	  translate -0.7*y
	  translate -5*z
	  rotate 0*z
	  translate 8*x
	}
	box {
	  <0, -hex1, -hex2>, <12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	box {
	  <0, -hex1, -hex2>, <12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <60, 0, 0>
	}
	box {
	  <0, -hex1, -hex2>, <12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <-60, 0, 0>
	}
#end
#if (south)
	// South
	cylinder { // module
	  <0, 0, 0>, <0, -11, 0>, 5
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	cylinder { // tunnel
	  <0, 0, 0>, <0, -20, 0>, 3
	  texture {pigment { colour2 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	text {
	  ttf "cyrvetic.ttf" str(rand(seed1)*100, -2, 0) .5, 0
	  pigment { Black }
	  scale 2
	  translate -1*x
	  translate -0.7*y
	  translate -5*z
	  rotate -90*z
	  translate -8*y
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, -12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, -12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <0, 60, 0>
	}
	box {
	  <-hex1, 0, -hex2>, <hex1, -12, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <0, -60, 0>
	}
#end
#if (west)
	// West
	cylinder { // module
	  <0, 0, 0>, <-11, 0, 0>, 5
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	cylinder { // tunnel
	  <0, 0, 0>, <-20, 0, 0>, 3
	  texture {pigment { colour2 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	text {
	  ttf "cyrvetic.ttf" str(rand(seed1)*100, -2, 0) .5, 0
	  pigment { Black }
	  scale 2
	  translate -1*x
	  translate -.7*y
	  translate -5*z
	  rotate 180*z
	  translate -8*x
	}
	box {
	  <0, -hex1, -hex2>, <-12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	}
	box {
	  <0, -hex1, -hex2>, <-12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <60, 0, 0>
	}
	box {
	  <0, -hex1, -hex2>, <-12, hex1, hex2>
	  texture {pigment { colour3 }}
	  normal { wrinkles 0.2 scale .1 }
	  rotate <-60, 0, 0>
	}
#end

#declare paths = north + east + south + west;
#if (paths = 1)
    // Dead end.
	sphere {
	  <0, 0, 0>, 8
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
#else
  #if (paths != 0)
	sphere {
	  <0, 0, 0>, 5
	  texture {pigment { colour1 }}
	  normal { wrinkles 0.2 scale .1 }
	}
  #end
#end

// Look from slightly below.
camera {
  orthographic
  location <0, -camera_back/5, -camera_back>
  look_at  <0, 0, 0>
  angle camera_angle
  right .58  // Aspect ratio
}

// Sunlight.
light_source {
  <-camera_back/2, -camera_back/2, -camera_back*2>
  color White
  parallel
  point_at <0,0,0>
}

