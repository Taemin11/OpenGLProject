var gl;

function testGLError(functionLastCalled) {

    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

function initialiseGL(canvas) {
    try {
 // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}

var shaderProgram;

function initialiseBuffer() {
	// Create a texture.
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
	new Uint8Array([0, 0, 255, 255]));
	// Asynchronously load an image
	var image = new Image();
	image.src = "data:image/png;base64,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"
	image.addEventListener('load', function () {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		});
		
    var vertexData = [
		-0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,//3
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0,  1.0, 1.0,//1
		0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,//2
				
		-0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,//3
		0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,//2
		-0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,//4
		 //상
		 
		-0.5,-0.5,-0.5, 0.0, 0.0, 0.0, 1.0,0.0, 0.0,//8
		0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 1.0,1.0, 0.0,//6
		0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,//2
		   
		-0.5,-0.5,-0.5, 0.0, 0.0, 0.0, 1.0,0.0, 0.0,//8
		0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,//2
		-0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 1.0,0.0, 1.0,//4
		//옆1
			
		0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 1.0,0.0, 1.0,//5
		0.5, -0.5, -0.5, 1.0, 0.5, 0.0, 1.0,0.0, 1.0,//6
		0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 1.0, 1.0, 1.0,//2

		0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 1.0,0.0, 1.0,//5
		0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 1.0, 1.0, 1.0,//2
		0.5, 0.5, 0.5, 1.0, 0.5, 0.0, 1.0, 1.0, 1.0,//1
		//옆2
				 
		-0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,0.0, 0.0,//7
		-0.5,-0.5, -0.5, 1.0, 0.0, 0.0, 1.0,0.0, 0.0,//8
		-0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,//4
		
		-0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,0.0, 0.0,//7
		-0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0,0.0, 1.0,//4
		-0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,0.0, 1.0,//3
		//옆3
		
		-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,0.0, 0.0,//7
		0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,1.0, 0.0,//5
		0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,//1
				 
		-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,0.0, 0.0,//7
		0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,//1
		-0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0,0.0, 1.0,//3
		//옆4		
		
		-0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0,0.0, 0.0,//7
		 0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0,1.0, 0.0,//5
		 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,1.0, 0.0,//6
		
		-0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0,0.0, 0.0,//7
		 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,1.0, 0.0,//6
		-0.5,-0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,//8
		//하

    ];

	
	
    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();

    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d; \
			void main(void) \
			{ \
				gl_FragColor = 0.5 * color + 0.5 * texture2D(sampler2d, texCoord); \
			}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myUV; \
			uniform mediump mat4 Pmatrix; \
			uniform mediump mat4 Vmatrix; \
			uniform mediump mat4 Mmatrix; \
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
				color = myColor;\
				texCoord = myUV; \
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
	gl.bindAttribLocation(gl.programObject, 2, "myUV");

    // Link the program
    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

// FOV, Aspect Ratio, Near, Far 
function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
    	0.5/ang, 0 , 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax+zMin)/(zMax-zMin), -1,
        0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 ];
}
			
var proj_matrix = get_projection(30, 1.0, 1, 5);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
// translating z
view_matrix[14] = view_matrix[14]-2;//zoom

function idMatrix(m) {
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0; 
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0; 
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0; 
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1; 
}

