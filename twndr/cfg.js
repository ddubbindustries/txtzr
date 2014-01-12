var cfg = {
  sets: 1,
  lines: 1,
  minWords: 15,
  maxWords: 25,
  maxChars: 135,
  maxTries: 500,
  maxTime: 2000,
  lineEnd: '',
  topCount: 15,
  stats: false,
  optimize: true,
  
  maxChunks: 2000,
  //timeStart: 'Tue Aug 13 22:24:22 +0000 2013',
  //timeEnd: 'Fri Aug 16 13:18:44 +0000 2013',
  stream: true,
  streamInterval: 30
};

if (typeof exports !== 'undefined') exports.cfg = cfg;

