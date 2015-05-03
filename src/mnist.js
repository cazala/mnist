// MNIST digits
var MNIST = {
    raw: [
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
    ]
};

// CommonJS & AMD
if (typeof define !== 'undefined' && define.amd)
{
  define([], function(){ return MNIST });
}

// Node.js
if (typeof module !== 'undefined' && module.exports)
{
  module.exports = MNIST;
}

// Browser
if (typeof window == 'object')
{
  (function(){ 
    var old = window['mnist'];
    MNIST.ninja = function(){ 
      window['mnist'] = old; 
      return MNIST;
    };	
  })();

  window['mnist'] = MNIST;
}