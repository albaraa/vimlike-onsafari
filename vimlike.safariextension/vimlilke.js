(function(_doc,_win){
var VIMLIKE = {
hintText: '',
mode : 'normal',
interval: 30,
handler: {
  'S-escape' : function(){ VIMLIKE.modechange(); },
  'C-d'  : function(){ VIMLIKE.pagedown(); },
  'C-u'  : function(){ VIMLIKE.pageup(); },
  'j'  : function(){ VIMLIKE.scrolldown(); },
  'k'  : function(){ VIMLIKE.scrollup(); },
  'h'  : function(){ VIMLIKE.scrollleft(); },
  'l'  : function(){ VIMLIKE.scrollright(); },
  'gg' : function(){ VIMLIKE.scrollTop(); },
  'S-g': function(){ VIMLIKE.scrollBottom(); },
  't' : function(){ VIMLIKE.openNewTab(); },
  'u' : function(){ VIMLIKE.reopenTab(); },
  'gt' : function(){ VIMLIKE.nextTab(); },
  'S-k' : function(){ VIMLIKE.nextTab(); },
  'gS-t': function(){ VIMLIKE.previousTab(); },
  'S-j': function(){ VIMLIKE.previousTab(); },
  'd' : function(){ VIMLIKE.closeTab(); },
  'C-w' : function(){ VIMLIKE.closeTab(); },
  'r' : function(){ VIMLIKE.reload(); },
  'f' : function(){ VIMLIKE.hah(true); },
  '/' : function(){ VIMLIKE.hah(true); },
  'S-f' : function(){ VIMLIKE.hah(false); },
  'S-h' : function(){ VIMLIKE.historyBack(); },
  'S-l' : function(){ VIMLIKE.historyForward(); },
  'escape' : function(){ VIMLIKE.blurFocus(); },
  'C-[' : function(){ VIMLIKE.blurFocus(); }
},
formHandler:{
  'escape' : function(){ VIMLIKE.blurFocus(); },
  'C-[': function(){ VIMLIKE.blurFocus(); }
},
firstStroke:{},
keyChoice:[],
keyEvent: function(e){
  if( VIMLIKE.mode == 'hint' ){ return; }
  var t = e.target;
  if( t.nodeType == 1 ){
     var tn = t.tagName.toLowerCase();
     var pressKey = VIMLIKE.kc2char(e.keyCode || e.charCode);
     if( pressKey == 191 ) pressKey = '/'; //I want more good code :(
     if( e.ctrlKey ){ pressKey = 'C-' + pressKey; }
     if( e.shiftKey ){ pressKey = 'S-' + pressKey; }
     if( e.altKey ){ pressKey = 'A-' + pressKey; }
      // prevent false positives when using the Command-key:
     if( e.metaKey ){ pressKey = 'M-' + pressKey; }
     if( pressKey == 'S-shift' ){ //don't use :)
       return;
     }

     if( tn == 'input' || tn == 'textarea' || tn == 'select' ){
        if( typeof VIMLIKE.formHandler[pressKey] == 'function' && VIMLIKE.mode != 'useonline' ){
          e.preventDefault();
          VIMLIKE.formHandler[pressKey].apply();
        }
        return;
     }

     if( VIMLIKE.mode == 'useonline' ){
       if( pressKey == 'S-escape' ){
         VIMLIKE.modechange();
       }
       return;
     }

     VIMLIKE.keyChoice.push(pressKey);
     var keychain = VIMLIKE.keyChoice.join('');

      if( VIMLIKE.firstStroke[pressKey] && typeof VIMLIKE.handler[keychain] != 'function' ){
        e.preventDefault();
        return;
      }

      //check w stroke bind
      if( typeof VIMLIKE.handler[keychain] == 'function' ){
        pressKey = keychain;
      }else{
        if( typeof VIMLIKE.handler[pressKey] != 'function' ){
          VIMLIKE.keyChoice.length = 0; //clear keychoice
          return;
        }
      }
      VIMLIKE.keyChoice.length = 0; //clear keychoice
      e.preventDefault();
      VIMLIKE.handler[pressKey].apply();
  }
},
pagedown: function(){
  scroll(0, _win.pageYOffset + (VIMLIKE.interval*10));
},
pageup: function(){
  scroll(0, _win.pageYOffset - (VIMLIKE.interval*10));
},
scrolldown: function(){
  scroll(0, _win.pageYOffset + VIMLIKE.interval);
},
scrollup: function(){
  scroll(0, _win.pageYOffset - VIMLIKE.interval);
},
scrollTop: function(){
  scroll(0, -_doc.documentElement.scrollHeight)
},
scrollBottom: function(){
  scroll(0, _doc.documentElement.scrollHeight)
},
scrollleft: function(){
  scrollBy(-VIMLIKE.interval, 0);
},
scrollright: function(){
  scrollBy(VIMLIKE.interval, 0);
},
openNewTab: function(){
  safari.self.tab.dispatchMessage('vimlike','open');
},
openBackGround:function(url){
  safari.self.tab.dispatchMessage('vimlike', {background:url});
},
reopenTab: function(){
  safari.self.tab.dispatchMessage('vimlike','reopen');
},
previousTab: function(){
  safari.self.tab.dispatchMessage('vimlike','previous');
},
nextTab: function(){
  safari.self.tab.dispatchMessage('vimlike','next');
},
closeTab: function(){
  safari.self.tab.dispatchMessage('vimlike','close');
},
reload: function(){
  location.reload();
},
hah: function(isCurrent){
    var hintKeys = new String(VIMLIKE.hintText).toUpperCase();
    var xpath = '//a[@href]|//input[not(@type=\x22hidden\x22)]|//textarea|//select|//img[@onclick]|//button';
    var hintColor = '\x23ffff00';
    var hintColorForm = '\x2300ffff';
    var hintColorFocused= '\x23ff00ff';
    var keyMap = {'8': 'Bkspc', '46': 'Delete', '32': 'Space', '13':'Enter', '16': 'Shift', '17': 'Ctrl', '18': 'Alt'};

    var hintKeysLength;
    var hintContainerId = 'hintContainer';
    var hintElements = [];
    var inputKey = '';
    var lastMatchHint = null;
    var k=0;

    function getAbsolutePosition( elem, html, body, inWidth, inHeight ){
      var style = getComputedStyle(elem,null);
      if(style.visibility === 'hidden' || style.opacity === '0' ) return false;
      //var rect = rectFixForOpera( elem, getComputedStyle(elem,null)) || elem.getClientRects()[0];
      var rect = elem.getClientRects()[0];
      if( rect && rect.right - rect.left >=0 && rect.left >= 0 && rect.top >= -5 && rect.bottom <= inHeight + 5 && rect.right <= inWidth ){
        return {
          top: (body.scrollTop || html.scrollTop) - html.clientTop + rect.top,
          left: (body.scrollLeft || html.scrollLeft ) - html.clientLeft + rect.left
        }
      }
      return false;

    }

    function createText(num){
      var text = '';
      var l = hintKeysLength;
      var iter = 0;
      while( num >= 0 ){
        var n = num;
        num -= Math.pow(l, 1 + iter++ );
      }
      for( var i=0; i<iter; i++ ){
        var r = n % l;
        n = Math.floor(n/l);
        text = hintKeys.charAt(r)+text;
      }
      return text;
    }

    function getXPathElements(win){
      function resolv(p){ if (p == 'xhtml') return 'http://www.w3.org/1999/xhtml'; }
      var result = win.document.evaluate(xpath, win.document, resolv, 7, null);
      for (var i = 0, arr = [], len = result.snapshotLength; i < len; i++){
        arr[i] = result.snapshotItem(i);
      }
      return arr;
    }

    function start(win){
      var html = win.document.documentElement;
      var body = win.document.body;
      var inWidth = win.innerWidth;
      var inHeight = win.innerHeight

      var df = _doc.createDocumentFragment();
      var div = df.appendChild(_doc.createElement('div'));
      div.id = hintContainerId;

      var spanStyle = {
        'position' : 'absolute',
        'zIndex' : '214783647',
        'color' : '#000',
        'fontSize' : '10pxt',
        'fontFamily' : 'monospace',
        'lineHeight' : '10pt',
        'padding' : '0px',
        'margin' : '0px',
        'opacity' : '1.0'
      };
      var elems = getXPathElements(win);
      elems.forEach(function(elem){
        var pos = getAbsolutePosition(elem, html, body, inWidth, inHeight );
        if( pos == false ) return;
        var hint = createText(k);
        var span = win.document.createElement('span');
        span.appendChild(_doc.createTextNode(hint));
        var st = span.style;
        for( key in spanStyle ){
          st[key] = spanStyle[key];
        }
        st.backgroundColor = elem.hasAttribute('href') === true ? hintColor : hintColorForm;
        st.left = Math.max(0,pos.left-8) + 'px';
        st.top = Math.max(0,pos.top-8) + 'px';
        hintElements[hint] = span;
        span.element = elem;
        div.appendChild(span);
        k++;
      },this);
      win.document.addEventListener('keydown', handle, true );
      win.document.body.appendChild(df);
    }

    function handle(eve){
      var key = eve.keyCode || eve.charCode;
      if( key in keyMap === false ){
        removeHints();
        return;
      }
      var onkey = keyMap[key];
      switch(onkey){
        case 'Enter':
          if( lastMatchHint.element.type == 'text' ){
            eve.preventDefault();
            eve.stopPropagation();
          }
          if( !isCurrent ){
            if( /https?:\/\//.test(lastMatchHint.element.href) ){
              eve.preventDefault();
              eve.stopPropagation();
              VIMLIKE.openBackGround(lastMatchHint.element.href);
            }
          }
          resetInput();
          removeHints();
        case 'Shift':
        case 'Ctrl':
        case 'Alt' : return;
      }
      eve.preventDefault();
      eve.stopPropagation();
      switch(onkey){
        case 'Bkspc':
        case 'Delete':
          if( !inputKey ){
            removeHints();
            return;
          }
          resetInput();
          return;
        case 'Space':
          removeHints();
          return;
        default:
          inputKey += onkey;
      }
      blurHint();
      if( inputKey in hintElements === false ){
        resetInput();
        inputKey += onkey;
      }
      lastMatchHint = hintElements[inputKey];
      lastMatchHint.style.backgroundColor = hintColorFocused;
      lastMatchHint.element.focus();
    }

    function removeHints(){
      var frame = top.frames;
      if( !_doc.getElementsByTagName('frameset')[0]){
        end(top);
      }
      Array.prototype.forEach.call(frame, function(elem){
        try{
          end(elem);
        }catch(e){ }
      }, this);
    }

    function blurHint(){
      if(lastMatchHint){
        lastMatchHint.style.backgroundColor  = lastMatchHint.element.hasAttribute('href')===true?hintColor:hintColorForm;
      }
    }

    function resetInput(){
      inputKey = '';
      blurHint();
      lastMatchHint = null;
    }

    function end(win){
      var div = win.document.getElementById(hintContainerId);
      win.document.removeEventListener('keydown', handle, true);
      if(div){
        win.document.body.removeChild(div);
      }
      VIMLIKE.mode = 'normal';
    }

    function hahInit(){
      hintKeysLength = hintKeys.length;
      hintKeys.split('').forEach(function(l){ keyMap[l.charCodeAt(0)] = l;  }, this);
    }

    function hahDraw(){
      
      var frame = _win.frames;
      if(!_doc.getElementsByTagName('frameset')[0]){
        start(_win);
      }else{
        Array.prototype.forEach.call(frame, function(elem){
          try{
            start(elem);
          }catch(e){
          }
        },this);
      }
    }

    VIMLIKE.mode = 'hint';
    hahInit();
    hahDraw();
},
historyBack: function(){
    history.back();
},
historyForward: function(){
    history.forward();
},
blurFocus: function(){
  _doc.activeElement.blur();
},
modechange: function(){
  switch(VIMLIKE.mode){
    case 'useonline':
      VIMLIKE.mode = 'normal';
      break;
    case 'normal':
      VIMLIKE.mode = 'useonline';
      break;
    default:
      VIMLIKE.mode = 'normal';
  }
  /*var modeDiv = _doc.getElementById('VIMLIKE_MODE_DIV');*/
  /*if( modeDiv ){*/
  /*modeDiv.innerHTML = VIMLIKE.mode;*/
  /*var fadeOut = function(opa){*/
  /*modeDiv.style.opacity = opa/100;*/
  /*opa -= 10;*/
  /*if( opa < 10 ){*/
  /*modeDiv.style.opacity = 0.0;*/
  /*return;*/
  /*}*/
  /*setTimeout( function(){ fadeOut(opa); },70);*/
  /*}*/
  /*fadeOut(100);*/
  /*}*/
},
kc2char: function(kc){
   function between(a,b){
     return a <= kc && kc <= b;
   }
   var _32_40 = "space pageup pagedown end home left up right down".split(" ");
   var kt = {
     8  : "backspace",
     9  : "tab"  ,
     13 : "enter",
     16 : "shift",
     17 : "control",
     27 : "escape",
     46 : "delete"
   };
   return (between(65,90)  ? String.fromCharCode(kc+32) : // a-z
           between(48,57)  ? String.fromCharCode(kc) :    // 0-9
           between(96,105) ? String.fromCharCode(kc-48) : // num 0-9
           between(32,40)  ? _32_40[kc-32] :
           kt.hasOwnProperty(kc) ? kt[kc] : kc);
},
init: function(){
  for( var key in VIMLIKE.handler){
    if( key.length > 1 && !(/S-|C-|A-|M-|escape/.test(key))){
      VIMLIKE.firstStroke[key[0]] = true;
    }
  }
  /*VIMLIKE.createModeDiv();*/
  safari.self.tab.dispatchMessage('vimlike','load');

},
  /*createModeDiv: function(){*/
  /*var modeDiv = _doc.createElement('div');*/
  /*modeDiv.id = 'VIMLIKE_MODE_DIV';*/
  /*modeDiv.innerHTML = VIMLIKE.mode;*/
  /*modeDiv.addEventListener('mouseover', function(){ this.style.opacity = '1.0'; },false );*/
  /*modeDiv.addEventListener('mouseout', function(){ this.style.opacity = '0.0'; },false );*/
  /*modeDiv.addEventListener('click', function(){ VIMLIKE.modechange(); }, false );*/
  /*_doc.body.appendChild(modeDiv);*/
  /*}*/

}

VIMLIKE.init(); 
_doc.addEventListener( 'keydown', function(e){ VIMLIKE.keyEvent(e); },false);

if( typeof _win.VIMLIKE == "undefined" ){
  _win.VIMLIKE = VIMLIKE;
}

safari.self.addEventListener( 'message', function(e){
  if( e.name === 'hintText' ){
    VIMLIKE.hintText = e.message;
  }
},false );

})(document,window);