function mulMatrix(m, k) {
    m0=m[0];m1=m[1];m2=m[2];m3=m[3];m4=m[4];m5=m[5];m6=m[6];m7=m[7];
    m8=m[8];m9=m[9];m10=m[10];m11=m[11];m12=m[12];m13=m[13];m14=m[14];m15=m[15];
    k0=k[0];k1=k[1];k2=k[2];k3=k[3];k4=k[4];k5=k[5];k6=k[6];k7=k[7];
    k8=k[8];k9=k[9];k10=k[10];k11=k[11];k12=k[12];k13=k[13];k14=k[14];k15=k[15];

    a0 = k0 * m0 + k3 * m12 + k1 * m4 + k2 * m8;
    a4 = k4 * m0 + k7 * m12 + k5 * m4 + k6 * m8 ;
    a8 = k8 * m0 + k11 * m12 + k9 * m4 + k10 * m8 ;
    a12 = k12 * m0 + k15 * m12 + k13 * m4 + k14 * m8;

    a1 = k0 * m1 + k3 * m13 + k1 * m5 + k2 * m9;
    a5 = k4 * m1 + k7 * m13 + k5 * m5 + k6 * m9;
    a9 = k8 * m1 + k11 * m13 + k9 * m5 + k10 * m9;
    a13 = k12 * m1 + k15 * m13 + k13 * m5 + k14 * m9;

    a2 = k2 * m10 + k3 * m14 + k0 * m2 + k1 * m6;
    a6 =  k6 * m10 + k7 * m14 + k4 * m2 + k5 * m6;
    a10 =  k10 * m10 + k11 * m14 + k8 * m2 + k9 * m6;
    a14 = k14 * m10 + k15 * m14 + k12 * m2 + k13 * m6; 

    a3 = k2 * m11 + k3 * m15 + k0 * m3 + k1 * m7;
    a7 = k6 * m11 + k7 * m15 + k4 * m3 + k5 * m7;
    a11 = k10 * m11 + k11 * m15 + k8 * m3 + k9 * m7;
    a15 = k14 * m11 + k15 * m15 + k12 * m3 + k13 * m7;

    m[0]=a0; m[1]=a1; m[2]=a2; m[3]=a3; m[4]=a4; m[5]=a5; m[6]=a6; m[7]=a7;
    m[8]=a8; m[9]=a9; m[10]=a10; m[11]=a11; m[12]=a12; m[13]=a13; m[14]=a14; m[15]=a15;
}

function translate(m, tx,ty,tz) {
   var tm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
   tm[12] = tx; tm[13] = ty; tm[14] = tz; 
   mulMatrix(m, tm); 
}

function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];
    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
}

function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];
				
    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
}

function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];
				
    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
}

rotValue = 0.0; 
animRotValue = 0.0;
transX = 0.0;
frames = 1;

function animRotate()
{
	animRotValue += 0.01;
}

function trXinc()
{
	transX += 0.01;
	document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function renderScene() {

    //console.log("Frame "+frames+"\n");
    frames += 1 ;

    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
	
    idMatrix(mov_matrix); 
    rotateZ(mov_matrix, rotValue);
	rotateX(mov_matrix, rotValue);
    rotValue += animRotValue; 
    translate(mov_matrix, transX, 0.0, 0.0); 
    //transX += 0.01; 

    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
	gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);


    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); 

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLES, 0, 36);
    document.getElementById("matrix0").innerHTML = mov_matrix[0].toFixed(4);
	document.getElementById("matrix1").innerHTML = mov_matrix[1].toFixed(4);
	document.getElementById("matrix2").innerHTML = mov_matrix[2].toFixed(4);
	document.getElementById("matrix3").innerHTML = mov_matrix[3].toFixed(4);
	document.getElementById("matrix4").innerHTML = mov_matrix[4].toFixed(4);
	document.getElementById("matrix5").innerHTML = mov_matrix[5].toFixed(4);
	document.getElementById("matrix6").innerHTML = mov_matrix[6].toFixed(4);
	document.getElementById("matrix7").innerHTML = mov_matrix[7].toFixed(4);
	document.getElementById("matrix8").innerHTML = mov_matrix[8].toFixed(4);
	document.getElementById("matrix9").innerHTML = mov_matrix[9].toFixed(4);
	document.getElementById("matrix10").innerHTML = mov_matrix[10].toFixed(4);
	document.getElementById("matrix11").innerHTML = mov_matrix[11].toFixed(4);
	document.getElementById("matrix12").innerHTML = mov_matrix[12].toFixed(4);
	document.getElementById("matrix13").innerHTML = mov_matrix[13].toFixed(4);
	document.getElementById("matrix14").innerHTML = mov_matrix[14].toFixed(4);
	document.getElementById("matrix15").innerHTML = mov_matrix[15].toFixed(4);
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");
    console.log("Start");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (
	function () {
        //	return window.requestAnimationFrame || window.webkitRequestAnimationFrame 
	//	|| window.mozRequestAnimationFrame || 
	   	return function (callback) {
			    // console.log("Callback is"+callback); 
			    window.setTimeout(callback, 100, 10); };
    })();

    (function renderLoop(param) {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
