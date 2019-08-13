// JavaScript source code
function idmatrix(m) {
    m = [1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
    ]
    return m
}

function mulMatrix(m, k) {
    var multiM = [];
    for (var i = 0; i <= 12; i = i + 4) {
        for (var j = 0; j < 4; j++) {
            multiM[i + j] = m[j] * k[i] + m[j + 4] * k[i + 1] + m[j + 8] * k[i + 2] + m[j + 12] * k[i + 3]
        }
    }

    for (var l = 0; l < 16; l++) {
        m[l] = multiM[l]
    }
    return m
}

function mulStoreMatrix(m, k, r) {

    for (var i = 0; i <= 12; i = i + 4) {
        for (var j = 0; j < 4; j++) {
            r[i + j] = m[j] * k[i] + m[j + 4] * k[i + 1] + m[j + 8] * k[i + 2] + m[j + 12] * k[i + 3]
        }
    }
    return r
}

function mulMatrixVec(rv, m, v) {
    for (var i = 0; i < 4; i++) {
        rv[i] = m[i] * v[0] + m[i + 4] * v[1] + m[i + 8] * v[2] + m[i + 12] * v[3]
    }
    return rv
}

