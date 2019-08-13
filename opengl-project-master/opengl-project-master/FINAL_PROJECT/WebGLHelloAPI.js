"(CC-NC-BY) 하태민 2019"
var gl;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
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

/**************************************************
********************** mode ***********************
***************************************************/

//modePLT
var modePLTName = ["Triangle", "Point", "Line"];

var modePLT = 0;
function changeModePLT() {
    modePLT++;
    modePLT %= 3;
    console.log("modePLT =" + modePLT);
    document.getElementById("idPLT").innerHTML = modePLTName[modePLT];
}

//modeTxr 
var modeTxrName = ["Default", "Texture"];

var modeTxr = 0;
function changeModeTxr() {
    modeTxr++;
    modeTxr %= 3;
    console.log("ModeTxr =" + modeTxr);
    document.getElementById("idTxr").innerHTML = modeTxrName[modeTxr];
}

var rot_z = 0.0;

var shaderProgram;


/**************************************************
**********************texture**********************
***************************************************/
var texture;
function createTexture() {

    // Create a texture.
    texture = gl.createTexture();
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });
}

/**************************************************
*********************** moon **********************
***************************************************/

var modeMoon = 0;
function createMoon() {
    if (modeMoon <= 8) {
        modeMoon++;
        console.log("Modemoon =" + modeTxr);
    }
}

var modeatt = 0;
function initialiseBuffer() {
	
	
    if (modeTxr == 1)
        createTexture()



    var vertexData = [
            -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0,//3
            0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0,//1
            0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0,//2

            -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0,//3
            0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0,//2
            -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0,//4

            0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0,//2
            0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 0.0,//6
            -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0,//8

            -0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 1.0,//4
            0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0,//2
            -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0,//8

            0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0,//5
            0.5, -0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0,//6
            0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0,//2

            0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0,//5
            0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0,//2
            0.5, 0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0,//1

            -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0,//4
            -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0,//8
            -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0,//7

            -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0,//3
            -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0,//4
            -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0,//7

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0,//7
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 1.0, 0.0,//5
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 1.0, 1.0,//1

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0,//7
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 1.0, 1.0,//1
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0,//3

             0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0,//6
             0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0,//5
            -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0,//7

            -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0,//8
             0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0,//6
            -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0,//7
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
			
var proj_matrix = get_projection(30, 1.0, 1, 20);
var mov_matrix = create$3();
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
// translating z
view_matrix[14] = view_matrix[14]-5;//zoom

//function idMatrix(m) {
function create$3() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
}

function clone$3(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

function copy$3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

function identity$3(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}


function translate$2(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
}

function scale$3(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
}


function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
}

function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];

    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
}
//transformation value set
rotValue = 0.0; 
animRotValue = 0.0;


transX = 0.0;
transY = 0.0;
transZ = 0.0;
scaleValue = 1.0;
scaleValueBT = 1.0;




grpmode = 1;
frames = 1;


//translate

function trXinc() {
    transX = 0.01;
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
    grpmode = 1;
}

function trYinc() {
    transY = 0.01;
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
    grpmode = 1;
}

function trZinc() {
    transZ = 0.01;
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
    grpmode = 1;
}

function trXdec() {
    transX = -0.01;
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
    grpmode = 1;
}


function trYdec() {
    transY = -0.01;
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
    grpmode = 1;
grpmode = 1;}

function trZdec() {
    transZ = -0.01;
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
    grpmode = 1;
}

function pauseTranslate() {
    transX = 0;
    transY = 0;
    transZ = 0;
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
    grpmode = 1;
}

//rotate

function Rotateinc() {
    rotValue = 0.01;
    document.getElementById("webRt").innerHTML = "Rotate Value : " + rotValue.toFixed(4);
    grpmode = 1;
}

function Rotatedec() {
    rotValue = 0.01;
    document.getElementById("webRt").innerHTML = "Rotate Value : " + rotValue.toFixed(4);
    grpmode = 1;
}

function AnimRoate() {
    animRotValue += 0.01;

}

function pauseRotate() {
    rotValue = 0.0;
    document.getElementById("webRt").innerHTML = "Rotate Value : " + rotValue.toFixed(4);
    grpmode = 1;
}



//scale

function scinc() {
    scaleValue += 0.01;
    document.getElementById("webSc").innerHTML = "Scale Value : " + scaleValue.toFixed(4);
    grpmode = 1;
}

