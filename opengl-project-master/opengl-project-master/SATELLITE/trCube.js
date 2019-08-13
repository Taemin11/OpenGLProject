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
		
    var vertexData = [
		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//3
        0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//1
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//2
				
		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//3
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//2
		-0.5, 0.5, -0.5,	1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//4
		 
		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,//2
		0.5, -0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		1.0, 0.0,//6
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
		   
		-0.5, 0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,//2
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
			
		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//5
		0.5, -0.5, -0.5,	1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//6
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//2

		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//5
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//2
		0.5, 0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//1
				 
		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		-0.5,-0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5, 0.5, 0.5,		1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//3
		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		0.0, 0.0,//7
		0.5, -0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 0.0,//5
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 1.0,//1
				 
		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		0.0, 0.0,//7
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 1.0,//1
		-0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		0.0, 1.0,//3
		
		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//6
		 0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//5
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5,-0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//8
		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//6
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//7
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
			void main(void) \
			{ \
				gl_FragColor = 1.0 * color;\
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
            uniform mediump float th; \
			uniform mediump mat4 Pmatrix; \
			uniform mediump mat4 Vmatrix; \
			uniform mediump mat4 Mmatrix; \
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
                if (gl_Position.w != 0.0) \
                    gl_Position.x = (gl_Position.x/gl_Position.w + sin(th))*gl_Position.w; \
                else \
                    gl_Position.x += 1.0;\
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
			
var proj_matrix = get_projection(30, 1.0, 1, 10.0);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
// translating z

view_matrix[14] = view_matrix[14]-5;//zoom

function idMatrix(m) {
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0; 
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0; 
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0; 
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1; 
}

function mulStoreMatrix(r, m, k) {
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

    r[0]=a0; r[1]=a1; r[2]=a2; r[3]=a3; r[4]=a4; r[5]=a5; r[6]=a6; r[7]=a7;
    r[8]=a8; r[9]=a9; r[10]=a10; r[11]=a11; r[12]=a12; r[13]=a13; r[14]=a14; r[15]=a15;
}

function mulMatrix(m,k)
{
	mulStoreMatrix(m,m,k);
}

function translate(m, tx,ty,tz) {
   var tm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
   tm[12] = tx; tm[13] = ty; tm[14] = tz; 
   mulMatrix(m, tm); 
}

function scale(m, sx, sy, sz) {
    var tm = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    mulMatrix(m, tm);
}


function rotateX(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[5] = c;  rm[6] = s; 
	rm[9] = -s;  rm[10] = c;
	mulMatrix(m, rm); 
}

function rotateY(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[2] = -s;
	rm[8] = s;  rm[10] = c; 
	mulMatrix(m, rm); 
}

function rotateZ(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[1] = s;
	rm[4] = -s;  rm[5] = c; 
	mulMatrix(m, rm); 
}

function normalizeVec3(v)
{
	sq = v[0]*v[0] + v[1]*v[1] + v[2]*v[2]; 
	sq = Math.sqrt(sq);
	if (sq < 0.000001 ) // Too Small
		return -1; 
	v[0] /= sq; v[1] /= sq; v[2] /= sq; 
}

function rotateArbAxis(m, angle, axis)
{
	var axis_rot = [0,0,0];
	var ux, uy, uz;
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
	var c1 = 1.0 - c; 
    var s = Math.sin(angle);
	axis_rot[0] = axis[0]; 
	axis_rot[1] = axis[1]; 
	axis_rot[2] = axis[2]; 
	if (normalizeVec3(axis_rot) == -1 )
		return -1; 
	ux = axis_rot[0]; uy = axis_rot[1]; uz = axis_rot[2];
	console.log("Log", angle);
	rm[0] = c + ux * ux * c1;
	rm[1] = uy * ux * c1 + uz * s;
	rm[2] = uz * ux * c1 - uy * s;
	rm[3] = 0;

	rm[4] = ux * uy * c1 - uz * s;
	rm[5] = c + uy * uy * c1;
	rm[6] = uz * uy * c1 + ux * s;
	rm[7] = 0;

	rm[8] = ux * uz * c1 + uy * s;
	rm[9] = uy * uz * c1 - ux * s;
	rm[10] = c + uz * uz * c1;
	rm[11] = 0;

	rm[12] = 0;
	rm[13] = 0;
	rm[14] = 0;
	rm[15] = 1;

	mulMatrix(m, rm);
}

rotValue = 0.0;
rotValueALL = 0.0;
rotValuemoon1 = -0.1;
rotValuemoon2 = 0.1;
rotValuemoon3 = -0.05;
rotValuemoon4 = 0.05;
rotValuemoon5 = 0.15;
rotValuemoon6 = -0.15;
rotValuemoon7 = 0.025;
rotValuemoon8 = -0.025;

animRotValue = 0.0;
animRotValueALL = 0.0;
animRotValuemoon1 = 0.0;
animRotValuemoon2 = 0.0;
animRotValuemoon3 = 0.0;
animRotValuemoon4 = 0.0;
animRotValuemoon5 = 0.0;
animRotValuemoon6 = 0.0;
animRotValuemoon7 = 0.0;
animRotValuemoon8 = 0.0;

transX = 0.0;
transY = 0.0;
transZ = 0.0;

transXmoon1 = 0.75;
transXmoon2 = -0.75;
transXmoon3 = 0.75;
transXmoon4 = -0.75;
transXmoon5 = 0.75;
transXmoon6 = -0.75;
transXmoon7 = 0.75;
transXmoon8 = -0.75;

transYmoon1 = 0.75;
transYmoon2 = 0.75;
transYmoon3 = -0.75;
transYmoon4 = -0.75;
transYmoon5 = 0.75;
transYmoon6 = 0.75;
transYmoon7 = -0.75;
transYmoon8 = -0.75;

transZmoon1 = 0.75;
transZmoon2 = 0.75;
transZmoon3 = 0.75;
transZmoon4 = 0.75;
transZmoon5 = -0.75;
transZmoon6 = -0.75;
transZmoon7 = -0.75;
transZmoon8 = -0.75;

frames = 1;

function animRotateALL() {
    animRotValueALL += 0.01;
}


function animRotate()
{
	animRotValue += 0.01;
}

function animRotatemoon1() {
    animRotValuemoon1 += 0.01;
}

function animRotatemoon2() {
    animRotValuemoon2 += 0.01;
}

function animRotatemoon3() {
    animRotValuemoon3 += 0.01;
}

function animRotatemoon4() {
    animRotValuemoon4 += 0.01;
}

function animRotatemoon5() {
    animRotValuemoon5 += 0.01;
}

function animRotatemoon6() {
    animRotValuemoon6 += 0.01;
}

function animRotatemoon7() {
    animRotValuemoon7 += 0.01;
}

function animRotatemoon8() {
    animRotValuemoon8 += 0.01;
}


function animPause()
{
    animRotValue = 0.0;
    animRotValueALL = 0.0;
    animRotValuemoon1 = 0.0;
    animRotValuemoon2 = 0.0;
    animRotValuemoon3 = 0.0;
    animRotValuemoon4 = 0.0;
    animRotValuemoon5 = 0.0;
    animRotValuemoon6 = 0.0;
    animRotValuemoon7 = 0.0;
    animRotValuemoon8 = 0.0;
}

//trans inc
//x
function trXinc()
{
	transX += 0.01;
	document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function trXincmoon1() {
    transXmoon1 += 0.01;
    document.getElementById("webTrXm1").innerHTML = "transXmoon1 : " + transX.toFixed(4);
}

function trXincmoon2() {
    transXmoon2 += 0.01;
    document.getElementById("webTrXm2").innerHTML = "transXmoon2 : " + transX.toFixed(4);
}

function trXincmoon3() {
    transXmoon3 += 0.01;
    document.getElementById("webTrXm3").innerHTML = "transXmoon3 : " + transX.toFixed(4);
}

function trXincmoon4() {
    transXmoon4 += 0.01;
    document.getElementById("webTrXm4").innerHTML = "transXmoon4 : " + transX.toFixed(4);
}

function trXincmoon5() {
    transXmoon5 += 0.01;
    document.getElementById("webTrXm5").innerHTML = "transXmoon5 : " + transX.toFixed(4);
}

function trXincmoon6() {
    transXmoon6 += 0.01;
    document.getElementById("webTrXm6").innerHTML = "transXmoon6 : " + transX.toFixed(4);
}

function trXincmoon7() {
    transXmoon7 += 0.01;
    document.getElementById("webTrXm7").innerHTML = "transXmoon7 : " + transX.toFixed(4);
}

function trXincmoon8() {
    transXmoon8 += 0.01;
    document.getElementById("webTrXm8").innerHTML = "transXmoon8 : " + transX.toFixed(4);
}

//y
function trYinc() {
    transY += 0.01;
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
}

function trYincmoon1() {
    transYmoon1 += 0.01;
    document.getElementById("webTrYm1").innerHTML = "transYmoon1 : " + transY.toFixed(4);
}

function trYincmoon2() {
    transYmoon2 += 0.01;
    document.getElementById("webTrYm2").innerHTML = "transYmoon2 : " + transY.toFixed(4);
}

function trYincmoon3() {
    transYmoon3 += 0.01;
    document.getElementById("webTrYm3").innerHTML = "transYmoon3 : " + transY.toFixed(4);
}

function trYincmoon4() {
    transYmoon4 += 0.01;
    document.getElementById("webTrYm4").innerHTML = "transYmoon4 : " + transY.toFixed(4);
}

function trYincmoon5() {
    transYmoon5 += 0.01;
    document.getElementById("webTrYm5").innerHTML = "transYmoon5 : " + transY.toFixed(4);
}

function trYincmoon6() {
    transYmoon6 += 0.01;
    document.getElementById("webTrYm6").innerHTML = "transYmoon6 : " + transY.toFixed(4);
}

function trYincmoon7() {
    transYmoon7 += 0.01;
    document.getElementById("webTrYm7").innerHTML = "transYmoon7 : " + transY.toFixed(4);
}

function trYincmoon8() {
    transYmoon8 += 0.01;
    document.getElementById("webTrYm8").innerHTML = "transYmoon8 : " + transY.toFixed(4);
}
//z
function trZinc() {
    transZ += 0.01;
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
}

function trZincmoon1() {
    transZmoon1 += 0.01;
    document.getElementById("webTrZm1").innerHTML = "transZmoon1 : " + transZ.toFixed(4);
}

function trZincmoon2() {
    transZmoon2 += 0.01;
    document.getElementById("webTrZm2").innerHTML = "transZmoon2 : " + transZ.toFixed(4);
}

function trZincmoon3() {
    transZmoon3 += 0.01;
    document.getElementById("webTrZm3").innerHTML = "transZmoon3 : " + transZ.toFixed(4);
}

function trZincmoon4() {
    transZmoon4 += 0.01;
    document.getElementById("webTrZm4").innerHTML = "transZmoon4 : " + transZ.toFixed(4);
}

function trZincmoon5() {
    transZmoon5 += 0.01;
    document.getElementById("webTrZm5").innerHTML = "transZmoon5 : " + transZ.toFixed(4);
}

function trZincmoon6() {
    transZmoon6 += 0.01;
    document.getElementById("webTrZm6").innerHTML = "transZmoon6 : " + transZ.toFixed(4);
}

function trZincmoon7() {
    transZmoon7 += 0.01;
    document.getElementById("webTrZm7").innerHTML = "transZmoon7 : " + transZ.toFixed(4);
}

function trZincmoon8() {
    transZmoon8 += 0.01;
    document.getElementById("webTrZm8").innerHTML = "transZmoon8 : " + transZ.toFixed(4);
}

//trans dec
//x


function tdec() {
    transX -= 0.01;
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function trXdecmoon1() {
    transXmoon1 -= 0.01;
    document.getElementById("webTrXm1").innerHTML = "transXmoon1 : " + transX.toFixed(4);
}

function trXdecmoon2() {
    transXmoon2 -= 0.01;
    document.getElementById("webTrXm2").innerHTML = "transXmoon2 : " + transX.toFixed(4);
}

function trXdecmoon3() {
    transXmoon3 -= 0.01;
    document.getElementById("webTrXm3").innerHTML = "transXmoon3 : " + transX.toFixed(4);
}

function trXdecmoon4() {
    transXmoon4 -= 0.01;
    document.getElementById("webTrXm4").innerHTML = "transXmoon4 : " + transX.toFixed(4);
}

function trXdecmoon5() {
    transXmoon5 -= 0.01;
    document.getElementById("webTrXm5").innerHTML = "transXmoon5 : " + transX.toFixed(4);
}

function trXdecmoon6() {
    transXmoon6 -= 0.01;
    document.getElementById("webTrXm6").innerHTML = "transXmoon6 : " + transX.toFixed(4);
}

function trXdecmoon7() {
    transXmoon7 -= 0.01;
    document.getElementById("webTrXm7").innerHTML = "transXmoon7 : " + transX.toFixed(4);
}

function trXdecmoon8() {
    transXmoon8 -= 0.01;
    document.getElementById("webTrXm8").innerHTML = "transXmoon8 : " + transX.toFixed(4);
}

//y


function trYdec() {
    transY -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transY : " + transY.toFixed(4);
}

function trYdecmoon1() {
    transYmoon1 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon1 : " + transY.toFixed(4);
}

function trYdecmoon2() {
    transYmoon2 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon2 : " + transY.toFixed(4);
}

function trYdecmoon3() {
    transYmoon3 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon3 : " + transY.toFixed(4);
}

function trYdecmoon4() {
    transYmoon4 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon4 : " + transY.toFixed(4);
}

function trYdecmoon5() {
    transYmoon5 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon5 : " + transY.toFixed(4);
}

function trYdecmoon6() {
    transYmoon6 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon6 : " + transY.toFixed(4);
}

function trYdecmoon7() {
    transYmoon7 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon7 : " + transY.toFixed(4);
}

function trYdecmoon8() {
    transYmoon8 -= 0.01;
    document.getElementById("webTrYm").innerHTML = "transYmoon8 : " + transY.toFixed(4);
}

//z


function trZdec() {
    transZ -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZ : " + transZ.toFixed(4);
}

function trZdecmoon1() {
    transZmoon1 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon1 : " + transZ.toFixed(4);
}

function trZdecmoon2() {
    transZmoon2 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon2 : " + transZ.toFixed(4);
}

function trZdecmoon3() {
    transZmoon3 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon3 : " + transZ.toFixed(4);
}

function trZdecmoon4() {
    transZmoon4 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon4 : " + transZ.toFixed(4);
}

function trZdecmoon5() {
    transZmoon5 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon5 : " + transZ.toFixed(4);
}

function trZdecmoon6() {
    transZmoon6 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon6 : " + transZ.toFixed(4);
}

function trZdecmoon7() {
    transZmoon7 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon7 : " + transZ.toFixed(4);
}

function trZdecmoon8() {
    transZmoon8 -= 0.01;
    document.getElementById("webTrZm").innerHTML = "transZmoon8 : " + transZ.toFixed(4);
}

function renderScene() {

    //console.log("Frame "+frames+"\n");
    frames += 1 ;
	rotAxis = [1,1,0];

    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
    var locTH = gl.getUniformLocation(gl.programObject, "th");
    
    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniform1f(locTH, rotValue);



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
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL); 
	// gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.blendEquation(gl.FUNC_ADD);

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    idMatrix(mov_matrix);
    translate(mov_matrix, transX, transY, transZ);
    rotateArbAxis(mov_matrix, rotValue + rotValueALL, rotAxis);

    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    var mov_matrix_child = mov_matrix.slice();
    //1
    translate(mov_matrix, transXmoon1, transYmoon1, transZmoon1);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateY(mov_matrix, rotValuemoon1 + 5*rotValueALL)
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //2
    translate(mov_matrix, transXmoon2, transYmoon2, transZmoon2);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateX(mov_matrix, rotValuemoon2 + 4 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //3
    translate(mov_matrix, transXmoon3, transYmoon3, transZmoon3);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateZ(mov_matrix, rotValuemoon3 + 3 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //4
    translate(mov_matrix, transXmoon4, transYmoon4, transZmoon4);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateX(mov_matrix, rotValuemoon4 + 2 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //5
    translate(mov_matrix, transXmoon5, transYmoon5, transZmoon5);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateY(mov_matrix, -rotValuemoon5 - 2 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //6
    translate(mov_matrix, transXmoon6, transYmoon6, transZmoon6);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateZ(mov_matrix, -rotValuemoon6 - 3 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //7
    translate(mov_matrix, transXmoon7, transYmoon7, transZmoon7);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateX(mov_matrix, -rotValuemoon7 - 4 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    mov_matrix = mov_matrix_child.slice();
    //8
    translate(mov_matrix, transXmoon8, transYmoon8, transZmoon8);
    scale(mov_matrix, 0.25, 0.25, 0.25);
    rotateY(mov_matrix, -rotValuemoon8 - 5 * rotValueALL);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);


    rotValue += animRotValue;
    rotValueALL += animRotValueALL;
    rotValuemoon1 += animRotValuemoon1;
    rotValuemoon2 += animRotValuemoon2;
    rotValuemoon3 += animRotValuemoon3;
    rotValuemoon4 += animRotValuemoon4;
    rotValuemoon5 += animRotValuemoon5;
    rotValuemoon6 += animRotValuemoon6;
    rotValuemoon7 += animRotValuemoon7;
    rotValuemoon8 += animRotValuemoon8;



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
			    window.setTimeout(callback, 10, 10); };
    })();

    (function renderLoop(param) {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
