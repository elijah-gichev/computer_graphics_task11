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

    var triangleVertices =
    [ // X, Y
    0.0,  0.5,  
    -0.5,  -0.4,  
    -0.2,  -0.5,  
    0.2,  -0.5,  
    0.5,  -0.4,  
    ];

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