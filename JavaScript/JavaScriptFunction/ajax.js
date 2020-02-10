var Class = {
  create: function() {
    return function() { 
      this.initialize.apply(this, arguments);
    }
  }
}

Object.extend = function(destination, source) {
  for (property in source) {
    destination[property] = source[property];
  }
  return destination;
}

Function.prototype.bind = function(object) {
  var __method = this;
  return function() {
    return __method.apply(object, arguments);
  }
}

function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1) 
      return element;

    elements.push(element);
  }

  return elements;
}

//-------------------------

document.getElementsByClassName = function(className) {
  var children = document.getElementsByTagName('*') || document.all;
  var elements = new Array();
  
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var classNames = child.className.split(' ');
    for (var j = 0; j < classNames.length; j++) {
      if (classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }
  
  return elements;
}

//-------------------------

if (!window.Element) {
  var Element = new Object();
}

Object.extend(Element, {
  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
  },

  hasClassName: function(element, className) {
    element = $(element);
    if (!element)
      return;
    var a = element.className.split(' ');
    for (var i = 0; i < a.length; i++) {
      if (a[i] == className)
        return true;
    }
    return false;
  },

  addClassName: function(element, className) {
    element = $(element);
    Element.removeClassName(element, className);
    element.className += ' ' + className;
  },
  
  removeClassName: function(element, className) {
    element = $(element);
    if (!element)
      return;
    var newClassName = '';
    var a = element.className.split(' ');
    for (var i = 0; i < a.length; i++) {
      if (a[i] != className) {
        if (i > 0)
          newClassName += ' ';
        newClassName += a[i];
      }
    }
    element.className = newClassName;
  },
  
  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) 
        Element.remove(node);
    }
  }
});


ajaxNew = Class.create();
ajaxNew.prototype = {
	initialize: function(url, options){
		this.transport = this.getTransport();
		this.postBody = options.postBody || '';
		this.method = options.method || 'post';
		this.onComplete = options.onComplete || null;
		this.update = $(options.update) || null;
		this.request(url);
	},

	request: function(url){
		this.transport.open(this.method, url, true);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if (this.method == 'post') {
			this.transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			if (this.transport.overrideMimeType) this.transport.setRequestHeader('Connection', 'close');
		}
		this.transport.send(this.postBody);
	},

	onStateChange: function(){
		if (this.transport.readyState == 4 && this.transport.status == 200) {
			if (this.onComplete) 
				setTimeout(function(){this.onComplete(this.transport);}.bind(this), 10);
			if (this.update)
				setTimeout(function(){this.update.innerHTML = this.transport.responseText;}.bind(this), 10);
			this.transport.onreadystatechange = function(){};
		}
	},

	getTransport: function() {
		if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
		else if (window.XMLHttpRequest) return new XMLHttpRequest();
		else return false;
	}
};

function AjaxSuggest(doneHandler, failHandler)
{
  newAjax = this;
  this.onDone = doneHandler;
  this.onFail = failHandler;
  this.transport = this.getTransport();
  this.transport.onreadystatechange = ajaxTrampoline(this);
}

AjaxSuggest.prototype.get = function (uri, query)
{  
  if( typeof query != 'string' )
    query = ajaxArrayToQueryString(query);
  fullURI = uri+(query ? ('?'+query) : '');
  this.transport.open('GET', fullURI, true );
  this.transport.send('');
}

AjaxSuggest.prototype.post = function (uri, data)
{
  if( typeof data != 'string' )
    data = ajaxArrayToQueryString(data);
  this.transport.open('POST', uri, true);
  this.transport.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  this.transport.send(data);
}

AjaxSuggest.prototype.stateDispatch = function ()
{
  if( this.transport.readyState == 1 && this.showLoad )
    ajaxShowLoadIndicator();
  
  if( this.transport.readyState == 4 ) {
    if( this.showLoad )
      ajaxHideLoadIndicator();
    if( this.transport.status >= 200 &&
        this.transport.status < 300 &&
        this.transport.responseText.length > 0 ) {
      if( this.onDone ) this.onDone(this, this.transport.responseText);
    } else {
      if( this.onFail ) this.onFail(this);
    }
  }
}

AjaxSuggest.prototype.getTransport = function ()
{
  var ajaxNew = null;
  
  try { ajaxNew = new XMLHttpRequest(); }
  catch(e) { ajaxNew = null; }
  
  try { if(!ajaxNew) ajaxNew = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch(e) { ajaxNew = null; }
  
  try { if(!ajaxNew) ajaxNew = new ActiveXObject("Microsoft.XMLHTTP"); }
  catch(e) { ajaxNew = null; }
  
  return ajaxNew;
}

function ajaxTrampoline(ajaxObject)
{
  return function () { ajaxObject.stateDispatch(); };
}

function ajaxArrayToQueryString(queryArray)
{
  var sep = '';
  var query = "";
  
  for( var key in queryArray ) {
    query = query +
      sep +
      encodeURIComponent(key) +
      '=' +
      encodeURIComponent(queryArray[key]);
    sep = '&';
  }
  return query;
}

var ajaxLoadIndicatorRefCount = 0;

function ajaxShowLoadIndicator()
{
  indicatorDiv = ge('ajaxLoadIndicator');
  if( !indicatorDiv ) {
    indicatorDiv = document.createElement("div");
    indicatorDiv.id = 'ajaxLoadIndicator';
    indicatorDiv.innerHTML = 'Loading';
    indicatorDiv.className = 'ajaxLoadIndicator';
    document.body.appendChild(indicatorDiv);
  }
  
  indicatorDiv.style.top = (5 + pageScrollY()) + 'px';
  indicatorDiv.style.left = (5 + pageScrollX()) + 'px';
  indicatorDiv.style.display = 'block';
  ajaxLoadIndicatorRefCount++;
}

function ajaxHideLoadIndicator()
{
  ajaxLoadIndicatorRefCount--;
  if( ajaxLoadIndicatorRefCount == 0 )
    ge('ajaxLoadIndicator').style.display = '';
}
