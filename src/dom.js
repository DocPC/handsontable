/**
 * DOM helper optimized for maximum performance
 * It is recommended for Handsontable plugins and renderers, because it is much faster than jQuery
 * @type {Object}
 */
if(!window.Handsontable) {
  var Handsontable = {}; //required because Walkontable test suite uses this class directly
}
Handsontable.Dom = {};

//https://gist.github.com/p0rsche/2763377
Handsontable.Dom.class2type = {};

Handsontable.Dom.type = function( obj ) {
  return obj == null ?
    String( obj ) :
  Handsontable.Dom.class2type[ Object.prototype.toString.call(this,obj) ] || "object";
};

Handsontable.Dom.isWindow = function( obj ) {
  return obj != null && obj == obj.window;
};

Handsontable.Dom.isFunction = function(target){
  return toString.call(target) === "[object Function]";
};

Handsontable.Dom.isArray =  Array.isArray || function( obj ) {
    return Handsontable.Dom.type(obj) === "array";
  };

Handsontable.Dom.isPlainObject = function( obj ) {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if ( !obj || Handsontable.Dom.type(obj) !== "object" || obj.nodeType || Handsontable.Dom.isWindow( obj ) ) {
    return false;
  }

  try {
    // Not own constructor property must be Object
    if ( obj.constructor &&
      !Handsontable.Dom.class2type.hasOwnProperty.call(obj, "constructor") &&
      !Handsontable.Dom.class2type.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
      return false;
    }
  } catch ( e ) {
    // IE8,9 Will throw exceptions on certain host objects #9897
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.

  var key;
  for ( key in obj ) {}

  return key === undefined || Handsontable.Dom.class2type.hasOwnProperty.call( obj, key );
};

Handsontable.Dom.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !Handsontable.Dom.isFunction(target) ) {
    target = {};
  }

  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( Handsontable.Dom.isPlainObject(copy) || (copyIsArray = Handsontable.Dom.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Handsontable.Dom.isArray(src) ? src : [];

          } else {
            clone = src && Handsontable.Dom.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = Handsontable.Dom.extend( deep, clone, copy );

          // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }
  // Return the modified object
  return target;
};

//Handsontable.Dom.isPlainObject = function (obj) {
//  return obj!=null && typeof(obj)=="object" && Object.getPrototypeOf(obj)==Object.prototype;
//};
//
//Handsontable.Dom.isFunction = function (target) {
//  return toString.call(target) === "[object Function]";
//};
//
//
//Handsontable.Dom.extend = function () {
//  var options, name, src, copy, copyIsArray, clone,
//    target = arguments[0] || {},
//    i = 1,
//    length = arguments.length,
//    deep = false;
//
//  // Handle a deep copy situation
//  if ( typeof target === "boolean" ) {
//    deep = target;
//    target = arguments[1] || {};
//    // skip the boolean and the target
//    i = 2;
//  }
//
//  // Handle case when target is a string or something (possible in deep copy)
//  if ( typeof target !== "object" && !Handsontable.Dom.isFunction(target) ) {
//    target = {};
//  }
//
//  if ( length === i ) {
//    target = this;
//    --i;
//  }
//
//  for ( ; i < length; i++ ) {
//    // Only deal with non-null/undefined values
//    if ( (options = arguments[ i ]) != null ) {
//      // Extend the base object
//      for ( name in options ) {
//        src = target[ name ];
//        copy = options[ name ];
//
//        // Prevent never-ending loop
//        if ( target === copy ) {
//          continue;
//        }
//
//        // Recurse if we're merging plain objects or arrays
//        if ( deep && copy && (Handsontable.Dom.isPlainObject(copy) || (copyIsArray = (typeof(copy) ===  "array") ) ) ) {
//          if ( copyIsArray ) {
//            copyIsArray = false;
//            clone = src && typeof(src) === "array" ? src : [];
//
//          } else {
//            clone = src && Handsontable.Dom.isPlainObject(src) ? src : {};
//          }
//
//          // Never move original objects, clone them
//          target[ name ] = Handsontable.Dom.extend( deep, clone, copy );
//
//          // Don't bring in undefined values
//        } else if ( copy !== undefined ) {
//          target[ name ] = copy;
//        }
//      }
//    }
//  }
//  // Return the modified object
//  return target;
//};

//goes up the DOM tree (including given element) until it finds an element that matches the nodeName
Handsontable.Dom.closest = function (elem, nodeNames, until) {
  while (elem != null && elem !== until) {
    if (elem.nodeType === 1 && nodeNames.indexOf(elem.nodeName) > -1) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return null;
};

//goes up the DOM tree and checks if element is child of another element
Handsontable.Dom.isChildOf = function (child, parent) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

/**
 * Counts index of element within its parent
 * WARNING: for performance reasons, assumes there are only element nodes (no text nodes). This is true for Walkotnable
 * Otherwise would need to check for nodeType or use previousElementSibling
 * @see http://jsperf.com/sibling-index/10
 * @param {Element} elem
 * @return {Number}
 */
Handsontable.Dom.index = function (elem) {
  var i = 0;
  if (elem.previousSibling) {
    while (elem = elem.previousSibling) {
      ++i
    }
  }
  return i;
};

if (document.documentElement.classList) {
  // HTML5 classList API
  Handsontable.Dom.hasClass = function (ele, cls) {
    return ele.classList.contains(cls);
  };

  Handsontable.Dom.addClass = function (ele, cls) {
    if (cls) {
      ele.classList.add(cls);
    }
  };

  Handsontable.Dom.removeClass = function (ele, cls) {
    ele.classList.remove(cls);
  };
}
else {
  //http://snipplr.com/view/3561/addclass-removeclass-hasclass/
  Handsontable.Dom.hasClass = function (ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  Handsontable.Dom.addClass = function (ele, cls) {
    if(ele.className == "") ele.className = cls;
    else if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  };

  Handsontable.Dom.removeClass = function (ele, cls) {
    if (this.hasClass(ele, cls)) { //is this really needed?
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ').trim(); //String.prototype.trim is defined in polyfill.js
    }
  };
}

/*//http://net.tutsplus.com/tutorials/javascript-ajax/javascript-from-null-cross-browser-event-binding/
 Handsontable.Dom.addEvent = (function () {
 var that = this;
 if (document.addEventListener) {
 return function (elem, type, cb) {
 if ((elem && !elem.length) || elem === window) {
 elem.addEventListener(type, cb, false);
 }
 else if (elem && elem.length) {
 var len = elem.length;
 for (var i = 0; i < len; i++) {
 that.addEvent(elem[i], type, cb);
 }
 }
 };
 }
 else {
 return function (elem, type, cb) {
 if ((elem && !elem.length) || elem === window) {
 elem.attachEvent('on' + type, function () {

 //normalize
 //http://stackoverflow.com/questions/4643249/cross-browser-event-object-normalization
 var e = window['event'];
 e.target = e.srcElement;
 //e.offsetX = e.layerX;
 //e.offsetY = e.layerY;
 e.relatedTarget = e.relatedTarget || e.type == 'mouseover' ? e.fromElement : e.toElement;
 if (e.target.nodeType === 3) e.target = e.target.parentNode; //Safari bug

 return cb.call(elem, e)
 });
 }
 else if (elem.length) {
 var len = elem.length;
 for (var i = 0; i < len; i++) {
 that.addEvent(elem[i], type, cb);
 }
 }
 };
 }
 })();

 Handsontable.Dom.triggerEvent = function (element, eventName, target) {
 var event;
 if (document.createEvent) {
 event = document.createEvent("MouseEvents");
 event.initEvent(eventName, true, true);
 } else {
 event = document.createEventObject();
 event.eventType = eventName;
 }

 event.eventName = eventName;
 event.target = target;

 if (document.createEvent) {
 target.dispatchEvent(event);
 } else {
 target.fireEvent("on" + event.eventType, event);
 }
 };*/

Handsontable.Dom.removeTextNodes = function (elem, parent) {
  if (elem.nodeType === 3) {
    parent.removeChild(elem); //bye text nodes!
  }
  else if (['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR'].indexOf(elem.nodeName) > -1) {
    var childs = elem.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
      this.removeTextNodes(childs[i], elem);
    }
  }
};

/**
 * Remove childs function
 * WARNING - this doesn't unload events and data attached by jQuery
 * http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/9
 * http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/11 - no siginificant improvement with Chrome remove() method
 * @param element
 * @returns {void}
 */
//
Handsontable.Dom.empty = function (element) {
  var child;
  while (child = element.lastChild) {
    element.removeChild(child);
  }
};

Handsontable.Dom.HTML_CHARACTERS = /(<(.*)>|&(.*);)/;

/**
 * Insert content into element trying avoid innerHTML method.
 * @return {void}
 */
Handsontable.Dom.fastInnerHTML = function (element, content) {
  if (this.HTML_CHARACTERS.test(content)) {
    element.innerHTML = content;
  }
  else {
    this.fastInnerText(element, content);
  }
};

/**
 * Insert text content into element
 * @return {void}
 */
if (document.createTextNode('test').textContent) { //STANDARDS
  Handsontable.Dom.fastInnerText = function (element, content) {
    var child = element.firstChild;
    if (child && child.nodeType === 3 && child.nextSibling === null) {
      //fast lane - replace existing text node
      //http://jsperf.com/replace-text-vs-reuse
      child.textContent = content;
    }
    else {
      //slow lane - empty element and insert a text node
      this.empty(element);
      element.appendChild(document.createTextNode(content));
    }
  };
}
else { //IE8
  Handsontable.Dom.fastInnerText = function (element, content) {
    var child = element.firstChild;
    if (child && child.nodeType === 3 && child.nextSibling === null) {
      //fast lane - replace existing text node
      //http://jsperf.com/replace-text-vs-reuse
      child.data = content;
    }
    else {
      //slow lane - empty element and insert a text node
      this.empty(element);
      element.appendChild(document.createTextNode(content));
    }
  };
}

/**
 * Returns true/false depending if element has offset parent
 * @param elem
 * @returns {boolean}
 */
/*if (document.createTextNode('test').textContent) { //STANDARDS
  Handsontable.Dom.hasOffsetParent = function (elem) {
    return !!elem.offsetParent;
  }
}
else {
  Handsontable.Dom.hasOffsetParent = function (elem) {
    try {
      if (!elem.offsetParent) {
        return false;
      }
    }
    catch (e) {
      return false; //IE8 throws "Unspecified error" when offsetParent is not found - we catch it here
    }
    return true;
  }
}*/

/**
 * Returns true if element is attached to the DOM and visible, false otherwise
 * @param elem
 * @returns {boolean}
 */
Handsontable.Dom.isVisible = function (elem) {
  //fast method according to benchmarks, but requires layout so slow in our case
  /*
  if (!Handsontable.Dom.hasOffsetParent(elem)) {
    return false; //fixes problem with UI Bootstrap <tabs> directive
  }

//  if (elem.offsetWidth > 0 || (elem.parentNode && elem.parentNode.offsetWidth > 0)) { //IE10 was mistaken here
  if (elem.offsetWidth > 0) {
    return true;
  }
  */

  //slow method
  var next = elem;
  while (next !== document.documentElement) { //until <html> reached
    if (next === null) { //parent detached from DOM
      return false;
    }
    else if (next.nodeType === 11) {  //nodeType == 1 -> DOCUMENT_FRAGMENT_NODE
      if (next.host) { //this is Web Components Shadow DOM
        //see: http://w3c.github.io/webcomponents/spec/shadow/#encapsulation
        //according to spec, should be if (next.ownerDocument !== window.document), but that doesn't work yet
        if (next.host.impl) { //Chrome 33.0.1723.0 canary (2013-11-29) Web Platform features disabled
          return Handsontable.Dom.isVisible(next.host.impl);
        }
        else if (next.host) { //Chrome 33.0.1723.0 canary (2013-11-29) Web Platform features enabled
          return Handsontable.Dom.isVisible(next.host);
        }
        else {
          throw new Error("Lost in Web Components world");
        }
      }
      else {
        return false; //this is a node detached from document in IE8
      }
    }
    else if (next.style.display === 'none') {
      return false;
    }
    next = next.parentNode;
  }
  return true;
};

/**
 * Returns elements top and left offset relative to the document. In our usage case compatible with jQuery but 2x faster
 * @param {HTMLElement} elem
 * @return {Object}
 */
Handsontable.Dom.offset = function (elem) {
  if (this.hasCaptionProblem() && elem.firstChild && elem.firstChild.nodeName === 'CAPTION') {
    //fixes problem with Firefox ignoring <caption> in TABLE offset (see also Handsontable.Dom.outerHeight)
    //http://jsperf.com/offset-vs-getboundingclientrect/8
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
      left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
    };
  }

  var offsetLeft = elem.offsetLeft
    , offsetTop = elem.offsetTop
    , lastElem = elem;

  while (elem = elem.offsetParent) {
    if (elem === document.body) { //from my observation, document.body always has scrollLeft/scrollTop == 0
      break;
    }
    offsetLeft += elem.offsetLeft;
    offsetTop += elem.offsetTop;
    lastElem = elem;
  }

  if (lastElem && lastElem.style.position === 'fixed') { //slow - http://jsperf.com/offset-vs-getboundingclientrect/6
    //if(lastElem !== document.body) { //faster but does gives false positive in Firefox
    offsetLeft += window.pageXOffset || document.documentElement.scrollLeft;
    offsetTop += window.pageYOffset || document.documentElement.scrollTop;
  }

  return {
    left: offsetLeft,
    top: offsetTop
  };
};

Handsontable.Dom.getWindowScrollTop = function () {
  var res = window.scrollY;
  if (res == void 0) { //IE8-11
    res = document.documentElement.scrollTop;
  }
  return res;
};

Handsontable.Dom.getWindowScrollLeft = function () {
  var res = window.scrollX;
  if (res == void 0) { //IE8-11
    res = document.documentElement.scrollLeft;
  }
  return res;
};

Handsontable.Dom.getScrollTop = function (elem) {
  if (elem === window) {
    return Handsontable.Dom.getWindowScrollTop(elem);
  }
  else {
    return elem.scrollTop;
  }
};

Handsontable.Dom.getScrollLeft = function (elem) {
  if (elem === window) {
    return Handsontable.Dom.getWindowScrollLeft(elem);
  }
  else {
    return elem.scrollLeft;
  }
};

Handsontable.Dom.getComputedStyle = function (elem) {
  return elem.currentStyle || document.defaultView.getComputedStyle(elem);
};

Handsontable.Dom.outerWidth = function (elem) {
  return elem.offsetWidth;
};

Handsontable.Dom.outerHeight = function (elem) {
  if (this.hasCaptionProblem() && elem.firstChild && elem.firstChild.nodeName === 'CAPTION') {
    //fixes problem with Firefox ignoring <caption> in TABLE.offsetHeight
    //jQuery (1.10.1) still has this unsolved
    //may be better to just switch to getBoundingClientRect
    //http://bililite.com/blog/2009/03/27/finding-the-size-of-a-table/
    //http://lists.w3.org/Archives/Public/www-style/2009Oct/0089.html
    //http://bugs.jquery.com/ticket/2196
    //http://lists.w3.org/Archives/Public/www-style/2009Oct/0140.html#start140
    return elem.offsetHeight + elem.firstChild.offsetHeight;
  }
  else {
    return elem.offsetHeight;
  }
};

Handsontable.Dom.innerHeight = function (elem) {
  return elem.clientHeight || elem.innerHeight;
};

Handsontable.Dom.innerWidth = function (elem) {
  return elem.clientWidth || elem.innerWidth;
};

Handsontable.Dom.addEvent = function(element, event, callback) {
  if (window.addEventListener) {
    element.addEventListener(event, callback, false)
  } else {
    element.attachEvent('on' + event, callback);
  }
};

Handsontable.Dom.removeEvent = function(element, event, callback) {
  if (window.removeEventListener) {
    element.removeEventListener(event, callback, false);
  } else {
    element.detachEvent('on' + event, callback);
  }
};


(function () {
  var hasCaptionProblem;

  function detectCaptionProblem() {
    var TABLE = document.createElement('TABLE');
    TABLE.style.borderSpacing = 0;
    TABLE.style.borderWidth = 0;
    TABLE.style.padding = 0;
    var TBODY = document.createElement('TBODY');
    TABLE.appendChild(TBODY);
    TBODY.appendChild(document.createElement('TR'));
    TBODY.firstChild.appendChild(document.createElement('TD'));
    TBODY.firstChild.firstChild.innerHTML = '<tr><td>t<br>t</td></tr>';

    var CAPTION = document.createElement('CAPTION');
    CAPTION.innerHTML = 'c<br>c<br>c<br>c';
    CAPTION.style.padding = 0;
    CAPTION.style.margin = 0;
    TABLE.insertBefore(CAPTION, TBODY);

    document.body.appendChild(TABLE);
    hasCaptionProblem = (TABLE.offsetHeight < 2 * TABLE.lastChild.offsetHeight); //boolean
    document.body.removeChild(TABLE);
  }

  Handsontable.Dom.hasCaptionProblem = function () {
    if (hasCaptionProblem === void 0) {
      detectCaptionProblem();
    }
    return hasCaptionProblem;
  };

  /**
   * Returns caret position in text input
   * @author http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
   * @return {Number}
   */
  Handsontable.Dom.getCaretPosition = function (el) {
    if (el.selectionStart) {
      return el.selectionStart;
    }
    else if (document.selection) { //IE8
      el.focus();
      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }
      var re = el.createTextRange(),
        rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);
      return rc.text.length;
    }
    return 0;
  };

  /**
   * Returns end of the selection in text input
   * @return {Number}
   */
  Handsontable.Dom.getSelectionEndPosition = function (el) {
    if(el.selectionEnd) {
      return el.selectionEnd;
    } else if(document.selection) { //IE8
      var r = document.selection.createRange();
      if(r == null) {
        return 0;
      }
      var re = el.createTextRange();

      return re.text.indexOf(r.text) + r.text.length;
    }
  };

  /**
   * Sets caret position in text input
   * @author http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
   * @param {Element} el
   * @param {Number} pos
   * @param {Number} endPos
   */
  Handsontable.Dom.setCaretPosition = function (el, pos, endPos) {
    if (endPos === void 0) {
      endPos = pos;
    }
    if (el.setSelectionRange) {
      el.focus();
      el.setSelectionRange(pos, endPos);
    }
    else if (el.createTextRange) { //IE8
      var range = el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', endPos);
      range.moveStart('character', pos);
      range.select();
    }
  };

  var cachedScrollbarWidth;
  //http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
  function walkontableCalculateScrollbarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    (document.body || document.documentElement).appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    (document.body || document.documentElement).removeChild(outer);

    return (w1 - w2);
  }

  /**
   * Returns the computed width of the native browser scroll bar
   * @return {Number} width
   */
  Handsontable.Dom.getScrollbarWidth = function () {
    if (cachedScrollbarWidth === void 0) {
      cachedScrollbarWidth = walkontableCalculateScrollbarWidth();
    }
    return cachedScrollbarWidth;
  }

  var isIE8 = !(document.createTextNode('test').textContent);
  Handsontable.Dom.isIE8 = function () {
    return isIE8;
  };

  var isIE9 = !!(document.documentMode);
  Handsontable.Dom.isIE9 = function () {
    return isIE9;
  };

  var isSafari = (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor));
  Handsontable.Dom.isSafari = function () {
    return isSafari;
  };

  /**
   * Sets overlay position depending on it's type and used browser
   */
  Handsontable.Dom.setOverlayPosition = function (overlayElem, left, top) {
    if (isIE8 || isIE9) {
      overlayElem.style.top = top;
      overlayElem.style.left = left;
    } else if (isSafari) {
      overlayElem.style['-webkit-transform'] = 'translate3d(' + left + ',' + top + ',0)';
    } else {
      overlayElem.style['transform'] = 'translate3d(' + left + ',' + top + ',0)';
    }
  };

  Handsontable.Dom.getCssTransform = function (elem) {
    var transform;

    if(elem.style['transform'] && (transform = elem.style['transform']) != "") {
      return ['transform', transform];
    } else if (elem.style['-webkit-transform'] && (transform = elem.style['-webkit-transform']) != "") {
      return ['-webkit-transform', transform];
    } else {
      return -1;
    }
  };

  Handsontable.Dom.resetCssTransform = function (elem) {
    if(elem['transform'] && elem['transform'] != "") {
      elem['transform'] = "";
    } else if(elem['-webkit-transform'] && elem['-webkit-transform'] != "") {
      elem['-webkit-transform'] = "";
    }
  };

})();
