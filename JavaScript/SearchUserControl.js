/*
---------------------------------------------------------------------------------------+
 eSchoolData - File Modification Information                                           |
----------------------------------------------------------------------------------------
     $Date::   Aug 21 2008 23:43:56                                                   $|
  $Modtime::   Aug 21 2008 21:59:08                                                   $|
   $Author::   shobhit.teotia                                                         $|
 $Workfile::   SearchUserControl.js                                                   $|
 $Revision::   1.2                                                                    $|
---------------------------------------------------------------------------------------+
                        Handle With a lot of Care                                      |
---------------------------------------------------------------------------------------+
*/
var	imgFSD;
var	imgPSD;
var	imgNSD;
var	imgLSD;
var	imgFS;			
var	imgPS;
var	imgNS;
var	imgLS;
var blnLoaded = false;
//---------------------------------------------------------------------------------------+
function LoadPictures()
{
	imgFSD = new Image();
	imgFSD.src="../images/Common/arrow_first_inactive_small.gif";
	imgPSD = new Image();
	imgPSD.src="../images/Common/arrow_prev_inactive_small.gif";
	imgNSD = new Image();
	imgNSD.src="../images/Common/arrow_next_inactive_small.gif";
	imgLSD = new Image();
	imgLSD.src="../images/Common/arrow_last_inactive_small.gif";		
	
	imgFS = new Image();			
	imgFS.src="../images/Common/arrow_first_active_small.gif";
	imgPS = new Image();
	imgPS.src="../images/Common/arrow_prev_active_small.gif";
	imgNS = new Image();
	imgNS.src="../images/Common/arrow_next_active_small.gif";
	imgLS = new Image();
	imgLS.src="../images/Common/arrow_last_active_small.gif";
	blnLoaded = true;
}
//---------------------------------------------------------------------------------------+
function DisableAll(objF,objP,objN,objL)
{
    if(blnLoaded == false)
        LoadPictures();
    if(objF)
	    objF.src = imgFSD.src;
	if(objP) 
	    objP.src = imgPSD.src;
	if(objN)
	    objN.src = imgNSD.src;
	if(objL)
	    objL.src = imgLSD.src;
}
//---------------------------------------------------------------------------------------+
function P(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader,objThis)
{
    if(blnLoaded == false)
        LoadPictures();
    //---------------------------------------------
    if(objThis.src == imgFS.src || objThis.src == imgPS.src || objThis.src == imgNS.src || objThis.src == imgLS.src)
    {
        var objHid = GetObject("hid" + strID + "PNO");
        var objTol = GetObject('txt' + strID + 'M');
        switch(objThis.src)
        {
            case imgFS.src: 
                objHid.value = '1'; 
                break;
            case imgPS.src: 
                objHid.value = parseInt(objHid.value) - 1;
                if(parseInt(objHid.value) < 1)
                    objHid.value = '1';
                break;
            case imgNS.src: 
                objHid.value = parseInt(objHid.value) + 1;
                if(parseInt(objHid.value) > parseInt(objTol.value))
                    objHid.value = objTol.value;
                break;
            case imgLS.src: 
                objHid.value = objTol.value; 
                break;
            default: break;
        }
        R(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader);
    }
    //---------------------------------------------
}
//---------------------------------------------------------------------------------------+
function __C(strID)
{
    var objHid = GetObject("hid" + strID + "PNO");
    objHid.value = '1';
}
//---------------------------------------------------------------------------------------+
function __GetNXML(strID)
{
    var objHid = GetObject("hid" + strID + "PNO");
    var objTol = eval("fn" + strID + "PPS()");
    var strXML;
    strXML = "<PageIndex>" + objHid.value + "</PageIndex>";
    strXML = strXML + "<PageSize>" + objTol + "</PageSize>";
    return strXML;
}
//---------------------------------------------------------------------------------------+
function R(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader)
{
    //---------------------------------------------
    ProcessAjAx(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader);
    //---------------------------------------------
}
//---------------------------------------------------------------------------------------+
function ProcessAjAx(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader)
{
    if(isObject(AjaxPro))
    {
        with(AjaxPro)
        {
            timeoutPeriod = 900 * 1000;
            if(blnHideNavigation==true)
                onLoading = ProcessAjAxOL;
            onError = ProcessAjAxOE;
            onTimeout = ProcessAjAxOTO;

        }
    }
    ShowBusy(strID);
    if(!blnIsFunction)
    {
        GetObject(objResult).disabled=false;
        GetObject(objResult).innerHTML='';
    }

    if(TrimResult(strXML).length != 0)
    {
        if(strXML.indexOf("().value",0) > 0)  
            strXML = strXML.replace(').value','ProcessAjAxCB)');
        else
            strXML = strXML.replace(').value',',ProcessAjAxCB)');
        strXML = TrimResult(strXML);
        var intStart = strXML.indexOf('(');
        var intEnd = strXML.length;
        var strCondistion =  strXML.substring((intStart + 1), (intEnd - 1))
        //--------------------------------------------------------
        ProcessAjAxCB.strResult = strResult;
        ProcessAjAxCB.objResult = objResult;
        ProcessAjAxCB.blnIsFunction = blnIsFunction;
        ProcessAjAxCB.strID = strID;
        ProcessAjAxCB.blnHideNavigation = blnHideNavigation;
        ProcessAjAxCB.blnFixedHeader = blnFixedHeader;
        ProcessAjAxCB.lngRowsInHeader = lngRowsInHeader;
        //--------------------------------------------------------
        ProcessAjAxOE.strID = strID;
        //--------------------------------------------------------
        ProcessAjAxOTO.strID = strID;
        //--------------------------------------------------------
        ProcessAjAxOL.strID = strID;
        //--------------------------------------------------------
        eval(strXML);   
    }
    else
    {
        HideBusy(strID);
    }
}
//---------------------------------------------------------------------------------------+
function ShowBusy(strID)
{
    if(GetObject('img' + strID + 'B'))
        GetObject('img' + strID + 'B').style.display = 'block';
    if(GetObject('img' + strID + 'TB'))
        GetObject('img' + strID + 'TB').style.display = 'block';
}
//---------------------------------------------------------------------------------------+
function ProcessAjAxOE(objRes)
{
    var strStrId = this.onError.strID;
    var objDiv = eval('fn' + strStrId + 'G();');                      
    objDiv.innerHTML = "<table><tr><td><img src='../images/common/alert_icon.gif' alt='' /></td><td>Some Errors were encountered while performing the Requested Operation</td></tr></table>";
    HideBusy(strStrId);
}
//---------------------------------------------------------------------------------------+
function ProcessAjAxOTO(objAJAX,objRes)
{
    var strStrId = this.onTimeout.strID;
    var objDiv = eval('fn' + strStrId + 'G();');                      
    objDiv.innerHTML = "<table><tr><td><img src='../images/common/alert_icon.gif' alt='' /></td><td>The Requested Operation Timed Out</td></tr></table>";
    HideBusy(strStrId);
}
//---------------------------------------------------------------------------------------+
function ProcessAjAxOL(objAJAX)
{
    if(objAJAX==true)
    {
        var strStrId = this.onLoading.strID;
        var objDiv = eval('fn' + strStrId + 'G();');                      
        objDiv.innerHTML = "<table width='100%'><tr><td style='width:50%' align='right' valign='middle'><img src='../images/common/LoadData.gif' alt='' /></td><td style='width:50%' align='left' valign='middle'>Loading...Please Wait</td></tr></table>";
    }
    else
    {
        HideBusy(strStrId);
    }
}
//---------------------------------------------------------------------------------------+
function HideBusy(strID)
{
    //Start search security implementation...
    if (typeof(__applySectionAccessRule) != 'undefined'){__applySectionAccessRule();}
    //if (typeof(__configureDateFields) != 'undefined'){__configureDateFields();}

    if(GetObject('img' + strID + 'B'))
        GetObject('img' + strID + 'B').style.display = 'none';
    if(GetObject('img' + strID + 'TB'))
        GetObject('img' + strID + 'TB').style.display = 'none';
}
//---------------------------------------------------------------------------------------+
function ProcessAjAxCB(objAJAX)
{
    var strObjResult;
    var strStrResult;
    var strStrId;
    var blnBlnFunction;
    var blnBlnHideNavigation;
    var blnBlnFixedHeader;
    var lnglngRowsInHeader;
    strObjResult = this[0].objResult;
    strStrResult = this[0].strResult;
    strStrId = this[0].strID;
    blnBlnFunction = this[0].blnIsFunction;
    blnHideNavigation = this[0].blnHideNavigation;
    blnBlnFixedHeader = this[0].blnFixedHeader;
    lnglngRowsInHeader = this[0].lngRowsInHeader;

    var objHDDiv = GetObject('divHD' + TrimResult(strStrId) + 'Results');
    
    if(objAJAX.error)
    {
        if(!blnBlnFunction)
            GetObject(strObjResult).innerHTML = objAJAX.error;
        else
        {
            var objDiv = eval('fn' + strStrId + 'G();');                      
            objDiv.innerHTML = objAJAX.error;
        }
    }
    else
    {
        eval(strStrResult + " = objAJAX.value;");
        if(blnBlnFunction)
        {
            new function(){strObjResult()};
            var objDiv = eval('fn' + strStrId + 'G();');
            
            if(blnHideNavigation==false)
                ProcessForPageNo(objDiv.id,strStrId);
            if(blnBlnFixedHeader==true)
                ProcessHeader(objHDDiv,objDiv,lnglngRowsInHeader);                            
        }
        else
        {
            GetObject(strObjResult).innerHTML = TrimResult(objAJAX.value);
            if(blnHideNavigation==false)
                ProcessForPageNo(strObjResult,strStrId);
            if(blnBlnFixedHeader==true)
                ProcessHeader(objHDDiv,GetObject(strObjResult),lnglngRowsInHeader);                            
            GetObject(strObjResult).disabled=false;
        }
    }
    HideBusy(strStrId);
}
//---------------------------------------------------------------------------------------+
function ProcessHeader(objHeaderDiv,objResultDiv,lngRowsInHeader)
{
    if((objHeaderDiv) && (objResultDiv))
    {
        objHeaderDiv.innerHTML = '';
        objHeaderDiv.innerHTML = objResultDiv.innerHTML;
        var objTRs = objHeaderDiv.getElementsByTagName('TR');
        if(objTRs)
        {
            if(objTRs.length > 0)
            {
                var objTable;
                if(objTRs[0].parentElement)
                    objTable = objTRs[0].parentElement;
                else if(objTRs[0].parentNode)
                    objTable = objTRs[0].parentNode
                else
                    objTable = null;
                for(var intCtr = (objTRs.length - 1); intCtr > (lngRowsInHeader - 1) ; intCtr--)
                {
                    objTRs[intCtr].style.display = 'none';
                    if(objTable)
                    {
                        if(objTable.deleteRow)
                            objTable.deleteRow(intCtr);
                    }
                }
            }
        } 
        var objTRs = objResultDiv.getElementsByTagName('TR');
        if(objTRs)
        {
            if(objTRs.length > 0)
            {
                for(var intCtr = 0; intCtr < lngRowsInHeader; intCtr++)
                    objTRs[intCtr].style.display = 'none';
            }                    
        } 
    }
}
//---------------------------------------------------------------------------------------+
var strRegexp1 = /^\s+/gi;
var strRegexp2 = /\s+$/gi;
function TrimResult(strResult)
{
	string = new String(strResult);
	string = string.replace(strRegexp1, "");
	return string.replace(strRegexp2, "");
}
//---------------------------------------------------------------------------------------+
function ProcessForPageNo(objResult,strID)
{
    var objDiv = GetObject(objResult);
    var objTables = objDiv.getElementsByTagName("table");
    //---------------------------------------------
    var txtCurPageNo;
    var txtTCurPageNo;
    var txtTotPageNo;
    var txtTTotPageNo;
    //---------------------------------------------
    //------------Image Object Names-------------------------
    var strIDPrefix = strID + "_";
    var strButtonTFirst = strIDPrefix + 'btnTFirst';
    var strButtonTPrevious = strIDPrefix + 'btnTPrevious';
    var strButtonTNext = strIDPrefix + 'btnTNext';
    var strButtonTLast = strIDPrefix + 'btnTLast';
    var strButtonFirst = strIDPrefix + 'btnFirst';
    var strButtonPrevious = strIDPrefix + 'btnPrevious';
    var strButtonNext = strIDPrefix + 'btnNext';
    var strButtonLast = strIDPrefix + 'btnLast';
    //------------Image Objects-------------------------
    var strObjectTFirst = GetObject(strButtonTFirst);
    var strObjectTPrevious = GetObject(strButtonTPrevious);
    var strObjectTNext = GetObject(strButtonTNext);
    var strObjectTLast = GetObject(strButtonTLast);
    var strObjectFirst = GetObject(strButtonFirst);
    var strObjectPrevious = GetObject(strButtonPrevious);
    var strObjectNext = GetObject(strButtonNext);
    var strObjectLast = GetObject(strButtonLast);
    //---------------------------------------------
    DisableAll(strObjectTFirst,strObjectTPrevious,strObjectTNext,strObjectTLast);      
    DisableAll(strObjectFirst,strObjectPrevious,strObjectNext,strObjectLast);      
    //---------------------------------------------
    txtCurPageNo =  'txt' + strID + 'P';
    txtTCurPageNo = 'txt' + strID + 'TP';    
    txtTotPageNo =  'txt' + strID + 'M';
    txtTTotPageNo = 'txt' + strID + 'TM';
    txtGPageNo =  'txt' + strID + 'G';
    txtTGPageNo =  'txt' + strID + 'TG';    
    if(GetObject(txtTGPageNo))
        GetObject(txtTGPageNo).value='';    
    if(GetObject(txtGPageNo))
        GetObject(txtGPageNo).value='';   
        
    txtCurPageNo = GetObject(txtCurPageNo);
    txtTCurPageNo = GetObject(txtTCurPageNo);    
    txtTotPageNo = GetObject(txtTotPageNo);
    txtTTotPageNo = GetObject(txtTTotPageNo);
    
    if(objTables.length > 0)
    {
        var objTable = objTables[0];
        txtCurPageNo.value='';
        txtTCurPageNo.value='';
        txtTotPageNo.value='';
        txtTTotPageNo.value='';
        
        if(objTable.getAttribute('PAGENO'))
        {
            if(txtCurPageNo)
                txtCurPageNo.value = objTable.getAttribute('PAGENO');       
            if(txtTCurPageNo)
                txtTCurPageNo.value = objTable.getAttribute('PAGENO');
        }
        if(objTable.getAttribute('PAGETOTAL'))
        {
            if(txtTotPageNo)
                txtTotPageNo.value = objTable.getAttribute('PAGETOTAL');
            if(txtTTotPageNo)
                txtTTotPageNo.value = objTable.getAttribute('PAGETOTAL');
        }
        var intPageNo = parseInt(objTable.getAttribute('PAGENO'));        
        var intPageTotal = parseInt(objTable.getAttribute('PAGETOTAL'));
        if(!isNaN(intPageNo) && !isNaN(intPageTotal))
        {
            //---------------------------------------------------
	        strObjectTFirst.src = imgFS.src;
	        strObjectTPrevious.src = imgPS.src;
	        strObjectTNext.src = imgNS.src;
	        strObjectTLast.src = imgLS.src;
	        strObjectFirst.src = imgFS.src;
	        strObjectPrevious.src = imgPS.src;
	        strObjectNext.src = imgNS.src;
	        strObjectLast.src = imgLS.src;
	        //---------------------------------------------------
	        if (parseInt(intPageNo) <= 1)
	        {
		        strObjectTFirst.src = imgFSD.src;
		        strObjectTPrevious.src = imgPSD.src;
		        strObjectFirst.src = imgFSD.src;
		        strObjectPrevious.src = imgPSD.src;
	        }
            //---------------------------------------------------
	        if (parseInt(intPageNo) >= parseInt(intPageTotal))
	        {
		        strObjectTNext.src = imgNSD.src;
		        strObjectTLast.src = imgLSD.src;				
		        strObjectNext.src = imgNSD.src;
		        strObjectLast.src = imgLSD.src;				
	        }     
            //---------------------------------------------------
        }            
    }
}
//---------------------------------------------------------------------------------------+
function N(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader)
{
    var txtCurPageNo;
    var txtTotPageNo;
    var txtGPageNo;
    var txtTGPageNo;
    txtCurPageNo =  'txt' + strID + 'P';
    txtTotPageNo =  'txt' + strID + 'M';
    txtGPageNo =  'txt' + strID + 'G';
    txtTGPageNo =  'txt' + strID + 'TG';    
    
    txtCurPageNo = GetObject(txtCurPageNo);
    txtTotPageNo = GetObject(txtTotPageNo);
    txtGPageNo = GetObject(txtGPageNo);
    txtTGPageNo = GetObject(txtTGPageNo);
    
    if(txtGPageNo.value == '' && txtTGPageNo.value != '')
        txtGPageNo.value =txtTGPageNo.value;
    else if(txtTGPageNo.value == '' && txtGPageNo.value != '')
        txtTGPageNo.value =txtGPageNo.value;
    if(txtTotPageNo.value != '')
    {
        if(parseInt(txtCurPageNo.value) != parseInt(txtGPageNo.value))
        {
            if((parseInt(txtGPageNo.value) <= parseInt(txtTotPageNo.value)) && 
            (parseInt(txtGPageNo.value) >= 1))
            {   
                if(isOnlyNumeric(txtGPageNo))
                {
                    var PageNo =  Math.round(txtGPageNo.value);
                    var objHid = GetObject("hid" + strID + "PNO");
                    objHid.value = PageNo;
                    R(strXML,strResult,objResult,blnIsFunction,strID,blnHideNavigation,blnFixedHeader,lngRowsInHeader);
                }
                else
                {
                    alert('Page Number may only contain numeric characters');
                    txtGPageNo.value = '';
                    txtTGPageNo.value = '';
                }
            }
            else
            {
                alert(eSDMessaging.Validation.DYN_RANGE.format('Page Number', '1', txtTotPageNo.value));
                txtGPageNo.value = '';
                txtTGPageNo.value = '';
            }
        }
    }
    else
    {
        txtGPageNo.value = '';
        txtTGPageNo.value = ''
    }
}
//---------------------------------------------------------------------------------------+
function C(strDivId,strID)
{
    GetObject(strDivId).innerHTML = '';
    //------------Text Box Objects-------------------------
    var txtCurPageNo;
    var txtTCurPageNo;
    var txtTotPageNo;
    var txtTTotPageNo;
    var txtGPageNo;
    var txtTGPageNo;

    txtCurPageNo =  'txt' + strID + 'P';
    txtTCurPageNo = 'txt' + strID + 'TP';    
    txtTotPageNo =  'txt' + strID + 'M';
    txtTTotPageNo = 'txt' + strID + 'TM';
    txtGPageNo =  'txt' + strID + 'G';
    txtTGPageNo =  'txt' + strID + 'TG';
    
    if(GetObject(txtCurPageNo))
        GetObject(txtCurPageNo).value='';
    if(GetObject(txtTotPageNo))
        GetObject(txtTotPageNo).value='';
    if(GetObject(txtGPageNo))
        GetObject(txtGPageNo).value='';
    if(GetObject(txtTCurPageNo))
        GetObject(txtTCurPageNo).value='';    
    if(GetObject(txtTTotPageNo))
        GetObject(txtTTotPageNo).value='';    
    if(GetObject(txtTGPageNo))
        GetObject(txtTGPageNo).value='';    
    //------------Image Object Names-------------------------
    var strIDPrefix = strID + "_";
    var strButtonTFirst = strIDPrefix + 'btnTFirst';
    var strButtonTPrevious = strIDPrefix + 'btnTPrevious';
    var strButtonTNext = strIDPrefix + 'btnTNext';
    var strButtonTLast = strIDPrefix + 'btnTLast';
    var strButtonFirst = strIDPrefix + 'btnFirst';
    var strButtonPrevious = strIDPrefix + 'btnPrevious';
    var strButtonNext = strIDPrefix + 'btnNext';
    var strButtonLast = strIDPrefix + 'btnLast';
    //------------Image Objects-------------------------
    var strObjectTFirst = GetObject(strButtonTFirst);
    var strObjectTPrevious = GetObject(strButtonTPrevious);
    var strObjectTNext = GetObject(strButtonTNext);
    var strObjectTLast = GetObject(strButtonTLast);
    var strObjectFirst = GetObject(strButtonFirst);
    var strObjectPrevious = GetObject(strButtonPrevious);
    var strObjectNext = GetObject(strButtonNext);
    var strObjectLast = GetObject(strButtonLast);
    //---------------------------------------------        
    DisableAll(strObjectTFirst,strObjectTPrevious,strObjectTNext,strObjectTLast);      
    DisableAll(strObjectFirst,strObjectPrevious,strObjectNext,strObjectLast);      
}
//---------------------------------------------------------------------------------------+