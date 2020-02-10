var Suggest = function(rootEl, q, formEl, textBoxEl, idEl, uri, param, successHandler, instructions, schoolid, placeholderText, defaultOptions, showNoMatches)
{
  this.onInputChange = function()
  {

    var currentInputValue = oThis.typeAheadObj.currentInputValue;
   	
		var cache = oThis.getCache(currentInputValue);
		if(cache)
		{
			oThis.onSuggestRequestDone(currentInputValue, cache[0], cache[1], cache[2]);
		}
		else
		{

		    var strOutputXML;
			strOutputXML = eSD.StudentPortal.WEB.Register.GetDistrictList(GetInputXML()).value; 
			
            var q = escapeURI(currentInputValue);
			var ajax = new AjaxSuggest(oThis.onAjaxDone, oThis.onAjaxFail);
			ajax.key = currentInputValue;
      	    ajax.pEvent = oThis.typeAheadObj.pEvent;
      	 
			var t = LoadCourseData(strOutputXML)
		    eval(t);
		    oThis.onSuggestRequestDone(ajax.key, suggestNames, suggestIDs, suggestLocs, ajax.pEvent);

		}
  }
	this.onAjaxFail = function(ajaxObj, responseText)
	{
//		var suggestNames = [];
//		var suggestIDs = [];
//        var suggestLocs = [];
//        var t =  "suggestNames = ['hello']; suggestIDs = ['4']; suggestLocs = ['hello - course number'];"
//	
//		eval(t);
//		oThis.onSuggestRequestDone(ajaxObj.key, suggestNames, suggestIDs, suggestLocs, ajaxObj.pEvent);
				
	}
	
	this.onAjaxDone = function(ajaxObj, responseText)
	{
//		var suggestNames = [];
//		var suggestIDs = [];
//        var suggestLocs = [];
//		eval(responseText);		
//		oThis.onSuggestRequestDone(ajaxObj.key, suggestNames, suggestIDs, suggestLocs, ajaxObj.pEvent);
	}

	this.onSuggestRequestDone = function(key, names, ids, locs, pEvent)
	{
		this.setCache(key, names, ids, locs);
		if(this.typeAheadObj.displaySuggestList(names, ids, locs))
		{
      		this.typeAheadObj.pEvent = pEvent;
			this.typeAheadObj.onListChange();			
		}
	}
	
	this.getCache = function(key)
	{
		return this.suggestCache[key.toUpperCase()];
	}

	this.setCache = function(key, names, ids, locs)
	{
		this.suggestCache[key.toUpperCase()] = new Array(names, ids, locs);
	}

	this.init = function()
	{		
	    this.suggestURI = uri;
		this.suggestParam = param;
		this.suggestCache = [];
		this.returnXML = '';
		this.CourseNumber = '';
		this.CourseId = '';
		this.CourseName = '';
       // this.coursename = coursename;    
           
        this.typeAheadObj = new TypeAhead(rootEl, formEl, textBoxEl, idEl, defaultOptions, instructions, 0, successHandler, this.onInputChange, null, null, null, placeholderText, showNoMatches);
     
	    this.typeAheadObj.setText(q);
     }

	var oThis = this;	
	this.init();
}
//---------------------End of Suggest ----------------------



// -------------------- Utilities functions ----------------------------


function GetInputXML()
{      
    var strResult = '';
    strResult= strResult + "<Root>";       
    strResult= strResult + "<DistrictName>"+GetObject('districtName_auto').value+"</DistrictName>";     
    strResult= strResult + "</Root>"
    return strResult;
}


function GetXMLDocument(xmlDocResult)
{
      if(typeof(xmlDocResult)=='object')
      {
        return xmlDocResult;
      }
       
      try  
      {
      var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async="false";
      xmlDoc.loadXML(xmlDocResult);
      
      return xmlDoc;
      }
      catch(e)
      {
      var parser=new DOMParser();
      var xmlDoc=parser.parseFromString(xmlDocResult,"text/xml");
      return xmlDoc;
      }
}


function LoadCourseData(xmlDocResult)
{

    var xmlDoc = GetXMLDocument(xmlDocResult)
     
    
    
    if(xmlDoc)
    {
        
      
       var x = xmlDoc.getElementsByTagName('Table');
        
      
        var strCorID = "";
        var strCorName = "";        
        var strCorNumber = "";
        for (i = 0 ; i < x.length ; i++)
        {
            for (intChild = 0 ; intChild < x[i].childNodes.length ; intChild++)
            { 
                switch(x[i].childNodes[intChild].nodeName)
                {
                    case "GEO_PK":
                        if ( i <1 )
                            strCorID = '"' + x[i].childNodes[intChild].firstChild.nodeValue + '"'
                        else
                            strCorID = strCorID + ',"' + x[i].childNodes[intChild].firstChild.nodeValue + '"'
                        break;
                    case "GEO_NAME":
                        if ( x[i].childNodes[intChild].firstChild != null)                                                                   
                        {
                            if ( i <1 )
                                strCorNumber = '"' + x[i].childNodes[intChild].firstChild.nodeValue + '"'
                            else
                                strCorNumber = strCorNumber + ',"' + x[i].childNodes[intChild].firstChild.nodeValue + '"'
                        }
                        else
                           strCorNumber = strCorNumber + ",''"
                        break;
//                    

                    default: break;
                }
            }                       
        }
        
        return 'suggestNames = [' + strCorNumber + ']; suggestIDs = [' + strCorID + ']; suggestLocs = [' + strCorName + ']';
         
    }
}

function debug(str)
{
	document.getElementById("debug").innerHTML += str + "<BR>";
}


function escapeURI(u)
{
    if(encodeURIComponent) {
        return encodeURIComponent(u);
    }
    if(escape) {
        return escape(u);
    }
}

function ge(e){
    return document.getElementById(e);
}

function elementX(obj)
{
  var curleft = 0;
  if (obj.offsetParent) {
    while (obj.offsetParent) {
      curleft += obj.offsetLeft;
      obj = obj.offsetParent;
    }
  }
  else if (obj.x)
    curleft += obj.x;
  return curleft;
}

function elementY(obj)
{
  var curtop = 0;
  if(obj.offsetParent) {
    while (obj.offsetParent) {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
  }
  else if (obj.y)
    curtop += obj.y;
  return curtop;
}