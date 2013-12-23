var composition = {stanzas: 5, lines: 4, count: 7},
    $input = $('#input'),
    $out = $('#output'),
    $dump = $('<div id="dump"/>').appendTo('body'),
    log = function(k, v){console.log(k+':',v);},
    dump = function(obj){$dump.append(JSON.stringify(obj,null,'\t'));};
 
var getScore = function(string, markup){
  var score = 0, words = string.split(' '), scoredWords = [], out = '';
  $.each(words, function(k,v){
    if (lex.isInArr(lex.meta.top, 'word', v) && scoredWords.indexOf(v) == -1) {
      scoredWords.push(v);
      score++;// += lex.list[v].count;
      //v += '<sup>'+lex.list[v].count+'</sup>';
      out += '<span class="hilight">'+v+'</span> ';
    } else {
      out += v + ' ';
    }
  });
  //score = (score / lex.cfg.topCount).toFixed(2);
  return markup ? out + '<br/>' + score : score;
};
var getBestScore = function(lines, wordsPerLine, scoreMin){
  var temp = {txt: '', score:0}, best = {txt:'', score:0};
  for(k=0; k<lex.cfg.bestScoreMaxTries; k++) {
    temp.txt = generateLines(lines, wordsPerLine);
    temp.score = getScore(temp.txt);
    if (temp.score > best.score) {
      best.score = temp.score; best.txt = temp.txt;
    }
  }
  return getScore(best.txt, true)+' / '+k+' tries / '+ best.txt.length+' chars';
};
var generateLines = function(newlineMax, wordsPerLine) {
  var i = 0,
      ii = newlineMax * wordsPerLine,
      //timer = new Date(),
      lineCount = 0,
      newline = 0,
      exclude = 'BR',
      item = lex.getWeightedRandom(lex.list, exclude), //lex.list.BR,
      output = '';
  while (newline < newlineMax && i < ii) {
    output += item.word.replace('BR',/*'| '+lineCount+*/'<br/>')+' ';
    if (item.word == 'BR') {
      newline++;
      lineCount = 0;
    }
    if (lineCount < wordsPerLine * 0.75) exclude = 'BR';
    if (lineCount > wordsPerLine) exclude = item.word;
    var nextWord = lex.getWeightedRandom(item.next ? item.next : lex.list, exclude).word;
    item = lex.list[nextWord];
    lineCount++;
    i++;
  }
  //log('time',new Date() - timer);
  //if (i==ii) output += '= '+ii+'<br/>';
  output = util.capitalize(output);
  return output;
};
var buildOutput = function(opt) {
  var out = '';
  for (s=0;s<opt.stanzas;s++){
    // noprotect
    out += '<p>' + (
        lex.cfg.optimize ? 
          (getBestScore(opt.lines, opt.count, lex.cfg.topThreshold)) :
          (generateLines(opt.lines, opt.count))
      ) + '</p>';
  }
  return out;
};
var printOutput = function(arr) {
  var out = '';
  arr = lex.sortArr(arr);
  $.each(arr, function(k,v){
    out += '<p>'+getScore(v, true)+'</p>';
  });
  return out;
};
var getAjax = function(){ 
  $.ajax({
    url: 'http://twndr.com:5000',
    data: {count: 100, geocode: '37.22,-80.42,15mi', lang: 'en'},
    dataType: 'jsonp',
    success: function(data){
      $.each(data.statuses,function(k,v){
        //console.log(v.text);
        lex.build(v.text);
      });
    }
  });
};

$(document).ready(function(){

  util.buildControls($('#configs'), composition, function(composition){
    $out.html(buildOutput(composition));
  });

  $refresh = $('<button/>').html('Refresh').appendTo('#configs'),
  $refresh.click(function(){
    $out.html(buildOutput(composition));
  });

  $input.bind('input propertychange', function(e){
    lex.build($(this).val(), function(lex){
      log('meta', lex.meta);
      dump(lex.meta.top.map(function(v){return v.word+' '+v.count;}));
      $refresh.click();
    });
  });

  $.get('christmas-songs.txt', function(data) {
    $input.text(data).trigger('input');
  });
    
});   


