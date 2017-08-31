// MNIST digits
var MNIST = [];

// size of the sample images (28 x 28)
var size = 28;

// raw data
var raw = [
  require('./digits/0.json').data,
  require('./digits/1.json').data,
  require('./digits/2.json').data,
  require('./digits/3.json').data,
  require('./digits/4.json').data,
  require('./digits/5.json').data,
  require('./digits/6.json').data,
  require('./digits/7.json').data,
  require('./digits/8.json').data,
  require('./digits/9.json').data
];

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (id) {
  // mnist digit
  var digit = {
    id: id
  };

  // raw data
  digit.raw = raw[digit.id];

  // number of samples
  digit.length = digit.raw.length / (size * size) | 0;

  // get one sample
  digit.get = function (_which) {
    var which = _which;
    // if not specified, or if invalid, pick a random sample
    if ('undefined' == typeof which || which > digit.length || which < 0) {
      which = Math.random() * digit.length | 0;
    }

    // generate sample
    var sample = [];
    for (
      var length = size * size,
      start = which * length,
      i = 0;
      i < length;
      sample.push(digit.raw[start + i++])
    );
    return sample;
  }

  // get a range of samples
  digit.range = function (start, end) {
    if (start < 0)
      start = 0;
    if (end >= digit.length)
      end = digit.length - 1;
    if (start > end) {
      var tmp = start;
      start = end;
      end = tmp;
    }
    var range = [];
    for (
      var i = start;
      i <= end;
      range.push(digit.get(i++))
    );
    return range;
  }

  // get set of digits, ready to be used for training or testing
  digit.set = function (start, end) {
    var set = [];
    var output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    output[digit.id] = 1;
    var range = digit.range(start, end);
    for (
      var i = 0;
      i < range.length;
      set.push({
        input: range[i++],
        output: output
      })
    );
    return set;
  }

  // add mnist digit
  MNIST.push(digit);
});

// Generates non-overlaping training and a test sets, with the desired ammount of samples
MNIST.get = function (count) {
  var range = [];
  for (var i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    range = range.concat(this[i].set(0, this[i].length));
  }
  range = shuffle(range);
  if (Number(count)) {
    range = range.slice(0, Number(count));
  }
  return range;
}


// Generates non-overlaping training and a test sets, with the desired ammount of samples
MNIST.set = function (_training, _test) {
  var training = _training / 10 | 0;
  var test = _test / 10 | 0;

  if (training < 1)
    training = 1;
  if (test < 1)
    test = 1;

  // check that there are enough samples to make the sets, and change the ammounts if they are too big
  if (training + test + 1 > MNIST.__MINLENGTH) {
    console.warn('There are not enough samples to make a training set of ' + training + ' elements and a test set of ' + test + ' elements.');
    if (training > test) {
      test = MNIST.__MINLENGTH * (test / training);
      training = MNIST.__MINLENGTH - training;
    }
    else {
      training = MNIST.__MINLENGTH * (training / test);
      test = MNIST.__MINLENGTH - test;
    }
  }

  // make both sets
  var trainingSet = [];
  var testSet = [];

  for (var i = 0; i < 10; i++) {
    trainingSet = trainingSet.concat(MNIST[i].set(0, training - 1));
    testSet = testSet.concat(MNIST[i].set(training, training + test - 1));
  }

  // return the sets, shuffled
  return {
    training: shuffle(trainingSet),
    test: shuffle(testSet)
  }
}

// draws a given digit in a canvas context
MNIST.draw = function (digit, context, offsetX, offsetY) {
  var imageData = context.getImageData(offsetX || 0, offsetY || 0, size, size);
  for (var i = 0; i < digit.length; i++) {
    imageData.data[i * 4] = digit[i] * 255;
    imageData.data[i * 4 + 1] = digit[i] * 255;
    imageData.data[i * 4 + 2] = digit[i] * 255;
    imageData.data[i * 4 + 3] = 255;
  }
  context.putImageData(imageData, offsetX || 0, offsetY || 0);
}

// takes an array of 10 digits representing a number from 0 to 9 (ie. any output in a dataset) and returns the actual number
MNIST.toNumber = function (array) {
  return array.indexOf(Math.max.apply(Math, array));
}

// CommonJS & AMD
if (typeof define !== 'undefined' && define.amd) {
  define([], function () { return MNIST });
}

// Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MNIST;
}

// Browser
if (typeof window == 'object') {
  (function () {
    var old = window['mnist'];
    MNIST.ninja = function () {
      window['mnist'] = old;
      return MNIST;
    };
  })();

  window['mnist'] = MNIST;
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

function shuffle(v) {
  for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
};