function scdec() {
    scaleValue -= 0.01;
    document.getElementById("webSc").innerHTML = "Scale Value : " + scaleValue.toFixed(4);
    grpmode = 1;
}

function scBTinc() {
    scaleValueBT += 0.01;
    document.getElementById("webScBT").innerHTML = "Scale Value Before Translate : " + scaleValueBT.toFixed(4);
    grpmode = 1;
}

function scBTdec() {
    scaleValueBT -= 0.01;
    document.getElementById("webScBT").innerHTML = "Scale Value Before Translate : " + scaleValueBT.toFixed(4);
    grpmode = 1;
}

function pauseScale() {
    scaleValue = 1;
    scaleValueBT = 1;
    document.getElementById("webScBT").innerHTML = "Scale Value Before Translate : " + scaleValueBT.toFixed(4);
    document.getElementById("webScBT").innerHTML = "Scale Value Before Translate : " + scaleValueBT.toFixed(4);
    grpmode = 1;
}



function PLTMODE(modePLT){
    if (modePLT == 0)
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    else if (modePLT == 1)
        gl.drawArrays(gl.POINTS, 0, 36);
    else
        gl.drawArrays(gl.LINES, 0, 36);
}

/*
function MOON(mov_matrix) {
    var mov_matrix_child = mov_matrix.slice();
    scale(mov_matrix, 0.25, 0.25, 0.25);
    translate(mov_matrix, moonx, moony, moonz);
    rotateX(mov_matrix, rotValue);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    PLTMODE(modePLT);
}
*/

/**************************************************
******************* renderScene *******************
***************************************************/

function renderScene() {
    SetT = [transX, transY, transZ]
    SetSV = [scaleValue, scaleValue, scaleValue]
    SetSVBT = [scaleValueBT, scaleValueBT, scaleValueBT]

    moonx = 2;
    moony = 2;
    moonz = 2;

    SetTm = [moonx, moony, moonz]
    SetSVm = [scaleValue, scaleValue, scaleValue]
    SetSVBTm = [scaleValueBT, scaleValueBT, scaleValueBT]

    //console.log("Frame "+frames+"\n");
    frames += 1 ;

    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
    var locTH = gl.getUniformLocation(gl.programObject, "th");

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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendEquation(gl.FUNC_ADD);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   
    
    if (grpmode == 1) {
        scale$3(mov_matrix, clone$3(mov_matrix), SetSVBT);
        translate$2(mov_matrix, clone$3(mov_matrix), SetT);
        scale$3(mov_matrix, clone$3(mov_matrix), SetSV);
        rotateZ(mov_matrix, clone$3(mov_matrix), rotValue);
        rotateX(mov_matrix, clone$3(mov_matrix), rotValue);
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    }
    rotateZ(mov_matrix, clone$3(mov_matrix), animRotValue);
    rotateX(mov_matrix, clone$3(mov_matrix), animRotValue);
    PLTMODE(modePLT);
    
    /*
	if (modeMoon >= 1) {
	    var mov_matrix_child = mov_matrix.slice();
	    scale$3(mov_matrix, clone$3(mov_matrix), SetSVBTm);
	    translate$2(mov_matrix, clone$3(mov_matrix), SetTm);
	    scale$3(mov_matrix, clone$3(mov_matrix), SetSVm);
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	    
	}
	if (modeMoon >= 2) {
	    mov_matrix = mov_matrix_child.slice();
	    scale$3(mov_matrix, clone$3(mov_matrix), SetSVBT);
	    translate$2(mov_matrix, clone$3(mov_matrix), SetT);
	    scale$3(mov_matrix, clone$3(mov_matrix), SetSV);
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 3) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx, moony * (-1), moonz);
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 4) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx * (-1), moony * (-1), moonz);
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 5) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx, moony, moonz * (-1));
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 6) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx * (-1), moony, moonz * (-1));
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 7) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx, moony * (-1), moonz * (-1));
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	if (modeMoon >= 8) {
	    mov_matrix = mov_matrix_child.slice();
	    scale(mov_matrix, 0.25, 0.25, 0.25);
	    translate(mov_matrix, moonx * (-1), moony * (-1), moonz * (-1));
	    rotateX(mov_matrix, rotValue);
	    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
	    PLTMODE(modePLT);
	}
	*/
    

	
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
    grpmode = 0;
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
