var vertexShaderText =
[
"precision mediump float;",
"",
"attribute vec2 vertPosition;",
"",
"void main()",
"{",
"   gl_Position = vec4(vertPosition, 0.0, 1.0);",
"}",
].join("\n");

var fragmentShaderText =
[
"precision mediump float;",
"",
"uniform vec4 outColor;",
"void main()",
"{",
"   gl_FragColor = outColor;",
"}",
].join("\n");

var InitDemo = function() {
    console.log("InitDemo");

    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        alert("Your browser does not support WebGL");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Создание шейдеров
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Установка исходного кода шейдеров
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    // Компиляция шейдеров
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Проверка на ошибки компиляции
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Создание программы
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // Проверка на ошибки линковки
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(program));
        return;
    }

    // Проверка на ошибки валидации
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    
// x=0 #центр полигона (x)
// y=0 #центр полигона (y)
// n=5   #число сторон полигона
// r=0.5  #радиус окружности в которую вписываем полигон
// #получаем координаты вершин

    var x = 0.0;
    var y = 0.0;
    var r = 0.5;
    var n = 5;

    var phi = 180; //угол отклонения одного из отрезков

    coords=[];
    for(var i = 1; i < 6; i++){

        var xCoord = x + r * Math.cos(phi + 2 * Math.PI * i / n);
        var yCoord = y + r * Math.sin(phi + 2 * Math.PI * i / n);
        coords.push(xCoord);
        coords.push(yCoord);
    }
    console.log(coords);

    var triangleVertices = coords;

    // Передаём данные о вершинах в буфер видеокарты
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    //Переводим данные в Float32Array из Float64Array
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    gl.vertexAttribPointer(
        positionAttribLocation, // Атрибут
        2, // Количество элементов на одну вершину
        gl.FLOAT, // Тип данных
        gl.FALSE, // Нормализовать ли данные
        2 * Float32Array.BYTES_PER_ELEMENT, // Размер одной вершины
        0 // Смещение от начала одной вершины до первого элемента
    );

    gl.enableVertexAttribArray(positionAttribLocation);

    // Основной цикл
    gl.useProgram(program);

    const uniformHandle = gl.getUniformLocation(program, "outColor");
    gl.uniform4fv(uniformHandle, [1.0, 0.0, 1.0, 1.0]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
};