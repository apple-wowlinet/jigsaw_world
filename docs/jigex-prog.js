/** @license 下面的版本申请仅作为测试用，请忽略版权申明*/
!function(){"use strict";var e=window.jigexGlobals;if(!e.parms){
e.parms=null,String.prototype.includes||(String.prototype.includes=function(e,t){return-1!==this.indexOf(e,t)}),
String.prototype.codePointAt||(String.prototype.codePointAt=function(e){if(null==this)throw TypeError()
;var t=String(this),n=t.length,i=e?Number(e):0;if(i!=i&&(i=0),!(i<0||i>=n)){var o,r=t.charCodeAt(i)
;return r>=55296&&r<=56319&&n>i+1&&(o=t.charCodeAt(i+1))>=56320&&o<=57343?1024*(r-55296)+o-56320+65536:r}}),
String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.indexOf(e,t)===t}),
Array.prototype.includes||(Array.prototype.includes=function(e,t){return-1!==this.indexOf(e,t)}),
Array.prototype.from||(Array.prototype.from=function(e){return Array.prototype.slice.call(e)}),
Math.imul||(Math.imul=function(e,t){var n=65535&e,i=65535&t;return n*i+((e>>>16&65535)*i+n*(t>>>16&65535)<<16>>>0)|0}),
Number.MAX_SAFE_INTEGER||(Number.MAX_SAFE_INTEGER=9007199254740991),
window.queueMicrotask||(window.queueMicrotask=function(e){setTimeout(e,0)}),Object.assign||(Object.assign=function(e){
if(null==e)throw new TypeError("Cannot convert undefined or null to object")
;for(var t=Object(e),n=1;n<arguments.length;n++){var i=arguments[n]
;if(null!=i)for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t}),window.Map||function(){
function e(){this._keys=[],this._values=[]}e.prototype.set=function(e,t){var n=this._indexOfKey(e)
;return-1===n?(this._keys.push(e),this._values.push(t)):this._values[n]=t,this},e.prototype.get=function(e){
var t=this._indexOfKey(e);return-1===t?void 0:this._values[t]},e.prototype.has=function(e){
return-1!==this._indexOfKey(e)},e.prototype._indexOfKey=function(e){
for(var t=0;t<this._keys.length;t++)if(this._keys[t]===e||this._keys[t]!=this._keys[t]&&e!=e)return t;return-1},
window.Map=e}(),Object.values||(Object.values=function(e){var t=[]
;for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(e[n]);return t}),
Array.prototype.includes||(Array.prototype.includes=function(e,t){return-1!==this.indexOf(e,t)}),function(){
var t,n={},i=[],o=!0;Error.stackTraceLimit=50;var r=function(r){
var a,s=!1,l=e.parms&&e.parms().debug,c=new Error(r.message);if(c.stack=r.stack,a=function(t){var n={msg:t.message,
stk:t.stack,url:t.source||"",ua:navigator.userAgent
},i=n.ua.includes("Mac OS X")&&n.ua.includes("Safari/")&&!n.ua.includes("Chrome/"),o=n.ua.includes("Firefox/"),r=e.isIE11,a=n.ua.includes("Edge/"),s=r||a,l=!n.stk||!n.stk.trim().length||!n.stk.includes("\n")||!n.stk.includes("jigsawexplorer.com")||!n.stk.includes(".js")||n.msg.includes("_AutofillCallbackHandler")||n.stk.includes("yimg.com")||n.stk.includes("amazon-adsystem.com"),c=(l=l||n.stk.split("\n").every((function(e,t){
return 0===t||e.includes("anonymous")
})))||n.ua.includes("Firefox/3.")||n.msg.includes("out of memory")||n.msg.includes("Out of memory")||n.msg.includes("Not enough memory")||n.msg.includes("Mémoire insuffisante pour cette opération")||n.msg.includes("Der er ikke tilstrækkelig tilgængelig hukommelse til at fuldføre denne handling")||n.msg.includes("Memoria disponibile insufficiente per completare l'operazione")||n.msg.includes("Onvoldoende opslagruimte beschikbaar om deze bewerking te voltooien")||n.msg.includes("Les ressources mémoire disponibles sont insuffisantes pour exécuter cette opération")||n.msg.includes("Für diesen Vorgang ist nicht genügend Speicher verfügbar")||n.msg.includes("Espacio de almacenamiento insuficiente para completar esta operación")||n.msg.includes("Det finns inte tillräckligt med utrymme tillgängligt för att slutföra den här åtgärden")||n.msg.includes("GPU-enhetsinstansen har försatts i väntetillstånd. Använd GetDeviceRemovedReason om du vill ta reda på vad du bör göra")||n.msg.includes("この操作を完了するのに十分な記憶域がありません。")||n.msg.includes("사용 가능한 저장소가 부족하여 이 작업을 마칠 수 없습니다")||n.msg.includes("메모리 리소스가 부족하기 때문에 이 작업을 완료할 수 없습니다")||n.msg.includes("GPU 장치 인스턴스가 중단되었습니다")||n.msg.includes("Não existe memória suficiente para concluir esta operação")||n.msg.includes("syntax error")&&n.parms.file.includes("jquery.js")||n.msg.includes("Script error in jquery-1.12.4.min.js")||n.msg.includes("The object is in an invalid state")||n.msg.includes("NS_ERROR_OUT_OF_MEMORY")||n.msg.includes("NS_ERROR_FILE_")||n.msg.includes("NS_ERROR_FAILURE")||n.msg.includes("NS_ERROR_STORAGE_IOERR")||n.msg.includes("Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'")||n.msg.includes("Attempted to assign to readonly property")&&n.ua.includes("Arora/")||n.msg.includes("Access is denied")&&r||n.msg.includes("Accès refusé")&&r&&n.stk.includes("jquery")||n.msg.includes("Access is denied")&&n.ua.includes("Edge/")&&n.stk.includes("jquery")||n.msg.includes("Accesso negato")&&n.ua.includes("Edge/")&&n.stk.includes("jquery")||n.msg.includes("SecurityError")&&n.stk.includes("clipgl.js")||n.msg.includes("Syntax error")&&s||n.msg.includes("Unterminated string constant")&&s||n.msg.includes("error 80020101")&&a||n.msg.includes("Unspecified error")&&s||n.msg.includes("Erreur non spécifiée")&&s||n.msg.includes("Odefinierat fel")&&s||n.msg.includes("Der opstod en udefineret fejl")&&s||n.msg.includes("Error no especificado")&&s||n.msg.includes("Erro não especificado")&&s||n.msg.includes("שגיאה לא מוגדרת")&&s||n.msg.includes("Niet nader omschreven fout")&&s||n.msg.includes("Not enough storage is available")&&r||n.stk.includes("G_cp_4")||n.msg.includes("image must not be empty")&&n.ua.includes("Android")||n.msg.includes("Java exception")&&n.ua.includes("Android")||n.msg.includes("887a0005")||n.msg.includes("Cannot redefine property: play")||n.msg.includes("undefined is not an object (evaluating 'je.Puzzle.curr')")&&n.ua.includes("Macintosh")||n.msg.includes("Object doesn't support property or method 'engn'")&&a||n.msg.includes("The RPC server is unavailable")&&n.stk.includes("visitBtn")&&a||n.msg.includes("Unable to create defaultColorShader fragment shader")&&a||n.msg.includes("Cannot read property 'DOMNodeInsertedByJs' of undefined")&&n.ua.includes("Android")||n.msg.includes("Cannot read property 'style' of null")&&n.stk.includes("setColor")||n.msg.includes("Cannot redefine property: websredir")||n.msg.includes("The GPU device instance has been suspended")||n.msg.includes("Istanza del dispositivo GPU sospesa")||n.msg.includes("Die GPU-Geräteinstanz wurde angehalten")||n.stk.includes("chrome-extension://")||n.stk.includes("handleRipple")||n.msg.includes("Unhandled SyntaxError: Expected ':'")&&n.stk.includes("Unknown script code")||n.stk.includes("vissense")||n.msg.includes("Erro de sintaxe")&&r||n.stk.includes("main.js")||n.stk.includes("Unknown script code:1:196")||n.stk.includes("XMLHttpRequest.js")||n.stk.includes("_stopObservingEnvironment")||n.stk.includes("rafTick")||n.stk.includes("BetterJsPop")||n.ua.includes("Electron")||n.msg.includes("Unexpected end of script")&&n.ua.includes("iPad")||n.msg.includes("expando")||n.msg.includes("Maximum call stack size exceeded")&&n.ua.includes("FBAV/300")||n.msg.includes("NS_ERROR_UNEXPECTED")||o&&(n.msg.includes("Script error")||n.msg.includes("can't access dead object")||n.msg.includes("The document is not fully active"))||n.msg.includes("Uncaught SyntaxError: Unexpected end of input")||n.msg.includes("Unterminated string constant")&&n.ua.includes("Edge/18")||i&&n.msg.includes("undefined is not an object (evaluating 'je.Puzzle.curr')")||n.msg.includes("The object is in an invalid state")&&n.stk.includes("getImageData")||e.modules&&e.modules.ClipGL&&e.modules.ClipGL.insts&&e.modules.ClipGL.insts["jigex-canvas"]&&!e.modules.ClipGL.insts["jigex-canvas"].stableContext||n.stk.includes("e.prototype._setupCodecs")
;e.errMonitor._handledError&&(c=!1,l=!0);return{reportError:!c,alertUser:!l,ieWarning:c&&r,ffWarning:c&&o}}(c),
a.reportError&&o&&!l)try{o=!1,s=!0,window.openConsole&&!e.errMonitor._handledError&&window.openConsole.log(c)
;for(var u=0,d=i.length;u<d;u++)i[u]()}catch(e){n["Inner error"]=e.stack}return a.alertUser&&(t=c.message,
setTimeout((function(){
window.alert(t),a.ieWarning?window.alert("If the error persists then please consider playing the puzzles in a different web browser (we recommend the Chrome browser). Internet Explorer is a old and buggy web browser. Even Microsoft is strongly encouraging all users to stop using Internet Explorer."):a.ffWarning&&window.alert("If the error persists then please consider playing the puzzles in a different web browser (we recommend the Chrome browser). The Firefox browser tends to be more prone to errors when playing the puzzles than the other major browsers.")
}),1e3)),s};e.errMonitor={_handledError:!1,_preppedError:null,setAuxData:function(e,t,i){
n[e]="object"==typeof t?JSON.stringify(t,null,i?null:"\t"):t},addCallback:function(e){i.push(e)},
sendReport:function(e,t){var n=t&&t.manual,i=this._preppedError||e||new Error("Handled error");if(this._preppedError){
if(this.prepOnly||!n)return}else{if("string"==typeof i&&(i=new Error(i)),!i.stack)try{throw i}catch(e){}
if(this.prepOnly)return void(this._preppedError=i)}this.extendStackTrace=!1,this._handledError=!0,this.pushError(i),
this._handledError=!1},extendStackTrace:!1,prepOnly:!1,pushError:function(e){},forceErrorReporting:false},
window.rg4js?(window.rg4js("onBeforeSend",(function(t){
if(!(t&&t.Details&&t.Details.Error&&t.Details.Error.Message&&t.Details.Error.StackTrace&&t.Details.Error.StackTrace.length))return!1
;var i=new Error(t.Details.Error.Message);if(i.stack=t.Details.Error.StackTrace.reduce((function(e,t){
return e+t.FileName+"\n"}),""),r(i)){var o={Location:"<geo placeholder>"}
;for(var a in n)n.hasOwnProperty(a)&&(o[a]=n[a]);return o.Logs="\n"+o.Logs,t.Details.UserCustomData=o,
t.Details.Version=e.status.progVersion,t.Details.Tags.push("Web"),t.Details.Breadcrumbs=[],t}return!1})),
e.errMonitor.pushError=function(e){window.rg4js("send",{error:e})
}):window.console.warn("No error reporting system detected")}()
;var t=document.getElementById("jigex-control-host"),n=document.getElementById("jigex-loader"),i=e.status;if(t&&n&&i){
e.status.framed=window.self!==window.top;var o=e.scriptsDir,r=e.status.framed,a=-1!==n.src.indexOf("jigex-prog"),s={
base:{init:null,inited:!1,file:"base"},niftybar:{init:null,inited:!1,file:"niftybar"},utils:{init:null,inited:!1,
file:"utils"},ClipGL:{init:null,inited:!1,file:"clipgl"},Sonic:{init:null,inited:!1,file:"sonic"},SonicH5:{init:null,
inited:!1,file:"sonic-h5"},theme:{init:null,inited:!1,file:"theme"},photon:{init:null,inited:!1,file:"photon"},
multiplayer:{init:null,inited:!1,file:"multiplayer"},snapIndicator:{init:null,inited:!1,file:"snap"},ui:{init:null,
inited:!1,file:"ui"},footer:{init:null,inited:!1,file:"footer"},player:{init:null,inited:!1,file:"player"}}
;String.prototype.includes||(String.prototype.includes=function(){
return-1!==String.prototype.indexOf.apply(this,arguments)});var l=function(){
var e={},t=window.location.search,n=t.length-1;if("#"===t[n]&&(t=t.substring(0,n-1)),t){
for(var i=t.substr(1).split("&"),o=i.length-1;o>=0;o--){var r=i[o].split("=");e[r[0]]=r[1]}e.url=e.url||e.img}return e
}();if(l.ctw&&l.cth){var c=parseInt(l.cth,10)+36;t.style.width=l.ctw+"px",t.style.height=c.toString(10)+"px"}
var u=("verbose"===l.dbg?l.dbg:!!l.dbg)||!a,d=window.console;e.debug=u;var h=function(t){
(d=t).config.throwOnAssertFail=!0,d.config.separator="",d.config.maxLogEntryLength=15e3,
u&&(d.config.recordLevel=d.DEBUG,d.config.nativeRecordLevel=d.DEBUG),d.config.onlogwrite=function(t,n,i){
t!==d.FAULT||u&&!e.errMonitor.forceErrorReporting||e.errMonitor.sendReport(i)}}
;if(window.openConsole?h(window.openConsole):window.onLoadOpenConsole=h,r||l.url){
var p=document.getElementById("adthrive_sticky_footer");p&&p.parentNode.removeChild(p)}
var g,m,f,v=window.navigator.userAgent,y=("100%"===t.style.width&&t.style.height,n.getAttribute("data-ga-events")||"")
;!!function(e){try{return localStorage.getItem(e)}catch(e){return null}
}("jigex-email-collected")||!navigator.cookieEnabled||n.getAttribute("data-mmunch-site-id")
;e.homeDomain="https://www.jigsawexplorer.com/",e.cdnDomain="https://d3v07jw5i24n9b.cloudfront.net/",
e.fetchPath=e.homeDomain+"api/fetch?target=",
e.imagesPath=e.resDir+"images/",e.altImagesPath=e.cdnDomain+"media/graphics/",e.audioPath=e.resDir+"audio/",
e.altAudioPath=e.cdnDomain+"media/audio/",e.scriptsPath=e.resDir+"scripts/",e.altScriptsPath=e.cdnDomain+"scripts/",
e.subjectsPath=e.homeDomain+"puzzles/subjects/",e.altSubjectsPath=e.cdnDomain+"puzzles/subjects/",
e.profilesPath=e.homeDomain+"puzzles/profiles/",e.altProfilesPath=e.cdnDomain+"puzzles/profiles/",e.testImage=null,
e.isIE11=navigator.userAgent.includes("Trident/"),e.isIOS=(g=/iPad|iPhone|iPod/.test(v),m=v.includes("Macintosh"),
f=navigator.maxTouchPoints>=1,g||m&&(f||function(){try{var e=new Audio}catch(e){return!1}return e.volume=.5,1===e.volume
}())),e.parms=function(){
var t=null,o=0,r=[],a=document.getElementById("jigex-promo-1"),s=document.getElementById("jigex-promo-2"),c=function(e){
if(e)try{
0!==(e=decodeURIComponent(e)).indexOf("http")&&(e=(e=(e=(e=decodeURIComponent(e)).split("-").join("+")).split("_").join("/")).split("~").join("="),
e=window.atob(e)),e=e.replace(/\\/g,"")}catch(t){d.log(e),d.error("URL decode failure:",t),e=""}return e},h=function(t){
var n=t.target;if(200===n.status){var i=n.response
;i&&(i.includes("jigex-promo-1")?a=i:i.includes("jigex-promo-2")&&(s=i))
}else d.error("Failed to load promo spec. code=%d, msg=%s, path=%s",n.status,n.statusText,n.filePath)
;0==--o&&e.parms.onReady&&e.parms.onReady()},p=function(e){if(e&&-1==r.indexOf(e)){var t=new XMLHttpRequest;o++,
r.push(e),t.open("GET",e,!0),t.filePath=e,t.responseType="text",t.crossOrigin="anonymous",t.onload=h,t.onerror=h,
t.send()}};p(c(l.promo1||n.getAttribute("data-promo-1"))),p(c(l.promo2||n.getAttribute("data-promo-2")))
;var g,m,f,v=(g={},m=function(t){var n=t.target;if(200===n.status){var i=JSON.parse(n.response)
;if(i&&"object"==typeof i){for(var r in i)if(i.hasOwnProperty(r))if("nextProfileAddress"===r){var a=i.nextProfileAddress
;"string"==typeof a?f(a):Array.isArray(a)?a.forEach(f):d.error('Invalid value for field "nextProfileAddress" in',n.filePath)
}else if("promotionPanelAddress"===r){var s=i.promotionPanelAddress
;"string"==typeof s?p(s):Array.isArray(s)?s.forEach(p):d.error('Invalid value for field "promotionPanelAddress" in',n.filePath)
}else g[r]=i[r]
}else i?d.error("Content of profile "+n.filePath+' is of type "'+typeof i+'", but should be an object'):d.error("Content of profile "+n.filePath+" is null, probably due to incorrect JSON format")
}else d.error("Failed to load profile. code=%d, msg=%s, path=%s",n.status,n.statusText,n.filePath)
;0==--o&&e.parms.onReady&&e.parms.onReady()},(f=function(e){if(e&&-1===r.indexOf(e)){var t=new XMLHttpRequest;o++,
r.push(e),t.open("GET",e,!0),t.filePath=e,t.responseType="text",t.crossOrigin="anonymous",t.onload=m,t.onerror=m,
t.send()}})(c(l.prof)),g);return function(){var e,r;return t||o||(e={puzzleId:l.puzzle_id||void 0,
url:c(l.url)||v.photoAddress||n.getAttribute("data-puzzle-url")||void 0,gameId:l.gid||void 0,
nop:parseInt(l.nop)||v.numberOfPieces||parseInt(n.getAttribute("data-num-pieces"))||void 0,
min:parseInt(l.min||v.minNumberOfPiecesAllowed||n.getAttribute("data-min-pieces"))||void 0,
cred:c(l.cred)||v.creditLine||n.getAttribute("data-credit")||void 0,
credu:c(l.credu)||v.creditAddress||n.getAttribute("data-credit-url")||void 0,
color:l.color||v.backgroundColor||n.getAttribute("data-color")||void 0,frm:i.framed?parseInt(l.frm||"1"):void 0,
saveName:null,data:null,recId:l.rec||void 0,rgn:l.rgn||null,plog:l.plog&&"n"!==l.plog,promo1:a,promo2:s,
mmunchId:l.mmid||v.mailMunchId||n.getAttribute("data-mmunch-id"),
mmunchOnOpen:!l.mmfin&&!v.mailMunchOnFinish&&!n.hasAttribute("data-mmunch-finish"),
mmunchForce:"true"===l.mmfrc||v.mailMunchForce||n.hasAttribute("data-mmunch-force"),
appl:n.hasAttribute("data-applause")||v.showApplause||void 0,
maxSaved:parseInt(n.getAttribute("data-max-saved"))||v.maxNumberOfSavedPuzzles||void 0,
debug:n.hasAttribute("data-debug")||u||void 0,canvasTestWidth:l.ctw||void 0,canvasTestHeight:l.cth||void 0,
reset:function(){return this.puzzleId=this.url=this.nop=this.min=this.cred=this.credu=this.saveName=this.data=null,this
},log:function(){var e=this.data;e&&e.length>128&&(this.data=e.substr(0,128)+"..."),this.data=e}},
(r=e.credu)&&(0!==r.indexOf("http")||r.includes("script")||r.includes('"')||r.includes("<")||r.includes(">"))&&(e.credu=void 0),
t=e),t}}()
;var b=!!window,w=b?"ht":"",x=b?"tps://ww":"",P=b?"w.jigs":"",_=b?"awexpl":"",E=b?"orer.c":"",k=b?"om/":"",S=b?"hr":"",C=b?"ef":""
;if(0===window[(b?"loc":"")+(b?"ation":"")][S+C].indexOf(w+x+P+_+E+k)){e.logEvent=function(e,t,n){
"function"==typeof window.ga?y.includes(e)?window.ga("send","event","Puzzles",e,t,n):"Completed".includes(e)&&d.error("unrecognized GA log event: %s",e):r||d.error('GA event "%s" was not pegged because GA was not loaded or has been overwritten',e)
};var T,z,I,L,O,A,M,j,B,N,R,D,G,V=function(e,t){var n=document.createElement("script");return n.type="text/javascript",
n.crossorigin="anonymous",n.onload=t,n.onerror=function(){
n.srcList&&n.srcList.length?V(n.srcList,n.onload):d.error("Script failed to load: "+n.src)},
"string"==typeof e?n.src=e:(n.srcList=e,n.src=e.shift()),document.body.appendChild(n),n
},F=(T=document.getElementsByTagName("head")[0],z={},I=document.createElement("link"),
L="sheet"in I?"sheet":"styleSheet",O="sheet"in I?"cssRules":"rules",A=!0,M=window.navigator.userAgent,
j=M.includes("Mac OS X")&&M.includes("Safari/")&&!M.includes("Chrome/"),B=function(){var e=!1
;for(var t in z)if(z.hasOwnProperty(t)){var n=z[t];if(!n.isLoaded){try{
if(j)for(var i=document.styleSheets.length-1;i>=0;i--)document.styleSheets[i].href===t&&(n.isLoaded=!0);else n.isLoaded=n[L]&&n[L][O]&&!!n[L][O].length
}catch(e){}n.isLoaded?(N.onFirstLoad&&(N.onFirstLoad(),N.onFirstLoad=null),n.callback&&n.callback(n)):e=!0}}
e?setTimeout(B,100):A=!0},(N=function(e,t){var n=z[e]
;return n?n.isLoaded?t&&t(n):t&&(n.callback=t):(F.allSheetsLoaded=!1,
(n=document.createElement("link")).setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),
n.setAttribute("crossorigin","anonymous"),n.setAttribute("href",e),n.callback=t,n.isCSS=!0,n.isLoaded=!1,z[e]=n,
T.appendChild(n),setTimeout(B,100)),n}).onFirstLoad=null,N.allSheetsLoaded=function(){return A},N);e.modules=(R=[],D=!1,
G=!1,{bundled:a,load:V,addModInit:function(e,t){s[e].init=t,this.update()},update:function(){if(!G&&!D){
for(var t=!0;t;)for(var n in t=!1,s)if(s.hasOwnProperty(n)){var i=s[n]
;if(!i.inited&&i.init&&i.init.dependenciesReady()){if(i.init(),G)return;i.inited=!0,t=!0,
d.log('module "%s" has initialized',n)}}var o=!0;for(n in s)if(s.hasOwnProperty(n)&&!s[n].inited){o=!1;break}if(o){
for(;R.length;)if(R.pop()(),G)return;D=!0,setTimeout(e.modules.onProgramStart,0)}}},haltInit:function(){G=!0,
d.log("module initialization halted")},onInitComplete:function(e){R.push(e)},onProgramStart:null});var H
;if(v.includes("MSIE")&&!v.includes("Trident/"))return H="Internet Explorer is not capable of displaying the jigsaw puzzle",
H=v.includes("Windows NT 5.")||v.includes("Windows NT 6.0")?"Internet Explorer is not capable of displaying the<br/>jigsaw puzzle on Windows XP or Vista.":v.includes("Windows NT 6.1")?'Welcome! You will need to <a href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx" style="color: white" target="_blank">upgrade to Internet Explorer 11</a> (or use a different web browser) to play this jigsaw puzzle.</p>':'Welcome! Internet Explorer is not capable of displaying the jigsaw puzzle <br/>in Windows 8.0. Please try a different web browser, such as <a href="https://www.google.com/chrome/browser/desktop/" style="color: white" target="_blank">Chrome</a>.',
void(t?t.innerHTML='<br/><br/><p style="text-align: center; font-size: large; font-family: Arial; color: white;">'+H+"</p>":window.alert("Welcome! You will need to upgrade to Internet Explorer 11 (or use a different web browser, such as Chrome) to play this jigsaw puzzle."))
;!function(){if(F("https://fonts.googleapis.com/css?family=Roboto"),!a)for(var t in s)if(s.hasOwnProperty(t)){
var n=s[t].file;V(o+"jigex-"+n+".js")}window.dataLayer=window.dataLayer||[],window.gtag=function(){
dataLayer.push(arguments)},gtag("js",new Date),gtag("config","UA-10103852-5"),gtag("config","G-BJND4BVEWS"),
V("https://www.googletagmanager.com/gtag/js?id=G-BJND4BVEWS"),e.adBlockerPresent=!0,V(e.scriptsPath+"ads.js")}()
;var q=document.getElementById("jigex-copyright"),W=i.srcModDate.substring(i.srcModDate.length-4)
;q.innerHTML=q.innerHTML.replace("vvvv",i.progVersion),q.innerHTML=q.innerHTML.replace("yyyy",W),t||(!0,
document.documentElement.setAttribute("style","height: 100%; overflow: hidden"),
document.body.setAttribute("style","padding: 0; margin: 0; height: 100%; overflow: hidden; background-color: #7390aa"),
(t=document.createElement("div")).id="jigex-control-host",
t.setAttribute("style","width: 100%; height: 100%; position: fixed; top: 0; right: 0;"),document.body.appendChild(t)),
e.modules||e.reloadProg("modules component not present")}}else{
var U="Not ready: host="+!!t+", loader="+!!n+", status="+!!i
;e.reloadProg?e.reloadProg(U):(window.alert("Error: "+U+'\n\nClick the "OK" button to try again.'),
window.setTimeout((function(){window.location.reload(!0)}),1e3))}}}(),function(){"use strict"
;var e="undefined"!=typeof self,t=e?self:global;if(!t.openConsole){
var n,i=Array.prototype.filter&&Array.prototype.reduce&&JSON&&JSON.stringify&&Object.hasOwnProperty&&String.prototype.trim&&Function.bind&&Error,o=" ",r="    ",a="\n"+r,s=" · ",l=" • ",c="…",u=".dfioOs",d=e&&-1!==navigator.userAgent.indexOf("Chrome"),h=20,p=40,g={
applyChromeDebugFix:!0,autoLineBreak:!0,includeStackLevel:70,includeTimestamp:!0,logLimit:1e4,logCharacterLimit:5e5,
maxLogEntryLength:5e3,nativeRecordLevel:e?60:h,onlogwrite:null,recordLevel:30,separator:" ",throwOnAssertFail:!1,
usePrettyPrintJson:!1,useTags:!0,verbose:!1},m={length:0,size:0,logsLost:0},f={},v=t.console,y=!0,b=(n=[],{
add:function(e){for(n.push(e),m.size+=e.length+1;n.length&&(n.length>g.logLimit||m.size>g.logCharacterLimit);){
var t=n.shift();m.size-=t.length+1,m.logsLost++}m.length=n.length},clear:function(){n=[],f={},m.length=0,m.size=0,
m.logsLost=0,v&&v.clear&&v.clear()},emitBreak:function(){i&&b.add(o)},toString:function(){
return(m.logsLost?r+"(Earlier logs lost due to logging limits)\n":"")+n.join("\n")},toStrings:function(){
return n.slice()}}),w=function(){var e=new Date,t=e.getHours(),n=e.getMinutes(),i=e.getSeconds(),o=e.getMilliseconds()
;return(t<10?"0"+t:t)+":"+(n<10?"0"+n:n)+":"+(i<10?"0"+i:i)+"."+(o<10?"00"+o:o<100?"0"+o:o)},x=function(e){var t=e.stack
;if(!t)try{throw e}catch(n){t=e.stack}if(t){var n=!e.message
;if(-1===t.indexOf("open-console.js"))n&&(t=t.substring(t.indexOf("\n")+1).trim());else{var i=!1
;t=t.split("\n").filter((function(e){var t=-1!==e.indexOf("open-console.js");return(i=i||t)?!t:!n})).join(a)}
t&&(e.stack=t)}else e.stack=r+"(No call stack provided)";return e},P=function(e){if("."===e[0]){
var t=parseInt(e.substring(1),10);if(!isNaN(t)){var n=t.toString(10).length;if(-1!=="dfioOs".indexOf(e[n+1]))return t}}
return null},_=function(e,t){return t&&e.length>t?e.substring(0,t)+c:e},E=function(e,t,n){
if(e instanceof Error)return e.stack;var i;switch(typeof e){case"string":return _(e.replace(/\n/g,a),n);case"number":
if(n)try{return e.toFixed(n)}catch(e){return"(bad float precision specifier)"}return""+e;case"object":try{
if(t||g.usePrettyPrintJson){var o=JSON.stringify(e,null,r).split("\n");o.length>3&&(i=o.join(a)+a)}
return _(i||JSON.stringify(e),n)}catch(e){return"(cannot convert circular object to string)"}default:return _(""+e,n)}
},k=function(e){return(e.level>=g.recordLevel||e.level>=g.nativeRecordLevel&&v&&v[e.native]||g.verbose)&&i
},S=function(n,i,o){if(!(arguments.length<4)&&k(n)){
var r="assert"===n.name,p=!!r&&!!arguments[3],m=Array.prototype.slice.call(arguments,r?4:3),_=m[0],S="string"==typeof _
;if(i&&S){if(f.hasOwnProperty(_))return;f[_]=!0}
if((n.level>=g.nativeRecordLevel||g.verbose&&g.nativeRecordLevel===h)&&v&&y&&v[n.native]){
var C=d&&g.applyChromeDebugFix&&"debug"===n.native?"log":n.native,T=r?Array.prototype.slice.call(arguments,3):m;try{
v[C].apply(v,T)}catch(n){y=!1,e&&setTimeout((function(e){try{
t.openConsole("openConsole failed to access the native console"+(e?": "+e.message:""))}catch(e){}}),0,n)}}
if(n.level>=g.recordLevel||g.verbose){if(!p){
var z="",I=g.useTags?n.tag:null,L=I?l:s,O=g.includeTimestamp?w()+L:"",A=m.length&&m[m.length-1]instanceof Error,M=null
;if(S){var j=_.split("%");j.length>1&&(m.shift(),z=j.reduce((function(e,t,n){if(0===n)return e+t.replace(/\n/g,a)
;if(-1===u.indexOf(t[0]))return e+"%"+t.replace(/\n/g,a)
;var i=P(t),r=t.substring(i?i.toString().length+2:1),s=m.shift(),l=E(s,o,i);return M=M||(s instanceof Error?s:null),
e+l+r.replace(/\n/g,a)}),z),m.length&&(z=m.reduce((function(e,t){return M=M||(t instanceof Error?t:null),
e+g.separator+E(t,o,null)}),z)),m.length=0)}if(m.length&&(z=m.reduce((function(e,t){
return M=M||(t instanceof Error?t:null),e+g.separator+E(t,o,null)
}),z)),("trace"===n.name||n.level>=g.includeStackLevel)&&!A&&(z+=a+x(new Error).stack),z=O+(I?I+": ":"")+z.trim(),
g.autoLineBreak&&(z+=-1===z.indexOf("\n")?"":"\n"),g.onlogwrite){var B=g.onlogwrite(n.level,z,M);if(null===B)return
;void 0!==B&&"string"==typeof B&&(z=B)}z.length>g.maxLogEntryLength&&(z=z.substring(0,g.maxLogEntryLength)+c),b.add(z)}
if(r&&!p&&g.throwOnAssertFail)throw x(new Error("Assertion failure"))}}},C=function(){
var e=arguments[0],t="object"==typeof arguments[1],n=t?arguments[1]:{},o=t?[]:Array.prototype.slice.call(arguments,1)
;if(n.name=n.name||o[0],n.native=n.native||o[1]||"log",n.level=n.level>0?n.level:o[2]||p,n.tag=n.tag||o[3]||"",i){
if(!n.name||"string"!=typeof n.name||!n.native||"string"!=typeof n.native||v&&!v[n.native]&&"assert"!==n.native||"number"!=typeof n.level||n.level<=0||"string"!=typeof n.tag)throw new Error("OpenConsole.defineLog was passed an invalid specification value: nam="+n.name+";"+(typeof n.name)[0]+", natc="+!!v+", natcnat="+!!v[n.native]+", nat="+n.native+";"+(typeof n.native)[0]+", lvl="+n.level+";"+(typeof n.level)[0]+", tag="+n.tag+";"+(typeof n.tag)[0])
;var r=S.bind(null,n,!1,!1);r.once=S.bind(null,n,!0,!1),r.pretty=S.bind(null,n,!1,!0),r.isRecording=k.bind(null,n),
e[n.name]=r,e[n.name.toUpperCase()]=n.level}else{var a=function(){};a.once=function(){},a.pretty=function(){},
a.isRecording=function(){return!1},e[n.name]=a,e[n.name.toUpperCase()]=n.level}},T=function(){
C(this,"detail","log",10,""),C(this,"debug","debug",h,"Debug"),C(this,"trace","trace",30,"Trace"),
C(this,"diag","log",30,"Diag"),C(this,"log","log",p,""),C(this,"note","log",50,"Note"),C(this,"info","info",60,"Info"),
C(this,"warn","warn",70,"Warning"),C(this,"error","error",80,"Error"),C(this,"fault","error",90,"Fault"),
C(this,"assert","assert",100,"Assertion failure"),this.NONE=Infinity,this.toString=b.toString,
this.toStrings=b.toStrings,this.emitBreak=b.emitBreak,this.clear=b.clear,this.config=g,this.stats=m,
this.defineLog=i?C.bind(null,this):function(e){C(this,e)}}
;T.prototype=v||{},"undefined"==typeof module?(t.openConsole=new T,
t.onLoadOpenConsole&&(t.onLoadOpenConsole(t.openConsole),t.onLoadOpenConsole=void 0)):module.exports=new T}}(),
function(){"use strict";var e="object"==typeof self?self:global;if(!e.Sym){var t={};n.prototype={get description(){
return this.name||"<sym>"},eq:function(e){
return 1===arguments.length?this.ordinal===e.ordinal:Array.prototype.slice.call(arguments,0).some((function(e){
return this.ordinal===e.ordinal}),this)},neq:function(e){
return 1===arguments.length?this.ordinal!==e.ordinal:Array.prototype.slice.call(arguments,0).every((function(e){
return this.ordinal!==e.ordinal}),this)},gt:function(e){return this.ordinal>e.ordinal},gte:function(e){
return this.ordinal>=e.ordinal},lt:function(e){return this.ordinal<e.ordinal},lte:function(e){
return this.ordinal<=e.ordinal},bet:function(e,t){return this.ordinal>=e.ordinal&&this.ordinal<=t.ordinal},
toString:function(){return this.description},toFullString:function(){
return(this.group?this.group+":":"")+(this.name||"<sym>")+(void 0===this.ordinal?"":" ("+this.ordinal+")")}},
Object.defineProperty(n.prototype,"isaSym",{value:!0}),n.get=function(e,n){var i=t[e];if(i){switch(typeof n){
case"number":return i.ordinalIndex[n]||null;case"string":return i[n]||null}return null}},
"undefined"==typeof exports?e.Sym=n:exports.Sym=n}function n(){
for(var e,n,i,o=Array.prototype.slice.call(arguments),r=!1,a=0;a<o.length&&!r;a++){var s=o[a];switch(typeof s){
case"number":void 0===n?n=s:r=!0;break;case"string":void 0===e&&void 0===n?e=s:void 0===i?i=s:r=!0;break;default:r=!0}}
if(Object.defineProperty(this,"name",{value:e}),Object.defineProperty(this,"ordinal",{value:n}),
Object.defineProperty(this,"group",{value:i}),r)throw new Error("Invalid argument specified for the Sym constructor")
;i&&(t[i]||(t[i]={ordinalIndex:[]}),t[i][this.name]=this,void 0!==this.ordinal&&(t[i].ordinalIndex[this.ordinal]=this))}
}(),function(){"use strict";var e="object"==typeof self?self:global;if(!e.Variant){var t,n,i=function(e,t){this.ord=e,
this.name=t
},o=new i(0),r=new i(1),a=new i(0),s=new i(0),l=new i(0),c=new i(0),u=new i(0),d=new i(0,"none"),h=new i(1,"failures"),p=new i(2,"changes"),g=new i(3,"all"),m=new i(4,"debug"),f=new i,v="..",y=0,b={},w=!1,x=!1,P=[],_=[],E=1e4,k=null,S=function(){
var e=[];function t(t,n){var i=t?(t.name||t.id||t.desc||t).toString():t;i?i.length>n?(e.push(i.substring(0,n)),
e.push("…")):e.push(i):e.push(new String(i))}function n(t){
if(0===t);else if(1===t)e.push(v);else if(String.prototype.repeat)e.push(v.repeat(t));else for(var n=t-1;n--;)e.push(v)}
return function(i,d,f,v,b,S,C,T,I){if(w||x){var L=y-i.ord,O=S||"log",A=void 0!==T,M=!1,j=!1;switch(e.length=0,i){case r:
case u:
M=d.extLogVerbosity.ord>=p.ord||d.extLogVerbosity===h&&i===u||I,j=d.intLogVerbosity.ord>=p.ord||d.intLogVerbosity===h&&i===u||I,
(M||j)&&(n(L),e.push(d.name),e.push(": "),t(v,d.maxStringLen),e.push(i===r?" ➜ ":" ⇏ "),t(f,d.maxStringLen),
b&&e.push(", ↻"),d.isLocked()&&e.push(", ⚷"),A&&(e.push(", ✔ ("),t(T,d.maxStringLen),e.push(")")),C&&(e.push(", "),
e.push(C)));break;case o:case c:if(M=d.extLogVerbosity.ord>=g.ord,j=d.intLogVerbosity.ord>=g.ord,M||j){n(L),
e.push(d.name),e.push(i===o?": ◀ ":": ◁ ");var B=f.name||f.id||f.desc;if(!B){var N=typeof f
;B=("function"===N?"<anonymous function>":"object"===N&&"<unnamed object>")||"<invalid listener of type "+N+">"}
e.push(B)}break;case s:M=d.extLogVerbosity.ord>=g.ord,j=d.intLogVerbosity.ord>=g.ord,(M||j)&&(n(L),e.push(d.name),
e.push(": ⛒ "));break;case a:M=d.extLogVerbosity===m,j=d.intLogVerbosity===m,(M||j)&&(n(L),e.push(d.name),e.push(": "),
e.push(f),e.push(" ⇊ "),e.push(v));break;case l:M=d.extLogVerbosity.ord>=p.ord,j=d.intLogVerbosity.ord>=p.ord,
(M||j)&&(n(L),d.name&&(e.push(d.name),e.push(": ")),e.push(f))}var R=e.length?e.join(""):null
;if(null!==R&&(!k||k(R))&&(w&&M&&z.logger[O]&&z.logger[O](R),x&&j)){if("trace"===O){var D=new Error;if(!D.stack)try{
throw D}catch(e){}R+=D.stack?D.stack.substring(D.stack.indexOf("\n")):""}_.push(Date.now()),P.push(R),
P.length>E&&(_.shift(),P.shift())}}}}();z.prototype={_listeners:null,_listenerCount:0,_validator:void 0,_disposed:null,
_changeInProgress:!1,_delayedCompaction:!1,_parent:void 0,_errorMessage:null,_locked:!1,extLogVerbosity:d,
intLogVerbosity:d,listenerLoopAction:"warn",maxStringLen:30,meta:null,read:null,get:function(){return C(this),
this._value},set:function(e,t){C(this,null,this._changeInProgress)
;var n,i,o=this._value,a=!1,s=this._changeInProgress,l=this._listeners,c=!0,d=!1
;if(!this._locked||this._key&&t===this._key)if(this._validator){
var h=this._validator(e,o,this,this._parent),p=typeof h,g="string"===p?h:null;!h||g?(c=!1,
S(u,this,e,o,s,null,g)):"object"===p&&(void 0!==h.correction&&h.correction!==e&&(void 0!==h.uncorrectedValue?h.uncorrectedValue!==h.correction&&(n=h.uncorrectedValue):e!==h.correction&&(n=e),
e=h.correction),i=h.note,a=h.forceLog,d=h.skipEquivTest),this._errorMessage=g}else this._errorMessage=null;else c=!1,
this._errorMessage="Variant is locked",S(u,this,e,o,s);if(c&&(e!==o||d)){this._changeInProgress=!0,y++,this._value=e
;try{if(S(r,this,e,o,s,null,i,n,a),l)for(var m=0,f=l.length;m<f&&e===this._value;m++){var v=l[m],b=v?typeof v:null
;"remove"===(h="function"===b?v(e,o,this,this._parent):"object"===b&&v.handleVarChange?v instanceof z&&v._disposed?"remove":v.handleVarChange(e,o,this,this._parent):null)&&this.removeListener(v)
}}finally{s||(this._changeInProgress=!1),y--}}return this._delayedCompaction&&T(this),c},addListener:function(e){
C(this,e),this._locked!==f&&(Array.isArray(e)?e.forEach((function(e){this.addListener(e)
}),this):e&&(this._listeners?-1===this._listeners.indexOf(e)&&this._listeners.push(e):this._listeners=[e],
this._listenerCount++,S(o,this,e)))},removeListener:function(e){var t=this._listeners,n=!1;if(e&&t&&t.length){
if(Array.isArray(e)&&e.length)for(var i=e,o=0,r=0;r<i.length;r++){var a=i[r],s=t[o];a&&(a!==s&&(o=t.indexOf(a)),
-1!==o&&(t[o++]=null,this._listenerCount--,n=!0,S(c,this,a)))}else-1!==(o=t.indexOf(e))&&(t[o]=null,
this._listenerCount--,n=!0,S(c,this,e));T(this)}return n},removeAllListeners:function(){
this.removeListener(this._listeners)},handleVarChange:function(e,t,n){if(this._disposed)return"remove"
;var i=this._value&&this._value.handleVarChange?this._value:null;return i?i.handleVarChange(e,t,n,n._parent,this):void 0
},dispose:function(){this._disposed||(this._disposed=!0,this._listeners=null,this._listenerCount=0,this._parent=null,
this._validator=null,this._value=null,this._locked=!1,this.meta=null,S(s,this))},lock:function(e,t){
var n=!0===e||!0===t,i=e instanceof z.Key?e:t instanceof z.Key?t:null
;this._locked===f||this._locked&&this._key&&i!==this._key||(i&&(this._key=i),this._locked=!n||f)},unlock:function(e){
this._locked===f||this._key&&e!==this._key||(this._locked=!1,this._key=null)},isLocked:function(){
return this._locked===f?"permanent":this._locked},getParent:function(){return this._parent},getErrorString:function(){
return this._errorMessage},log:function(e,t){e&&(e===this&&(e=this.toString().substring(this.name.length+2)),
S(l,this,e.toString(),null,!1,t))},toString:function(){var e=this.name+": "
;return this._disposed?e+="disposed":(e+="value="+this.get(),
this._locked===f?e+=", permanently locked":e+=", #-listeners="+this._listenerCount+(this._locked?", locked":"")),
e+=", rec-verbosity="+this.intLogVerbosity.name+", log-verbosity="+this.extLogVerbosity.name}},
Object.defineProperty(z.prototype,"val",{get:z.prototype.get,set:z.prototype.set}),
Object.defineProperty(z.prototype,"isDisposed",{get:function(){return this._disposed}}),z.addListener=function(e,t,n){
if(n){var i=t,o=n.split(".");t=[],i.forEach((function(e){var n=o.reduce((function(e,t){return e[t]}),e);t.push(n)}))}
t.forEach((function(t){t.addListener(e)}))},z.removeListener=function(e,t,n){if(n){var i=t,o=n.split(".");t=[],
i.forEach((function(e){var n=o.reduce((function(e,t){return e[t]}),e);t.push(n)}))}t.forEach((function(t){
t.removeListener(e)}))},z.enableLogs=(t=!1,function(e,n,i,o,r){if(w=e,x=n,E="number"==typeof o&&o||E,k=r,!i){
var a="Variant log legend: ➜ Value change,  ⇏ Failed validation,  ✔ Correction,  ⚷ Locked,  ↻ Listener loop,  ◀ Add listener,  ◁ Remove listener,  ⛒ Dispose,  .. Nesting depth"
;e&&z.logger.log(a),n&&!t&&(P.unshift(a),_.unshift(Date.now()),t=!0)}}),z.log=(n={name:null,intLogVerbosity:p},
function(e,t,i){n.extLogVerbosity=i||z.log.displayAll?p:d,S(l,n,""+e,null,!1,t)}),z.log.displayAll=!1,
z.clearLogs=function(){P.length=0,_.length=0},z.getLogs=function(){var e,t,n,i=new Date;function o(t,o,r){
return t+function(e){i.setTime(e);var t=i.getHours(),n=i.getMinutes(),o=i.getSeconds(),r=i.getMilliseconds()
;return(t<10?"0"+t:t)+":"+(n<10?"0"+n:n)+":"+(o<10?"0"+o:o)+"."+(r<10?"00"+r:r<100?"0"+r:r)}(n[r])+" · "+o+e}
return function(i,r){var a=r&&r.excludeTimestamps||!1,s=r&&r.limit||1/0;return e=r&&r.eol||"\n",i?(t=[],n=a?null:[],
P.forEach((function(e,o){var r=_[o];i(e,r)&&(t.push(e),a||n.push(r))}))):(t=P,n=_),t.length>s&&(t=t.slice(t.length-s),
n&&(n=n.slice(n.length-s))),a?t.join(e):t.reduce(o,"")}}(),z.define=function(e,t,n){return n._parent=e,
Object.defineProperty(e,t,{get:n.get.bind(n),set:n.set.bind(n)}),n},z.Key=function(){},z.logger=e.console,z.LOG_NONE=d,
z.LOG_FAILURES=h,z.LOG_CHANGES=p,z.LOG_ALL=g,z.LOG_DEBUG=m,"undefined"==typeof exports?e.Variant=z:exports.Variant=z}
function C(e,t,n){if(e._disposed)throw new Error('Access denied to disposed variant "'+e.name+'"')
;if(t&&t._disposed)throw new Error('Cannot add disposed variant "'+t.name+'" as a listener to variant "'+e.name+'"')
;if(n&&e.listenerLoopAction){var i='Listener loop detected involving variant "'+e.name+'"';switch(e.listenerLoopAction){
case"warn":z.logger.warn(i);break;case"throw":throw new Error(i)}}}function T(e){
if(e._changeInProgress)e._delayedCompaction=!0;else{var t=e._listeners;if(t){var n=t.length
;e._listenerCount?t.length>=10&&t.length>=2*e._listenerCount&&(t=t.filter((function(e){return!!e})),
e._listenerCount=t.length,e._listeners=t,e._delayedCompaction=!1,S(a,e,n,t.length)):(t.length=0,e._delayedCompaction=!1,
S(a,e,n,0))}}}function z(e){for(var t=!0,n=1;n<arguments.length;n++){var o=arguments[n]
;switch(o instanceof i?"Sym":typeof o){case"string":var r=o;break;case"function":this._validator=o;break;case"Sym":
t?(this.intLogVerbosity=o,t=!1):this.extLogVerbosity=o;break;case"object":Array.isArray(o)?(this._listeners=o,
this._listenerCount=o.length):this._parent=o}}if(-1!==(r=r||"variant-#").lastIndexOf("#")){var a=b[r]||1;b[r]=a+1,
r=r.replace("#",a)}this.name=r,this._value=e}}(),function(){"use strict"
;var e="object"==typeof globalThis?globalThis:"object"==typeof self?self:"object"==typeof global?global:this
;if(!e.StateCell){var t=" ➜ ",n=" ⇏ ",i={log:null,logger:e.console,logPrefix:""},o={_name:"<nameless cell>",_state:null,
_handlers:null,_options:Object.freeze(Object.assign({},i)),get name(){return this._name},get state(){return this._state
},onEvent:function(e,t,n){var i=this;return this._handlers=this._handlers||new Map,
Array.isArray(t)?t.forEach((function(t){l(e,t,i,n)})):t&&"object"==typeof t?Object.values(t).forEach((function(t){
l(e,t,i,n)})):l(e,t,this,n),this},handleEvent:function(e,t,n){
var i=null,o=this._options.logger,r=n&&!0===n.log||this._options.log,l=this._state;if(s(e,"event",this),this._handlers){
var c=this._handlers.get(this._state);i=c?c.get(e):null}if(!i)return r&&a(this,e,l,void 0,"no handler"),!1;try{
var u=i(e,t,this._context)}catch(t){return(o.error||o.log).call(o,t.stack||t.message||t),
a(this,e,l,void 0,"handler threw exception; state unchanged"),!1}var d=u&&"object"==typeof u,h=d?u.newState:u
;return d&&u.cancel?(r&&a(this,e,l,void 0,"canceled"),!1):(h=null==h?l:h,this._handlers.has(h)?(this._state=h,
r&&a(this,e,l,h,null===this._handlers.get(h)?"terminus":void 0),!0):(a(this,e,l,h,"invalid new state",!0),!1))}
},r=function(e,t,n,r){var a=!1;if(t&&"object"==typeof t&&(Array.isArray(t)||(t=Object.values(t)),a=t.length>0),
!a)throw Error('Parameter "definedStates" must be an object or array containing at least one state')
;var s=Object.create(o);return e&&(s._name=e),s._state=t[0],s._context=Object.assign({},n),s._handlers=new Map,
r&&(s._options=Object.freeze(Object.assign({},o._options||i,r))),t.forEach((function(e){s._handlers.set(e,null)})),s}
;r.setDefaultOptions=function(e){o._options=Object.freeze(Object.assign({},i,e))},
"undefined"==typeof exports?e.StateCell=r:exports.StateCell=r}function a(e,i,o,r,a,s){
var l=e._options.logger,c=void 0!==r&&r!==o,u=s?n:t,d=(e._options.logPrefix||"")+e._name+": ["+i+"], "+o+(c?u+r:"")+(a?"  ("+a+")":"")
;s?(l.error||l.log).call(l,d):l.log(d)}function s(e,t,n){switch(typeof e){case"symbol":case"string":case"boolean":
case"number":case"bigint":break;default:
var i="Invalid "+t+" type specified. value="+e+", type="+typeof e+", cell="+n._name;throw Error(i)}}function l(e,t,n,i){
s(e,"event",n),s(t,"state",n);var o=n._handlers.get(t)
;if(void 0===o)throw new Error('Specified state "'+t+'" was not declared for cell "'+n._name+'"');null===o&&(o=new Map,
n._handlers.set(t,o)),o.set(e,i?i.bind(n):null)}}(),function(){"use strict";var e=window.jigexGlobals,t=e.modules
;if(t&&!t.base){if(!t.bundled){
var n=[e.scriptsDir+"open-console.js",e.scriptsDir+"sym.js",e.scriptsDir+"variant.js",e.scriptsDir+"state-cell.js"]
;e.debug&&n.push(e.scriptsDir+"variant.test.js"),n.forEach((function(e){t.load(e,t.update)}))}var i="1.12.4",o=!1
;t.load([e.homeDomain+"program/jquery-"+i+".min.js",e.cdnDomain+"scripts/jquery-"+i+".min.js","//code.jquery.com/jquery-"+i+".min.js"],(function(){
"function"==typeof window.jQuery?window.jQuery((function(){
o=!0,(window.openConsole||window.console).log('module "jQuery" has initialized'),t.update()
})):e.reloadProg("jQuery did not initialize")}));var r=function(){var n=window.Variant;t.console=window.openConsole,
t.Sym=window.Sym,t.StateCell=window.StateCell,t.StateCell.setDefaultOptions({logger:window.openConsole}),t.Variant=n,
t.Variant.logger=window.openConsole,t.Variant.enableLogs(!0,"verbose"===e.debug,!0),t.base=!0}
;r.dependenciesReady=function(){return!!(window.openConsole&&window.Sym&&window.StateCell&&window.Variant&&o)},
t.addModInit("base",r)}}(),function(){"use strict";var e=window.jigexGlobals.modules;if(e&&!e.footer){var t=function(){
var t,n=e.console,i=e.StateCell,o=["AdThrive_Footer_1_desktop","AdThrive_Footer_1_tablet","AdThrive_Footer_1_phone"],r={
childList:!0
},a=document.getElementById("adthrive_sticky_footer"),s=document.getElementById("jigex-ad-background"),l=document.getElementById("jigex-ad-close-pop"),c=document.getElementById("jigex-ad-close-btn"),u=function(){
if(l&&"showPopover"in HTMLElement.prototype)try{return l.matches(":popover-open"),!0}catch(e){}return!1
}(),d="ad-container-prepared",h="new-ad-is-displayed",p="ad-ended",g="jigex-ad-close",m="adthriveFooterClose",f="timer-expired",v="prepping-for-ads",y="prepped-for-first-ad",b="ad-display-cycling",w="ad-closed",x=[v,y,b],P=((t=new i("ad-controller",[v,y,b,w],null,{
log:!0,logger:window.openConsole})).onEvent(d,v,(function(e,t,n){return t.includes("phone")&&(n.isaPhone=!0),
setTimeout((function(e){e&&e.handleEvent(f)}),1e4,this),y})).onEvent(f,[v,y],(function(){
queueMicrotask(t.handleEvent.bind(t,g))})).onEvent(h,[y,b],(function(e,t,n){return s&&(s.style.visibility="visible"),
n.raptiveCloseBtn=t,l&&!l.popoverIsShowing()&&queueMicrotask((function(){l.style.display="block",l.showPopover()})),b
})).onEvent(p,b,(function(e,t,n){n.raptiveCloseBtn=null})).onEvent(g,x,(function(e,n,i){
return queueMicrotask((function(){if(i.raptiveCloseBtn)try{return void i.raptiveCloseBtn.click()}catch(e){}
t.handleEvent(m)})),null})).onEvent(m,x,(function(){var e=document.getElementById("jigex-noads-btn")
;return E&&(E.disconnect(),E=null),s&&s.parentNode&&(s.parentNode.removeChild(s),s=null),
l&&l.parentNode&&(l.parentNode.removeChild(l),l=null),c&&c.parentNode&&(c.parentNode.removeChild(c),c=null),
a&&a.parentNode&&(a.parentNode.removeChild(a),a=null),e.style.display="none",window.removeEventListener(m,_),
document.removeEventListener(m,_),w})),t),_=P.handleEvent.bind(P,m);window.addEventListener(m,_),
document.addEventListener(m,_);var E=new MutationObserver((function(e){for(var t=0;t<e.length;t++){var n=e[t]
;if(n&&n.addedNodes)for(var i=0;i<n.addedNodes.length;i++){var a=n.addedNodes[i];a&&(o.includes(a.id)?(E.observe(a,r),
P.handleEvent(d,a.id)):a.className&&-1!==(" "+a.className+" ").indexOf(" adthrive-close ")&&P.handleEvent(h,a))}
if(n&&n.removedNodes)for(t=0;t<n.addedNodes.length;t++)(a=n.removedNodes[t])&&a.className&&-1!==(" "+a.className+" ").indexOf(" adthrive-close ")&&P.handleEvent(p)
}}));a&&E.observe(a,r)
;var k=document.getElementById("AdThrive_Footer_1_desktop")||document.getElementById("AdThrive_Footer_1_tablet")||document.getElementById("AdThrive_Footer_1_phone")
;if(k){E.observe(k,r),P.handleEvent(d,k.id);var S=document.querySelector(".adthrive-close")
;S&&queueMicrotask(P.handleEvent.bind(P,h,S))}var C=new MutationObserver((function(e){for(var t=0;t<e.length;t++){
var n=e[t];if(n&&n.addedNodes)for(var i=0;i<n.addedNodes.length;i++){var o=n.addedNodes[i]
;o&&o.className&&"string"==typeof o.className&&o.className.includes("adthrive-comscore")&&(o.style.display="none",
C.disconnect(),C=null)}}}));C.observe(document.body,{childList:!0});var T=new MutationObserver((function(e){
for(var t=e.length-1;t>=0;t--){var n=e[t];if(n&&n.addedNodes)for(var i=n.addedNodes.length-1;i>=0;i--){
var o=n.addedNodes[i];if(o&&o.id&&"string"==typeof o.id&&o.id.includes("gdpr-toggle"))return o.style.display="none",
void T.disconnect()}}}));T.observe(document.body,{childList:!0});s&&Object.assign(s.style,{backgroundColor:"white",
opacity:"0.50",visibility:"hidden",width:"100%",height:"90px",position:"fixed",bottom:"0",left:"0",zIndex:"90000"}),
l&&(Object.assign(l.style,{display:"none",backgroundColor:"white",width:"34px",height:"90px",position:"fixed",
margin:"0",padding:"0",bottom:"0",right:"0",top:"auto",left:"auto",border:"none",borderLeft:"1px solid #ccc",
borderTop:"1px solid #ccc"}),u?(l.popoverIsShowing=function(){return l.matches(":popover-open")},
l.popoverIsShowing()&&l.hidePopover()):(l.showPopover=function(){this.style.display="block"},l.hidePopover=function(){
this.style.display="none"},l.popoverIsShowing=function(){return"block"===l.style.display},l.hidePopover(),
l.style.zIndex=Number.MAX_SAFE_INTEGER)),c&&(Object.assign(c.style,{display:"inline-block",backgroundColor:"white",
color:"DarkGray",fontFamily:"sans-serif",fontSize:"16px",textAlign:"center",width:"22px",height:"20px",
borderStyle:"solid",borderWidth:"1px",borderColor:"#bbb",borderRadius:"16px",marginTop:"33px",marginLeft:"5px",
cursor:"pointer"}),c.addEventListener("click",P.handleEvent.bind(P,g))),e.footer={closeAd:P.handleEvent.bind(P,g),
test:function(){n.log("Pop = "+l.popoverIsShowing())}}};t.dependenciesReady=function(){return!!e.base},
e.addModInit("footer",t)}}(),function(){"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.SonicH5){
var n=function(){
var n=e.resDir+"audio/",i="https://s3.amazonaws.com/jigex-pub-res/media/audio/",o=.3,r=!1,a="loading",s="ready",l="failed"
;!function(){try{var e=new Audio;e.volume=.5,r=1===e.volume}catch(e){}}();var c,u,d,h,p=t.console,g=[]
;t.SonicH5=function(t){var n,i,c;g.push(this),this.name=t,this.state=a,this.play=function(){var t=e.audioMuted()
;if(!this.audio||this.state===l||t&&this.state!==a)p.log.once("h5 sound failed to play: name=%s, muted=%s, audio=%s, state=%s",this.name,t,!!this.audio,this.state);else{
p.detail.once("sound play: name="+this.name+", state="+this.state+", audState="+this.audio.readyState+", err="+(this.audio.error?this.audio.error.message:"n/a")+", src="+this.audio.src)
;var n=this.audio.play();n&&n.catch&&n.catch((function(e){p.error("AudioSound play error:",e)})),
this.state===s&&(this.state="played",p.log.once("first h5 sound played: name=%s",this.name))}},this.stop=function(){
this.audio&&this.state!==l&&(this.audio.pause(),this.audio.currentTime=0,this.audio.volume=o)},
this.fadeOut=(c=function(e){var t=e-n;if(n)if(t>=1e3)this.stop();else try{this.audio.volume=o*(1-t/1e3),
requestAnimationFrame(i)}catch(e){p.error.once("h5 audio fade failure: ",e.message)}else n=e,requestAnimationFrame(i)},
function(){r?this.stop():(n=0,i=c.bind(this),requestAnimationFrame(i))}),this.load=function(e){this.audio.src=e,
this.audio.load(),this.audio.volume=o,this.state=s}},t.SonicH5.prep=(c=function(e){
p.error("sound error: name="+e.name+", state="+e.state+", audState="+e.audio.readyState+", src="+e.audio.src+", err="+(e.audio.error?e.audio.error.message:"n/a")),
e.state===a?e.audio.src.includes(i)?(p.warn("failed to init "+e.name+" sound"),e.audio.removeEventListener("ended",u),
e.load(n+e.name+(r?"-ios.mp3":".mp3"))):(e.audio.src=i+"silence.mp3?cb="+Date.now(),
e.play()):e.audio.src.includes(i)?(p.warn("failed to load "+e.name+" sound"),
e.state=l):e.load(i+e.name+(r?"-ios.mp3?cb=":".mp3?cb=")+Date.now())},u=function(e,t){
p.detail("sound "+e.name+" initialized:, state="+e.state+", audState="+e.audio.readyState),
"ended"===t.type&&(e.audio.removeEventListener("ended",e.oninit),setTimeout((function(){
e.load(n+e.name+(r?"-ios.mp3":".mp3"))}),100))},d=function(){document.removeEventListener("mousedown",d),
document.removeEventListener("pointerdown",d),document.removeEventListener("touchstart",d),g.forEach((function(e){try{
e.audio=new Audio(n+"silence.mp3")}catch(t){
return void p.error('failed to create audio element for sound "'+e.name+'": '+t.message)}e.oninit=u.bind(null,e),
e.audio.addEventListener("error",c.bind(null,e)),e.audio.addEventListener("ended",e.oninit),e.audio.volume=o,e.play()}))
},h=!1,function(){h||(h=!0,document.addEventListener("mousedown",d),document.addEventListener("pointerdown",d),
document.addEventListener("touchstart",d))})};n.dependenciesReady=function(){return!!t.base},t.addModInit("SonicH5",n)}
}(),function(){"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.Sonic){var n=function(){
var n,i,o,r,a,s,l=e.resDir+"audio/",c=window.AudioContext||window.webkitAudioContext,u=null,d=t.utils,h=t.console,p=!1,g=t.utils.localStore
;if(e.forceAltAudio=g.getItem("jigex-alt-audio"),e.forceAltAudio)n=!0,h.log("forcing h5 audio");else try{c&&(u=new c),
n=!u}catch(e){h.error("failed to create audio context: "+e.message),n=!0}n?t.Sonic=t.SonicH5:(t.Sonic=function(n){
this.name=n,this.gain=null,this.buffer=null,this.source=null,this.failed=!1,this.play=function(){
var t=e.audioMuted(),n="silence"===this.name
;if(!this.isReady()||t&&!n)n?h.log.once("silence failed to play: mute=%s, buff=%s, failed=%s",t,!!this.buffer,this.failed):h.log.once("sound failed to play: name=%s, muted=%s, buff=%s, sil=%s, failed=%s",this.name,t,!!this.buffer,p,this.failed);else try{
var i=u.createBufferSource(),o=u.createGain();o.gain.value=.3,i.buffer=this.buffer,i.connect(o),
o.connect(u.destination),i.start(0),this.source=i,this.gain=o,n?p=!0:h.log.once("first sound played: name=%s",this.name)
}catch(e){this.failed=!0,h.error('sound "'+this.name+'" failed to play: ',e.message)}},this.fadeOut=function(){try{
this.gain&&this.gain.gain&&this.gain.gain.linearRampToValueAtTime(0,u.currentTime+1),
this.source&&this.source.stop(u.currentTime+1.1)}catch(e){
h.error('sound "'+this.name+'" failed to fade out: ',e.message)}},this.isReady=function(){
return!!this.buffer&&(p||"silence"===this.name)&&!this.failed}
;var i=new d.WebReq(l+n+".mp3","https://s3.amazonaws.com/jigex-pub-res/media/audio/"+n+".mp3");i.sonic=this,
i.onload=function(){try{h.log("typ=%s, len=%s",i.response,i.response?i.response.byteLength:"n/a"),
u.decodeAudioData(i.response,(function(e){i.sonic.buffer=e,h.log('sound "'+i.sonic.name+'" is loaded')}),(function(e){
var n="n/a"
;e&&(n="string"==typeof e?e:e.err||e.message||"unknown"),h.error('Sonic error for sound "'+i.sonic.name+'" (falling back to HTML5 audio): '+n),
t.Sonic=t.SonicH5}))}catch(e){h.error('failed to decode audio file "'+i.sonic.name+'": '+e.message)}},i.send()},
t.Sonic.prep=(i=!1,o=new t.Sonic("silence"),r=function(){o.isReady()&&(document.removeEventListener("mousedown",r),
document.removeEventListener("pointerdown",r),document.removeEventListener("touchstart",r),o.play(),
h.log("sound system is ready"))},function(){i||(i=!0,document.addEventListener("mousedown",r),
document.addEventListener("pointerdown",r),document.addEventListener("touchstart",r))})),
e.audioMuted=(a="jigex-opt-muted",s="true"===g.getItem(a),function(e){if(void 0===e)return s;s=!!e;try{
g.setItem(a,s.toString())}catch(e){h.warn("failed to write mute change to local store. err="+e.message)}}),
h.log("using %s audio",n?"html5":"web")};n.dependenciesReady=function(){return!!(t.base&&t.utils&&t.SonicH5)},
t.addModInit("Sonic",n)}}(),function(){"use strict";var e=window.jigexGlobals.modules;if(e&&!e.niftybar){
var t=function(){
var t,n,i,o,r,a,s,l,c,u,d,h,p,g,m,f,v,y,b,w,x,P,_,E,k,S,C,T,z,I,L,O,A,M,j,B,N=0,R=3,D=window.jQuery,G={},V={},F={},H=1,q=0,W=0,U=0,Y=e.console,X={
element:null,x:function(){return this.element?this.element.offset().left:0},y:function(){
return this.element?this.element.offset().top:0},width:function(){
return this.element?Math.min(this.element[0].clientWidth,window.innerWidth):window.innerWidth},height:function(){
return this.element?Math.min(this.element[0].clientHeight,window.innerHeight):window.innerHeight}},J={top:0,left:0,
visibility:"visible",opacity:"0"},K=function(e,t){var n=e.attributes;if(n)for(var i=n.length-1;i>=0;i--){var o=n[i]
;if(o.name===t)return void 0===o.value||"undefined"===o.value||""===o.value||!!o.value}return!1},Q=function(e,t,n){
return Function.prototype.bind?e.bind(t,n):function(){e.call(t,n)}
},Z=window.performance&&window.performance.now?function(){return window.performance.now()}:function(){return Date.now()
},$=function(e,t,n,i){var o=n?e.button.position():e.button.offset(),r=X.width();return o.top+=e.button.height()+(i||0),
o.left-=Math.round(t/2)-Math.round(e.width()/2),o.left=Math.max(0,o.left),o.left=Math.min(r-t,o.left),o},ee=(t=[],
n=function(e){var t,n=Z()-e.start;e.done=n>=e.duration,t=e.done?e.to:e.from+n/e.duration*(e.to-e.from),
e.target.css(e.prop,t),e.done&&e.onEnd&&e.onEnd(e.target)},i=function(){for(var e=!0,o=t.length-1;o>=0;o--){var r=t[o]
;r.done||n(r),r.done&&e?t.pop():e=!1}t.length&&window.requestAnimationFrame(i)},o=function(e,t,n,i){e.css(t,n),
i&&setTimeout((function(){i(e)}),1)},function(e,n,r,a,s){if(window.requestAnimationFrame){
var l=t.length,c=function(e,n){for(var i=t.length-1;i>=0;i--){var o=t[i];if(o.target===e&&o.prop===n)return o}
return null}(e,n),u=!!c,d=parseFloat(e.css(n));if(isNaN(d)){var h=e.attr("id")
;return Y.error("Invalid property value for tweening: targ="+h+", prop="+n+", val="+e.css(n)),void o(e,n,r,s)}
(c=c||{}).target=e,c.prop=n,c.from=d,c.to=r,c.duration=a,c.onEnd=s,c.done=!1,c.start=Z(),u||t.push(c),
l||window.requestAnimationFrame(i)}else o(e,n,r,s)}),te=(c=null,u=!1,d=0,r=1,a=[],s=function(e){
e.css("visibility","hidden"),e!==c&&h.free(e)},l=function(){var e="niftybar-ttip-"+r++,t=D('<div id="'+e+'"></div>')
;return t.isShowing=!1,t.timestamp=0,t.deactivate=function(){this.isShowing&&(this.isShowing=!1,d=Z(),
ee(t,"opacity",0,ae.tweenPeriod,s.bind(null,this)))},t.addClass("niftybar-tooltip"),D("body").append(t),t},h={
getToolTip:function(){return a.pop()||l()},free:function(e){a.push(e)}},{init:function(){u||(c=h.getToolTip(),u=!0)},
trigger:function(e){Z()-d<ae.tooltipDelay?this.show(e):e._tipTimer=setTimeout(this.show,ae.tooltipDelay,e)},
show:function(e){if(e){!e._tooltipWidth&&e.tooltip&&(e._tooltipWidth=ae.measure(e.tooltip))
;var t=$(e,e._tooltipWidth,!1,20);e._tipTimer=null,te.showAt(t,e.tooltip)}},showAt:function(e,t,n){
var i=e.left,o=e.top,r=n?h.getToolTip():c;r.html(t),r.isShowing||(J.top=o.toString()+"px",J.left=i.toString()+"px",
r.css(J),ee(r,"opacity",1,ae.tweenPeriod),r.isShowing=!0),n&&setTimeout((function(){r.deactivate(r)}),n)},
hide:function(e){e&&clearTimeout(e._tipTimer),c.isShowing&&c.deactivate()}}),ne=(p=function(e){
for(var t=[],n=0;n<e.length;n++){var i=new oe(D(e[n]),this);this.buttons.push(i),t.push(i)}return t},g=function(e){
for(var t=this.buttons.length-1;t>=0;t--){var n=this.buttons[t],i=-1===e.indexOf(n.id)?"none":"flex"
;n.button.css("display",i)}},function(e){
var t=e.find(".niftybar-button, .niftybar-icon-button, .niftybar-tab-button, .niftybar-dialog-button, .niftybar-menu-button")
;this._currTab=null,this.id=e[0].id,this.bar=e,this.buttons=[],this.addButtons=p,this.switchButtons=g,
this.id||(this.id="bar-"+q++),G[this.id]=this,this.addButtons(t)}),ie=function(){if(this._hoverTimer=null,
this._autoClick&&this.enabled()){this._autoClicked=!0;try{this.click()}catch(e){this._autoClicked=!1}
}else this.handleEvent({type:"mousehover",data:this})},oe=(m=function(e){
var t=e.button.closest(".niftybar-panel, .niftybar-dialog-panel, .niftybar-left-slide-panel")
;return t.length?F[t[0].id]:null},f=function(e){var t=e.panel,n=!t.visible();if(n){if(2!==t.type){var i=$(e,t._width,!0)
;J.top=i.top+"px",J.left=i.left+"px",t.panel.css(J)}e._autoClicked&&!e._touched&&(t._autoClose=!0)}t.visible(n)},
v=function(t){
var n=t.data,i=t.originalEvent&&"touch"===t.originalEvent.pointerType||"touchstart"===t.type||"touchend"===t.type
;if(!n)throw new Error("Unrecognized NiftyBar button id: "+t.target.id);var o=n["on"+t.type];switch(t.type){
case"touchstart":case"pointerdown":i&&(n._hoverTimer&&n.enabled()&&(clearTimeout(n._hoverTimer),n._hoverTimer=null),
te.hide(n),n._touched=!0,e.niftybar.touchScreen=!0);break;case"touchend":case"pointerup":case"mousehover":break
;case"click":if(n.enabled()){var r=Z();if(n._debounce&&r-n._clickTimestamp<ae.debouncePeriod)return
;if(n._clickTimestamp=r,te.hide(n),ae.onAnyButtonClick&&ae.onAnyButtonClick(n),n._response){var a=m(n)
;a&&(a.visible(!1),a.handleResponse(n))}else if(2===n.style)n.toggled(!0);else if(3===n.style){var s=m(n)
;s&&s.visible(!1),n.panel&&f(n)}else n.panel&&f(n);n._autoClicked=!1,n._touched=!1}break;case"mouseenter":
ae.mouseHoverDelay&&n.enabled()&&!n._touched&&(n._hoverTimer=setTimeout(Q(ie,n),ae.mouseHoverDelay)),
n.tooltip&&te.trigger(n);break;case"mouseleave":n._hoverTimer&&n.enabled()&&(clearTimeout(n._hoverTimer),
n._hoverTimer=null),te.hide(n);break;case"mousemove":n._hoverTimer&&n.enabled()&&(clearTimeout(n._hoverTimer),
n._hoverTimer=setTimeout(Q(ie,n),ae.mouseHoverDelay))}o&&n.enabled()&&(t.niftybarElement=n,o(t))},y=function(){
this.button.trigger("click")},b=function(){switch(this.style){case 1:
this.svg.css("color",this._enabled?this._color:"#b8b8b8"),
this.button.css("background-color",this._toggled?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0)");break;case 2:
this._toggled?this.button.addClass(this._selTabStyle):this.button.removeClass(this._selTabStyle);break;case 3:
this._enabled?this.button.removeClass("niftybar-disabled"):this.button.addClass("niftybar-disabled")}},w=function(e){
if(void 0===e)return this._toggled;if("function"==typeof e)this._isToggledCallback=e,
this.toggled(this._isToggledCallback());else if(e="toggle"===e?!this._toggled:!!e,this._toggled!==e&&(this._toggled=e,
this.refresh(),2===this.style))if(e){var t=this._toolbar._currTab;this._toolbar._currTab=this,t&&t.toggled(!1),
this.panel&&this.panel.visible(!0)}else this.panel&&this.panel.visible(!1,!0)},x=function(e){
if(void 0===e)return this._enabled&&(ae.enabled||4===this.style);e=!!e,this._enabled!==e&&(this._enabled=e,
this.refresh())},P=function(e){if(void 0===e)return this._debounce;e=!!e,this._debounce!==e&&(this._debounce=e)},
_=function(){return this.button?this.button.width():void 0},E=function(){return this.button?this.button.height():void 0
},function(e,t){var n=e.data("tooltip"),i=e.data("panel");this._enabled=!0,this._toggled=K(e[0],"data-toggled"),
this._clickTimestamp=0,this._hoverTimer=null,this._tipTimer=null,this._toolbar=t,this._response=e.data("response"),
this._color=e.css("color"),this._isToggledCallback=null,this._selTabStyle="niftybar-selected-tab",
this._autoClick=K(e[0],"data-auto-click"),this._autoClicked=!1,this._touched=!1,this._debounce=!0,this.id=e[0].id,
this.button=e,this.click=y,this.refresh=b,this.enabled=x,this.toggled=w,this.debounce=P,this.handleEvent=v,
this.tooltip=n||null,
this.width=_,this.height=E,this.panel=i?F[i]:null,e.hasClass("niftybar-button")?this.style=0:e.hasClass("niftybar-icon-button")?(this.style=1,
this.svg=e.children("svg:first")):e.hasClass("niftybar-tab-button")?this.style=2:e.hasClass("niftybar-menu-button")?this.style=3:e.hasClass("niftybar-dialog-button")&&(this.style=4),
this.tooltip&&(!0,this._tooltipWidth=ae.measure(this.tooltip)),this.onclick=e[0].onclick?e[0].onclick:null,
e[0].onclick=null,e.on("click",this,v),this.onmouseenter=e[0].onmouseenter?e[0].onmouseenter:null,
e[0].onmouseenter=null,e.on("mouseenter",this,v),this.onmouseleave=e[0].onmouseleave?e[0].onmouseleave:null,
e[0].onmouseleave=null,e.on("mouseleave",this,v),this.onmousemove=e[0].onmousemove?e[0].onmousemove:null,
e[0].onmousemove=null,e.on("mousemove",this,v),e.on("pointerdown",this,v),e.on("pointerup",this,v),
e.on("touchstart",this,v),e.on("touchend",this,v),this.id||(this.id="button-"+W++),V[this.id]=this,
e[0].hasAttribute("data-selected")&&this.toggled(!0),
e[0].hasAttribute("data-selected-tab-style")&&(this._selTabStyle=e.data("selected-tab-style"))}),re=(C=!1,T=function(){
var e=null;for(var t in F)if(F.hasOwnProperty(t)){var n=F[t];(!e||n._actOrder>e._actOrder)&&(e=n)}
return e&&e._actOrder?e:null},z=function(e){var t,n;if(void 0===(e=e||window.event).which&&(e.which=e.keyCode),
27===e.which)(t=T())&&t._dismissable&&(t.visible(!1),t.handleResponse("cancel"));else if(13===e.which){
var i=D("input, textarea").is(":focus")
;(n=(t=T())?t.panel.find(".niftybar-default-button").filter(":visible"):D()).length&&!i&&(n=V[n[0].id])&&n.click()}},
I=function(e){var t=T();if(t&&t._dismissByClick){var n=t.panel
;D(e.target).closest(n).length||("touchend"===e.type?setTimeout(Q(t.visible,t,!1),100):t.visible(!1))}},L=function(){
var e=function(e){e.css("display","none")},t=function(){this._actOrder=H++},n=null
;return window.addEventListener("keyup",(function(e){n&&27===e.which&&n._dismissable&&n.visible(!1)})),function(i,o){
if(void 0===this._showing&&(this._showing="block"===this.panel.css("display")),!arguments.length)return this._showing
;if("toggle"===i&&(i=!this._showing),i){if(this._showing=!0,this.panel.css("display","block"),
o)this.panel.css("opacity",1);else if(this.type===R){var r=n;this.panel.css("left",-this._width),
ee(this.panel,"left",0,ae.tweenPeriod),n=this,r&&r.visible(!1)}else ee(this.panel,"opacity",1,ae.tweenPeriod)
;this.type!==N&&setTimeout(Q(t,this),0),this.onShow&&this.onShow(this)}else this._showing=!1,this._autoClose=!1,
this._actOrder=0,
o?(this.panel.css("opacity",0),e(this.panel)):this.type===R?(ee(this.panel,"left",-this._width,ae.tweenPeriod,e),
n===this&&(n=null)):ee(this.panel,"opacity",0,ae.tweenPeriod,e)}}(),k={},O=function(){
var e=this.panel.width(),t=this.panel.height(),n=X.width()||document.documentElement.clientWidth||document.body.clientWidth,i=X.height()||document.documentElement.clientHeight||document.body.clientHeight
;k.left=X.x()+Math.round((n-e)/2),k.top=X.y()+Math.round((i-t)/2),this.panel.offset(k)},A=function(e){
"string"!=typeof e&&(e=e._response),this.response=e,this.onResponse&&this.onResponse(e)},M=function(){
this._autoCloseTimer&&clearTimeout(this._autoCloseTimer)},S=function(){this.visible(!1)},j=function(){
this._autoClose&&(this._autoCloseTimer=setTimeout(Q(S,this),500))},function(e){var t=!K(e[0],"data-no-dismiss")
;this.panel=e,this.id=e[0].id,this.visible=L,this.response=null,this.center=O,this.onResponse=null,this.onShow=null,
this.handleResponse=A,this._width=e.width(),this._actOrder=0,this._autoClose=!1,this._autoCloseTimer=null,
e.hasClass("niftybar-panel")?(this.type=1,
this._dismissable=t,this._dismissByClick=t):e.hasClass("niftybar-sub-panel")?(this.type=N,this._dismissable=!1,
this._dismissByClick=!1):e.hasClass("niftybar-dialog-panel")?(this.type=2,this._dismissable=t,
this._dismissByClick=t&&0===e.find("[data-response]").length):e.hasClass("niftybar-left-slide-panel")&&(this.type=R,
this._dismissable=t,this._dismissByClick=t),this.id||(this.id="panel-"+U++),e.mouseenter(Q(M,this)),
e.mouseleave(Q(j,this)),F[this.id]=this,C||(C=!0,window.document.addEventListener("keydown",z,!1),
window.document.addEventListener("click",I,!1),window.document.addEventListener("dblclick",I,!1),
window.document.addEventListener("touchend",I,!1))}),ae={getBar:function(e){return G[e]},getBtn:function(e){return V[e]
},getPnl:function(e){return F[e]},setRoot:(B=null,function(e){"object"==typeof(B=e)&&(X.element=B instanceof D?B:D(B))
}),showTooltip:te.showAt,onAnyButtonClick:null,measure:function(e){return ae.ruler.html(e),ae.ruler.width()+24},
mouseHoverDelay:200,tooltipDelay:1200,tweenPeriod:200,debouncePeriod:250,touchScreen:!1}
;ae.enabledVar=Variant.define(ae,"enabled",new Variant(!0,"niftybar.enabled"))
;var se=D(".niftybar, .niftybar-dialog-bar"),le=D(".niftybar-panel, .niftybar-sub-panel, .niftybar-dialog-panel, .niftybar-left-slide-panel")
;ae.ruler=D('<span id="niftybar-ruler"></span>'),ae.ruler.addClass("niftybar-ruler"),D("body").append(ae.ruler),
te.init(),le.each((function(e,t){new re(D(t))})),se.each((function(e,t){new ne(D(t))})),e.niftybar=ae}
;t.dependenciesReady=function(){return!(!e.base||!e.utils)},e.addModInit("niftybar",t)}}(),function(){"use strict"
;var e=window.jigexGlobals,t=e.modules;if(t&&!t.utils){var n=function(){var n,i,o,r,a,s,l,c,u,d,h,p,g,m,f={},v=t.console
;f.RADIANS_PER_DEGREE=Math.PI/180,f.SHOW_NONE=0,f.SHOW_ALWAYS=1,f.SHOW_FOR_DBG_ONLY=2,f.SHOW_FOR_FIELD_ONLY=3,
f.test=function(){},f.msgBox=function(e){alert(e)},f.List=function(){this.head=null,this.tail=null,this.length=0,
this._freeNodes=[]},f.List.prototype.forEach=function(e){for(var t=this.head;t;)e(t.item),t=t.next},
f.List.prototype._getNode=function(e){if(this._freeNodes.length){var t=this._freeNodes.pop();return t.item=e,t}return{
next:null,prev:null,item:e,imaLinkNode:!0}},f.List.prototype.addFirst=function(e){var t=e.imaLinkNode?e:this._getNode(e)
;return this.head?(t.next=this.head,this.head.prev=t,this.head=t):(this.head=t,this.tail=t),this.length++,t},
f.List.prototype.addLast=function(e){var t=e.imaLinkNode?e:this._getNode(e);return this.tail?(t.prev=this.tail,
this.tail.next=t,this.tail=t):(this.head=t,this.tail=t),this.length++,t},f.List.prototype.addBefore=function(e,t){
if(t&&!t.item)throw new Error("Utils: Reference to freed node not allowed.");if(t&&t.prev){
var n=e.imaLinkNode?e:this._getNode(e);return n.next=t,n.prev=t.prev,t.prev.next=n,t.prev=n,this.length++,n}
return this.addFirst(e)},f.List.prototype.addAfter=function(e,t){
if(t&&!t.item)throw new Error("utils: Reference to freed node not allowed.");if(t&&t.next){
var n=e.imaLinkNode?e:this._getNode(e);return n.next=t.next,n.prev=t,t.next.prev=n,t.next=n,this.length++,n}
return this.addLast(e)},f.List.prototype.moveToBeginning=function(e){
return e!==this.head&&(this.moveBefore(e,this.head),!0)},f.List.prototype.moveToEnd=function(e){
return e!==this.tail&&(this.moveAfter(e,this.tail),!0)},f.List.prototype.moveBefore=function(e,t){this.unlink(e),
this.addBefore(e,t)},f.List.prototype.moveAfter=function(e,t){this.unlink(e),this.addAfter(e,t)},
f.List.prototype.unlinkFirst=function(){var e=null;if(this.head)if(e=this.head,this.head=e.next,this.length--,
this.head)try{this.head.prev=null}catch(e){v.warn("List.unlinkFirst: Strange null head encountered"),this.head=null,
this.tail=null}else this.tail=null;return e.next=null,e.prev=null,e},f.List.prototype.unlinkLast=function(){var e=null
;return this.tail&&(e=this.tail,this.tail=e.prev,this.length--,this.tail?this.tail.next=null:this.head=null),
e.next=null,e.prev=null,e},f.List.prototype.unlink=function(e){
return this.head===e?this.unlinkFirst():this.tail===e?this.unlinkLast():e?(e.prev.next=e.next,e.next.prev=e.prev,
this.length--,e.next=null,e.prev=null,e):void v.warn("Link.unlink: Null node specified")},
f.List.prototype.find=function(e){for(var t=this.tail;t;){if(e(t.item))return t;t=t.prev}return null},
f.List.prototype.findLast=function(e){for(var t=this.tail;t;){if(e(t.item))return t;t=t.prev}return null},
f.List.prototype.dispose=function(e){var t=e.item;return t&&(this.unlink(e),e.prev=e.next=e.item=null,
this._freeNodes.push(e)),t},f.List.prototype.sanityCheck=function(){
for(var e=this.head,t=e;t&&t.next;)if((t=t.next)===e)throw new Error("Error: Circular linked list detected.")},
f.WebReq=(n=function(e,t){var n=e.altUrl?e.altUrl:t?e.url:null,i=e.image
;if(t&&(n+=(n.includes("?")?"&":"?")+"cb="+Math.round(1e3*Math.random())),n){if(i){var l=new Image;e.currUrl=n,
e.image=l,l.crossOrigin="anonymous",l.onload=r,l.onerror=s,l.webReq=e,l.src=n}else{var c=new XMLHttpRequest;e.currUrl=n,
e.xhr=c,e.progress=0,e.total=0,c.open("GET",n,!0),c.responseType=e.isBinary?"arraybuffer":"text",c.onload=a,c.onerror=s,
c.onprogress=o,c.webReq=e,c.send()}return!0}return!1},i=function(e){switch(e.state){case 1:e.state=2,n(e,!1)||i(e);break
;case 2:e.state=3,n(e,!e.otherParmsPresent)||i(e);break;case 3:
e.state=4,e.failedOnChromeBug||v.log("Download failure",e.url),e.onerror&&e.onerror(e)}},o=function(e){
var t=e.target.webReq;t&&!t.canceled&&(t.progress=e.loaded,t.total=e.total)},r=function(e){var t=e.target,n=t.webReq
;if(!n.canceled){
if(4===n.state)v.warn("onImageLoad invoked after image load failure");else if(5===n.state)return void v.warn("attempted to invoke onImageLoad a second time")
;if(n&&t.width&&t.height){if(n.state=5,n.response=t,n.onload){try{return void n.onload(n)}catch(e){
v.error("Failed to load image:",e)}s(e)}}else s(e)}},a=function(e){var t=e.target,n=t.webReq;if(n){if(!n.canceled){
if(4===n.state)v.warn("onLoad invoked after file load failure");else if(5===n.state)return void v.warn("attempted to invoke onLoad a second time")
;200!==t.status||n.isJson&&"{"!==t.responseText[0]?s(e):(n.failedOnChromeBug=!1,n.state=5,
n.response=n.isBinary?t.response:n.isJson?JSON.parse(t.responseText):t.responseText,n.onload&&n.onload(n))}}else s(e)},
s=function(e){var t,n,o=e.target.webReq
;o&&o.canceled||(o&&o.xhr&&4===o.xhr.readyState&&0===o.xhr.status&&navigator.userAgent.includes("Chrome")?(o.failedOnChromeBug=!0,
v.log("Chrome download bug encountered")):o?o.failedOnChromeBug=!1:v.warn("null webReq encountered"),
(n=(t=o)?t.image:null)?v.log("image download failure: cmplt="+n.complete+", w="+n.width+", h="+n.height+", nw="+n.naturalWidth+", nh="+n.naturalHeight+", url="+n.src):t?v.log("file download failure: state="+t.xhr.readyState+", status="+t.xhr.status+", prog="+t.progress+", tot="+t.total+", status text="+t.xhr.statusText+", url="+t.currUrl):v.log("file download failure"),
i(o))},(l=function(t,n,i){
var l=t.includes(e.fetchPath)?"%3F":"?",c=t.indexOf(l),u=-1===c?t.length-4:c-4,d=t.substring(u,u+4).toLowerCase(),h=".webm"===d||".mp3"===d
;if(void 0===i?".jpg"===d||"jpeg"===d||".png"===d||".webp"===d||".gif"===d:i){var p=new Image;p.crossOrigin="anonymous",
p.onload=r,p.onerror=s,p.webReq=this,this.image=p}else{var g=function(e){var t=new XMLHttpRequest;try{t.open("GET",e,!0)
}catch(n){v.log("webReq trapped: msg="+n.message+", url="+e),(t=new XMLHttpRequest).open("GET",e,!0)}return t}(t)
;g.responseType=h?"arraybuffer":"text",g.onload=a,g.onerror=s,g.onprogress=o,g.webReq=this,this.xhr=g,this.isBinary=h,
this.isJson="json"===d,this.onload=null,this.onerror=null,this.state=0,this.image=null,this.response=null,
this.progress=0,this.total=0,this.image=null}this.url=t,this.currUrl=t,this.altUrl=n,this.onload=null,this.onerror=null,
this.state=0,this.failedOnChromeBug=!1,this.otherParmsPresent=-1!==c,this.canceled=!1}).prototype={send:function(){
this.state=1,this.image?this.image.src=this.url:this.xhr.send()},cancel:function(){this.state>0&&(this.canceled=!0,
this.image?this.image.src="":this.xhr.abort(),v.log("webReq canceled: url="+this.url))}},l),f.postMsg=function(e,t){
var n=new XMLHttpRequest;n.open("POST",e,!0),n.send(t)},f.getRandomSeed=function(){
return Math.floor(1e8*Math.random())||f.getRandomSeed()},f.getRandomGenerator=function(e){
if(void 0===e)throw new Error("Missing seed value");var t=function(){e=(e|=0)+1831565813|0;var n=Math.imul(e^e>>>15,1|e)
;return(n=(((n=n+Math.imul(n^n>>>7,61|n)^n)^n>>>14)>>>0)/4294967296)||t()};return t},f.genGuuid=function(e){
for(var t=Date.now(),n=Math.random();0===n;)n=Math.random();var i=t.toString(36)+"-"+n.toString(36).substr(2)
;return e&&(i=e+i),i},f.isPowerOfTwo=function(e){switch(e){case 2:case 4:case 8:case 16:case 32:case 64:case 256:
case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:return!0;default:return!1}},
f.stringToVarName=function(e){var t=null;if(e){t=["_"];for(var n=0,i=e.length;n<i;n++){var o=e[n]
;o>="a"&&o<="z"||o>="A"&&o<="Z"||o>="0"&&o<="9"?t.push(o):t.push("_")}t=t.join("")}return t},f.xor=function(e,t){
return(e||t)&&!(e&&t)},f.sine=(c=null,u=null,function(e){switch(e){case 0:case 180:return 0;case 90:return 1;case 270:
return-1;default:return e!==c&&(c=e,u=Math.sin(e*f.RADIANS_PER_DEGREE)),u}}),f.cosine=function(){var e=null,t=null
;return function(n){switch(n){case 0:return 1;case 90:case 270:return 0;case 180:return-1;default:return n!==e&&(e=n,
t=Math.cos(n*f.RADIANS_PER_DEGREE)),t}}}(),f.fileNameFromPath=function(e){if(e){
var t=0===e.indexOf("http")?"/":"\\",n=e.lastIndexOf(t);if(-1!==n)return e.slice(n+1)}return""},f.localStore=function(){
var e=null;try{localStorage.setItem("jigex-testkey","testvalue"),localStorage.removeItem("jigex-testkey")}catch(t){
v.log("localStorage is not enabled"),e={}}return e?(e.key=function(e){return Object.keys(this)[e]},
e.getItem=function(e){return this[e]},e.setItem=function(e,t){this[e]=t},e.removeItem=function(e){
void 0!==this[e]&&delete this[e]},e.clear=function(){Object.keys(this).forEach((function(t){delete e[t]}))},
e.toString=function(){return JSON.stringify(this)},e.disable=function(){v.warn("polyStore should not be disabled")},
Object.defineProperty(e,"length",{get:function(){return Object.keys(e).length}}),
e):(Storage.prototype.disable=function(){var e=function(){return null};f.localStore={key:e,getItem:e,setItem:e,
removeItem:e,clear:e,toString:e,disable:e,length:0},v.log("localStorage is disabled")},localStorage)}(),
f.secureString=function(e){
return e&&(e.includes("&")&&(e=(e=(e=(e=(e=(e=e.replace(/&/g,"&amp;")).replace(/&amp;amp;/g,"&amp;")).replace(/&amp;lt;/g,"&lt;")).replace(/&amp;gt;/g,"&gt;")).replace(/&amp;apos;/g,"&apos;")).replace(/&amp;quot;/g,"&quot;")),
e=(e=(e=(e=e.replace(/</g,"&lt;")).replace(/>/g,"&gt;")).replace(/'/g,"&apos;")).replace(/"/g,"&quot;")),e},
f.convertTimestampToLocalDateAndTime=function(e){var t="";try{
t=new Date(e||0).toLocaleString(navigator.language||"en-US",{year:"numeric",month:"numeric",day:"numeric",
hour:"numeric",minute:"2-digit"})}catch(e){}return t},f.convertTimestampToTime=function(e){if(!e)return"00:00:00.000"
;var t=new Date(e),n=t.getHours(),i=t.getMinutes(),o=t.getSeconds(),r=t.getMilliseconds()
;return(n<10?"0"+n:n)+":"+(i<10?"0"+i:i)+":"+(o<10?"0"+o:o)+"."+(r<10?"00"+r:r<100?"0"+r:r)},
f.stringify=function(e,t,n,i){return JSON.stringify(e,function(e,t){var n=[],i=[];return t||(t=function(e,t){
return n[0]===t?"[Circular ~]":"[Circular ~."+i.slice(0,n.indexOf(t)).join(".")+"]"}),function(o,r){if(n.length>0){
var a=n.indexOf(this);~a?n.splice(a+1):n.push(this),~a?i.splice(a,1/0,o):i.push(o),~n.indexOf(r)&&(r=t.call(this,o,r))
}else n.push(r);return e?e.call(this,o,r):r}}(t,i),n)},f.sysTiming=(d=1/0,h=0,p=[],g=[],(m=function(e,t,n){
e&&t&&(this.setCount=0,this.set(e,n?t.bind(n):t))}).prototype={set:function(e,t){this._start=performance.now(),
this._duration=e||this._duration,this._callback=t||this._callback,this.expired=!1,this.startDate=Date.now(),
this.checked=0,this.setCount++,g.includes(this)||g.push(this)},clear:function(){this._start=NaN},armed:function(){
return!isNaN(this._start)},execute:function(e){if(this.armed()){var t=this._callback;this.clear(),this.expired=!!e,
t(this)}},log:function(e){
v.log("Timer log: msg="+e+", expd="+!!this.expired+", elap="+(this.armed()?(performance.now()-this._start).toFixed(2):"n/a")+", qued="+g.includes(this)+", chkd="+(Date.now()-this.checked)+"mS ago")
}},window.requestAnimationFrame?(window.requestAnimationFrame((function e(){var t=performance.now();t-h>500&&(d=t),h=t,
window.requestAnimationFrame(e);for(var n=g.length-1;n>=0;n--){var i=g[n]
;i.armed()?(h-i._start>=i._duration&&i.execute(!0),i.checked=Date.now()):g.splice(n,1),h=performance.now()}if(p.length){
var o=p;for(p=[];o.length;)o.shift()(),h=performance.now()}})),{get isRunning(){return performance.now()-h<500},
get stoppedDuration(){return this.isRunning?0:performance.now()-h},get runningDuration(){
return this.isRunning?performance.now()-d:0},onRunning:function(e){p.includes(e)||p.push(e)},Timer:m
}):(window.alert("This web browser does not provide the functionality required by Jigsaw Explorer's puzzle program."),
void t.haltInit())),t.utils=f};n.dependenciesReady=function(){return!!t.base},t.addModInit("utils",n)}}(),function(){
"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.ClipGL){var n=function(){
var n=t.console,i=t.Sym,o=t.Variant,r=null;t.onInitComplete((function(){r=t.player})),t.ClipGL=function(a,s){
var l=t.ClipGL;if(!(this instanceof l))return new l(a);if(l.insts||(l.insts={}),l.insts[a])return l.insts[a]
;l.insts[a]=this;var c=t.utils;n.log("creating ClipGL instance for "+a),l.isSupported=!!window.WebGLRenderingContext
;var u=this;u.error=null,u.isAvailable=!1,u.stableContext=!0,u.isReady=function(){
return!u.error&&u.isAvailable&&K.getError()!==K.CONTEXT_LOST_WEBGL};var d="tweenable property disposition",h={x:0,y:0
},p=new i("not_queued",2),g=new i("pending",1),m=new i("active",3),f=new i("completed",4),v=new i("delayed",5)
;u.TW_FINISH=new i("finish",1,d),u.TW_ABORT=new i("abort",1,d),u.TW_DISPOSE=new i("dispose",1,d),u.EASE_NONE=0,
u.EASE_IN=1,u.EASE_IN_SLOW=2,u.EASE_OUT=3,u.EASE_OUT_SLOW=4,u.EASE_IN_OUT=5
;var y,b,w,x,P,_,E,k,S,C,T,z,I,L,O,A,M,j,B,N,R,D,G,V,F,H,q,W,U,Y,X=function(){u.getClientRect=function(){
return u.canvas.getBoundingClientRect()},u.pixelWidth=1/u.canvas.width,u.pixelHeight=1/u.canvas.height,
u.aspect=u.canvas.width/u.canvas.height},J=function(){K.enable(K.BLEND),K.blendFunc(K.ONE,K.ONE_MINUS_SRC_ALPHA),X(),
u.isAvailable=!0};if(l.isSupported)if(window.requestAnimationFrame)if(u.canvas=document.getElementById(a),u.canvas){
n.log("canvas touch-action="+u.canvas.style.touchAction);var K=function(){
var e=["webgl","experimental-webgl","webkit-3d","moz-webgl"],t=null;n.log("get WebGL context")
;for(var i=0;i<e.length;++i){try{t=u.canvas.getContext(e[i],{alpha:!1,depth:!1,stencil:!1,antialias:!1})}catch(e){}
if(t)break}return t}();K&&K.enable?J():(u.error="WebGL is either unavailable or disabled",u.isSupported=!1)
}else u.error='Canvas "'+(a||"<no name>")+'" not found';else u.error="Graphics animation is unsupported by this browser version";else u.error="WebGL is unsupported by this browser version"
;if(u.error)return n.error("ClipGL: "+u.error),u;u.setClearColor=function(e,t){var n,i,o,r=parseInt(e.substr(1),16)
;n=(r>>16&255)/255,i=(r>>8&255)/255,o=(255&r)/255,K.clearColor(n,i,o,1),t&&K.clear(K.COLOR_BUFFER_BIT)},
s&&s.clearColor&&u.setClearColor(s.clearColor,!0),u.createTask=(y=1,b=[],w=[],x=function(){this.when=null,
this.keepAlive||(this.callback=null,this.data=null,this.delay=null,this.repeat=!1)},P=function(){
this.callback&&(this.when=Date.now()+this.interval,this.active||(this.active=!0,b.push(this)))},_=function(e,t,n){
var i={id:y++,callback:e,data:null,when:Date.now()+(t||0),repeat:n,interval:t,keepAlive:!1,cancel:x,restart:P,active:!0}
;return b.push(i),i},_.processAll=function(){for(var e=b.pop(),t=Date.now();e;)e.active=!1,e.when&&(e.when>t?(w.push(e),
e.active=!0):(e.callback&&e.callback(e.data),e.repeat?(e.when=t+e.interval,w.push(e),e.active=!0):e.cancel())),e=b.pop()
;if(w.length){var n=b;b=w,w=n}},_),u.onBenchmark=null,u.projector=(k=!0,S=!0,C=new Float32Array(100),T=0,z=!1,I=!1,
L=function(e){if(u.onBenchmark)if(C[T]=e,99===T){for(var t,n=0,i=99;i>0;i--)n+=C[i]-C[i-1];t=Math.round(1e3/(n/100)),
u.onBenchmark(t),C[0]=e,T=1}else T++;S||(u.isReady()&&(u.updateTweeners(e),u.updateAnimators(e),
(u.vertMngr.isModified()||z)&&(u.Clip.drawAll(),z&&(z=!1,setTimeout((function(e){E(e)
}),0,I?u.canvas.toDataURL("image/jpeg",.85):u.canvas.toDataURL()))),u.createTask.processAll()),
window.requestAnimationFrame(L))},{autoStart:function(){k&&this.start()},captureScreen:function(e,t){E=e,I=t,z=!0},
start:function(){S&&(S=!1,window.requestAnimationFrame(L))},stop:function(){k=!1,S=!0}}),
u.resize=(O=window.devicePixelRatio||1,A=null,M=null,j=function(){
var e=u.canvas,t=r.host.getWidth(),n=r.host.getHeightMinusToolbar();A=null,e.width=Math.round(O*t),
e.height=Math.round(O*n),K.viewport(0,0,e.width,e.height),X(),e.style.width=t,e.style.height=n,M&&M()},function(e){
M=e||null,A?A.when=Date.now()+1e3:A=u.createTask(j,1e3)}),u.vertMngr=(B=15,N=18e3,R=new Float32Array(N),
D=new Float32Array(N),G=0,V=!1,F=null,H=null,q=null,W=!1,U=function(e){F&&(e<F.modifiedAt?(F.modifiedAt=e,
F.numClips=0===F.numClips?1:Number.POSITIVE_INFINITY):e>=F.modifiedAt&&e<F.modifiedAt+F.numClips?F.numClips+=0:e===F.modifiedAt+F.numClips+1?F.numClips++:F.numClips=Number.POSITIVE_INFINITY),
H&&(e<H.modifiedAt?(H.modifiedAt=e,
H.numClips=0===H.numClips?1:Number.POSITIVE_INFINITY):e>=H.modifiedAt&&e<H.modifiedAt+H.numClips?H.numClips+=0:e===H.modifiedAt+H.numClips+1?H.numClips++:H.numClips=Number.POSITIVE_INFINITY)
},{stride:B,strideBytes:60,scaleOffset:2,transOffset:4,rotOffset:6,stateOffset:8,colorOffset:9,opaOffset:10,
tex0Offset:11,tex1Offset:13,reset:function(){this.shader=Y(),q=null,F=null,H=null,W=!0,U(0),V=!0},isModified:function(){
return V},shader:(Y=function(){var e=K.createShader(K.VERTEX_SHADER)
;if(!e)throw new Error("Unable to create vertex shader.")
;if(K.shaderSource(e,"precision highp float;uniform float aspect;uniform float invAspect;attribute vec4 pos;attribute vec2 a_texCoord0;varying vec2 v_texCoord0;attribute vec2 a_texCoord1;varying vec2 v_texCoord1;attribute float a_color;varying float v_color;attribute float a_opacity;varying float v_opacity;attribute float a_state;varying float v_state;attribute vec2 trans;attribute vec2 scale;attribute vec2 rot;varying vec2 v_rot;void main() {    v_texCoord0 = a_texCoord0;    v_texCoord1 = a_texCoord1;    v_color = a_color;    v_opacity = a_opacity;    v_state = a_state;    v_rot = rot;    gl_Position.x = (scale.x * rot.t * pos.x) + (invAspect * scale.y * rot.s * pos.y) + trans.x;    gl_Position.y = (aspect * scale.x * -rot.s * pos.x) + (scale.y * rot.t * pos.y) + trans.y;    gl_Position.z = pos.z;    gl_Position.w = pos.w;}"),
K.compileShader(e),!K.getShaderParameter(e,K.COMPILE_STATUS)){var t=K.getShaderInfoLog(e)
;throw new Error("Failed to compile vertex shader: err="+t)}return e})(),register:function(e){var t=G/B;if(G+90>N){
N=Math.round(1.5*N);var n=new Float32Array(N);n.set(R),R=n,D=new Float32Array(N),F&&(F.realloc=!0),H&&(H.realloc=!0)}
var i=R,o=G,r=e.width*u.pixelWidth,a=e.height*u.pixelHeight;return i[o++]=-1,i[o++]=1,i[o++]=r,i[o++]=a,i[o++]=0,
i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=-1,i[o++]=-1,i[o++]=r,
i[o++]=a,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=1,i[o++]=1,
i[o++]=1,i[o++]=r,i[o++]=a,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=1,i[o++]=0,i[o++]=1,
i[o++]=0,i[o++]=-1,i[o++]=-1,i[o++]=r,i[o++]=a,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,
i[o++]=1,i[o++]=0,i[o++]=1,i[o++]=1,i[o++]=1,i[o++]=r,i[o++]=a,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=0,
i[o++]=1,i[o++]=1,i[o++]=0,i[o++]=1,i[o++]=0,i[o++]=1,i[o++]=-1,i[o++]=r,i[o++]=a,i[o++]=0,i[o++]=0,i[o++]=0,i[o++]=1,
i[o++]=0,i[o++]=0,i[o++]=1,i[o++]=1,i[o++]=1,i[o++]=1,i[o++]=1,G=o,V=!0,t},deregister:function(e){W=!0,U(e._zOrder),V=!0
},addTexture0:function(e,t){if(e.active){var n=e._zOrder*B+11,i=R,o=t;i[n]=o[0],i[n+1]=o[1],i[n+=B]=o[2],i[n+1]=o[3],
i[n+=B]=o[4],i[n+1]=o[5],i[n+=B]=o[2],i[n+1]=o[3],i[n+=B]=o[4],i[n+1]=o[5],i[n+=B]=o[6],i[n+1]=o[7],U(e._zOrder),V=!0}},
addTexture1:function(e,t){if(e.active){var n=e._zOrder*B+13,i=R,o=t;i[n]=o[0],i[n+1]=o[1],i[n+=B]=o[2],i[n+1]=o[3],
i[n+=B]=o[4],i[n+1]=o[5],i[n+=B]=o[2],i[n+1]=o[3],i[n+=B]=o[4],i[n+1]=o[5],i[n+=B]=o[6],i[n+1]=o[7],U(e._zOrder),V=!0}},
move:function(e){if(e.active){for(var t=e._zOrder*B+4,n=e.position._oglX,i=e.position._oglY,o=0;o<6;o++)R[t]=n,R[t+1]=i,
t+=B;U(e._zOrder),V=!0}},rotate:function(e){if(e.active){var t=e._zOrder*B+6,n=e._angle.renderedValue
;n=n>=360?n-360:n<0?n+360:n;for(var i=0;i<6;i++)R[t]=c.sine(n),R[t+1]=c.cosine(n),t+=B;U(e._zOrder),V=!0}},
setSize:function(e){if(e.active){for(var t=e._zOrder*B+2,n=0;n<6;n++)R[t]=e.width*u.pixelWidth,
R[t+1]=e.height*u.pixelHeight,t+=B;U(e._zOrder),V=!0}},setColor:function(e){if(e.active){
for(var t=e._zOrder*B+9,n=0;n<6;n++)R[t]=e._color,t+=B;U(e._zOrder),V=!0}},setOpacity:function(e){if(e.active){
for(var t=e._zOrder*B+10,n=0;n<6;n++)R[t]=e._opacity.renderedValue,t+=B;U(e._zOrder),V=!0}},setState:function(e){
if(e.active){for(var t=e._zOrder*B+8,n=0;n<6;n++)R[t]=e._userState,t+=B;U(e._zOrder),V=!0}},commit:function(){
if(u.isReady()&&V){if(W&&function(){for(var e,t=0,n=u.clips[t].head,i=0;null===n&&++t<u.clips.length;)n=u.clips[t].head
;for(;n;){var o=n.item,r=o._zOrder*B;o._zOrder=i/B;for(var a=r+90;r<a;)D[i++]=R[r++]
;for(n=n.next;null===n&&++t<u.clips.length;)n=u.clips[t].head}e=R,R=D,D=e,W=!1,F&&(F.realloc=!0),H&&(H.realloc=!0)}(),
!(q=q===F?H:F)){if(F){if(H)throw new Error("ClipGL Error: Unexpected VBO condition.");H={buff:K.createBuffer(),
modifiedAt:Number.POSITIVE_INFINITY,numClips:0,realloc:!0},q=H}else F={buff:K.createBuffer(),
modifiedAt:Number.POSITIVE_INFINITY,numClips:0,realloc:!0},q=F
;if(!q)throw new Error("ClipGL Error: Failed to create VBO.")}K.bindBuffer(K.ARRAY_BUFFER,q.buff),
q.realloc?(K.bufferData(K.ARRAY_BUFFER,R,K.DYNAMIC_DRAW),q.realloc=!1):q.numClips&&K.bufferSubData(K.ARRAY_BUFFER,0,R),
q.modifiedAt=Number.POSITIVE_INFINITY,q.numClips=0,V=!1}},rebuild:function(){W=!0,V=!0},get actBuffId(){return q===F?1:2
}});var Q,Z,$,ee,te,ne,ie,oe,re,ae,se,le,ce,ue=((Q=function(e){this.value=e,this.renderedValue=e}).prototype={
__tweener:null,disposed:!1,get tweener(){
for(;this.__tweener&&this.__tweener._state.eq(f);)this.__tweener=this.__tweener.link;return this.__tweener},
set tweener(e){this.__tweener=e},isEqualTo:function(e){
return this.value===e||e instanceof u.Tweener2&&this.value===e.toValue}},Q);u.Clip=function(){var e=function(e,t){
var i=t.image?t.image.data:null,o=t.layer?t.layer:0
;if(e.name=t.name,t.image&&t.image.bounds&&!t.image.bounds.margin&&(t.image.bounds.margin=0),
t.width&&t.height)e.width=t.width,e.height=t.height;else if(i&&t.image.animation&&t.image.animation.frameCount){
var r,a=t.image.animation;a.frameRows=a.frameRows||1,r=Math.floor(a.frameCount/a.frameRows),
e.width=Math.floor(i.width/r),e.height=Math.floor(i.height/a.frameRows),t.image.bounds={x:0,y:0,width:e.width,
height:e.height}
}else if(i&&t.image.bounds&&t.image.bounds.width&&t.image.bounds.height)e.width=t.image.bounds.width+2*t.image.bounds.margin,
e.height=t.image.bounds.height+2*t.image.bounds.margin;else{
if(!i)return void n.fault(new Error("ClipGL: Clip "+t.name+" size not specified."));e.width=i.width,e.height=i.height}
if(e._zOrder=u.vertMngr.register(e),
t.shader?e.shader=t.shader:e.shader=i?t.image.mask?u.Shader.defImageAndMaskShader:u.Shader.defImageShader:u.Shader.defColorShader,
i){if(e._texture=u.Texture.getTexture(i,!1),e.setTexBounds(e._texture,t.image.bounds),t.image.mask){
var s=t.image.bounds,l=s?{x:s.maskX?s.maskX:s.x,y:s.maskY?s.maskY:s.y,width:s.width?s.width:e.width,
height:s.height?s.height:e.height,margin:0}:null;e._mask=u.Texture.getTexture(t.image.mask,!0),
e.setTexBounds(e._mask,l,!0),e._mask2=t.image.mask2?u.Texture.getTexture(t.image.mask2,!0):null}else e._mask=null,
e._mask2=null;t.image.animation?e.animator=u.createAnimator(e,t.image.animation):e.animator=null}else e._texture=null,
e._mask=null,e._mask2=null,e.animator=null;e.layer=o,e.node=u.clips[o].addLast(e),
n.assert(e.node,"Null clip node encountered"),e.isDisposed=!1,e._active=!0,e.boundingRect={left:0,top:0,
right:(e.width-1)/2,bottom:(e.height-1)/2},e._userState=0,e._angle=new ue(0),e.onMove=t.onMove,
void 0===t.color?e._color=0:e.color=t.color,void 0!==t.angle&&(e.angle=t.angle),e._opacity=new ue(1),
void 0!==t.opacity&&(e.opacity=t.opacity),e._position=new u.PosPoint(e),u.clips.getTopMost()!==e&&u.vertMngr.rebuild(),
t.position&&(void 0===t.position.normX?e.position.assign(t.position.x,t.position.y):e.position.assignNorm(t.position.normX,t.position.normY)),
e.touchRect=t.touchRect,u.projector.autoStart()};return function(t){var i=this,o=t&&t.image?t.image.data:null
;t?o?o instanceof Element||o.data?o.width&&o.height?e(i,t):n.fault(new Error("ClipGL: Clip "+(t.name||"<no name>")+" image must not be empty.")):n.fault(new Error("ClipGL: Clip "+(t.name||"<no name>")+" image must be an Image object.")):(t.width&&t.height||(t.width=100,
t.height=100),e(i,t)):e(i,t={width:100,height:100})}}(),Object.defineProperty(u.Clip.prototype,"angle",{get:function(){
if(this.isDisposed)throw new Error("Attempted to access disposed clip "+this.name);return this._angle.value},
set:(Z=function(e,t){if(void 0===e)return t._angle.renderedValue
;if(360===e)e=0;else if(e<0||e>360)throw new Error("Invalid render angle: "+e);t._angle.renderedValue=e,
u.vertMngr.rotate(t)},$=function(e){switch(e){case 0:case 90:case 180:case 270:break;default:
(e<0||e>=360)&&(e=e%360+(e<0?360:0)),e=e<45?0:e<135?90:e<225?180:e<315?270:0}return e},function(t){var n=this._angle
;if(this.isDisposed)throw new Error("Attempted to access disposed clip "+this.name)
;if(n.disposed)t!==u.TW_DISPOSE&&t!==u.TW_ABORT&&e.errMonitor.sendReport("Attempted to set disposed property in clip "+this.name);else if(this.active||t===u.TW_DISPOSE)if(t===u.TW_DISPOSE)o.log(this.name+".angle disposed"),
n.tweener&&n.tweener.kill(),n.disposed=!0;else if(t===u.TW_ABORT)n.tweener&&(o.log(this.name+".angle aborted"),
n.tweener.kill(),Z(n.value,this));else if(t===u.TW_FINISH)n.tweener&&(o.log(this.name+".angle -> "+t+" (finish)"),
n.tweener.finish());else if("number"==typeof t)t=$(t),
n.value===t&&n.renderedValue===t||(o.log(this.name+".angle -> "+t),n.value=t,Z(t,this));else{
if(!(t instanceof u.Tweener2))throw new Error("Unexpected angle value. val="+t+", typ="+typeof t+", clp="+this.name)
;var i=t;if(i._state!==p)throw new Error("Unexpected tweener state. clp="+this.name+", tw-st="+i._state)
;if(i.target=this,
i.throttle&&n.tweener&&(n.tweener.progress<.5||n.tweener.link))return o.log(this.name+".angle throttled tweener"),
void(i.onEnd&&i.onEnd(i));var r=$(i.toValue)
;r===n.value?(r!==n.renderedValue&&(n.tweener?o.log("Warning: Redundant tweener assignment in clip %s",this.name):(o.log("Warning: Unexpected renderedValue in clip %s",this.name),
Z(r,this))),i._state=f,i.onEnd&&i.onEnd(i)):(0===n.value&&270===r?(i.fromValue=360,
i.toValue=270):270===n.value&&0===r?(i.fromValue=270,i.toValue=360):(i.fromValue=n.value,i.toValue=r),i.renderValue=Z,
n.tweener?(o.log(this.name+".angle -> "+i.toValue+" (extended tweener)"),
n.tweener.extend(i)):(o.log(this.name+".angle -> "+i.toValue+" (tweener)"),n.tweener=i,i.queue()),n.value=r)
}else t===u.TW_ABORT||n.isEqualTo(t)||e.errMonitor.sendReport("Attempted to set property in inactive clip "+this.name)})
}),Object.defineProperty(u.Clip.prototype,"opacity",{get:function(){
if(this.isDisposed)throw new Error("Attempted to access disposed clip "+this.name);return this._opacity.value},
set:function(){var t=function(e,t){if(void 0===e)return t._opacity.renderedValue;t._opacity.renderedValue=e,
u.vertMngr.setOpacity(t)};return function(n){var i=this._opacity
;if(this.isDisposed)throw new Error("Attempted to access disposed clip "+this.name)
;if(i.disposed)n!==u.TW_DISPOSE&&n!==u.TW_ABORT&&e.errMonitor.sendReport("Attempted to set disposed property in clip "+this.name);else if(this.active||n===u.TW_DISPOSE)if(n===u.TW_DISPOSE)o.log(this.name+".opacity disposed"),
i.tweener&&i.tweener.kill(),i.disposed=!0;else if(n===u.TW_ABORT)i.tweener&&(o.log(this.name+".opacity aborted"),
i.tweener.kill(),t(i.value,this));else if(n===u.TW_FINISH)i.tweener&&(o.log(this.name+".opacity -> "+n+" (finish)"),
i.tweener.finish());else if("number"==typeof n)i.value===n&&i.renderedValue===n||(o.log(this.name+".opacity -> "+n),
i.value=n,t(n,this));else{
if(!(n instanceof u.Tweener2))throw new Error("Unexpected opacity value. val="+n+", typ="+typeof n+", clp="+this.name)
;var r=n;if(r._state!==p)throw new Error("Unexpected tweener state. clp="+this.name+", tw-st="+r._state);r.target=this,
r.toValue===i.value?(r.toValue!==i.renderedValue&&(i.tweener?o.log("Warning: Redundant tweener assignment in clip %s",this.name):(o.log("Warning: Unexpected renderedValue in clip %s",this.name),
t(r.toValue,this))),r._state=f,r.onEnd&&r.onEnd(r)):(r.renderValue=t,r.fromValue=i.value,
i.tweener?(o.log(this.name+".opacity -> "+r.toValue+" (extended tweener)"),
i.tweener.extend(n)):(o.log(this.name+".opacity -> "+r.toValue+" (tweener)"),i.tweener=r,r.queue()),i.value=r.toValue)
}else n===u.TW_ABORT||i.isEqualTo(n)||e.errMonitor.sendReport("Attempted to set property in inactive clip "+this.name)}
}()}),Object.defineProperty(u.Clip.prototype,"position",{get:function(){return this._position}}),
u.Clip.prototype.isRotating=function(){return!!this._angle.tweener},u.Clip.prototype.moveToTop=function(){
u.clips[this.layer].moveToEnd(this.node)&&u.vertMngr.rebuild()},u.Clip.prototype.moveToBottom=function(){
u.clips[this.layer].moveToBeginning(this.node)&&u.vertMngr.rebuild()},u.Clip.prototype.sendToLevelOf=function(e){
this!==e&&(u.clips[this.layer].moveAfter(this.node,e.node),u.vertMngr.rebuild())},
u.Clip.prototype.fadeIn=function(e,t,n){var i=new u.Tweener2("opacity",1,e);t&&(i.onEnd=function(e){t(e.target)}),
i.delay=n,this.active=!0,this.opacity=i},u.Clip.prototype.fadeOut=function(e,t,n,i){var o=null;(t||n)&&(o=function(e){
n&&!e.target.opacity&&(e.target.active=!1),t&&t(e.target)});var r=new u.Tweener2("opacity",0,e,o);r.delay=i||0,
this.active=!0,this.opacity=r},u.Clip.prototype.setSize=function(e,t,n,i,o){this.width=e,this.height=t,
n&&this.setTexBounds(this._texture,n,!1),i&&this.setTexBounds(this._mask,i,!0),o&&this.setTexBounds(this._mask2,o,!0),
u.vertMngr.setSize(this)},u.Clip.prototype.setTexBounds=function(e,t,n){var i;if(t){
var o=n?t.margin:0,r=(t.x-o)*e.pixelWidth,a=(t.y-o)*e.pixelHeight,s=(t.x+t.width+o)*e.pixelWidth,l=(t.y+t.height+o)*e.pixelHeight
;i=[r,a,r,l,s,a,s,l]}else i=[0,0,0,1,1,0,1,1];n?u.vertMngr.addTexture1(this,i):u.vertMngr.addTexture0(this,i),
this.maskBounds=t},u.clips=function(){
for(var e=s&&s.numberOfLayers?s.numberOfLayers:1,t=new Array(e),n=e-1;n>=0;n--)t[n]=new c.List;return t}(),
u.clips.getClip=function(e,t){for(var n=u.clips[t].head;n;){if(n.item.id===e)return n.item;n=n.next}return null},
u.clips.getTopMost=function(){for(var e=u.clips.length-1;e>=0;e--){var t=u.clips[e].tail;if(t)return t.item}return null
},u.clips.getClipAt=function(e,t,n,i){n="number"==typeof n?n:0;var o=u.clips[n].findLast((function(n){
return n.active&&n.opacity&&n.containsPoint(e,t,i)}));return o?o.item:null},u.Texture=function(){
var e=null,t=function(t,n,i,o){var r=K.createTexture();return K.bindTexture(K.TEXTURE_2D,r),
K.texImage2D(K.TEXTURE_2D,0,K.RGBA,K.RGBA,K.UNSIGNED_BYTE,n),
K.texParameteri(K.TEXTURE_2D,K.TEXTURE_MIN_FILTER,K.NEAREST),
K.texParameteri(K.TEXTURE_2D,K.TEXTURE_MAG_FILTER,K.NEAREST),
c.isPowerOfTwo(n.width)&&c.isPowerOfTwo(n.height)||(K.texParameteri(K.TEXTURE_2D,K.TEXTURE_WRAP_S,K.CLAMP_TO_EDGE),
K.texParameteri(K.TEXTURE_2D,K.TEXTURE_WRAP_T,K.CLAMP_TO_EDGE)),K.bindTexture(K.TEXTURE_2D,null),e=null,t.name=i,
t.width=n.width,t.height=n.height,t.pixelWidth=1/n.width,t.pixelHeight=1/n.height,t.isMask=o,t.image=n,
o&&n.data?t.pixels=n:o&&n.getContext?t.pixels=n.getContext("2d").getImageData(0,0,n.width,n.height):t.pixels=null,r}
;return function(i,o,r,a){var s=t(this,i,o,a),l=1;this.setActive=function(t){e!==this&&(e=this,
K.activeTexture(K.TEXTURE0+r),K.bindTexture(K.TEXTURE_2D,s),K.uniform1i(t,r))},this.addRef=function(){l++},
this.reinit=function(e,i,o){
0===l?(s=t(this,e,i,o),l=1):n.fault(new Error("ClipGL: Cannot reinit non-disposed texture."))},this.reset=function(){
if(null!==this.name){var e=this.name;l=0,this.name=null,this.width=0,this.height=0,this.pixels=null,
this.reinit(this.image,e,this.isMask)}},this.subtractRef=function(){l>0&&l--},this.disposeIfUnused=function(){
0===l&&this.dispose()},this.dispose=function(){
l>1&&n.warn("ClipGL: Disposing of texture with "+l+" references. texture="+this.name),l=0,K.deleteTexture(s),
this.active=!1,this.name=null,this.width=0,this.height=0,this.pixels=null,this.image=null,this.isMask=!1}}}(),
u.Texture._textures=[],u.Texture.getTexture=(ee=1,function(e,t){var i,o=u.Texture._textures,r=null,a=o.length
;if("string"==typeof e){for(i=a-1;i>=0;i--)if((r=o[i]).name===e)return r;return null}
var s=e.src?c.stringToVarName(e.src):e.name,l=-1
;for(s||(s="No_name_"+ee++,n.warn("ClipGL: Image with no name detected.")),i=a-1;i>=0;i--){
if((r=o[i]).name===s)return r.addRef(),r;null===r.name&&(l=i)}
return l>=0?(r=o[l]).reinit(e,s,t):a<32?(r=new u.Texture(e,s,a,t),
o.push(r)):n.fault(new Error("ClipGL: No more available textures.")),r}),u.Texture.freeAllUnused=function(){
for(var e=u.Texture._textures.length-1;e>=0;e--){u.Texture._textures[e].disposeIfUnused()}},
u.Texture.resetAll=function(){u.Texture._textures.forEach((function(e){e.reset()}))},
Object.defineProperty(u.Clip.prototype,"userState",{get:function(){return this._userState},set:function(e){
this._userState!==e&&(this._userState=e,u.vertMngr.setState(this))}}),Object.defineProperty(u.Clip.prototype,"color",{
get:function(){return this._color},set:function(e){this._color!==e&&(this._color=e,u.vertMngr.setColor(this))}}),
Object.defineProperty(u.Clip.prototype,"zOrder",{get:function(){return void 0===this._zOrder?0:this._zOrder/6}}),
Object.defineProperty(u.Clip.prototype,"texture",{get:function(){return void 0===this._texture?null:this._texture},
set:function(e){var t,n=null;e instanceof Element?t=e:(t=e.data,e.bounds&&(n=e.bounds)),
this._texture&&this._texture.subtractRef(),this._texture=u.Texture.getTexture(t,!1),this.setTexBounds(this._texture,n)}
}),Object.defineProperty(u.Clip.prototype,"mask",{get:function(){return void 0===this._mask?null:this._mask},
set:function(e){var t,n=null;e instanceof Element?t=e:(t=e.data,e.bounds&&(n=e.bounds)),
this._mask&&this._mask.subtractRef(),this._mask=u.Texture.getTexture(t,!0),this.setTexBounds(this._mask,n,!0)}}),
Object.defineProperty(u.Clip.prototype,"mask2",{get:function(){return void 0===this._mask2?null:this._mask2},
set:function(e){var t;t=e instanceof Element?e:e.data,this._mask2&&this._mask2.subtractRef(),
this._mask2=u.Texture.getTexture(t,!0)}}),u.Clip.count=function(){
for(var e=0,t=u.clips.length-1;t>=0;t--)e+=u.clips[t].length;return e},u.Clip.drawAll=function(){
for(var e=u.Clip.count(),t=0,n=u.clips[t].head,i=!1;null===n&&++t<u.clips.length;)n=u.clips[t].head;if(n){var o
;K.clear(K.COLOR_BUFFER_BIT),u.vertMngr.commit();try{if(1===e)(o=n.item).shader.setActive(o._texture,o._mask,o._mask2),
K.drawArrays(K.TRIANGLES,o._zOrder,6);else{var a=n.item,s=1,l=!1
;for(n=n.next;null===n&&++t<u.clips.length;)n=u.clips[t].head;for(;n;){
for((o=n.item).shader===a.shader&&o._texture===a._texture&&o._mask===a._mask&&o._mask2===a._mask2?s++:l=!0,
n=n.next;null===n&&++t<u.clips.length;)n=u.clips[t].head
;for(l||n||(i=!0);(l||i)&&(a.shader.setActive(a._texture,a._mask,a._mask2),K.drawArrays(K.TRIANGLES,a._zOrder,6*s),a=o,
s=1,l=!1,!i)&&!n;)i=!0}}}catch(e){
var c=navigator.userAgent.includes("Firefox/"),d=e.message.includes("can't access dead object")&&e.stack.includes("Clip.drawAll")
;if(!c||!d)throw e;var h=r.Puzzle.curr,p=h&&h.multiplayerGameShortLink
;window.alert("A severe error common to Firefox has occurred, so this page must be reloaded.\n\nIf the problem persists then try disabling any installed Firefox add-ons. If that does not resolve the problem then we recommend playing the jigsaw puzzles in the Chrome browser instead."),
p?window.location.replace(p):window.location.reload()}}},u.Clip.prototype.containsPoint=function(e,t,n,i){
var o=90===this.angle||270===this.angle,r=(o?this.height:this.width)/2,a=(o?this.width:this.height)/2,s=this.position,l=s._y-a,c=s._x-r,u=s._y+a,d=s._x+r,p=i||h,g=e>=c-p.x&&e<d+p.x&&t>=l-p.y&&t<u+p.y,m=!1
;if(n){var f=this.touchRect;m=e>=c+f.x&&e<d-(this.width-f.x-f.width)&&t>=l+f.y&&t<u-(this.height-f.y-f.height)}
if(m)return!0;if(g&&this._mask&&this._mask.pixels){e-=Math.round(c),t-=Math.round(l)
;var v,y,b=this._mask.pixels,w=this.maskBounds;switch(this.angle){case 90:y=e,e=t,t=w.height-y;break;case 180:
e=w.width-e,t=w.height-t;break;case 270:y=e,e=w.width-t,t=y}return v=4*(w.x+w.y*b.width),b.data[v+4*(e+t*b.width)]>=128}
return g},Object.defineProperty(u.Clip.prototype,"active",{get:function(){return null!==this.node},set:function(e){
null!==this.node!==e&&(e?(this._active=!0,this._zOrder=u.vertMngr.register(this),
this.node=u.clips[this.layer].addLast(this),this._position=new u.PosPoint(this),
u.clips.getTopMost()!==this&&u.vertMngr.rebuild(),
u.vertMngr.setOpacity(this),this.position.assign(u.canvas.width/2,u.canvas.height/2),
this.animator&&this.animator.autoStart&&this.animator.play()):(this.animator&&this.animator.stop(),
u.clips[this.layer].dispose(this.node),u.vertMngr.deregister(this),this.node=null,this._angle.disposed||(this.angle=0),
this._position=null,this._active=!1))}}),u.Clip.prototype.isTweening=function(){
return this.active&&!!(this._position.tweener||this._opacity.tweener||this._angle.tweener)},
u.Clip.prototype.killTweeners=function(e){if(!this.isDisposed){
var t=e?u.TW_FINISH:u.TW_ABORT,n=0,i=this.active&&this._position.tweener;i&&(n++,this.position.tween(t)),
(i=this._opacity.tweener)&&(n++,this.opacity=t),(i=this._angle.tweener)&&(n++,this.angle=t),
o.log((this.name||"<no name>")+": killed tweeners. count="+n)}},u.Clip.prototype.dispose=function(){this.killTweeners(),
this.opacity=u.TW_DISPOSE,this.angle=u.TW_DISPOSE,this._position=null,this.shader=null,this.width=0,this.height=0,
this.active=!1,this.isDisposed=!0,this._texture&&(this._texture.subtractRef(),this._texture=null),
this._mask&&(this._mask.subtractRef(),this._mask=null),this._mask2&&(this._mask2.subtractRef(),this._mask2=null)},
u.Shader=(ne="precision mediump float;",ie=function(t){var i=K.createShader(K.FRAGMENT_SHADER);if(!i){
var o="Unable to create "+this.name+" fragment shader.";if(u.stableContext)throw new Error(o);e.reloadProg(o)}
K.shaderSource(i,t),K.compileShader(i);var r=K.getShaderParameter(i,K.COMPILE_STATUS)
;return r||(o="Failed to compile shader "+this.name+", fragment shader: err="+(r||K.getShaderInfoLog(i)),
u.stableContext?n.assert(r,o):e.reloadProg(o)),i},oe=function(e){var t=K.createProgram()
;if(!t)throw new Error("Failed to create "+this.name+" shader program.");return K.attachShader(t,e),
K.attachShader(t,u.vertMngr.shader),
K.linkProgram(t),K.getProgramParameter(t,K.LINK_STATUS)||(this.error=K.getProgramInfoLog(t),
n.error("failed to link shader program: name="+this.name+", err="+this.error),K.deleteProgram(t),t=null),t},
function(e,t){var i,o,r,a,s,l,c,d,h,p,g,m,f,v,y=0,b=!1;this.name=e,this.error=null
;var w=ie.call(this,t),x=oe.call(this,w);if(!x){if(0===t.indexOf(ne))return this.error=null,
n.log("switched shader to high precision: name="+e),new u.Shader(e,"precision highp float;"+t.substr(ne.length))
;throw this.error&&-1!==this.error.indexOf("D3D shader")?new Error("Failed to link shader program due D3D shader error: "+e):new Error("Failed to link shader program: "+e)
}u.Shader._shaders.push(this),this.setActive=function(e,t,n){var w=u.vertMngr.actBuffId
;b||(i=K.getUniformLocation(x,"aspect"),o=K.getUniformLocation(x,"invAspect"),r=K.getAttribLocation(x,"pos"),
a=K.getAttribLocation(x,"scale"),s=K.getAttribLocation(x,"trans"),l=K.getAttribLocation(x,"rot"),
c=K.getAttribLocation(x,"a_state"),d=K.getAttribLocation(x,"a_color"),h=K.getAttribLocation(x,"a_opacity"),
e&&(p=K.getAttribLocation(x,"a_texCoord0"),m=K.getUniformLocation(x,"u_image")),
t&&(g=K.getAttribLocation(x,"a_texCoord1"),f=K.getUniformLocation(x,"u_mask")),n&&(v=K.getUniformLocation(x,"u_mask2")),
b=!0),
y!==w&&(K.vertexAttribPointer(r,2,K.FLOAT,!1,u.vertMngr.strideBytes,0),K.vertexAttribPointer(a,2,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.scaleOffset),
K.vertexAttribPointer(s,2,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.transOffset),
K.vertexAttribPointer(l,2,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.rotOffset),
K.vertexAttribPointer(c,1,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.stateOffset),
K.vertexAttribPointer(d,1,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.colorOffset),
K.vertexAttribPointer(h,1,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.opaOffset),
e&&K.vertexAttribPointer(p,2,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.tex0Offset),
t&&K.vertexAttribPointer(g,2,K.FLOAT,!1,u.vertMngr.strideBytes,4*u.vertMngr.tex1Offset),K.enableVertexAttribArray(r),
K.enableVertexAttribArray(a),K.enableVertexAttribArray(s),K.enableVertexAttribArray(l),K.enableVertexAttribArray(c),
K.enableVertexAttribArray(d),K.enableVertexAttribArray(h),e&&K.enableVertexAttribArray(p),
t&&K.enableVertexAttribArray(g),y=w),te!==this&&(te=this,K.useProgram(x),K.program=x),K.uniform1f(i,u.aspect),
K.uniform1f(o,1/u.aspect),e&&e.setActive(m),t&&t.setActive(f),n&&n.setActive(v)},this.reset=function(){
w=ie.call(this,t),x=oe.call(this,w),b=!1},this.dispose=function(){var e=u.Shader._shaders,t=e.indexOf(this)
;K.deleteShader(w),K.deleteProgram(x),-1!==t&&e.splice(t,1)}}),u.Shader._shaders=[],u.Shader.resetAll=function(){
u.Shader._shaders.forEach((function(e){e.reset()}))};try{
u.Shader.defColorShader=new u.Shader("defaultColorShader","precision mediump float;void main() { gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0); }"),
u.Shader.defImageShader=new u.Shader("defaultImageShader","precision mediump float;uniform sampler2D u_image;varying vec2 v_texCoord0;varying float v_opacity;void main() {   vec4 sPixel = texture2D(u_image, v_texCoord0);   float alpha = sPixel.a * v_opacity;   gl_FragColor.rgb = sPixel.rgb * alpha;   gl_FragColor.a = alpha;}\n"),
u.Shader.defImageAndMaskShader=new u.Shader("defaultImageAndMaskShader","precision mediump float;uniform sampler2D u_image;uniform sampler2D u_mask;varying vec2 v_texCoord0;varying vec2 v_texCoord1;void main() {   vec4 sPixel = texture2D(u_image, v_texCoord0);   vec4 mPixel = texture2D(u_mask, v_texCoord1);   float alpha = mPixel.r;   gl_FragColor.rgb = sPixel.rgb * alpha;   gl_FragColor.a = alpha;}\n")
}catch(e){return u.error="Failed to compile shaders",n.error("ClipGL: "+u.error),u}u.animators=[],u.ANI_DEAD=0,
u.ANI_STOPPED=1,u.ANI_WAITING=2,u.ANI_RUNNING=3,u.updateAnimators=(ae=function(e){
e.state===u.ANI_RUNNING&&re-e.timestamp>=e.fPeriod&&(++e.fCurr>=e.fCount&&(e.fCurr=0),
e.bounds.x=e.fCurr%e.fCols*e.target.width,e.bounds.y=Math.floor(e.fCurr/e.fCols)*e.target.height,
e.target.setTexBounds(e.target.texture,e.bounds,!1),e.timestamp=re)},function(e){re=e,u.animators.forEach(ae)}),
u.createAnimator=(se=function(){this.state!==u.ANI_DEAD&&(this.state=u.ANI_STOPPED)},le=function(){
this.state!==u.ANI_DEAD&&(this.state=u.ANI_RUNNING)},ce=function(){var e=u.animators.indexOf(this)
;-1!==e&&u.animators.splice(e,1),this.bounds.x=0,this.target.setTexBounds(this.target.texture,this.bounds,!1),
this.state=u.ANI_DEAD},function(e,t){var i=t.startFrame?t.startFrame-1:-1,o={timestamp:0,
state:t.autoStart?u.ANI_RUNNING:u.ANI_STOPPED,autoStart:t.autoStart,fCurr:i,fCount:t.frameCount,
fCols:Math.ceil(t.frameCount/t.frameRows),fPeriod:Math.round(1e3/t.fps),stop:se,play:le,dispose:ce,target:e,bounds:{
x:i*e.width,y:0,width:e.width,height:e.height}}
;return e.texture.width%o.fCols==0?u.animators.push(o):(o.state=u.ANI_DEAD,
n.error("invalid animation image width. w="+e.texture.width+", fc="+t.frameCount+", name="+e.texture.name)),o})
;var de,he,pe,ge=[],me=[],fe=new o.Key;u.tweeningInProgress=new o(!1,"tweeningInProgress",o.LOG_CHANGES),
u.tweeningInProgress.listenerLoopAction=null,u.tweeningInProgress.lock(fe),u.updateTweeners=function(){
var e,t,n=1,i=function(i){if(i._state===m){if(i._cycle===n)return;if(i._cycle=n,i.target.isDisposed)return i._state=f,
void(t=!0);if(i.delay){if(e-i.startTime<i.delay)return void(t=!0);i.delay=0,i.startTime=e}
if(i.startTime>=e)return i.startTime=e,void(t=!0);var o=e-i.startTime>=i.duration
;i.progress=o?1:(e-i.startTime)/i.duration,i.run(e,o),o&&(i._state=f),i.onStep&&i.onStep(i),o&&(i.onEnd&&i.onEnd(i),
i.link&&(i.link.startTime=e,i.link.progress=0,i.link._state=g,me.push(i.link))),t=!0}},o=function(e){
e._state===g&&(e._state=m,ge.push(e))};return function(r){e=r,me.forEach(o),me.length=0,ge.length?(t=!1,n++,
ge.forEach(i),
t||(ge.length=0,0===me.length&&u.tweeningInProgress.set(!1,fe))):u.tweeningInProgress.val&&u.tweeningInProgress.set(!1,fe)
}}(),u.Tweener=function(e,t,n){this.toValue=e,this.duration=t,this.onEnd=n,this.startTime=u.perfNow(),
this.deprecatedDelay=function(){this._state=v},me.push(this),u.tweeningInProgress.val||u.tweeningInProgress.set(!0,fe)},
u.Tweener2=function(e,t,n,i,o){this._state=p,this.toValue=t,this.duration=n,this.onEnd=i,this.propName=e,
this.ease=o||u.EASE_NONE},u.Tweener2.prototype={_state:g,_cycle:0,progress:0,customTween:null,target:null,property:null,
fromValue:null,toValue:null,duration:null,onStep:null,onEnd:null,startTime:0,ease:u.EASE_NONE,assign:null,extension:!1,
throttle:!1,link:null,renderValue:null,delay:0,logState:function(e){
(e?o.log:n.log)("tweener: clip="+this.target.name+", prop="+this.propName+", stat="+this._state.name+", from="+this.fromValue+", to="+this.toValue+", rval="+this.renderValue(void 0,this.target).toFixed(3)+", prog="+this.progress.toFixed(3)+", elap="+(u.perfNow()-this.startTime).toFixed(2)+", dur="+this.duration+", dely="+this.delay+", link="+!!this.link)
},lastTweener:function(){for(var e=this;e.link;)e=e.link;return e},run:function(e,t){var n=this
;if(t)n.renderValue(n.toValue,n.target);else{var i,o=n.fromValue,r=n.toValue-n.fromValue,a=(e-n.startTime)/n.duration
;switch(n.ease){case u.EASE_IN:i=r*a*a*a+o;break;case u.EASE_IN_SLOW:i=r*a*a+o;break;case u.EASE_OUT:i=r*(--a*a*a+1)+o
;break;case u.EASE_OUT_SLOW:i=-r*a*(a-2)+o;break;default:i=r*a+o}n.renderValue(i,n.target)}},queue:function(){
if(!this._state.eq(p))throw new Error("Unexpected tweener state: "+this._state.name);this._state=g,
this.startTime=u.perfNow(),me.push(this),u.tweeningInProgress.val||u.tweeningInProgress.set(!0,fe)},extend:function(e){
if(e._state.neq(p))throw new Error("Extending tweener must be in the not_queued state")
;if(this._state.eq(f))throw new Error("Extended tweener must not be in the completed state")
;if(!e.target)throw new Error("Must not extend tweener from outside ClipGL");this.lastTweener().link=e},kill:function(){
for(var e=this;e;)e._state=f,e=e.link},finish:function(){for(var e=this,t=0;e;)if(e._state=f,
e.renderValue(e.toValue,this.target,!0),
e.onEnd&&e.onEnd(this),e=e.link,100==++t)throw new Error("Infinite tweener callback loop detected")}},
u.clearAllTweeners=function(){me.length=0,ge.length=0,u.tweeningInProgress.set(!1,fe)},u.PosPoint=function(e){
var t=u.canvas.width/2,n=u.canvas.height/2;this._x=t,this._y=n,this._oglX=2*t*u.pixelWidth-1,
this._oglY=1-2*n*u.pixelHeight,this.clip=e},u.PosPoint.prototype=Object.create(new ue(null)),
u.PosPoint.prototype.distanceFrom=function(e){var t=this._x-e._x,n=this._y-e._y;return Math.sqrt(t*t+n*n)},
u.PosPoint.prototype.assignNorm=function(e,t){this.assign(e*u.canvas.width,t*u.canvas.height)},
u.PosPoint.prototype._renderValue=function(e,t){if(void 0===e)return{x:t._position._oglX,y:t._position._oglY}
;var n=t._position,i=!!(t.width%2),o=!!(t.height%2)
;0===t.angle||180===t.angle?(e.x=i?Math.floor(e.x)+.5:Math.round(e.x),
e.y=o?Math.floor(e.y)+.5:Math.round(e.y)):(e.x=o?Math.floor(e.x)+.5:Math.round(e.x),
e.y=i?Math.floor(e.y)+.5:Math.round(e.y)),e.x===n._x&&e.y===n._y?e.changed=!1:(n._x=e.x,n._y=e.y,
n._oglX=2*e.x*u.pixelWidth-1,n._oglY=1-2*e.y*u.pixelHeight,u.vertMngr.move(t),e.changed=!0)},
u.PosPoint.prototype.tween=(de={},he=function(e,t){
var n,i,o=this.fromValue.x,r=this.toValue.x-this.fromValue.x,a=this.fromValue.y,s=this.toValue.y-this.fromValue.y,l=(e-this.startTime)/this.duration
;t?(n=this.toValue.x,
i=this.toValue.y):this.ease===u.EASE_IN?(n=r*l*l*l+o,i=s*l*l*l+a):this.ease===u.EASE_IN_SLOW?(n=r*l*l+o,
i=s*l*l+a):this.ease===u.EASE_OUT?(n=r*(--l*l*l+1)+o,i=s*(l*l*l+1)+a):this.ease===u.EASE_OUT_SLOW?(n=-r*l*(l-2)+o,
i=-s*l*(l-2)+a):(n=r*l+o,i=s*l+a),de.x=n,de.y=i,this.target.position._renderValue(de,this.target)},
function(t,n,i,r,a,s){var l=this.clip;if(l.isDisposed)throw new Error("Attempted to access disposed clip "+l.name)
;if(this.disposed)t!==u.TW_DISPOSE&&t!==u.TW_ABORT&&e.errMonitor.sendReport("Attempted to set disposed property in clip "+l.name);else if(l.active||t===u.TW_DISPOSE)if(t===u.TW_DISPOSE)o.log(l.name+".position disposed"),
this.tweener&&this.tweener.kill(),
this.disposed=!0;else if(t===u.TW_ABORT)this.tweener&&(o.log(l.name+".position aborted"),this.tweener.kill(),
this.assign(this._x,this._y));else if(t===u.TW_FINISH)this.tweener&&(o.log(l.name+".position -> ["+this._x+", "+this._y+"] (finish)"),
this.tweener.finish());else{if(s&&this.tweener)return void(r&&r(null));var c=new u.Tweener2("position",{x:t,y:n},i,r,a)
;if(c._state!==p)throw new Error("Unexpected tweener state. clp="+l.name+", tw-st="+c._state);c.target=l,
c.renderValue=this._renderValue,
c.run=he,this.tweener?(o.log(l.name+".position -> ["+Math.round(t)+", "+Math.round(n)+"] (extended tweener)"),
c.fromValue=this.tweener.lastTweener().toValue,
this.tweener.extend(c)):(o.log(l.name+".position -> ["+Math.round(t)+", "+Math.round(n)+"] (tweener)"),c.fromValue={
x:this._x,y:this._y},this.tweener=c,c.queue()),l.onMove&&l.onMove(this.clip,c)
}else t!==u.TW_ABORT&&e.errMonitor.sendReport("Attempted to set property in inactive clip "+l.name)}),
u.PosPoint.prototype.assign=function(){var e={};return function(t,n){var i=this.clip;return"number"==typeof t?(e.x=t,
e.y=n):(e.x=t.x,e.y=t.y),this.tween(u.TW_FINISH),this._renderValue(e,i),i.onMove&&e.changed&&i.onMove(i),e.changed}}(),
u.PosPoint.prototype.moveBy=function(e,t){this.assign(this._x+e,this._y+t)
},Object.defineProperty(u.PosPoint.prototype,"x",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip");return this._x}}),
Object.defineProperty(u.PosPoint.prototype,"y",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip");return this._y}}),
Object.defineProperty(u.PosPoint.prototype,"normX",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip");return this._x/u.canvas.width}}),
Object.defineProperty(u.PosPoint.prototype,"normY",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip");return this._y/u.canvas.height}}),
Object.defineProperty(u.PosPoint.prototype,"htmlX",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip")
;return Math.round(this.normX*r.host.getWidth())}}),Object.defineProperty(u.PosPoint.prototype,"htmlY",{get:function(){
if(this.clip.isDisposed)throw new Error("Attempted to access disposed clip")
;return Math.round(this.normY*r.host.getHeight())}}),u.onLostContext=function(e){K.isAvailable=!1,u.stableContext=!1,
n.warn("Lost WebGL context."),e.preventDefault()},u.onRestoreContext=(pe=!0,function(){
pe&&(n.log("ClipGL: WebGL context is restored."),J(),u.vertMngr.reset(),u.Texture.resetAll(),u.Shader.resetAll(),
K.getError()===K.CONTEXT_LOST_WEBGL?(pe=!1,
n.error("ClipGL: gl context lost during CGL reinitialization.")):n.log("ClipGL: Reinitialization is complete."))}),
u.canvas.addEventListener("webglcontextlost",u.onLostContext,!1),
u.canvas.addEventListener("webglcontextrestored",u.onRestoreContext,!1),
u.perfNow=window.performance&&window.performance.now?function(){return window.performance.now()}:function(){
var e=0,t=function(n){e=n,window.requestAnimationFrame(t)};return window.requestAnimationFrame(t),function(){return e}
}()}};n.dependenciesReady=function(){return!(!t.base||!t.utils)},t.addModInit("ClipGL",n)}}(),function(){"use strict"
;var e=window.jigexGlobals.modules;if(e&&!e.theme){var t=function(){var t=window.jigexGlobals,n=e.Sym,i=(e.console,
[]),o=new n("blue",1,"themes"),r=new n("brown",2,"themes"),a=new n("gray",3,"themes"),s=new n("yellow",4,"themes"),l=new n("white",5,"themes"),c=new n("charcoal",6,"themes"),u=new n("lavender",7,"themes"),d=new n("teal",8,"themes"),h=new n("coral",9,"themes"),p=new n("plum",10,"themes"),g=new n("green",11,"themes"),m=new n("olive",12,"themes"),f=function(e,n){
e.texUrl=t.imagesPath+"leather-"+e.name+".jpg",
e.altTexUrl=t.altImagesPath?t.altImagesPath+"leather-"+e.name+".jpg":null,e.color=n,i.push(e.name)};f(u,{
background:"#95a2bd",panel:"#8296bd",highlight:"#8ba0c9",border:"#56637d"}),f(o,{background:"#7592ac",panel:"#5a86ac",
highlight:"#6c93b6",border:"#3b5a75"}),f(d,{background:"#5d747c",panel:"#50717d",highlight:"#5a7f8c",border:"#2f434a"}),
f(p,{background:"#a699a6",panel:"#998899",highlight:"#a694a6",border:"#665b66"}),f(g,{background:"#99a399",
panel:"#8a968a",highlight:"#96a396",border:"#5b635b"}),f(m,{background:"#68685a",panel:"#5c5c4a",highlight:"#696955",
border:"#36362b"}),f(h,{background:"#be9292",panel:"#b38181",highlight:"#bf8a8a",border:"#805c5c"}),f(s,{
background:"#b69366",panel:"#a88556",highlight:"#b58f5c",border:"#755c3c"}),f(r,{background:"#997663",panel:"#8f6a57",
highlight:"#a07662",border:"#563f35"}),f(l,{background:"#dadada",panel:"#b3b3b3",highlight:"#bfbfbf",border:"#909090"}),
f(a,{background:"#9b9b9b",panel:"#818181",highlight:"#8f8f8f",border:"#565656"}),f(c,{background:"#3d3d3d",
panel:"#303030",highlight:"#343434",border:"#202020"});var v=new e.Variant(void 0,"theme",(function(e,t){
return v.oldTheme=t,!0}));v.getThemeFromOrdinal=function(e){return e?n.get("themes",e):o},v.getThemeNames=function(){
return i},v.isValidColor=function(e){return e&&"string"==typeof e&&!!n.get("themes",e)},v.setToDefault=function(){
v.val=o},v.isLoaded=new e.Variant(!1,"theme-is-loaded"),e.theme=v};t.dependenciesReady=function(){
return!(!e.base||!e.ClipGL)},e.addModInit("theme",t)}}(),function(){"use strict"
;var e=window.jigexGlobals,t=e.modules,n=e.status;if(t&&!t.photon){var i=function(){
var i,o,r,a,s,l,c=e.debug&&n.recPhtnLogs?"photon-sdk-4.3.2.0.js":"photon-sdk-4.3.2.0.min.js",u=e.scriptsPath+c,d=e.altScriptsPath+c,h="photon states",p=2,g=e.parms().rgn||n.region,m=t.console,f=t.Variant,v=t.Sym,y=t.utils,b={
NOT_LOADED:new v("not-loaded",-999,h),LOADING:new v("loading",-998,h),ERR:new v("error",-1,h),
UNINIT:new v("uninitialized",0,h),CONNING_NAM:new v("connecting-to-name-server",1,h),
CONNED_NAM:new v("connected-to-name-server",2,h),CONNING_MAS:new v("connecting-to-master-server",3,h),
CONNED_MAS:new v("connected-to-master-server",4,h),LOBBY:new v("joined-lobby",5,h),
CONNING_GAM:new v("connecting-to-game-server",6,h),CONNED_GAM:new v("connected-to-game-server",7,h),
JOIN:new v("joined",8,h),DISCONN:new v("disconnected",10,h)},w=function(e,t,n){
e&&(m.log("warning: photon error: err=%s, msg=%s, op=%s",e,t,void 0===n?"n/a":n),x.onError&&x.onError({errorCode:e,
errorMsg:t,opCode:n}))},x=(a=[u,d],s=null,l=null,{ERR_CODE_OK:0,
stateVar:new f(b.NOT_LOADED,"photon.state",f.LOG_CHANGES,f.LOG_CHANGES,(function(e){
if(e===b.NOT_LOADED)throw new Error("Reinit of photon not allowed");return!0})),states:b,get gameInfo(){
return o?o.myRoom():null},load:(r=function(t){if(s)throw new Error("May not load photon script twice")
;(s=document.createElement("script")).type="text/javascript",s.crossorigin="anonymous",s.onload=function(){
if(window.Photon){i=Photon.LoadBalancing.LoadBalancingClient,Photon.LoadBalancing.Constants.OperationCode,
x.ERR_CODES=Photon.LoadBalancing.Constants.ErrorCode,
(o=new i(Photon.ConnectionProtocol.Wss,"a0a94d7b-d90a-4161-ab65-91e8e3752c8c","1.0")).nameServerAddress="wss://ns.photonengine.io:443",
o.onStateChange=function(e){x.stateVar.set(v.get(h,e))},o.onOperationResponse=w,o.onError=w,o.onJoinRoom=function(){
o.myRoom().onPropertiesChange=function(e,t){!t&&x.onPropertyChange&&x.onPropertyChange(e)}},o.onActorJoin=function(e){
x.onPlayerJoin&&x.onPlayerJoin({name:y.secureString(e.name),id:e.actorNr,isMe:e.isLocal})},o.onActorLeave=function(e){
x.onPlayerLeave&&x.onPlayerLeave({name:y.secureString(e.name),id:e.actorNr,isMe:e.isLocal})},o.onEvent=function(e,t,n){
if(x.onEvent){var i=o.myRoomActors()[n],r=i&&y.secureString(i.name)||"Another player";x.onEvent({command:e,data:t,
playerName:r})}};var t=n.recPhtnLogs||e.parms().plog||m.config.verbose;Photon.Logger.prototype.log=function(e,n,i){
if(t&&n&&e>=this.level){var o=this.prefix+(3===e?" WARNING: ":" ")+n+" "+i.join(" ");m.log(o)}},t&&o.setLogLevel(p),
m.log("photon: script loaded"),x.stateVar.listenerLoopAction=!1,x.stateVar.set(b.UNINIT)
}else m.log("warning: photon failed to initialize")},s.onerror=function(){s.onload=null,s.onerror=null,
document.body.removeChild(s),s=null,a.length?r(a.shift()):m.log("warning: photon failed to load")},s.src=t,
document.body.appendChild(s)},function(){x.stateVar.val=b.LOADING,r(a.shift())}),createAndJoinRoom:function(e){
o&&o.isInLobby()?o.createRoom(l,{isVisible:!1,maxPlayers:n.maxPlayers,emptyRoomLiveTime:0,suspendedPlayerLiveTime:1,
customGameProperties:e,propsListedInLobby:[]}):m.log("warning: photon: cannot create room until connected to lobby")},
joinRoom:function(){o&&o.isInLobby()?o.joinRoom(l):m.log("warning: photon: cannot enter room until connected to lobby")
},getNumPlayers:function(){return o?o.myRoomActorCount():0},getMyPlayerId:function(){return o?o.myActor().actorNr:null},
getPlayerNameFromId:function(e){if(o&&e){var t=o.myRoomActors()
;for(var n in t)if(t.hasOwnProperty(n)&&t[n].actorNr===e)return y.secureString(t[n].name)}return null},
getPlayerNames:function(){if(o){var e=o.myRoomActors(),t=[]
;for(var n in e)e.hasOwnProperty(n)&&t.push(y.secureString(e[n].name));return t}return[]},isMaster:function(){
if(o)return o.myActor().actorNr===o.myRoomMasterActorNr()},isOnlyPlayer:function(){if(o)return 1===o.myRoomActorCount()
},connect:function(e,t){o&&(t=y.secureString(t),l=e,o.myActor().setName(t),o.setUserId(e+"-"+t),
o.connectToRegionMaster(g))},disconnect:function(){o&&o.disconnect()},sendEvent:function(e){o&&o.raiseEvent(0,e)},
changeProperty:function(e,t){o.myRoom().setCustomProperty(e,t)},changeProperties:function(e){
o.myRoom().setCustomProperties(e)},onPlayerJoin:null,onPlayerLeave:null,onPropertyChange:null,onEvent:null,onError:null
});t.photon=x};i.dependenciesReady=function(){return t.base&&t.utils},t.addModInit("photon",i)}}(),function(){
"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.multiplayer){var n=function(){
var n,i="jigex-mp-game-rec",o=1e3,r=!1,a=t.console,s=t.Variant,l=t.photon,c=t.utils,u=null,d=null,h=l.states,p=function(){
var n,g="",m=null,f=!!e.parms().gameId,v={},y=!1,b=!1,w=function(e,t){v[e]=t,y=!0},x=function(){var e="remote upd: "
;for(var t in this)if(this.hasOwnProperty(t)){var n=typeof this[t];"function"!==n&&"object"!==n&&(e+=t+"="+this[t]+", ")
}return e?e.substring(0,e.length-2):""},P=function(){return x.call(this.data)},_=(n=function(){
y&&(p.timer.isRunning()&&p.timer.update(),l.changeProperties(v),v={},y=!1)},function(){var e=p.getNumPlayers(),t=200
;e>=15?t=1e3:e>=12?t=500:e>=9&&(t=300),clearInterval(d),e&&(d=setInterval(n,t))}),E=function(e,n){
if(l.stateVar.val!==h.LOADING)switch(k(),arguments.length&&(g=c.secureString(e),m=n),l.stateVar.val){case h.NOT_LOADED:
l.load(),p.onLoading&&p.onLoading();break;case h.UNINIT:case h.DISCONN:try{l.connect(p.gameId,g)}catch(e){
if(!e.message.includes("Client: NameServer: [203] PhotonPeer[_send] - Operation 230 - failed"))throw e
;a.warn("failed to connect to the game server"),
t.ui.msgbox("Failed to connect to the game server. Try again by reloading this game.")}break;case h.LOBBY:
f?l.joinRoom():l.createAndJoinRoom(m)}},k=function(){var e=u&&u.Puzzle.curr;v={},y=!1,b=!1,B=[],N=[],M=[],j=[],v={},
y=!1,e&&e.multiplayerGameId&&u.Puzzle.curr.resetPieces()};k();var S,C,T;S=function(e){var t=u&&u.Puzzle.curr
;return t&&e>0&&e<t.pieces.length&&e===Math.floor(e)},C=function(e){var t=parseFloat(e);return t>=0&&t<=1},
T=function(e){return!!e.immediate||l.getPlayerNameFromId(e.p)};l.stateVar.addListener((function(e){switch(e){
case h.UNINIT:p.ERR_CODES=l.ERR_CODES;case h.LOBBY:E();break;case h.JOIN:var t=l.gameInfo._customProperties
;if(t&&void 0===t.rot)throw new Error("Empty game info object encountered");f=!0,H.set(!0);break;case h.DISCONN:k(),
H.set(!1);break;case h.ERR:k(),p.leaveGame()}})),l.onError=function(e){p.errorVar.set(e),p.errorLogsPresent=!0},
l.onPlayerJoin=function(e){_(),p.errorLogsPresent=!1,p.onPlayerJoinVar.val=e},l.onPlayerLeave=function(e){_(),
p.onPlayerExitVar.val=e},l.onEvent=function(){var e=document.getElementById("jigex-canvas");return function(t){if(b){
if(!t.data){var n=typeof t;try{n=JSON.stringify(t)}catch(e){}return void a.warn("unexpected mp event received: evt="+n)}
var i={id:t.data.id,nam:t.playerName,cmd:t.data.cmd,ang:t.data.ang,data:t.data,toString:P}
;i.data.hasOwnProperty("x")&&i.data.hasOwnProperty("y")&&(i.data.x*=e.width,i.data.y*=e.height),
p.onEvent&&c.sysTiming.isRunning&&p.onEvent(i)}}}()
;var z,I,L,O,A=document.getElementById("jigex-canvas"),M=[],j=[],B=[],N=[],R=[],D=(I=function(e,t){e&&(e.logState(t),
e.logHistory())},function(e){I(e.cachedPiece,"piece"),I(e.cachedRefPiece,"ref piece"),I(e.pivotPiece,"pivot piece")
}),G=function(){if(G.isRunning=!0,!p.onAction)throw new Error("Multiplayer onAction handler not set")
;if(p.joinedToGameVar.val){for(;B.length;)z=B.shift(),p.onAction(z)||R.push(z);if(R.length)return B=R,R=[],
void setTimeout(G,100);for(;N.length;)z=N.shift(),p.onAction(z)||R.push(z);return R.length?(N=R,R=[],
void setTimeout(G,100)):M.length||j.length?(B=M,M=[],N=j,j=[],void setTimeout(G,0)):void(G.isRunning=!1)}}
;l.onPropertyChange=(L=function(e){return 0===e.indexOf("p-")},O=function(e){var t={toString:x}
;for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},function(e,t){
for(var n in e)if(e.hasOwnProperty(n)&&(!t||L(n))){var i=e[n],o=parseInt(n.substring(2),10)
;if(isNaN(o))!t&&p.onSettingChange&&p.onSettingChange(n,i);else if((i=O(e[n])).id=o,i.immediate=t,
i.hasOwnProperty("x")&&i.hasOwnProperty("y"))i.x*=A.width,i.y*=A.height,i.m=!!i.m,i.a*=90,
i.p=l.getPlayerNameFromId(i.p),M.push(i);else{if(!i.hasOwnProperty("g"))throw a.log(i.toString()),
new Error("Unrecognized multiplayer update");i.p=l.getPlayerNameFromId(i.p),j.push(i)}}
t&&p.gameInfo.cmplt&&(p.completeWhenLoaded=!0),G.isRunning||!M.length&&!j.length||(t?function(){
if(!p.onAction)throw new Error("Multiplayer onAction handler not set");for(;M.length;)if(z=M.shift(),
!p.onAction(z))throw D(z),new Error("Multiplayer action failed to process");for(;j.length;)if(z=j.shift(),
!p.onAction(z))throw D(z),new Error("Multiplayer group action failed to process")}():G()),b=!0})
;var V,F,H=new s(!1,"mp-joined-to-game",(function(e){if(e){var t=l.gameInfo._customProperties,n=Date.now(),o=!1
;if(t.cmplt);else if(-1===t.sesn)o=!0,a.warn.once("failed to connect to game "+p.gameId+": session id is -1");else{
var r=c.localStore.getItem(i)
;r&&(r=JSON.parse(r)).gameId!==p.gameId&&(r=null),l.isOnlyPlayer()?(r?t.sesn>=r.expectedSessionId?(r.expectedSessionId=t.sesn+1,
r.lastAccess=n,
c.localStore.setItem(i,JSON.stringify(r))):(o=!0,a.warn.once("failed to connect to game "+p.gameId+": session="+t.sesn+", expected_session="+r.expectedSessionId)):(r={
gameId:p.gameId,expectedSessionId:t.sesn+1,lastAccess:n},c.localStore.setItem(i,JSON.stringify(r))),l.changeProperties({
sesn:o?-1:r.expectedSessionId})):(r={gameId:p.gameId,expectedSessionId:t.sesn,lastAccess:n},
c.localStore.setItem(i,JSON.stringify(r)))}if(o)return l.disconnect(),setTimeout((function(){E(g,null)}),2e3),!1}
return!0}),s.LOG_CHANGES,s.LOG_CHANGES),q=(V=null,F=function(){
document.hidden&&(p.isConnecting()?V=setTimeout(F,3e3):p.joinedToGameVar.val&&p.leaveGame())},function(){
a.log("tab has transitioned to "+(document.hidden?"hidden":"visible")),V&&clearTimeout(V),document.hidden&&(Date.now(),
V=setTimeout(F,1e4))});return document.addEventListener("visibilitychange",q),{MAX_NAME_LEN:20,ERR_CODES:null,DEBUG:r,
joinedToGameVar:H,errorVar:new s(null,"mp-error",s.LOG_CHANGES,s.LOG_CHANGES),
onPlayerJoinVar:new s(null,"mp-player-join",s.LOG_CHANGES,s.LOG_CHANGES),
onPlayerExitVar:new s(null,"mp-player-exit",s.LOG_CHANGES,s.LOG_CHANGES),onAction:null,onEvent:null,
onSettingChange:null,onLoading:null,createdGame:!1,completeWhenLoaded:!1,placingPieces:!1,errorLogsPresent:!1,
logGameInfo:function(){H.val&&(a.log(JSON.stringify(l.gameInfo._customProperties)),this.dbug=function(){})},
get isSupported(){return!!window.WebSocket},get gameInfo(){return H.val?l.gameInfo._customProperties:null},
get myPlayerName(){return g},validatePlayerName:function(e,t){var n=t?2*this.MAX_NAME_LEN:this.MAX_NAME_LEN
;if(e&&e.length>=n){var i=(e=e.length>n?e.substr(0,n):e).codePointAt(n-1);i>=55296&&i<=56319&&(e=e.substr(0,e.length-1))
}return e},getPieceInfo:function(e){var t=l.gameInfo._customProperties;if(H.val){if(e){var n=t["p-"+e]
;return n?(n.g&&n.g!==e&&(n=t["p-"+n.g]),n):null}return t}return null},isConnecting:function(){
return l.stateVar.val.gte(h.CONNING_NAM)&&l.stateVar.val.lte(h.CONNED_GAM)},isMaster:function(){
return this.joinedToGameVar.val&&(l.isMaster()||l.isOnlyPlayer())},createAndJoinGame:function(e,t){
this.isConnecting()||(E(this.validatePlayerName(e),t),this.createdGame=!0)},joinGame:function(e){
if(e)var t=this.validatePlayerName(e);else t=g;if(!this.isConnecting()){
if(!t)throw new Error("Cannot join multiplayer game without a player name");E(t,null),this.createdGame=!1}},
leaveGame:function(){l.disconnect()},getNumPlayers:function(){return H.val?l.getNumPlayers():0},
getPlayerNames:function(){return H.val?l.getPlayerNames():[]},sendEvent:function(e,t){var n={id:t.id,cmd:e}
;"rotate"===e&&(n.ang=t.angle),l.sendEvent(n)},sendUpdate:function(e,n){
var i=!!n&&n.isPivot,o=!!n&&n.wasCaptured,r="p-",a={},s=e.group?e.group.refPiece:e
;if(!this.gameInfo.lsync||this.isMaster()||!o){if(r+=s.id.toString(),a.m=s.hasMoved?1:0,a.x=s.position.normX.toFixed(5),
a.y=s.position.normY.toFixed(5),a.a=Math.round(s.angle/90),a.g=s.group?s.group.id:0,a.p=l.getMyPlayerId(),i&&e!==s){
var c=u.Piece.gap,d=t.ClipGL.insts["jigex-canvas"].canvas;c.measure(e,s,!1,e.angle),
a.x=((e.position.x+c.x)/d.width).toFixed(5),a.y=((e.position.y+c.y)/d.height).toFixed(5),a.pv=e.id}o&&(a.wc=1),w(r,a)}},
sendGroupUpdate:function(e){var t="p-",n={};t+=e.id.toString(),n.g=e.group.id,n.p=l.getMyPlayerId(),w(t,n)},
changeSetting:function(e,t){w(e,t)},placePieces:function(){this.placingPieces=!0,k(),
l.onPropertyChange(this.gameInfo,!0),this.placingPieces=!1},timer:function(){var e,t=null,n=function(){
p.timer.isRunning()&&(p.isMaster()?p.timer.update():t=setTimeout(n,o))},i={onRunningChange:null,isRunning:(e=!1,
function(){var n=!(!H.val||p.gameInfo.cmplt||!t);return e!==n&&(e=n,this.onRunningChange&&this.onRunningChange(n)),n}),
start:function(){if(H.val&&!p.gameInfo.cmplt){if(p.isMaster()){var e=p.gameInfo,i=Date.now();l.changeProperties({
elpsd:e.elpsd+(e.last-e.strt),strt:i,last:i,strtd:!0})}clearTimeout(t),t=setTimeout(n,o),this.isRunning()}},
conditionalStart:function(){if(H.val&&!p.gameInfo.cmplt){var e=p.gameInfo
;if(!l.isOnlyPlayer()&&e.strtd)return clearTimeout(t),t=setTimeout(n,o),this.isRunning(),!0}return!1},stop:function(){
if(this.isRunning()&&p.isMaster()){var e=Date.now(),t=p.gameInfo;l.changeProperties({elpsd:t.elpsd+(e-t.strt),strt:0,
last:e,cmplt:!0}),this.isRunning()}},stopDateString:function(){var e=p.gameInfo
;return e&&e.cmplt?c.convertTimestampToLocalDateAndTime(e.last):""},getElapsedSecs:function(){var e=p.gameInfo;if(e){
var t=this.isRunning()?Date.now():e.last,n=e.elpsd+(e.cmplt?0:t-e.strt);return Math.round(n/1e3)}return 0},
update:function(){if(H.val&&!p.gameInfo.cmplt){if(!v.last){var e=Date.now();p.gameInfo.last=e,v.last=e,y=!0,
clearTimeout(t)}clearTimeout(t),t=setTimeout(n,o)}}};return H.addListener((function(e){
e?(l.isOnlyPlayer()&&l.changeProperty("strtd",!1),a.log("number of players: "+l.getNumPlayers())):(clearTimeout(t),
t=null,p.timer.isRunning())})),i}()}}();Object.defineProperty(p,"gameId",{get:(n=e.parms().gameId||c.genGuuid(),
function(){return n})}),t.onInitComplete((function(){u=t.player,t.ClipGL.insts["jigex-canvas"]})),t.multiplayer=p}
;n.dependenciesReady=function(){return!!(t.base&&t.utils&&t.photon&&t.ClipGL)},t.addModInit("multiplayer",n)}}(),
function(){"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.snapIndicator){var n=function(){
var n,i,o,r,a,s=t.console,l=t.Sym,c=t.utils,u=t.multiplayer,d=c.sysTiming.Timer,h=null,p=null,g=t.niftybar,m=500,f=200,v=null,y=null,b=new d,w=null,x=null,P=null,_={
piece1:null,piece2:null},E={left:null,right:null},k=(i=1,o=[],r=[],n=function(){this.killTweeners(),this.opacity=0,
this.active=!1},a=function(e){var t,o=E[e];return o&&o.width&&o.height?t=new h.Clip({
layer:l.get("layers","top-layer").ordinal,name:"snap-"+e+"-"+i,image:{data:E[e]}
}):(s.log("no %s snap image available, using block image instead",e),t=new h.Clip({
layer:l.get("layers","top-layer").ordinal,name:"snap-"+e+"-"+i,width:35,height:35,color:16777215})),t.kill=n,
t.opacity=0,t.active=!1,t},{isReady:function(){return!(!E.left||!E.right)},getClip:function(){
var e=o.pop()||(this.isReady()?{id:i++,timer:new d,left:a("left"),right:a("right"),kill:function(){this.timer.clear(),
this.left.kill(),this.right.kill(),k.free(this)}}:null);return e&&r.push(e),e},free:function(e){var t=r.indexOf(e)
;-1!==t&&r.splice(t,1),o.push(e)},kill:function(){for(;r.length;)r.pop().kill()}}),S=function(e){
var t=e.response,n=e.clip;t.width&&t.height?E[n]=t:s.log("warn: snap indicator "+n+" image did not load")
},C=function(e){e.timer.set(m,L.bind(null,e))},T=function(e){e.left.opacity=0,e.right.opacity=0,e.left.active=!1,
e.right.active=!1,e.piece=null,e.neighbor=null,k.free(e)},z=function(e){var t=e.left.position,n=e.right.position
;t.tween(t.x+15,t.y,m,null,h.EASE_IN),n.tween(n.x-15,n.y,m,C.bind(null,e),h.EASE_IN)},I=function(e){
var t,n,i=e.piece,o=e.neighbor;if(i.stateVar.val.eq(v,y)||o.stateVar.val.eq(v,y))t=i.position.x,n=i.position.y-50;else{
var r=e.piece.position.x,a=e.piece.position.y,s=e.neighbor.position.x,l=e.neighbor.position.y
;t=(r<=s?r:s)+Math.round(Math.abs(r-s)/2),n=(a<=l?a:l)+Math.round(Math.abs(a-l)/2)-50}return n=n<=0?n+100:n,
e.left.fadeIn(f),e.left.position.assign(t-21,n),e.right.fadeIn(f,z.bind(null,e)),e.right.position.assign(t+20,n-2),{
htmlX:Math.round(t/h.canvas.width*p.host.getWidth()),htmlY:Math.round(n/h.canvas.height*p.host.getHeight())}
},L=function(e){e.left.fadeOut(f),e.right.fadeOut(f,T.bind(null,e))},O=function(){if(p.Puzzle.curr){
var e,t=w.neighborWithinSnapRange(!1);if(e=w===_.piece1&&t===_.piece2,t&&!e){var n=k.getClip();if(!n)return;n.piece=w,
n.neighbor=t,I(n)}t?(_.piece1=w,_.piece2=t):(_.piece1=null,_.piece2=null)}},A=function(){
x=new c.WebReq(e.imagesPath+"snap-indicator-left.png",e.altImagesPath?e.altImagesPath+"snap-indicator-left.png":null),
P=new c.WebReq(e.imagesPath+"snap-indicator-right.png",e.altImagesPath?e.altImagesPath+"snap-indicator-right.png":null),
x.clip="left",x.onload=S,x.send(),P.clip="right",P.onload=S,P.send()};t.onInitComplete((function(){
v=l.get("PC","remote-select"),y=l.get("PC","remote-control"),p=t.player,h=p.clipGL,p.delayedActions.add((function(){
new d(1e3,A)}))})),t.snapIndicator={check:function(e){k.isReady()&&(w=e,b.set(450,O))},show:function(e,t){
if(k.isReady()&&e!==_.piece1){var n,i=k.getClip(),o=e.remotePlayerName;i&&(i.piece=e,i.neighbor=t,n=I(i),
o&&(o=u.validatePlayerName(o,!0),n={left:Math.round(n.htmlX-g.measure(o)/2),top:n.htmlY-50},
g.showTooltip(n,o,this.aniDuration)))}},kill:function(){b.clear(),k.kill()},aniDuration:1400}}
;n.dependenciesReady=function(){return!!(t.base&&t.ClipGL&&t.niftybar&&t.multiplayer)},t.addModInit("snapIndicator",n)}
}(),function(){"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.ui){var n=function(){
var n,i,o,r,a,s,l,c,u,d,h,p,g,m,f,v,y=window.location.href.includes("noad=y"),b=window.location.href.includes("?url=")||window.location.href.includes("&url="),w=window.Sym,x=t.console,P=t.Variant,_=e.debug,E=t.niftybar,k=window.jQuery,S=t.utils,C=t.multiplayer,T=S.localStore,z=e.errMonitor,I=null,L=navigator.userAgent.includes("Edge/"),O=e.status.framed,A=document.getElementById("jigex-control-host"),M=null,j=document.getElementById("jigex-spinner"),B=E.getPnl("jigex-spinner-container"),N=E.getBtn("jigex-capture-btn"),R=E.getBtn("jigex-edges-btn"),D=E.getBtn("jigex-edges-btn-alt"),G=E.getBtn("jigex-boxtop-btn"),V=E.getBtn("jigex-test-btn"),F=E.getBar("jigex-toolbar"),H=E.getPnl("jigex-start-dlg"),q=E.getBar("jigex-start-tb"),W=k("#jigex-nop-buttons"),U=E.getPnl("jigex-help-panel"),Y=(E.getPnl("jigex-help-content"),
document.getElementById("jigex-help-btn")),X=E.getPnl("jigex-msgbox-dlg"),J=k("#jigex-msgbox-content"),K=E.getBar("jigex-msgbox-tb"),Q=E.getPnl("jigex-prog-menu"),Z=E.getBtn("jigex-modify-btn"),$=(E.getBtn("jigex-visit-btn"),
k("#jigex-open-btn")),ee=k("#jigex-open-file-btn"),te=E.getBtn("jigex-clock"),ne=E.getPnl("jigex-pause-scrn"),ie=E.getPnl("jigex-pause-dlg"),oe=k("#jigex-status-line"),re=E.getBtn("jigex-show-ls-btn"),ae=E.getBtn("jigex-clear-ls-btn"),se=E.getPnl("jigex-toast-pnl"),le=E.getPnl("jigex-log-dlg"),ce=E.getBtn("jigex-test-atn-btn"),ue=E.getBtn("jigex-test-btn-alt"),de=(E.getPnl("jigex-promo-1"),
E.getBtn("jigex-fullscreen-btn")),he=document.getElementById("jigex-support-tools-link"),pe=document.getElementById("jigex-support-tools-panel"),ge=document.getElementById("jigex-hard-reload-btn"),me=document.getElementById("jigex-prog-log-btn"),fe=(document.getElementById("jigex-clear-recs-btn"),
document.getElementById("jigex-import-rec-btn")),ve=(document.getElementById("jigex-tag-line"),
document.getElementById("jigex-mute-btn")),ye=document.getElementById("jigex-noads-btn"),be=E.getBtn("jigex-multiplayer-btn"),we=document.getElementById("jigex-help-mp"),xe=Array.prototype.slice.call(document.getElementsByTagName("input")),Pe=!1,_e=xe.filter((function(e){
return"text"===e.type&&!e.readOnly}));function Ee(e){try{if(e.codePointAt){
for(var t=e.length,n="nam="+e+", len="+t+", cpts: ",i=0;i<t;i++)n+=e.codePointAt(i),i<t-1&&(n+=", ");x.log(n)}}catch(e){
x.log("failed to log player name. error="+e.message)}}
if(n=[document.getElementById("jigex-credits-content"),document.getElementById("jigex-help-content"),document.getElementById("jigex-log-pane")],
i=NaN,o=NaN,r=0,a=null,s=function(e){o=i,i=e.touches[0].screenY,"touchstart"===e.type?r=0:isNaN(o)||i===o||(r=i-o>0?1:2)
},A&&(e.isIE11||L?A.style["touch-action"]="none":(A.addEventListener("touchstart",(function(e){
e.touches&&(a=function(e){for(;e;){if(n.includes(e))return e.clientHeight<e.scrollHeight?e:null;e=e.parentElement}
return null}(e.target))&&s(e)})),A.addEventListener("touchmove",(function(e){a?(s(e),
(1===r&&0===a.scrollTop||2===r&&a.scrollTop>=a.scrollHeight-a.clientHeight)&&e.preventDefault()):e.preventDefault()
})))),N&&(N.onclick=function(){var e=I?I.Puzzle.curr:null;e&&e.toggleCaptureMode()}),R.onclick=(l=null,function(t){
var n=I.Puzzle.curr;if(n&&n.state.gte(e.PS_READY)){
var i=n.pieces.isEdgeComplete,o=n.multiplayerGameId&&C.getNumPlayers()>1;i||o?(n.relayer(),n.scatter({partial:!0,
shift:t.shiftKey,animate:!0,byCommand:!0}),n.updateRecord()):(l||(l=w.get("EDO",1)),
n.showEdgesOnly(!n.showEdgesOnly(),l),C.joinedToGameVar.val&&C.changeSetting("edo",n.showEdgesOnly()))}}),
D&&(D.onclick=R.onclick),G.onclick=function(){var e=I&&I.Puzzle.curr
;e&&e.customMystery?Je.msgbox("This puzzle's box top preview is disabled for added challenge."):M&&(M.toggleDisplay(),
G.toggled(M.isShowing()))},G.ontouchstart=(c=G.onclick,u=G.onmouseenter,d=G.onmouseleave,h=function(){G.onclick=c,
G.onmouseenter=u,G.onmouseenter=d},p=function(){document.removeEventListener("touchstart",p),
M&&M.isPeeking()&&M.unpeek()},g=function(){document.addEventListener("touchstart",p,!1)},function(){var e=I.Puzzle.curr
;G.onclick=null,
G.onmouseenter=null,G.onmouseenter=null,setTimeout(h,1e3),M&&(M.isShowing()||M.isPeeking()?(M.toggleDisplay(),
G.toggled(M.isShowing())):e&&e.customMystery?Je.msgbox("This puzzle's box top preview is disabled for added challenge."):(setTimeout(M.peek.bind(M),200),
setTimeout(g,200)))}),G.onmouseenter=function(){var e=I?I.Puzzle.curr:null;!M||e&&e.customMystery||M.peek()},
G.onmouseleave=function(){M&&M.unpeek()},Q.onShow=function(){
Z.enabled(!H.visible()&&I&&I.Puzzle.curr&&I.Puzzle.curr.isReady())},Z.enabled(!1),Z.onclick=function(){
var t=I.Puzzle.curr;H.visible(!0),t&&(t.state=e.PS_WAITING)},ve&&(ve.onclick=function(){e.audioMuted(!e.audioMuted()),
Je.update()}),ye&&(y||b?(ye.style.display="none",ye=null):ye.onclick=function(){Je.stopAds()}),
O?$[0].style.display="none":(ee.click((function(){Q.visible(!1)})),ee.hover((function(){try{
$.css("background-color","#f0f0f0")}catch(e){}}),(function(){try{$.css("background-color","white")}catch(e){}}))),
function(){if(!O){var e=ee[0];e.addEventListener("change",(function(t){return Je.onFileSelect&&(Pe=!0,
Je.onFileSelect(t)),e.value="",!1}),!1)}}(),Y&&(Y.onclick=function(){U.visible(!0)}),he&&pe&&(he.onclick=function(){
var e=document.getElementById("jigex-help-content")
;return"block"===pe.style.display?pe.style.display="none":(pe.style.display="block",e.scrollTop=e.scrollHeight),!1}),
ge&&(ge.onclick=function(){window.location.reload(!0)}),me&&(me.onclick=function(){Je.programLog.show()}),
fe&&(fe.onclick=(m=E.getPnl("jigex-import-rec-dlg"),f=document.getElementById("jigex-puzzle-rec"),
E.getBtn("jigex-rec-import").onclick=function(){},function(){m.visible(!0),f.focus()})),de&&!e.isIOS){
var ke="Full screen mode was denied by the browser. Try entering full screen mode by pressing the F11 key instead (or press Ctrl+Cmd+F for Macs)",Se=document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullscreenEnabled
;document.exitFullscreen=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen
;try{A.requestFullscreen=A.requestFullscreen||A.webkitRequestFullscreen||A.mozRequestFullScreen||A.msRequestFullscreen
}catch(e){}A.requestFullscreen&&Se&&(de.button.css("display","block"),de.onclick=function(){
if(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement)document.exitFullscreen();else if(window.Promise){
var e=A.requestFullscreen();e&&e.catch&&e.catch((function(){Je.msgbox(ke)}))}else try{A.requestFullscreen()}catch(e){
Je.msgbox(ke)}},document.onfullscreenchange=function(){
var e=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement
;de.toggled(!!e)},document.onwebkitfullscreenchange=document.onfullscreenchange,
document.onmozfullscreenchange=document.onfullscreenchange,document.onmsfullscreenchange=document.onfullscreenchange,
document.onfullscreenchange())}_&&(V.button.css("display","block"),re.onclick=function(){I.testShowLS()},
ae.onclick=function(){I.testClearLS()},ce.onclick=function(e){I.test(e.shiftKey)},ue&&(ue.onclick=ce.onclick)),
function(){
var e,t=[],n=[],i=document.getElementById("jigex-clock"),o=document.getElementById("jigex-toolbar"),r=document.getElementById("jigex-toolbar-left")
;if(r){
for(var a=document.getElementsByClassName("main-tb-btn"),s=a.length,l=getComputedStyle(a[0]),c=parseInt(l.width)+2*parseInt(l["padding-left"]),u=2*parseInt(getComputedStyle(r)["padding-left"],10),d=s-1;d>=0;d--)if(e=a[d],
"none"===k(e).css("display"))s--;else if(e.hasAttribute("data-adaptable")){var h=document.getElementById(e.id+"-alt")
;h&&(e.jigexAltBtn=h,h.style.display="none"),t.push(e)}t.sort((function(e,t){
return e.getAttribute("data-adaptable")<t.getAttribute("data-adaptable")?1:-1}))
;var p=s*c+parseInt(getComputedStyle(i).width),g=function(){var i=parseInt(getComputedStyle(o).width,10)-u-p+n.length*c
;if(i<0)for(;i<0&&t.length;)(e=t.pop()).style.display="none",
n.push(e),i+=c,e.jigexAltBtn&&(e.jigexAltBtn.style.display="block");else for(;i>=c&&n.length;)(e=n.pop()).style.display="block",
t.push(e),i-=c,e.jigexAltBtn&&(e.jigexAltBtn.style.display="none")};g(),addEventListener("resize",g,!1)}}(),
(v=document.getElementById("jigex-alt-audio-chkbox"))&&(t.Sonic!==t.SonicH5||e.forceAltAudio?(v.checked=e.forceAltAudio,
v.onchange=function(){var t=v.checked
;v.checked=!1,t?e.modules.ui.msgbox("It is recommended not to use alternate audio unless you cannot hear this puzzle program's sound effects.<br/><br/>Do you want to continue?",["jigex-mb-yes","jigex-mb-no"],(function(t){
"yes"===t&&(v.checked=!0,
T.setItem("jigex-alt-audio","true"),e.modules.ui.msgbox("Reload this puzzle to activate the change."))
})):(T.removeItem("jigex-alt-audio"),e.modules.ui.msgbox("Reload this puzzle to activate the change."))}):v.disabled=!0)
;var Ce,Te,ze,Ie,Le,Oe,Ae,Me,je,Be,Ne,Re,De,Ge,Ve,Fe,He,qe,We,Ue,Ye,Xe,Je={
OPEN_HAND_CURSOR:"cursor: pointer; cursor: -webkit-grab; cursor: -moz-grab; cursor: grab",
CLOSED_HAND_CURSOR:"cursor: pointer; cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: grabbing",
NOT_ALLOWED_CURSOR:"cursor: not-allowed",NO_CURSOR:"cursor: none",DEFAULT_CURSOR:"cursor: default",isReady:!0,
verboseLoggingVar:(Ue="verbose"===_,Ye=new P(Ue,"verbose logging"),Xe=document.getElementById("jigex-verbose-chkbox"),
Xe&&(Xe.onclick=function(){x.config.verbose=Xe.checked,t.Variant.enableLogs(!0,Xe.checked),Ye.val=Xe.checked,
_&&(P.prototype.extLogVerbosity=Xe.checked?P.LOG_CHANGES:P.LOG_NONE)},Ue&&(Xe.checked=!0,Xe.onclick(null))),Ye),
textInputMode:function(){var e=document.activeElement;return e&&-1!==_e.indexOf(e)},onTextInputBlur:(qe=[],
We=function(){for(;qe.length;)qe.pop()()},_e.forEach((function(e){e.addEventListener("blur",We)})),function(e){
e&&this.textInputMode()&&qe.push(e)}),starterDlg:(Fe=220===Math.floor(H.panel.width()),He=!1,H.update=function(){},
H.cloak=function(){H.panel.css("display","none"),H.isCloaked=!0},H.uncloak=function(){H.panel.css("display","block"),
H.isCloaked=!1},H.onShow=function(){var e=I.Puzzle.curr,t=e&&e.multiplayerGameId;He||!be||O||(He=!0,
H.panel.width(Fe?256:356),be.button.css("display","block"),we&&(we.style.display="block")),
Je.rotateBtn.toggled(I.Puzzle.curr&&I.Puzzle.curr.rotatable),Je.rotateBtn.enabled(!t),
Je.numPiecesBtn.enabled(!t&&!e.customMystery),be&&e.stateVar.addListener(H.update)},H),
numPiecesBtn:E.getBtn("jigex-num-pieces-btn"),rotateBtn:E.getBtn("jigex-rotate-btn"),
themeBtn:E.getBtn("jigex-theme-btn"),startBtn:E.getBtn("jigex-ok-btn"),edgesBtn:R,disable:function(){E.enabled=!1},
invitePanel:function(){if(be){
var t=E.getPnl("jigex-invite-panel"),n=E.getPnl("jigex-game-panel"),i=document.getElementById("jigex-game-link"),o=document.getElementById("jigex-game-back-btn"),r=document.getElementById("jigex-invite-back-btn"),a=document.getElementById("jigex-invite-btn"),s=document.getElementById("jigex-copy-button"),l=document.getElementById("jigex-copy-conf"),c=document.getElementById("jigex-player-name"),u=document.getElementById("jigex-player-name-desc"),d=document.getElementById("jigex-invite-spinner")
;d.style["animation-play-state"]="paused",d.style.display="none";var h=(p=!1,function(o){
var r=e.parms(),a=I.Puzzle.curr,s=Date.now(),l={pid:a.name,nop:a.pieces.length,rows:a.pieces.numRows,
cols:a.pieces.numCols,seed:a.getSeed(),aseed:a.getAngleSeed(),tabr:a.tabHoleRightIndex,tabb:a.tabHoleBottomIndex,
shp:a.shapeIndex,rot:a.rotatable,edo:a.showEdgesOnly(),elpsd:0,strt:s,last:s,sesn:0,dev:!0,lsync:o.shiftKey}
;l.nop!==l.rows*l.cols&&(x.warn("gameprops mismatch"),z.sendReport("Gameprops mismatch")),
r.puzzleId?l.pid=r.puzzleId:r.url&&(l.pid=null,l.url=r.url,r.cred&&(l.cred=r.cred),r.credu&&(l.credu=r.credu)),
Je.startBtn.enabled(!1),p||(C.joinedToGameVar.addListener((function(o){if(o){
var a="https://jigex.com/",s=C.gameId,l=e.homeDomain+"online-jigsaw-puzzle-player.html?gid="+s+"&rgn="+e.status.region+(r.url?"&cstm=1":""),u=location.href.indexOf("&key=")
;-1!==u&&(l+="&key="+location.href.substr(u+5))
;var h,p=e.fetchPath+encodeURIComponent(a+"createShortLink?url="+encodeURIComponent(l))
;(h=new S.WebReq(p)).onload=function(){var e,o=h.response;o?(e=(o=JSON.parse(o).shortLink).substring(a.length),
C.changeSetting("scode",e),d.style["animation-play-state"]="paused",d.style.display="none",E.enabled=!0,t.visible(!1),
i.value=o,
n.visible(!0),Je.startBtn.enabled(!0),Je.startBtn.click(),I.Puzzle.curr.multiplayerGameShortLink=o):Je.msgbox("An error occurred while creating the game link. Please try again.",X.OK,(function(){
window.location.reload()}))},h.send(),Ee(c.value),x.log("multiplayer: joined to game "+s),ee[0].disabled=!0,
te.tooltip="Click to see game information"}return"remove"})),p=!0),C.createAndJoinGame(c.value,l)})
;return be.onclick=function(){
var n=I.Puzzle.curr,i=n&&n.multiplayerGameId,o=!n||n.stateVar.val.lte(e.PS_READY),r=n&&(n.numMoves||n.record)
;if(i)C.joinedToGameVar.val?Je.connPanel.visible()?Je.connPanel.visible(!1):Je.connPanel.show():Je.joinPanel.visible("toggle");else if(C.isSupported){
if(Pe)Je.msgbox("Multiplayer mode is not supported for a puzzle based on a local image from your computer");else if(r){
Je.msgbox('Entering multiplayer mode will cause you to lose any progress you have made on the puzzle so far.<br/><br/>Choose "Continue" to proceed or "Cancel" to abort.',["jigex-mb-continue","jigex-mb-cancel"],(function(e){
if("ok"===e){var t=I.Puzzle.curr;t&&(t.reset(),be.onclick())}}))}else if(o&&(t.visible("toggle"),t.visible())){
var s=T.getItem("jigex-player-name");s&&s.length?(c.value=C.validatePlayerName(s),
a.focus()):"phone"!==I.DEVICE_TYPE&&c.focus()}}else Je.msgbox("This web browser does not support multiplayer mode.")},
a.onclick=function(e){if(c.value.length){var t=I.Puzzle.curr;t&&t.pieces&&t.pieces.length&&(a.disabled=!0,c.disabled=!0,
r.style.display="none",d.style.display="block",d.style["animation-play-state"]="running",E.enabled=!1,
T.setItem("jigex-player-name",c.value),x.log("mp invite button clicked"),h(e))}else u.style.color="red",c.focus()},
s.onclick=function(){var e=navigator.clipboard;function t(){l.style.visibility="visible",setTimeout((function(){
l.style.visibility="hidden"}),3e3)}function n(){i.focus(),i.setSelectionRange(0,999),
document.execCommand("copy")?(l.textContent="Link copied!",t()):(l.textContent="Copy failed!",t()),
i.setSelectionRange(0,0)}if(e&&e.writeText)try{e.writeText(i.value).then((function(){l.textContent="Link copied!",t()
}),(function(){n()}))}catch(e){n()}else n();return!1},r.onclick=function(){t.visible(!1)},o.onclick=function(){
n.visible(!1)},window.addEventListener("keyup",(function(e){
t.visible()&&(c.value.trim().length?u.style.color="black":u.style.color="red")})),t}return null;var p}(),
connPanel:function(){if(be){
var e=E.getPnl("jigex-conn-panel"),n=document.getElementById("jigex-player-list"),i=document.getElementById("jigex-conn-back-btn"),o=document.getElementById("jigex-conn-text"),r=null,a=null,s=!1
;return C.onLoading=function(){r=new t.Sonic("player-join"),a=new t.Sonic("player-leave")},i.onclick=function(){
e.visible(!1)},e.show=function(){
C.gameInfo.cmplt?(o.innerHTML="This game was completed on<br/>"+C.timer.stopDateString(),
n.innerHTML=""):n.innerHTML=C.getPlayerNames().join("<br/>"),e.visible(!0)},C.onPlayerJoinVar.addListener((function(e){
r&&r.play(),Je.toast.show('Player "'+e.name+'" joined the game.',5e3),s=s||e.name===C.myPlayerName})),
C.onPlayerExitVar.addListener((function(e){s&&(a&&a.play(),Je.toast.show('Player "'+e.name+'" left the game.'),
s=e.name!==C.myPlayerName)})),e}}(),joinPanel:function(){if(be){
var t=E.getPnl("jigex-join-panel"),n=(document.getElementById("jigex-join-back-btn"),
document.getElementById("jigex-join-btn")),i=document.getElementById("jigex-player-name-join"),o=document.getElementById("jigex-player-name-desc-join"),r=document.getElementById("jigex-join-spinner")
;return r.style["animation-play-state"]="paused",r.style.display="none",window.addEventListener("keyup",(function(e){
t.visible()&&(13===e.which&&n.onclick(null),i.value.trim().length?o.style.color="black":o.style.color="red")})),
t.show=function(){var e=T.getItem("jigex-player-name");t.visible(!0),e&&e.length?(i.value=C.validatePlayerName(e),
n.focus()):"phone"!==I.DEVICE_TYPE&&i.focus()},n.onclick=(a=!1,s=!1,function(){if(i.value.length){var l=C.gameId
;a||(C.joinedToGameVar.addListener((function(e){e&&(r.style["animation-play-state"]="paused",r.style.display="none",
Ee(i.value),x.log("multiplayer: joined to game "+l),Je.joinPanel.visible(!1),ee[0].disabled=!0,
te.tooltip="Game information",s||(Je.connPanel.show(),s=!0))})),C.errorVar.addListener((function(o){o&&(C.leaveGame(),
o.errorMsg.includes("Error response ResultCode='3'")?Je.msgbox("The specified game has expired after 30 days of inactivity or does not exist."):o.errorMsg.includes("already joined the specified game")?(Je.msgbox("You cannot join this game because player "+i.value+" is already present.",Je.msgbox.OK,(function(){
n.disabled=!1,i.disabled=!1,t.visible(!0)
})),setTimeout(Je.toast.hide,100)):o.errorMsg.includes("Game full")?(Je.msgbox("The maximum number of players allowed to be present in a game at one time is "+e.status.maxPlayers+". The game you are attempting to join has already reached that limit."),
setTimeout(Je.toast.hide,100)):o.errorMsg.includes("Max CCU of ")?(Je.msgbox("Jigsaw Explorer's system has currently reached the maximum number of multiplayer participants it can handle. Please try again later. We will increase the capacity of our system soon."),
setTimeout(Je.toast.hide,100),
z.sendReport("Max CCUs Exceeded")):x.info("multiplayer error: errCode=%s, opCode=%s, errMsg=%s",o.errorCode,o.opCode,o.errorMsg),
r.style["animation-play-state"]="paused",r.style.display="none",t.visible(!1))})),a=!0),n.disabled=!0,i.disabled=!0,
r.style.display="block",r.style["animation-play-state"]="running",T.setItem("jigex-player-name",i.value),
x.log("mp join button clicked: nam="+i.value+", gid="+l),Ee(i.value),C.joinGame(i.value)}else o.style.color="red",
i.focus()}),t}return null;var a,s}(),colorMenu:function(){var e=E.getPnl("jigex-theme-color-menu")
;t.theme.isLoaded.addListener((function(){if(t.theme.isLoaded.val){var e=t.theme.val
;F.bar.css("background-color",e.color.panel),q.bar.css("background-color",e.color.panel),
H.panel.css("background-color",e.color.panel),H.panel.css("border-color",e.color.border),
Je.startBtn.button.css("background-color",e.color.highlight),e.button.toggled(!0),
t.theme.oldTheme&&t.theme.oldTheme.button.toggled(!1)}}));var n=function(e){t.theme.val=e
},i=document.getElementById("jigex-color-buttons"),o=t.theme.getThemeNames();i.innerHTML=o.reduce((function(e,t){
return e+'<div id="jigex-color-'+t+'-btn" class="niftybar-tab-button jigex-color-button" data-selected-tab-style="jigex-color-sel-button"><div id="jigex-color-'+t+'-swatch" class="jigex-color-swatch">&nbsp;</div></div>'
}),"")
;for(var r=E.getBar("jigex-color-buttons"),a=k(i.getElementsByClassName("jigex-color-button")),s=r.addButtons(a),l=0;l<s.length;l++){
var c=s[l],u=o[l],d=w.get("themes",u)
;document.getElementById("jigex-color-"+u+"-swatch").style["background-color"]=d.color.background,d.button=c,
c.onclick=n.bind(c,d)}return document.getElementById("jigex-color-back-btn").onclick=function(){e.visible(!1)},
window.addEventListener("resize",(function(){e.visible(!1)})),e}(),numPiecesMenu:function(){for(var e,t=function(e){
var t=e.niftybarElement;n.selectedNop.selected=!1,n.selectedNop=t.choice,n.selectedNop.selected=!0,n.rows=t.choice.rows,
n.cols=t.choice.cols,n.onNopChange&&(n.visible(!1),Je.busy(!0),setTimeout(n.onNopChange,E.tweenPeriod+5))
},n=E.getPnl("jigex-num-pieces-menu"),i=E.getBar("jigex-nop-buttons"),o="",r=0,a=0;a<69;a++)o+='<div data-order="'+r+++'" class="niftybar-tab-button jigex-nop-button" data-selected-tab-style="jigex-nop-sel-button"></div>'
;for(W[0].innerHTML=o,o=W.find(".jigex-nop-button"),o=k(o),a=(e=i.addButtons(o)).length-1;a>=0;a--)e[a].onclick=t
;return n.selectedNop=null,n.rows=0,n.cols=0,n.onNopChange=null,n.setChoices=function(t){for(var i=68;i>=0;i--){
var o=e[i];if(i<t.length){var r=t[i];o.button.css("display","block"),o.button[0].innerHTML=r.nop.toString(),o.choice=r,
r.selected&&(n.selectedNop=r,o.toggled(!0),Je.crn(r))}else o.button.css("display","none")}},
window.addEventListener("resize",(function(){n.visible(!1)})),n}(),crn:function(){if(!arguments.length){
var e=[84,104,105,115,32,105,115,32,116,104,101,32,74,105,103,115,97,119,32,69,120,112,108,111,114,101,114,32,106,105,103,115,97,119,32,112,117,122,122,108,101,32,112,114,111,103,114,97,109,32,58,32,67,111,112,121,114,105,103,104,116,32,40,99,41,32,50,48,49,53,32,67,97,114,111,108,105,110,97,32,82,111,97,100,32,83,111,102,116,119,97,114,101,44,32,76,76,67],t=String.fromCharCode.apply(null,[105,110,110,101,114,72,84,77,76]),n=String.fromCharCode.apply(null,[103,101,116,69,108,101,109,101,110,116,115,66,121,84,97,103,78,97,109,101])
;Array.prototype.slice.call(document[n]("div")).forEach((function(n){try{
var i=parseInt(getComputedStyle(n).width,10),o=parseInt(getComputedStyle(n).height,10)
;i>1e3&&o<i/10&&(n[t]=String.fromCharCode.apply(null,e))}catch(e){}}))}},setClock:function(e){if(te){
var t=null,n=e%60,i=Math.floor(e/60)%60,o=Math.min(9999,Math.floor(e/3600));0===e?t="0:00":(t=n<10?":0"+n:":"+n,
t=o&&i<10?"0"+i+t:i.toString()+t,o&&(t=o.toString()+":"+t)),te.button.text(t)}},pause:(ie.onResponse=function(){
ne.visible(!1),I.clock.resume()},function(e){ie.visible()||(oe.text(e),ne.visible(!0),ie.visible(!0))}),
programLog:(Oe=k("#jigex-log-pane"),Ae=document.getElementById("jigex-screen-cap"),Me=null,
je=document.getElementById("jigex-preview-cap"),
Be=E.getPnl("jigex-cap-dlg"),Ne=document.getElementById("jigex-include-cap"),
Re=document.getElementById("jigex-log-name"),De=function(e){Me?e&&e():(Me=document.getElementById("jigex-cap-img"),
I.clipGL.projector.captureScreen((function(t){var n,i,o,r,a=document.createElement("canvas"),s=a.getContext("2d")
;Me.onload=function(){o=Me.naturalWidth,r=Me.naturalHeight,n=600/((i=o>=r)?o:r),Me.width=i?600:Math.round(n*o),
Me.height=i?Math.round(n*r):600,a.width=Me.width,a.height=Me.height,s.drawImage(Me,0,0,Me.width,Me.height),
Me.onload=function(){e&&e()},Me.src=a.toDataURL("image/jpeg",.85)},Me.onerror=function(){
x.error("screen capture failed")},Me.src=t})))},Ge=function(t){if("yes"===t){if(z.setAuxData("Screenshot","n/a"),
Me&&Me.width){if(Ae&&Ae.checked){var n={id:"jigex-sshot-"+(new Date).getTime()+"-"+Math.floor(1e6*Math.random()),
data:Me.src};S.postMsg(e.homeDomain+"scripts/aws/store-debug-data.php",JSON.stringify(n)),
z.setAuxData("Screenshot",e.homeDomain+"scripts/aws/view-debug-sshot.php?id="+n.id)}Me.width=0,Me=null}
I.missingPieceCheck(),z.sendReport("Log delivery from user "+(Re.value.trim()||"n/a"),{manual:!0}),le.visible(!1),
Je.programLog.onClose&&Je.programLog.onClose(t)}},Ve=function(e){
X.visible(!1),Je.programLog.onClose&&Je.programLog.onClose(e)},E.getBtn("jigex-log-send").onclick=function(){
Re.value.length?X.visible()||Je.msgbox("Are you sure you want to send the program logs to the Support team?",["jigex-mb-yes","jigex-mb-no"],Ge):Je.msgbox('Please enter your name in the "Name" field.')
},E.getBtn("jigex-log-cancel").onclick=function(){Me&&(Me.width=0,Me=null,Ae.checked=!1)},{show:function(){
var t=Oe[0],n=I&&I.Piece.selectedPiece;Ae&&(Ne.onclick=function(e){Ae.checked=!Ae.checked,Ae.onclick(e)},Ae.checked=!1,
Ae.onclick=function(){Ae.checked&&De()},je.onclick=function(){Be.visible()?Be.visible(!1):De((function(){
var e=I?I.clipGL.canvas.width:null,t=I?I.clipGL.canvas.height:null;Be.panel.css("width",Me.naturalWidth),
Be.panel.css("height",Me.naturalHeight),Be.panel.css("max-width","85%"),Be.panel.css("max-height","85%"),
x.log("canvas size: "+e+"x"+t),Me.style.width="100%",Me.style.height="100%",Me.onclick=function(){Be.visible(!1)},
Be.panel.css("z-index",99999),Be.visible(!0)}))
}),C.errorLogsPresent&&(e.status.recPhtnLogs||e.parms().plog||Je.verboseLoggingVar.val)&&(x.log("------------------- photon logs ----------------------"),
x.log(P.getLogs((function(e){return 0===e.indexOf("Client: ")}),{limit:200
}))),n&&(e.status.dbgEvents||_)&&(n.logState("selected piece state"),n.logHistory(!0)),t.innerHTML=x.toString(),
le.onResponse=Ve,le.visible(!0)
;var i=parseInt(getComputedStyle(document.getElementById("jigex-log-tb")).height),o=parseInt(getComputedStyle(document.getElementById("jigex-log-dlg")).height),r=parseInt(getComputedStyle(document.getElementById("jigex-log-container")).height)
;Oe.height(Oe.height()+o-r-i),_&&(t.scrollTop=t.scrollHeight)},isShowing:function(){return le.visible()},onClose:null}),
toast:(Ie=null,Le=function(){se.visible(!1)},{show:function(e,t,n){var i,o=O?A.offsetWidth:window.innerWidth
;se.panel[0].innerHTML=e,i=Math.round((o-se.panel.outerWidth())/2),se.panel.css("left",i+"px"),
n?se.panel.addClass("jigex-clickable-toast"):se.panel.removeClass("jigex-clickable-toast"),se.visible(!0),
se.panel.on("click",n||void 0),t&&(Ie=setTimeout(Le,t))},hide:function(){se.visible(!1),clearTimeout(Ie),Ie=null}}),
help:{isShowing:function(){return U.visible()}},update:function(){var t=I.Puzzle.curr;if(t&&!t.stateVar.isDisposed){
var n=t.state.gte(e.PS_READY),i=t.pieces.isEdgeComplete,o=t.multiplayerGameId&&I.Puzzle.partiallyComplete&&C.getNumPlayers()>1
;G.toggled(M.isShowing()),G.enabled(t.state.gte(e.PS_WAITING)),R.toggled(t.showEdgesOnly()),R.enabled(n),
R.tooltip=i||o?"Rearrange loose pieces":"Display only the edge pieces",D&&D.enabled(n&&!t.pieces.isEdgeComplete),
N&&(N.enabled(n),N.toggled(t.capStateVar.meta.isCapturing()))}else G&&G.enabled(!1),R&&R.enabled(!1),N&&N.enabled(!1)
;ve&&(ve.innerHTML=e.audioMuted()?"Unmute":"Mute")},busy:function(e){if(void 0===e)return B.visible()
;e!==B.visible()&&(e?(j.style["animation-play-state"]="running",B.visible(!0,!0),E.enabled=!1):(B.visible(!1,!0),
j.style["animation-play-state"]="paused",E.enabled=!0))},cursor:function(){var t=null,n=null;return function(i,o){
var r=I.clipGL.canvas,a=r.getAttribute("style");if(e.isIE11&&a&&";"===a[a.length-1]&&(a=a.substring(0,a.length-1)),
void 0===i)return a;i!==a&&(clearTimeout(n),n=null,o?t||(t=a):t=null,r.setAttribute("style",i),this.update(),
o&&(n=setTimeout((function(){Je.cursor(t)}),o)))}}(),deleteRecordPrompt:function(e,t){
var n=e+'<br/><br/>Note: You can click the "Delete" button if you no longer wish to complete the puzzle.'
;this.msgbox(n,["jigex-mb-delete","jigex-mb-ok"],(function(e){
"delete"===e&&(n="Are you sure you want to delete your progress for the specified puzzle?",
Je.msgbox(n,Je.msgbox.YES_NO,(function(e){"yes"===e&&(S.localStore.removeItem(t),window.location.reload())})))}))},
msgbox:(Ce=["jigex-mb-ok"],Te=[],ze=function(e,t,n,i){if(i){if(-1!==Te.indexOf(e))return;Te.push(e)}t=t||Ce,
K.switchButtons(t),X.onResponse=n,J[0].innerHTML=e,X.visible(!0),X.center(),x.log("msgbox: "+e)},ze.OK=Ce,
ze.YES_NO=["jigex-mb-yes","jigex-mb-no"],ze),stopAds:function(){if(!y){
var e=window.location,t=e.search?e.search.replace(/^\?/,""):"",n="noad=y"+(t?"&"+t:"")
;window.location.href=e.protocol+"//"+e.host+e.pathname+"?"+n}}};t.ui=Je,E.onAnyButtonClick=function(e){
x.log("button click: id=%s, tog=%s (pre-click)",e.id,e.toggled())},t.onInitComplete((function(){I=t.player,
M=I&&I.boxTop,we&&!O&&(we.style.display="block")}))};n.dependenciesReady=function(){
var e="UI dependencies: base="+!!t.base+", utils="+!!t.utils+", nb="+!!t.niftybar+", theme="+!!t.theme+", multiplayer="+!!t.multiplayer+", player="+!!t.player
;return e!==n.prevMsg&&(console.log(e),n.prevMsg=e),!!(t.base&&t.utils&&t.niftybar&&t.theme&&t.multiplayer)},
t.addModInit("ui",n)}}(),function(){"use strict";var e=window.jigexGlobals,t=e.modules;if(t&&!t.player){
var n=function(){var n=document.getElementById("jigex-canvas"),i=document.getElementById("jigex-toolbar")
;n instanceof Element&&i instanceof Element||e.reloadProg("Invalid DOM: canvas="+typeof n+", toolbar="+typeof i);try{
var o=parseInt(getComputedStyle(i).height,10)}catch(e){
return void alert("The browser failed to load the Jigsaw Explorer puzzle program. Please try again.")}
var r=t.console,a=e.debug,s=navigator.userAgent,l=window.devicePixelRatio||1,c=e.status,u=t.ui,d=t.multiplayer,h=t.theme,p=t.Variant,g=t.utils,m=t.niftybar,f=t.Sym,v=g.sysTiming,y=v.Timer,b=t.snapIndicator,w=e.status.framed,x=e.errMonitor,P=w?"This jigsaw puzzle program":"Jigsaw Explorer",_={}
;t.footer;if(!n||!n.id)return window.alert("The page canvas did not load correctly, please try again."),
void(_.start=function(){r.error("JE: Canvas did not load.")})
;var E,k,S,C,T,z=(E=document.getElementById("jigex-control-host"),
k=s.includes("GSA/")&&(s.includes("iPad")||s.includes("iPhone")),
S=(innerHeight>innerWidth?screen.height:screen.width)-innerHeight,
C=s.includes("Mac OS X")&&s.includes("Safari/")&&!s.includes("Chrome/")&&e.isIOS,T=window.visualViewport,
r.log("prog-version=",c.progVersion,w?" (framed)":"",", html-version=",e.htmlVersion,", res-version=",e.resVersion),
r.log("url: "+window.location.href),
r.log("devicePixelRatio="+l),r.log("screen size: "+screen.width+" x "+screen.height),
r.log("screen available size: "+screen.availWidth+" x "+screen.availHeight),
r.log("window inner size: "+innerWidth+" x "+innerHeight),
r.log("window client size: "+E.clientWidth+" x "+E.clientHeight),
r.log("host size: "+E.offsetWidth+" x "+E.offsetHeight),r.log("host scroll size: "+E.scrollWidth+" x "+E.scrollHeight),
r.log("host computed size: "+parseInt(getComputedStyle(E).width,10)+" x "+parseInt(getComputedStyle(E).height,10)),
r.log("toolbar height: "+o),
T?r.log("visual viewport size: "+Math.round(T.width)+" x "+Math.round(T.height)):r.log("visual viewport size: <viewport not supported>"),
{getWidth:function(){return Math.min(parseInt(getComputedStyle(E).width,10),window.innerWidth)},getHeight:function(){
return k?(innerHeight>innerWidth?screen.height:screen.width)-S:C&&T?Math.round(T.height):Math.min(parseInt(getComputedStyle(E).height,10),window.innerHeight)
},getHeightMinusToolbar:function(){return this.getHeight()-o},setColor:function(e){
w?E.style.background=e:document.body.style.background=e}});x.addCallback((function(){var t="No puzzle"
;_.Puzzle&&_.Puzzle.curr&&(_.Puzzle.curr.record?(g.postMsg(e.homeDomain+"scripts/aws/store-debug-data.php",JSON.stringify(_.Puzzle.curr.record)),
t=_.Puzzle.curr.record.id):t="No record"),x.setAuxData("Record id",t),x.setAuxData("Logs",r.toString())}))
;var I=z.getWidth(),L=z.getHeight()-o;n.width=Math.round(l*I),n.height=Math.round(l*L),n.style.width=I,n.style.height=L
;try{var O=new t.ClipGL(n.id,{numberOfLayers:5,clearColor:"#7390aa"});_.clipGL=O}catch(e){
r.error("Failed to construct ClipGL:",e),O={error:e.message,isReady:function(){return!1}}}
var A=O&&O.isReady(),M=A?new O.PosPoint:null,j=function(){var n,i=O.error||"";u.busy(!1),
i.includes("vertex shader")?e.isIOS?window.alert("An error occurred while trying to prepare the jigsaw puzzle.\n\nThe error is due to a Safari bug introduced in iOS versions 16.7 and 17.0.1 in late September, 2023. The bug affects some, but not all, iPads (and possibly iPhones). The problem can be fixed by completely powering down your iPad and then restarting it. Instructions on how to do that can be found on the following Apple web page: https://support.apple.com/en-us/HT210631"):window.alert(P+" encountered an error while trying to prepare the jigsaw puzzle.\n\nPlease reload this page to try again."):i.includes("shaders")||i.includes("animation")?window.alert(P+" requires graphics capabilities not supported by this web browser version.\n\nCheck to ensure you are using the latest version of your web browser."):i.includes("unsupported")||i.includes("disabled")||i.includes("Permission denied")?window.alert(P+" requires WebGL technology, but WebGL is either unavailable or disabled by your web browser.\n\nPlease see page www.jigsawexplorer.com/webgl for more information."):i.includes("Attempted to assign to readonly property")?window.alert(P+" requires WebGL technology, but WebGL does not appear to be supported by this device."):(n="An internal error has occurred.",
w||(n+="\n\nPlease report this problem to Support."),r.fault(new Error("WebGL error encountered: "+i)),window.alert(n)),
_.start=function(){r.error("JE: ClipGL did not start.")},u.disable(),t.haltInit()};if(A){
var B=e.PS_DEAD=new f("dead",0,"PS"),N=e.PS_INIT_PREPPING=new f("init_prepping",1,"PS"),R=e.PS_PREPPING=new f("prepping",2,"PS"),D=e.PS_WAITING=new f("waiting",3,"PS"),G=e.PS_READY=new f("ready",4,"PS"),V=e.PS_PLAYING=new f("playing",5,"PS"),F=new f("resting",0,"PC"),H=new f("selected",1,"PC"),q=new f("moving",2,"PC"),W=new f("touched",3,"PC"),U=new f("captured",4,"PC"),Y=new f("remote-select",5,"PC"),X=new f("remote-control",6,"PC"),J=new f("off",0),K=new f("ready",1),Q=new f("capturing",2),Z=new f("releasing",3),$=new f("bkgd-layer",0,"layers").ordinal,ee=new f("bottom-layer",1,"layers").ordinal,te=new f("primer-layer",2,"layers").ordinal,ne=new f("pieces-layer",3,"layers").ordinal,ie=new f("top-layer",4,"layers").ordinal,oe=new f("animate",1,"EDO"),re=new f("instant",2,"EDO"),ae=new f("value-only",3,"EDO"),se="_(no_preview_4)_",le="_(no_preview_2)_",ce="_(no_preview)_",ue=new f("force"),de=1,he=2,pe=4,ge=8,me=16,fe=32,ve=64,ye=128,be=0,we=1,xe=2,Pe=3,_e=[!1,!1,!0,!1,!0,!0,!1,!0,!0,!1,!0,!1,!0,!0,!1,!0,!0,!1,!0,!1,!0,!0,!1,!0,!0,!1,!0,!1,!0,!0],Ee=[0,1,6,4,1,7,5,9,2,8,6,9,0,5,9,6,7,9,3,7,2,0,8,4,9,6,2,6,8,4,3,0,8,3,2,7,9,5],ke="annisquam-harbor-light",Se=200,Ce=100,Te="puzzle_piece_mask",ze="puzzle_piece_mask_2",Ie="black",Le="red",Oe=Math.round(5*l),Ae=Math.round(6*l),Me=.9,je=100,Be="completions",Ne="jigex-completions",Re="jigex-rec-",De="phone",Ge=e.isIOS&&history.length>1&&!w?35*l:0
;s.includes("iPad")||s.includes("SM-T")||s.includes("Silk")||s.includes("FxiOS")?De="tablet":s.includes("iPhone")||s.includes("iPod")?De="phone":e.isIOS?De="tablet":(s.includes("Windows NT")||s.includes("Mac OS")||s.includes("CrOS")||s.includes("Linux")&&(s.includes("x86_64")||s.includes("i686")))&&(De="desktop"),
"tablet"===De?r.log("device type: "+(e.isIOS?"iPad":"tablet")):r.log("device type: "+De),_.DEVICE_TYPE=De,_.host=z
;var Ve,Fe,He,qe,We,Ue,Ye,Xe,Je,Ke,Qe,Ze,$e,et,tt,nt,it,ot,rt,at,st,lt,ct,ut,dt,ht,pt,gt,mt,ft,vt,yt,bt,wt,xt,Pt,_t,Et,kt,St,Ct,Tt,zt,It,Lt,Ot,At,Mt,jt,Bt,Nt,Rt,Dt,Gt,Vt,Ft,Ht,qt,Wt,Ut,Yt,Xt,Jt,Kt,Qt,Zt,$t,en,tn,nn,on,rn,an,sn,ln,cn,un,dn,hn,pn,gn,mn,fn,vn,yn,bn,wn,xn,Pn,_n,En,kn,Sn,Cn,Tn,zn,In,Ln,On,An,Mn,jn=function(){
var t=navigator.maxTouchPoints>=1||e.isIOS,n=t?3:4,i=t?0:5,o=n*(t?500:400);function r(e,t){
return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}return function(e,t,a){var s=0,l=0,c=null,u=[],d=!1;return{
get isShaking(){return d},update:function(h){if(!(t&&a&&r(h,t)>a)){var p=Date.now();if(c){var g=r(h,c)
;if(g>=l)l=g;else if(l-g>i){for(;p-u[0]>o;)u.shift();u.length||(d=!1),u.push(p),s=u.length-1,l=0,c.x=h.x,c.y=h.y,
d||s!==n||(d=!0,e&&e(this))}}else c={x:h.x,y:h.y},u.push(p)}}}}}();_.onEscape=(Ve=[],
document.addEventListener("keydown",(function(e){
if(27===((e=e||window.event).which||e.keyCode))for(r.log("Escape key pressed");Ve.length;){var t=Ve.pop();t&&t(e)}})),{
add:function(e){Ve.push(e)},remove:function(e){var t=Ve.indexOf(e);-1!==t&&(Ve[t]=null)}}),_.delayedActions=function(){
var e=[];return{add:function(t){var n=_.Puzzle&&_.Puzzle.curr;!n||n.state.lte(R)?e.push(t):t()},run:function(){
for(;e.length;)e.pop()()}}}(),_.trollShield=(Fe=[],{pieceHandled:function(){
if(d.joinedToGameVar.val)for(Fe.push(Date.now());Fe.length>10;)Fe.shift()},alarm:function(){if(10===Fe.length){
var e=Date.now(),t=e-Fe[0]<5e3,n=e-Fe[9]<500,i=t&&n;return i&&r.log.once("trolling"),i}return!1}}),
_.createContext=(He=function(e,t,n,i){try{return n&&i?this.getImageData(e,t,n,i):null}catch(e){
throw r.error.once("context.getImageData failure. err=",e.message),
u.msgbox("An internal error in the browser is preventing this program from functioning properly.<br/><br/>Try clicking the browser's Reload button to recover.",null,null,!0),
e}},function(e){try{var t=e.getContext("2d")}catch(e){}if(t)return t.jigexGetImageData=He,t
;var n=_.Puzzle.curr,i=n&&n.multiplayerGameShortLink;i?window.location.replace(i):window.location.reload()}),
qe=function(e){try{n.setPointerCapture(e.pointerId)}catch(e){}},We=function(e){try{n.releasePointerCapture(e.pointerId)
}catch(e){}},n.addEventListener("mousedown",qe),n.addEventListener("pointerdown",qe),
n.addEventListener("touchstart",qe),n.addEventListener("mouseup",We),n.addEventListener("touchend",We),
n.addEventListener("touchcancel",We),n.addEventListener("pointerup",We),n.addEventListener("pointercancel",We),
_.Controller=function(e){switch(this.type=e,this.x=0,this.y=0,this.captor=null,this.event=null,this.listeners=[],
this.shakeDetector=null,e){case 0:n.addEventListener("mousedown",this,!1),n.addEventListener("mouseup",this,!1),
n.addEventListener("mousewheel",this,!1),n.addEventListener("wheel",this,!1),n.addEventListener("mousemove",this,!1),
n.addEventListener("touchmove",this,!1),document.addEventListener("keydown",this,!1);break;case 1:
n.addEventListener("touchstart",this,!1),n.addEventListener("touchend",this,!1),
n.addEventListener("touchcancel",this,!1),n.addEventListener("touchmove",this,!1);break;case 2:
n.addEventListener("pointerdown",this,!1),n.addEventListener("pointerup",this,!1),
n.addEventListener("pointermove",this,!1),n.addEventListener("pointercancel",this,!1)}},_.Controller.controllerList=[],
_.Controller.getController=function(e){
for(var t,n=_.Controller.controllerList,i=n.length-1;i>=0;i--)if((t=n[i]).type===e)return t
;return t=new _.Controller(e),n.push(t),t},_.Controller.purgeListeners=function(){
for(var e=_.Controller.controllerList,t=e.length-1;t>=0;t--)e[t].removeAllListeners(),e[t].release()
;u.cursor(u.DEFAULT_CURSOR)},_.Controller.touchTS=0,_.Controller.recentTouch=function(){
return Date.now()-_.Controller.touchTS<2e3},_.mouseController=_.Controller.getController(0),
_.touchController=_.Controller.getController(1),_.pointerController=_.Controller.getController(2),
_.Controller.prototype.capture=function(e){this.captor||(this.captor=e)},_.Controller.prototype.release=function(){
this.captor=null},_.Controller.prototype.isCaptured=function(){return null!==this.captor},
_.Controller.prototype.handleEvent=(it=0,Ue=function(e){"function"==typeof e?e(this):e.handleEvent(this)},
ot=function(e,t){if(t.captor)t.event=e,t.captor.handleEvent(e),t.event=null;else{var n=t.listeners[e.type]
;n&&(t.event=e,n.forEach(Ue,e),t.event=null)}},Ye=0,Xe="",Je=function(e,t){
var n=Date.now(),i="key down: "+(e.shiftKey?"Shift+":"")+(e.ctrlKey?"Ctrl+":"")+(e.metaKey?"Cmd+":"")+e.key+(t||"")
;(i!==Xe||n-Ye>1e3)&&(Xe=i,r.log(i)),Ye=Date.now()},rt=function(t){
var n=!1,i=t.which,o=t.shiftKey,s=t.ctrlKey||t.metaKey,l=_.Puzzle.curr;switch(i){case 66:
o||s||!l||l.customMystery||(Je(t),_.boxTop.autoPeek());break;case 67:
o||s||!l||(Je(t,"old-cap-state="+l.capStateVar.val.name),l.toggleCaptureMode());break;case 68:
o&&!s&&e.modules.ui.msgbox("Are you sure you want to delete all saved puzzle progress?",["jigex-mb-yes","jigex-mb-no"],(function(t){
if("yes"===t){for(var n=g.localStore,i={},o=n.length-1;o>=0;o--){var r=n.key(o)
;0===r.indexOf(Re)&&(i[r]=JSON.parse(n.getItem(r)),n.removeItem(r))}
e.modules.ui.msgbox("All saved puzzle progress is now deleted",["jigex-mb-ok"],(function(){window.location.reload(!0)}))
}}));break;case 73:if(o&&!s&&(a||r.detail.isRecording())){var c=_.mouseController,d=l?l.pieces.getPieceAt(c):null;Je(t),
d&&(d.logState(),
d.logHistory(),u.toast.show("id="+d.id+(d.group?", grp="+d.group.id:"")+", st="+d.state.name+", x="+d.position.x+", y="+d.position.y+", mov="+d.hasMoved+", ec="+(d.group?d.group.edgeCount:d.isEdge?1:0),6e3)),
n=!0}break;case 75:s&&!o&&(u.stopAds(),n=!0);break;case 77:
o&&s&&(Je(t),t.altKey&&r.log(atob("VGhpcyBpcyB0aGUgSmlnc2F3IEV4cGxvcmVyIGppZ3NhdyBwdXp6bGUgcHJvZ3JhbSA6IENvcHlyaWdodCAoYykgMjAxNSBDYXJvbGluYSBSb2FkIFNvZnR3YXJlLCBMLkwuQy4=")),
u.programLog.show(),n=!0);break;case 80:o||s||(Je(t),_.clock.pause());break;case 82:
!s&&l&&l.stateVar.val.gte(G)&&(Je(t),l.relayer(),l.scatter({partial:!0,shift:o,animate:!0,byCommand:!0}),
l.updateRecord());break;case 83:if(o&&s)if(Je(t),l&&l.record){
var h=document.getElementById("jigex-import-rec-btn"),p=document.getElementById("jigex-puzzle-rec"),m=document.getElementById("jigex-rec-import")
;p.value=JSON.stringify(l.record),m.onclick=function(){p.select(),document.execCommand("copy")},h.onclick(null)
}else u.msgbox("Puzzle record not found.");break;case 84:Je(t),u.colorMenu.visible("toggle");break;case 85:
o&&s&&a&&(Je(t),_.test(),n=!0);break;case 88:o+s&&(Je(t),window.location.hash="#audit",n=!0)}
return n||(t.preventDefHandler=!1),n},Ke=!1,at=function(e,t){if(c.logEvents&&u.verboseLoggingVar.val){var n="EVENT: "
;if(e.type.includes("move")){if(Ke)return;Ke=!0,n+=e.type+" begins"
}else"keydown"===e.type?n+="keydown ("+e.key+")":"keyup"!==e.type&&(Ke=!1,n+=e.type);t&&(n+=" (filtered)"),
e.isFake&&(n+=" (fake)"),r.detail(n)}
},Qe=navigator.userAgent,Ze=Qe.includes("Chrome")&&(Qe.includes("Android")||Qe.includes("CrOS")),$e=null,et=null,tt=0,
nt=0,st=function(e,t){switch(e.type){case"touchstart":return"pointerdown"===$e;case"pointerdown":et=e;break
;case"pointerup":et=null;break;case"pointermove":tt=e.clientX,nt=e.clientY;break;case"pointercancel":if(Ze&&et){
var n=new Event("pointerup");n.pointerId=et.pointerId,n.pointerType=et.pointerType,n.clientX=tt,n.clientY=nt,
n.isFake=!0,t.handleEvent(n)}return!0}return $e=e.type,!1},lt=0,ct=!1,function(e){if(_.Puzzle&&_.Puzzle.curr){
var t=Date.now(),n=NaN,i=NaN,o=!1,a=0===e.type.indexOf("mouse")||0===e.type.indexOf("wheel"),s=!a&&0===e.type.indexOf("touch"),c=!a&&!s&&0===e.type.indexOf("pointer"),d=e.type.includes("key"),h=O.getClientRect(),p=!0,g=l
;if(d&&u.textInputMode())return;if(st(e,this))return void at(e,!0);if(at(e),(s||c)&&(_.Controller.touchTS=t),
a||c)n=(e.clientX-h.left)*g,i=(e.clientY-h.top)*g;else if(s)if(e.touches&&e.touches.length){var m=e.touches[0];try{
n=(m.clientX-h.left)*g,i=(m.clientY-h.top)*g}catch(e){
return void r.warn.once("touch event failure: err-msg=%s",e.message)}}else n=this.x,i=this.y;else{
if(!d)throw new Error("Unrecognized event type: "+e.type);void 0===(e=e||window.event).which&&(e.which=e.keyCode)}
switch(isNaN(n)||(n=Math.round(n),i=Math.round(i),o=n!==this.x||i!==this.y),o?(this.movedXBy=n-this.x,
this.movedYBy=i-this.y,this.x=n,this.y=i,this!==_.mouseController&&(_.mouseController.x=n,
_.mouseController.y=i)):(this.movedXBy=0,
this.movedYBy=0),this.shakeDetector&&(e.type.includes("move")?this.shakeDetector.update(this):this.shakeDetector=null),
this.event=e,e.controller=this,e.preventDefHandler=!this.isCaptured(),e.fromMouseDevice=a||c&&"mouse"===e.pointerType,
e.fromTouch=s||c&&"touch"===e.pointerType,e.type){case"mousemove":it=t;case"pointermove":o||(p=!1);break
;case"mouseenter":case"mouseleave":t-it>200&&(p=!1);break;case"keydown":rt(e)&&(p=!1);break;case"pointerdown":
case"pointerup":if("mouse"!==e.pointerType)break;case"mousedown":case"mouseup":e.type.includes("up")?(ct?p=!1:ct=!0,
lt=t):ct&&t-lt<150?p=!1:ct=!1}p&&(_.Controller.onEvent&&_.Controller.onEvent(e),ot(e,this)),
e.preventDefHandler&&e.preventDefault()}}),_.Controller.prototype.addListener=function(e,t){var n=this.listeners[e]
;n||(n=[],this.listeners[e]=n),-1===n.indexOf(t)&&this.listeners[e].push(t)
},_.Controller.prototype.removeListener=function(e,t){var n=this.listeners[e],i=n?n.indexOf(t):-1;-1!==i&&n.splice(i,1)
},_.Controller.prototype.removeAllListeners=function(){this.listeners=[]},_.background=(ht=null,pt=null,gt={x:0,y:0,
width:0,height:0,margin:0},mt=function(){var t=null,i=null,o=function(e){t=e.response,mt.reposition()};return{
init:function(){if(w){
var t=new g.WebReq(e.imagesPath+"powered-by-logo.png",e.altImagesPath?e.altImagesPath+"powered-by-logo.png":null)
;t.onload=o,t.send()}mt.init=function(){}},reposition:function(){if(t&&t.naturalWidth&&t.naturalHeight){
var e=Math.round(t.naturalWidth/2)+35,o=n.height-Math.round(t.naturalHeight/2)-35;i&&i.dispose(),(i=new O.Clip({
name:"jeLogo",position:{x:e,y:o},layer:ee,opacity:.4,image:{data:t}})).moveToBottom()}}}}(),ft=function(){
var t,i=null,o=null,r=function(e){i=e.response,ft.rescale()};return{init:(t=!1,function(){if(!t){var n=e.parms().logoUrl
;if(n){var i=new g.WebReq(n);i.onload=r,i.send()}t=!0}}),rescale:function(){var t,r,a,s,l=!1;return function(){if(i){
var c,u;l||(r=i.naturalWidth,a=i.naturalHeight,s=e.parms().logoPos||"left",t="center"===s?.65:.25,l=!0)
;var d=Math.round(n.width*t),h=Math.round(n.height*t),p=r,g=a;if(p>d||g>h){var m=Math.min(d/p,h/g);p=Math.round(m*p),
g=Math.round(m*g)}"center"===s?(c=Math.round(n.width/2),u=Math.round(n.height/2)):(c=n.width-Math.round(p/2)-35,
u=n.height-Math.round(g/2)-35),i.width=p,i.height=g,o&&o.dispose(),(o=new O.Clip({name:"brandLogo",position:{x:c,y:u},
layer:ee,opacity:.4,image:{data:i}})).moveToBottom()}}}()}}(),ut=null,dt=function(e){if(!e.canceled){var t=e.response
;O.setClearColor(h.val.color.background,!0),pt&&pt.texture.dispose(),pt?pt.texture={data:t,bounds:{x:0,y:0,
width:n.width,height:n.height}}:(ht={name:"background",width:n.width,height:n.height,layer:$,image:{data:t,bounds:{x:0,
y:0,width:n.width,height:n.height}}},(pt=new O.Clip(ht)).position.assign(n.width/2,n.height/2),
_.background.onload&&(_.background.onload(),_.background.onload=null)),h.isLoaded.val=!0}e===ut&&(ut=null)},
vt=function(e){ut&&ut.cancel(),h.isLoaded.val=!1,(ut=new g.WebReq(e.texUrl,e.altTexUrl)).onload=dt,ut.send(),
z.setColor(e.color.background),mt.init(),ft.init()},h.addListener(vt),{rescale:function(){pt&&(gt.width=n.width,
gt.height=n.height,pt.setSize(n.width,n.height,gt)),mt.reposition(),ft.rescale()},onload:null}),_.boxTop=function(){
var e,t,i,o=200,a=[Math.round(91.8),Math.round(76.5),Math.round(51),Math.round(25.5)],s=[Math.round(84.15),Math.round(71.4),Math.round(255*.23),Math.round(45.9),Math.round(33.15),Math.round(255*.08)],l=document.createElement("canvas"),c=_.createContext(l),d=null,h=0,p=0,g=null,m=null,f=null,v=null,y=null,b=!1,w=!1,x={
posX:.5,posY:.5,dispose:function(){m&&(m.dispose(),m=null),g&&(g.dispose(),g=null),d=null,f=null,v=null,u.update()},
isReady:function(){return!!d},setImage:function(e){d=e,w?(w=!1,this.setScale(h,p)):(h=0,p=0)},setScale:function(e,t){
var i,o=_.Puzzle.curr
;o.mysteryProfile?(i=(e=o.mysteryProfile.photo.sizes.full.width)/(t=o.mysteryProfile.photo.sizes.full.height),
(e>.8*n.width||t>.8*n.height)&&(e/n.width>t/n.height?(e=Math.round(.8*n.width),
t=Math.round(e/i)):(t=Math.round(.8*n.height),e=Math.round(t*i)))):(e=Math.round(.7*e),t=Math.round(.7*t)),h=e,p=t,
d?(w=!1,function(){if(d&&d.complete&&h){var e,t,n,i,o=h+8,r=p+8,s=4*o;if(l.width=o,l.height=r,c.clearRect(0,0,o,r),
c.drawImage(d,4,4,h,p),(e=c.jigexGetImageData(0,0,o,r))&&e.data){for(n=(t=e.data).byteLength-s+4,
i=t.byteLength;n<i;n+=4)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[3];for(n=t.byteLength-2*s+8,
i=t.byteLength-s;n<i;n+=4)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[2];for(n=t.byteLength-3*s+12,
i=t.byteLength-2*s;n<i;n+=4)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[1];for(n=t.byteLength-4*s+16,
i=t.byteLength-3*s;n<i;n+=4)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[0];for(n=2*s-4,i=t.byteLength-16;n<i;n+=s)t[n]=255,
t[n+1]=255,t[n+2]=255,t[n+3]=a[3];for(n=3*s-8;n<i;n+=s)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[2]
;for(n=4*s-12;n<i;n+=s)t[n]=255,t[n+1]=255,t[n+2]=255,t[n+3]=a[1];for(n=5*s-16;n<i;n+=s)t[n]=255,t[n+1]=255,t[n+2]=255,
t[n+3]=a[0];for(n=0;n<s;n+=4)t[n+3]=a[3];for(n=s,i=2*s-4;n<i;n+=4)t[n+3]=a[2];for(n=2*s,i=3*s-8;n<i;n+=4)t[n+3]=a[1]
;for(n=3*s,i=4*s-12;n<i;n+=4)t[n+3]=a[0];for(n=4*s,i=t.byteLength;n<i;n+=s)t[n+3]=a[3];for(n=4*s+4,
i-=s;n<i;n+=s)t[n+3]=a[2];for(n=4*s+8,i-=s;n<i;n+=s)t[n+3]=a[1];for(n=4*s+12,i-=s;n<i;n+=s)t[n+3]=a[0]
;(v=e).name="recessed box top";var u=m&&m.opacity;m&&m.dispose(),m=new O.Clip({layer:ee,name:"recessedBoxTop",image:{
data:v}}),u||(m.opacity=0,m.active=!1)}}}(),function(){if(d&&d.complete&&h){var e,t,n,i,o=h+6,a=p+6,u=4*o,m=4*h
;if(l.width=o,
l.height=a,c.clearRect(0,0,o,a),c.drawImage(d,0,0,h,p),!(e=c.jigexGetImageData(0,0,o,a)))return void r.error("Failed to create box top clip")
;for(i=(n=(t=e.data).byteLength-u+24)+m;n<i;n+=4)t[n+3]=s[5];for(i=(n=t.byteLength-2*u+20)+m;n<i;n+=4)t[n+3]=s[4]
;for(i=(n=t.byteLength-3*u+16)+m;n<i;n+=4)t[n+3]=s[3];for(i=(n=t.byteLength-4*u+12)+m;n<i;n+=4)t[n+3]=s[2]
;for(i=(n=t.byteLength-5*u+8)+m;n<i;n+=4)t[n+3]=s[1];for(i=(n=t.byteLength-6*u+4)+m;n<i;n+=4)t[n+3]=s[0];for(n=7*u-4,
i=t.byteLength;n<i;n+=u)t[n+3]=s[5];for(n=6*u-8,i-=u;n<i;n+=u)t[n+3]=s[4];for(n=5*u-12,i-=u;n<i;n+=u)t[n+3]=s[3]
;for(n=4*u-16,i-=u;n<i;n+=u)t[n+3]=s[2];for(n=3*u-20,i-=u;n<i;n+=u)t[n+3]=s[1];for(n=2*u-24,i-=u;n<i;n+=u)t[n+3]=s[0]
;(f=e).name="floating box top";var v=!1;g&&(v=!!g.opacity,g.dispose()),g=new O.Clip({layer:ie,name:"floatingBoxTop",
image:{data:f}}),v||(g.opacity=0,g.active=!1)
}else r.log.pretty("Could not create bt floating clip. img=%s, cmplt=%s, w1=%s, w2=%s, rec-profile=%s",d?"yes":"no",d?d.complete:"n/a",d?d.width:"n/a",h,_.Puzzle.curr.mysteryProfile),
r.fault()}()):w=!0},show:function(){m&&(m.active=!0,m.opacity=1,g.active=!0,g.opacity=0,g.active=!1,
u.starterDlg.isCloaked&&u.starterDlg.uncloak())},moveTo:function(e,t){this.posX=e,this.posY=t,m&&(m.active=!0,
m.opacity=1,m.position.assignNorm(e,t))},containsPoint:function(e,t,n){
return this.isShowing()&&m.containsPoint(e,t,!1,n)},toggleDisplay:function(){var e=_.Puzzle.curr
;m&&e&&e.state.gte(D)&&(m.opacity?(m.fadeOut(o,null,!0),u.toast.hide()):(g.opacity&&g.fadeOut(o,null,!0),m.fadeIn(o),
m.position.assignNorm(_.boxTop.posX,_.boxTop.posY),u.starterDlg.isCloaked&&u.starterDlg.uncloak(),
_.Puzzle.curr.mysteryProfile?u.toast.show("This box top shows only a portion of the complete puzzle subject.",5e3):u.toast.hide()))
},isShowing:function(){return m&&m.opacity},isPeeking:function(){return g&&g.opacity},peek:function(){
var e=_.Puzzle.curr
;e&&g&&e.state.gte(D)&&!this.isPeeking()&&!this.isShowing()&&(u.starterDlg.visible()&&u.starterDlg.cloak(),
g.opacity=O.TW_ABORT,
g.fadeIn(o),_.Puzzle.curr.mysteryProfile&&u.toast.show("This box top shows only a portion of the complete puzzle subject.",5e3))
},autoPeek:(i=function(e){66===e.which&&(_.boxTop.unpeek(),document.removeEventListener("keyup",i))},function(){
this.peek(),document.addEventListener("keyup",i,!1)}),unpeek:function(){var e=_.Puzzle.curr
;e&&e.state.gte(D)&&this.isPeeking()&&(g.opacity=O.TW_ABORT,g.fadeOut(o,null,!0),u.toast.hide()),
u.starterDlg&&u.starterDlg.isCloaked&&u.starterDlg.uncloak()},handleEvent:function(n){switch(n.type){case"mousedown":
case"pointerdown":case"touchstart":if(m&&m.opacity){switch(g.active=!0,g.opacity=1,
g.position.assign(m.position.x,m.position.y),m.opacity=0,m.active=!1,b=!0,n.preventDefHandler=!0,_.boxTop.marker=!0,
n.type){case"mousedown":(y=_.mouseController).addListener("mouseup",this),y.addListener("mousemove",this);break
;case"pointerdown":(y=_.pointerController).addListener("pointerup",this),y.addListener("pointermove",this);break
;case"touchstart":(y=_.touchController).addListener("touchend",this),y.addListener("touchmove",this)}y.capture(this)}
break;case"mouseup":case"pointerup":case"touchend":if(b)switch(g.active?(this.posX=g.position.normX,
this.posY=g.position.normY,g.opacity=0,g.active=!1):(this.posX=.5,this.posY=.5),m.active=!0,m.opacity=1,
m.position.assignNorm(this.posX,this.posY),b=!1,y.release(this),n.preventDefHandler=!0,n.type){case"mouseup":
y.removeListener("mouseup",this),y.removeListener("mousemove",this);break;case"pointerup":
y.removeListener("pointerup",this),y.removeListener("pointermove",this);break;case"touchend":
y.removeListener("touchend",this),y.removeListener("touchmove",this)}break;case"mousemove":case"pointermove":
case"touchmove":g.opacity&&(e=g.position.x+y.movedXBy,t=g.position.y+y.movedYBy,g.position.assign(e,t)),
n.preventDefHandler=!0}}};return Object.defineProperty(x,"isPresent",{get:function(){return m&&m.opacity}}),x}(),
_.Subject=function(e){var t=_.Puzzle.curr,n=document.createElement("canvas");n.name=g.stringToVarName(e.src),
this.name=e.src,this.srcImage=e,this.image=n,this.width=0,this.height=0,this.scale=1,
t&&!t.mysteryProfile&&_.boxTop.setImage(e),this.rescale()},_.Subject.prototype.isReady=function(){return!!this.image},
_.Subject.prototype.dispose=function(){this.srcImage=null,this.image=null,this.texture&&this.texture.dispose()},
_.Subject.prototype.rescale=function(){
for(var e=this.srcImage.width,t=this.srcImage.height,i=e*t,o=n.width*n.height,r=1,a=_.createContext(this.image),s=!1;i/o>.35||e>n.width*Me||t>n.height*Me;)r-=.01,
i=(e=this.srcImage.width*r)*(t=this.srcImage.height*r),s=!0;if(!s)for(;i/o<.35&&e<n.width*Me&&t<n.height*Me;)r+=.01,
i=(e=this.srcImage.width*r)*(t=this.srcImage.height*r);this.scale=r,this.width=Math.round(e),this.height=Math.round(t),
e=this.width+14+1,t=this.height+14+1,this.image.width=e,this.image.height=t;try{a.clearRect(0,0,e,t),
a.drawImage(this.srcImage,7,7,this.width,this.height)}catch(e){var l=_.Puzzle.curr,c=l&&l.multiplayerGameShortLink
;c?window.location.replace(c):window.location.reload()}this.width&&this.height&&(this.texture&&this.texture.dispose(),
this.texture=O.Texture.getTexture(this.image),_.boxTop.setScale(this.width,this.height))},
_.Puzzle=(yt=Object.create(O.clips[ne]),bt=null,wt=!0,xt=null,Pt=0,_t=0,Et=0,kt=0,St=!1,Ct=function(){if(yt.head&&wt){
var e,t=yt.head
;for(bt=[],xt=[],Pt=1,_t=0,St=!1;t;)e=t.item,bt.push(e),e.neighbors[be]?e.neighbors[Pe]?e.neighbors[xe]&&e.neighbors[we]||xt.push(e):(xt.push(e),
Pt++):(xt.push(e),_t++),t=t.next;kt=2*Pt+2*_t-4,Et=Pt*_t,wt=!1}},yt.applyTask=function(e){
for(var t=yt.head;t;)e(t.item),t=t.next},yt.audit=function(){for(var e=yt.head,t=0;e;){
var n=e.item,i="audit: id="+n.id+", node="+n.node+", disposed="+n.isDisposed+", edge="+n.isEdge
;n.group&&(i+=", grpid="+n.group.id+", grplen="+n.group.length),t++,r.log(i),e=e.next}r.log("audit: cnt="+t)},
yt.getPieceAt=function(e){var t=e.event.fromTouch,n=e!==_.mouseController&&t?null:_.Piece.selectedPiece;if(!n){
var i=O.clips.getClipAt(e.x,e.y,ne,t);if(i&&i.state.eq(Y)){var o={top:Math.round(i.position.y/l),
left:Math.round((i.position.x+i.spec.core.width/2)/l),adjust:!0}
;m.showTooltip(o,(i.remotePlayerName||"Another player")+" is already moving this piece",3e3),
u.cursor(u.NOT_ALLOWED_CURSOR,1e3)}}return n||(i&&i.state.neq(U,Y,X)?i:null)},yt.getPiece=function(e){
return this.specList[e-1].piece},yt.getIterator=function(){var e=0;return{getNext:function(){
return bt&&e<bt.length?bt[e++]:null}}},yt.dispose=function(){for(var e,t=yt.tail;t;){var n=t.item
;n.remoteData&&n.remoteData.timer&&n.remoteData.timer.clear(),e=t.prev,t.item.stateVar.dispose(),t.item.dispose(),t=e}
(yt.tail||yt.head)&&r.error("non-empty pieces list after dispose"),bt=null,xt=null,Pt=0,_t=0,Et=0,kt=0,St=!1,wt=!0,
_.Piece.selectedPiece=null},Object.defineProperty(yt,"isEdgeComplete",{get:function(){if(St)return!0;Ct()
;var e=xt?xt[0].group:null;return!(!e||e.edgeCount!==kt||(r.log("frame completed"),St=!0,
c.cmptModeEanbled&&u.edgesBtn.debounce(!1),0))}}),Object.defineProperty(yt,"length",{get:function(){return Ct(),Et}}),
Object.defineProperty(yt,"numRows",{get:function(){return Ct(),Pt}}),Object.defineProperty(yt,"numCols",{get:function(){
return Ct(),_t}}),Object.defineProperty(yt,"numEdges",{get:function(){return Ct(),kt}}),Ft=yt,Tt=function(e){if(e){
if(!d.gameInfo)throw new Error("Missing gameInfo object");return Ht(),"remove"}},Ht=function(){
var e=_.Puzzle.curr,t=!!(e&&e.subject&&e.subject.isReady()),n=e&&e.multiplayerGameId?d.joinedToGameVar.val:"n/a"
;if(r.log("readyToPrep: puzzle=%s, subject-ready=%s, box-top-ready=%s, ui-ready=%s, connected=%s",!!e,t,_.boxTop.isReady(),u.isReady,n),
!1===n&&(d.joinedToGameVar.addListener(Tt),d.isConnecting()||d.joinGame()),t&&_.boxTop.isReady()&&u.isReady&&n){
var i=_.recordsManager.find(e.name)
;i&&!e.multiplayerGameId?(r.note("found record: id="+i.id+", name="+e.name+", rec.nam="+i.nam+", rec.pid="+i.pid),
e.record=i,i.thm&&(h.val=h.getThemeFromOrdinal(i.thm)),e.rotatable=!!i.rot,e.tabIndexRight=i.shp.ri,
e.tabIndexBottom=i.shp.bi,e.shapeIndex=i.shp.si,e.compactMode=!!i.cmpt,setTimeout((function(){Wt();var e=_.Puzzle.curr
;if(e&&e.showEdgesOnly())for(var t=e&&e.pieces?e.pieces.head:null;t;){var n=t.item
;n.isEdge||n.group&&n.group.isEdge||!n.state.neq(H,U,Y,X)||(n.opacity=0),t=t.next}
}),10)):(e&&e.multiplayerGameId||r.note("no record found"),nn()&&setTimeout((function(){var e=_.Puzzle.curr;if(e){
var t=e.record;if(t&&t.rows||e.multiplayerGameId&&!d.joinedToGameVar.val)return void Ht();if(Wt(),
!e.stateVar.isDisposed&&e.stateVar.val.bet(N,D)&&!e.multiplayerGameId){var n=m.getPnl("jigex-promo-1"),i=function(){
n&&n.visible()?setTimeout(i,100):(u.starterDlg.visible(!0),e.state=D)};i()}}}),10)),_.delayedActions.run()}},
zt=-1!==navigator.userAgent.indexOf("Edge/12"),It=!1,Lt=function(){
u.msgbox('If most of the buttons in this program appear to be invisible it is because you are using an old version of this browser. This browser can be updated by going to the Windows Update panel at <i>Start > Settings > Update & security</i> and clicking "Check for updates".')
},qt=function(){zt&&!It&&(u.toast.show("Do some buttons seem to be invisible?",8e3,Lt),It=!0)},Wt=function(){
var e=_.Puzzle.curr,t=e.record,n=e.subject,i=d.gameInfo;if(e.state.bet(N,D)){var o;if(r.log("begin prep"),
e.capStateVar.meta.isCapturing()&&(e.toggleCaptureMode(),u.update()),t||i){if((o={}).nop=i?i.nop:t.num,
o.rows=i?i.rows:t.shp.rw,
o.cols=i?i.cols:t.shp.cl,o.size=Math.min(Math.floor(n.width/o.cols),Math.floor(n.height/o.rows)),
o.size<10)return u.busy(!1),u.msgbox("The browser window is not large enough to continue this puzzle."),e.dispose(),
void u.disable()
}else(o=u.numPiecesMenu.selectedNop)&&o.rows&&o.cols?r.log("valid nop, 2"):r.warn("invalid selected nop object encountered. nop="+o)
;n&&_.knife.cut(n,o)?(i?_.restoreGame():e.state.eq(N,R)&&(e.state=e.record?G:D),
_.mouseController.addListener("mousemove",e),_.mouseController.addListener("mousedown",e),
_.mouseController.addListener("mouseup",e),_.mouseController.addListener("mousewheel",e),
_.mouseController.addListener("wheel",e),_.mouseController.addListener("keydown",e),
_.touchController.addListener("touchstart",e),_.touchController.addListener("touchend",e),
_.touchController.addListener("touchmove",e),_.pointerController.addListener("pointerdown",e),
_.pointerController.addListener("pointerup",e),_.pointerController.addListener("pointermove",e),
t?(e.showEdgesOnly(t.edo,oe),_.clock.set(t.tmr),t.bt.v&&(_.boxTop.show(),_.boxTop.moveTo(t.bt.x,t.bt.y),
u.update())):(e.multiplayerGameId?_.clock.set(d.timer.getElapsedSecs()):_.clock.set(0),qt()),
r.log("end prep")):(r.error("prep failed"),e.dispose())}else r.error("wrong state to prep: state="+e.state)},
Ut=function(t){var n,i=_.Puzzle.curr;if(t.response&&t.image){var o=t.response
;1!==o.width||99!==o.height?0===(n=new _.Subject(o)).width||0===n.height?Jt(t):n.width<Ce||n.height<Ce?Kt(n):(i.subject=n,
Ht()):window.location.href=e.homeDomain+"custom-puzzle-error/?err=banned"
}else t.url.startsWith(e.fetchPath)?en(t.targetUrl,!0):Jt(t)},Yt=function(){var e=_.Puzzle.curr;if(this.onload=null,
this.onerror=null,e&&e.state.eq(N,R)){var t=new _.Subject(this)
;0===t.width||0===t.height?Jt(null):t.width<Ce||t.height<Ce?Kt(t):(e.subject=t,Ht())}},Xt=function(e){
_.boxTop.setImage(e.response),Ht()},Jt=function(t){var n,i=_.Puzzle.curr,o=i?i.name:null,a=i?i.record:null;u.busy(!1),
n=t&&t.failedOnChromeBug?'The puzzle subject could not be downloaded due to a problem in the Chrome browser. If the problem persists then try restarting the browser. If restarting the browser does not work then try <a href="https://support.google.com/chrome/answer/95589?hl=en" target="_blank">clearing the browser history</a>.':t&&!t.url.includes(e.subjectsPath)?t.url.includes(".fbcdn.net")?"This custom jigsaw puzzle failed to load because the Facebook image link used for the puzzle's subject has expired or is invalid.":"The custom jigsaw puzzle subject failed to load. Ensure the image link used to create this puzzle points to a valid "+(e.isIE11?"JPG, PNG, or GIF":"JPG, PNG, WEBP, or GIF")+" image file.":"The specified puzzle subject failed to load.",
a?u.deleteRecordPrompt(n,a.id):u.msgbox(n),r.log("Failed to pull subject. id="+o),i.state=B},Kt=function(e){u.busy(!1),
e.srcImage.width<Ce||e.srcImage.height<Ce?u.msgbox("The specified puzzle subject is too small. The minimum required image width is 100 pixels and the minimum required image height is 100 pixels."):u.msgbox("The browser window is too small to accommodate the puzzle."),
r.log("Subject is too small. id="+_.Puzzle.curr.name,!0)},Qt=function(){u.busy(!1),
u.msgbox("The specified puzzle box top could not be found."),
r.error("Failed to pull box top. id="+_.Puzzle.curr.name,!0)},Zt=function(t){var n,i,o,a=_.Puzzle.curr,s=t.response
;s.photo?(r.log("profile received"),s.mystery?(a.mysteryProfile=s,tn(s.photo.name),
i=e.subjectsPath+s.photo.name+"-bc."+s.photo.format,o=e.altSubjectsPath+s.photo.name+"-bc."+s.photo.format,
(n=new g.WebReq(i,o)).onload=Xt,n.onerror=Qt,n.send()):(a.profile=s,h.val=h.getThemeFromOrdinal(s.theme),
i=e.subjectsPath+s.photo.name+"."+s.photo.format,o=e.altSubjectsPath+s.photo.name+"."+s.photo.format,
(n=new g.WebReq(i,o)).onload=Ut,n.onerror=Jt,n.send(),a.credits=new _.Credits(s))):$t()},$t=function(){
var e=_.Puzzle.curr;u.busy(!1),e.state=B,u.msgbox("The specified puzzle could not be found."),
r.error("Failed to pull profile. id="+e.name,!0)},en=function(t,n){var i,o,a=e.parms(),s=_.Puzzle.curr;if(s.profile={},
t.includes(se)){var l=t.indexOf(se),c=t.indexOf("(nop=",l);o=t.slice(0,l),s.customMystery=se,
c&&(s.customMysteryNop=parseInt(t.slice(c+5),10))}else t.includes(le)?(l=t.indexOf(le),o=t.slice(0,l),
s.customMystery=le):t.includes("_(hidden)_")||t.includes(ce)?(o=t,s.customMystery=ce):o=t
;h.isValidColor(a.color)?h.val=f.get("themes",a.color):h.setToDefault(),r.log("fetching image "+o),
n||(o=e.fetchPath+encodeURIComponent(o)),(i=new g.WebReq(o,null,!0)).targetUrl=t,i.onload=Ut,i.onerror=Ut,i.send()},
tn=function(t){var n=e.profilesPath+t+".json",i=e.altProfilesPath+t+".json",o=new g.WebReq(n,i);o.onload=Zt,
o.onerror=$t,o.send(),r.log("profile requested")},nn=function(){var t=_.Puzzle.curr,n=function(){var t=_.Puzzle.curr
;if(t.customMysteryNop)return t.customMysteryNop
;var n=!!_.Puzzle.urlParms.name,i=!!t.mysteryProfile||t.customMystery===se,o=n||i?0:e.parms().nop||0,r=o<=je?1:o/je
;switch(De){case"phone":return o<=35?o||35:Math.round(35*r);case"tablet":return o<=60?o||60:Math.round(60*r);default:
return o||je}
}(),i=Math.round(n/je*(t.mysteryProfile?Math.min(t.mysteryProfile.mystery["min pieces"],1/0):_.Puzzle.urlParms.min||0)),o={
subject:t.subject,minNop:i,defNop:t.pieces.length||t.nop&&t.nop.nop||n,selectedNop:null},r=_.knife.cutChoices(o)
;return r?(u.numPiecesMenu.onNopChange=on,u.numPiecesMenu.setChoices(r),!0):(Kt(t.subject),!1)},on=function(){
var e=_.Puzzle.curr,t=O.clips[te];r.log("nop change"),e.showEdgesOnly(!1,ae),e.state=R,
e.nop=u.numPiecesMenu.selectedNop,e.capState=J,e.pieces.dispose(),t.head&&t.head.item.dispose()
;var n=O.Texture.getTexture(Te);n&&n.dispose(),(n=O.Texture.getTexture(ze))&&n.dispose(),_.Controller.purgeListeners(),
e.record&&(e.record.purge(),e.record=null),_.clock.stop(),_.clock.set(0),e.tabIndexRight=-1,e.tabIndexBottom=-1,
e.isComplete=!1,e.numMoves=0,e.rotatable=!1,e.compactMode=!1,Wt()},rn=function(){var e=_.Puzzle.curr;if(e){
if(e.state.lt(D)||d.isConnecting())return r.detail("delay rescale"),void setTimeout(rn,2e3);r.emitBreak(),
r.note("rescale: w="+n.width+", h="+n.height+", s.w="+z.getWidth()+", s.h="+z.getHeightMinusToolbar()),
_.background.rescale();var t=O.clips[te];if(e.state=R,e.capState=J,e.pieces.dispose(),e.record&&e.record.dispose(),
t.head&&t.head.item.dispose(),e.subject){e.subject.rescale();var i=O.Texture.getTexture(Te);i&&i.dispose(),
(i=O.Texture.getTexture(ze))&&i.dispose(),_.Controller.purgeListeners(),Ht()}}},Ot=function(e,t){
return e.members.length<t.members.length?1:e.members.length>t.members.length?-1:0},an=function(){
for(var e=[],t=this.pieces.head;t;){var n=t.item.group;n&&-1===e.indexOf(n)&&e.push(n),t=t.next}if(e.length){e.sort(Ot)
;for(var i=e.length-1;i>=0;i--)e[i].sendToBottom()}},sn=function(e){return e<45?0:e<135?90:e<225?180:e<315?270:0},Dt=!0,
Gt=[],Vt=function(e,t){if(!e.stateVar.val.eq(U,X))if(t.showEdgesOnly()){var n=e.group;if(n&&e.id===n.id){var i=n.members
;Gt.length=0;for(var o=i.length-1;o>=0;o--){var a=i[o];a.isEdge&&!n.isEdge&&(n.isEdge=!0,Bt++),0===a.opacity&&Gt.push(a)
}n.isEdge&&Gt.length&&(Dt&&(Gt[0].logState("invisible group piece",!0),Gt[0].logHistory(),Dt=!1),
Gt.forEach((function(e){e.opacity=1})),At+=Gt.length),Gt.length=0}}else 1!==e.opacity?(Dt&&(Dt=!1,
e.logState("invisible piece",!0),e.logHistory()),e.opacity=1,At++):1!==e._opacity.renderedValue&&(Dt&&(Dt=!1,
e.logState("unexpected rawOpacity value: "+e._opacity.renderedValue,!0),e.logHistory()),e.opacity=1,At++),
e.active||(r.warn.once("inactive piece encountered. id=%s",e.id),Mt++)},ln=function(){
var e=_.Puzzle.curr,t=e?e.pieces:null;if(t&&e.stateVar.val.eq(V)){
var n,i=O.canvas.width+.5,o=O.canvas.height+.5,a=0,s=t.getIterator(),l=0,u=0;for(At=0,Mt=0,jt=0,Bt=0,
Nt=0;n=s.getNext();){var h,g,m=!1;if(a++,!n.isTweening()){if(n.group){var f=n.group.members,v=0
;if(n.id!==n.group.id)continue;for(var y,b=n,w=null,P=n.angle,E=f.length-1;E>=0;E--)1===(y=f[E]).id&&Math.max(1,1),
!w&&y.position.x>=Ge&&y.position.x<=i&&y.position.y>=0&&y.position.y<=o&&(w=y),y.angle!==P&&(m=!0),y.isEdge&&v++
;if(n.group.edgeCount!==v&&(Nt++,n.group.edgeCount=v),w)n=w;else{var k,S,C=1/0
;for(E=f.length-1;E>=0;E--)h=(y=f[E]).position.x,
g=y.position.y,(k=(h<0?Math.abs(h):h>i?h-i:1)*(g<0?Math.abs(g):g>o?g-o:1))<C&&(C=k,S=y);n=S}if(m){var T=0,z=[]
;if(z[0]=0,z[90]=0,z[180]=0,z[270]=0,d.joinedToGameVar.val){var I=d.getPieceInfo(b.id);if(!I)return b.logState(),
b.logHistory(),void x.sendReport("Unexpected audit situation. id="+b.id);P=90*I.a,b.angle!==P&&(b.angle=P)}else{
for(E=f.length-1;E>=0;E--)void 0!==z[(y=f[E]).angle]&&z[y.angle]++;P=z[0]>z[90]?0:90,T=Math.max(z[0],z[90]),
P=z[180]>T?180:P,T=Math.max(z[180],T),P=z[270]>T?270:P}for(E=f.length-1;E>=0;E--)(y=f[E]).angle!==P&&(y.angle=P,jt++)}}
var L,A,M
;if(h=n.position.x<Ge?Ge:n.position.x>i?O.canvas.width:NaN,g=n.position.y<0?0:n.position.y>o?O.canvas.height:NaN,
isNaN(h)&&isNaN(g)||(h=isNaN(h)?n.position.x:h,g=isNaN(g)?n.position.y:g,n.position.assign(h,g),l++),
n.group)for(E=f.length-1;E>=0;E--)(y=f[E])!==n&&(_.Piece.gap.measure(y,n,!1,0),L=_.Piece.gap.x,A=_.Piece.gap.y,
_.Piece.gap.measure(y,n,!0,0),90===n.angle?(M=L,L=-A,A=M):180===n.angle?(L=-L,A=-A):270===n.angle&&(M=A,A=-L,L=M),
L===_.Piece.gap.x&&A===_.Piece.gap.y||(2===f.length&&p.log(n.name+": Gap found. x="+n.position.x+", y="+n.position.y+", id2="+y.id+", x2="+y.position.x+", y2="+y.position.y+", dx="+L+", dy="+A),
L=_.Piece.gap.x-L,A=_.Piece.gap.y-A,h=y.position.x+L,g=y.position.y+A,y.position.assign(h,g)&&(u++,
Rt||(p.log(n.name+": gap corrected"),Rt={sendReport:!0,piece:n,grpPiece:y,xGap:L,yGap:A})))),Vt(y,e);else Vt(n,e);n.id,
n.spec.id}}
if((At||Mt||l||jt||u||Bt||Nt)&&r.info("corrected pieces: mispositioned="+l+", invisible="+At+", inactive="+Mt+", bad_angle="+jt+", gaps="+u+", edge_grps="+Bt+", edge_cnts="+Nt),
a===t.length&&a===t.numRows*t.numCols||(r.warn("mismatched count: cnt="+a+", len="+t.length+", rows="+t.numRows+", cols="+t.numCols),
t.audit(),
x.sendReport("Mismatched count")),c.debug1&&Rt&&Rt.sendReport&&(jt||u)&&Rt.piece.group&&2===Rt.piece.group.length&&(!l||e.record&&e.record.progv)){
var j=Date.now()
;r.log("id="+Rt.piece.id+", x="+Rt.piece.position.x+", y="+Rt.piece.position.y+", a="+Rt.piece.angle+", x-gap="+Rt.xGap+", y-gap="+Rt.yGap),
r.log(p.getLogs((function(e,t){return!(t+6e3<j)&&(e.includes(Rt.piece.name)||e.includes(Rt.grpPiece.name))}))),
r.log("end"),x.sendReport("Rotation corrections"),Rt.sendReport=!1}
c.debug2&&(At||Mt)&&(r.log("number of pieces captured: %s",_.Piece.capturedList.length),
x.sendReport("Visibility corrections")),(Bt||Nt)&&x.sendReport("Edge corrections")}},function(t){
var n,i,o,a,s,l,c=u.verboseLoggingVar.val?p.LOG_CHANGES:p.LOG_NONE;if(_.Puzzle.curr&&(_.Puzzle.curr.dispose(),
O.Texture.freeAllUnused()),this.capStateVar=p.define(this,"capState",new p(J,"puzzle.capState",(function(){
var e=_.Puzzle.curr;return e.state.eq(N,R)||e.state.gte(G)}),c,c)),this.capStateVar.meta={isCapturing:function(){
return _.Puzzle.curr.capState.neq(J)}},this.capStateVar.addListener((function(e,t){var n=_.Piece.capturedList.length
;e.gte(K)?(e.eq(K)&&t.eq(J)&&r.warn("Capture state enabled (debug)"),
u.cursor(n?u.CLOSED_HAND_CURSOR:u.OPEN_HAND_CURSOR)):e.eq(J)&&(u.cursor(u.DEFAULT_CURSOR),_.Piece.releaseAll())})),
u.verboseLoggingVar.addListener((function(e,t,n){n.intLogVerbosity=e?p.LOG_CHANGES:p.LOG_NONE,
n.extLogVerbosity=e?p.LOG_CHANGES:p.LOG_NONE
})),this.stateVar=p.define(this,"state",new p(B,"puzzle.state",p.LOG_CHANGES,p.LOG_CHANGES,(function(e){
return e.eq(N)&&p.clearLogs(),!0}))),this.stateVar.addListener((function(e){var t=_.Puzzle.curr;u.busy(e.eq(N,R)),
u.update(),t.state.lt(D)&&t.showEdgesOnly(!1,ae),e.eq(V)&&r.emitBreak()})),_.Puzzle.curr=this,_.Puzzle.urlParms=t,
t.log(),this.pieces=Ft,this.state=N,this.subject=null,this.record=null,this.profile=null,this.tabIndexRight=-1,
this.tabIndexBottom=-1,this.shapeIndex=d.gameInfo?d.gameInfo.shp:Math.round(Math.random()*(Ee.length-1)),
this.isCompleteVar=p.define(this,"isComplete",new p(!!d.gameInfo&&d.gameInfo.cmplt,"puzzle.isComplete")),
this.credits=null,this.mysteryProfile=null,this.customMystery=!1,this.customMysteryNop=0,this.nop=null,this.rescale=rn,
this.relayer=an,this.nopChangePrep=nn,this.onNopChange=on,this.numMoves=0,this.snapDistance=Ae,this.auditPieces=ln,
this.normalizeAngle=sn,
this.initialAngles=null,this.tabHoleRightIndex=d.gameInfo?d.gameInfo.tabr:Math.round(Math.random()*(_e.length-1)),
this.tabHoleBottomIndex=d.gameInfo?d.gameInfo.tabb:Math.round(Math.random()*(_e.length-1)),
this.multiplayerGameId=e.parms().gameId,this.multiplayerGameShortLink=null,this.compactMode=!1,this.getSeed=(n=this,
i=null,function(){return i||(i=n.record&&n.record.seed||n.multiplayerGameId&&d.gameInfo.seed||g.getRandomSeed()),i}),
this.getAngleSeed=function(e){var t=null;return function(){
return t||(t=e.record&&e.record.aseed||e.multiplayerGameId&&d.gameInfo.aseed||g.getRandomSeed()),t}}(this),
this.multiplayerGameId||d.joinedToGameVar.addListener((function(e){if(e)return _.Puzzle.curr.multiplayerGameId=d.gameId,
"remove"})),this.multiplayerGameId){var m=parseInt(this.multiplayerGameId,36)
;r.log("game initial date: gid=%s, date=%s",this.multiplayerGameId,g.convertTimestampToLocalDateAndTime(m))}
if(u.isReady&&(u.numPiecesBtn.enabled(!0),u.rotateBtn.toggled(!1),u.update()),t.recId){
var f=new XMLHttpRequest,v="https://s3.amazonaws.com/jigex-pub-res/debug-data/records/"+t.recId+".json";f.open("GET",v),
f.crossOrigin="anonymous",f.onload=function(e){var n=e.target;o=JSON.parse(n.response),_.Puzzle.curr.name=o.pid,
t.puzzleId=o.pid,_.puzzleRecord(o,!0),tn(o.pid)},f.onerror=function(e){var n=e.target
;r.error("Failed to load record: status=",n.status,", recId=",t.recId)},f.send()
}else if(t.puzzleId)"testmode"===t.puzzleId?((l=new g.WebReq("nicks-fish-house.jpg",null)).onload=Ut,
l.send()):tn(t.puzzleId),this.name=t.saveName||t.puzzleId;else if(t.url){if(this.name=t.saveName||t.url,en(t.url),
t.cred){var y=t.cred.indexOf("©");-1!==y&&(t.cred=t.cred.substr(0,y-1)+"&copy;"+t.cred.substr(y+1))}
this.credits=new _.Credits(t)}else if(t.name)this.name=t.saveName?t.saveName:t.name,h.setToDefault(),a=t.data,
(s=new Image).onload=Yt,s.onerror=Yt,s.src=a;else{var b,w;if(o=_.recordsManager.youngest(),t.puzzleId=o?o.pid:"",
b=t.puzzleId,
o&&o.nam)u.busy(!1),h.setToDefault(),w="The jigsaw puzzle represented by saved puzzle file "+o.nam+" can be continued by reopening that puzzle file.",
u.deleteRecordPrompt(w,o.id),this.state=B;else if(0===b.indexOf("http"))t.puzzleId=null,t.url=b,t.cred=o.cred,
t.credu=o.credu,
this.record=o,this.name=b,en(b),this.credits=new _.Credits(t);else if(b.includes(".jpg")||b.includes(".jpeg")||b.includes(".png")||b.includes(".webp")||b.includes(".gif")||b.includes(".bmp")||b.includes(".jigsaw")||b.includes(".JPG")||b.includes(".JPEG")||b.includes(".PNG")||b.includes(".WEBP")||b.includes(".GIF")||b.includes(".BMP")||b.includes(".JIGSAW")){
var x=b.includes(".jigsaw")||b.includes(".JIGSAW")?"saved puzzle":"image";u.busy(!1),h.setToDefault(),
w="The jigsaw puzzle made from "+x+" "+b+" can be continued by reopening that "+x+" file.",
o?u.deleteRecordPrompt(w,o.id):u.msgbox(w),this.state=B
}else b?(this.name=b,tn(b)):(w='You have no saved puzzles in progress.<br/><br/>You can play this default puzzle, or you can open your own photo as a jigsaw puzzle by clicking the "Open" button.',
u.msgbox(w,["jigex-mb-open","jigex-mb-ok"],(function(e){
"open"===e&&document.getElementById("jigex-open-file-btn").click()})),this.name=ke,tn(ke))}
(t.name&&t.name.includes(".jigsaw")||t.saveName&&t.saveName.includes(".jigsaw"))&&u.numPiecesBtn.enabled(!1)}),
_.Puzzle.curr=null,_.Puzzle.prototype.reset=function(){this.nopChangePrep(),this.onNopChange()},
_.Puzzle.prototype.showEdgesOnly=(cn=!1,un=!1,function(e,t,n){if(void 0===e)return un
;if(void 0===t)throw new Error("showEdgesOnly requires an action parameter");var i=this,o=i.pieces.isEdgeComplete
;if(e===un){
if(t.eq(oe)||!cn)return void r.log("showEdgesOnly request rejected (1): edo=%s, act=%s, inprg=%s",e,t.name,cn)
}else t.eq(oe)&&(cn||document.hidden||!g.sysTiming.isRunning)&&(t=re,cn=!1)
;if(i.state.lt(R)||e&&o)r.log("showEdgesOnly request rejected (2): edo=%s, cmplt=%s, st=%s",e,o,i.state.name);else{
r.log("showEdgesOnly -> "+e+";  ("+t.name+")");var a,s,l,c,d=i.pieces.head;if(un=e,t===re){
for(;d;)s=!((a=d.item).isEdge||a.group&&a.group.isEdge),c=e?a.stateVar.val.eq(F):a.stateVar.val.eq(F,Y,X),
s&&c&&(a.opacity=e?0:1),d=d.next;i.scatter({partial:!0}),i.updateRecord()}else if(t===oe){
for(var h=[];d;)s=!((a=d.item).isEdge||a.group&&a.group.isEdge),c=e?a.stateVar.val.eq(F):a.stateVar.val.eq(F,Y,X),
l=a.hasMoved||!!a.group,!s&&l||!c||h.push(a),d=d.next;h.length&&(cn=!0,h[0].applyTask((function(e,t){
e.fadeOut(Se,t,!1,n)}),(function(){i.relayer(),i.scatter({partial:!0})}),h),h[0].applyTask((function(t,i){
if(t.isEdge||t.group&&t.group.isEdge||!e){var o=t.isEdge||t.group&&t.group.isEdge||e?void 0:Se+(n||0);t.fadeIn(Se,i,o)
}else i()}),(function(){h.length=0,cn=!1,i.updateRecord()}),h))}u.update()}}),_.Puzzle.prototype.updateRecord=(dn=null,
function(e){if(this.multiplayerGameId)clearTimeout(dn),dn=setTimeout(this.auditPieces,500);else{if(!this.record){
if(!this.numMoves)return;this.record=new _.puzzleRecord}this.record.update(e)}}),
_.Puzzle.prototype.resetPieces=function(){if(this.stateVar.val.gte(D)){for(var e=this.pieces.head;e;){var t=e.item
;t.isDisposed||(t.killTweeners(),
t.stateVar.val.eq(U)&&(t.opacity=1),t.remoteData&&(t.remoteData.timer&&(t.remoteData.timer.clear(),
t.remoteData.timer=null),t.remoteData=null,t.remotePlayerName=null),t.group&&t.group.id!==t.id||(t.stateVar.val=F)),
e=e.next}this.capStateVar.val.neq(J)&&(_.Piece.releaseAll(!0),u.cursor(u.DEFAULT_CURSOR),this.capStateVar.val=J,
u.update()),_.Piece.selectedPiece&&(_.Piece.selectedPiece.drop(),_.Piece.selectedPiece=null),b.kill(),
O.clearAllTweeners()}},_.Puzzle.prototype.start=function(){this.multiplayerGameId?d.timer.start():_.clock.resume(),
this.state=V},_.Puzzle.prototype.toggleCaptureMode=(hn=function(){var e=_.Puzzle.curr;e&&(e.capState=J)},function(e){
var t=_.Puzzle.curr
;(t.state.eq(N,R)||t.state.gte(G))&&(t.capState.eq(J)?_.Piece.selectedPiece?u.msgbox("Release the currently selected puzzle piece before switching to capture mode."):(t.capState=K,
_.onEscape.add(hn)):(t.capState=J,_.onEscape.remove(hn)))}),_.Puzzle.prototype.isReady=function(){
return this.state.gte(G)},pn=!1,gn=0,Object.defineProperty(_.Puzzle.prototype,"rotatable",{get:function(){return pn},
set:function(e){var t=Date.now();if(!(e===pn&&e!==ue||t-gn<=1500)){u.rotateBtn.toggled(!!e);var n=this.pieces.head
;for(pn=!!e,gn=t,function(){var e=_.Puzzle.curr,t=e&&e.pieces&&e.pieces.length
;if(t&&(!e.initialAngles||e.initialAngles.length!==t)){
for(var n=g.getRandomGenerator(e.getAngleSeed()),i=[],o=t-1;o>=0;o--){var r=n(),a=270
;r>=.75?a=0:r>=.5?a=90:r>=.25&&(a=180),i.push(a)}e.initialAngles=i}}();n;){var i=n.item,o=null
;this.rotatable?i.hasMoved||(o=this.initialAngles[i.id-1]):!i.angle||i.group&&i.id!==i.group.id||(o=0),
null!==o&&(this.state.gte(D)?i.rotateTo(o,!0):i.angle=o),n=n.next}this.state.gte(D)&&setTimeout((function(){
var e=_.Puzzle.curr;e&&(e.auditPieces(),e.state.gte(G)&&e.updateRecord())}),1500)}}}),
_.Puzzle.prototype.percentComplete=function(){var e=_.Puzzle.curr,t=e&&e.pieces;if(!e||!t)return 0
;if(e.isComplete)return 100;for(var n=t.length-1,i=0,o=t.head;o;){var r=o.item,a=r.group
;a&&r.id===a.id&&(i+=a.length-1),o=o.next}var s=i?Math.max(1,Math.round(100*i/n)):0;return Math.min(99,s)},
_.Puzzle.prototype.onComplete=function(){var t,n=e.parms();if(r.log("puzzle completed"),_.clock.stop(),d.timer.stop(),
this.isComplete=!0,
this.updateRecord(!0),t=(n=_.Puzzle.urlParms).puzzleId?n.puzzleId:n.url?"Custom URL"+(w?" (embedded)":" (linked)"):n.name?"Local file":"[unknown]",
(!d.joinedToGameVar.val||d.isMaster())&&(window.gtag("event","puzzle_completion",{puzzle:t}),
n.puzzleId&&e.homeDomain.includes("www."))){var i=new XMLHttpRequest;i.open("POST",e.homeDomain+"api/completions"),
i.setRequestHeader("Content-Type","application/json;charset=UTF-8"),i.send(JSON.stringify({puzzleId:n.puzzleId,
action:"incr"}))}var o=g.localStore.getItem(Ne)||g.localStore.getItem(Be);o=o?parseInt(o):0;try{
g.localStore.setItem(Ne,(o+1).toString(10))}catch(e){r.warn("failed to update completion count. err="+e.message)}
setTimeout(_.applause.play,500)},_.Puzzle.prototype.handleEvent=function(e){var t,n=_.Puzzle.curr
;if(n.state.eq(D)&&!u.starterDlg.visible()){var i=m.getPnl("jigex-promo-1");i&&i.visible()||(n.state=G)}
if(n&&n.state.gte(G)&&!u.busy())switch(e.type){case"mousemove":case"touchmove":case"pointermove":
n.capState.eq(Q)?(t=n.pieces.getPieceAt(e.controller))&&t.handleEvent&&t.handleEvent(e):n.capState.eq(Z)&&((t=n.pieces.getPieceAt(e.controller))||_.Piece.release(e.controller))
;break;case"mouseup":case"pointerup":case"touchend":n.capState.gt(K)&&(n.capState=K);break;case"mousedown":
case"touchstart":case"pointerdown":case"mousewheel":case"wheel":
(t=n.pieces.getPieceAt(e.controller))&&t.handleEvent?t.handleEvent(e):!e.type.includes("wheel")&&n.capState.eq(K)?_.Piece.capturedList.length?_.Piece.release(e.controller):_.Puzzle.curr.toggleCaptureMode():_.boxTop.containsPoint(e.controller.x,e.controller.y)&&_.boxTop.handleEvent(e)
;break;case"keydown":
(t=n.pieces.getPieceAt(e.controller))&&t.handleEvent&&(37===e.which||39===e.which)&&t.handleEvent(e)}},
_.Puzzle.prototype.getScatterSequence=(mn=[],function(){var e=_.Puzzle.curr,t=e.pieces.specList
;if(mn.length!==t.length||e.pieces.length!==t.length){var n=t.slice(),i=null,o=0;for(mn.length=0,n.sort((function(e,t){
return e.sortOrder-t.sortOrder}));n.length;){var r=n.pop()
;i&&-1!==r.piece.neighbors.indexOf(i.piece)&&5!==o?(n.unshift(r),o++):(mn.push(r.piece.id),i=r,o=0)}}return mn}),
_.Puzzle.prototype.scatter=(fn=function(e){
for(var t,n,i,o=null,r=1/0,a=e.length-1;a>=0;a--)(n=(t=e[a]).position.distanceFrom(M))<r&&(r=n,o=t,i=a)
;i&&(e.splice(i,1),e.unshift(o)),o.position.assignNorm(o.tuple.x,o.tuple.y),new _.Group(e)},vn=function(){var e=[0,0]
;return function(){var t=_.Puzzle.curr,n=Date.now(),i=n-e[0]<600&&e[0]-e[1]>600;e.unshift(n),e.pop(),
c.cmptModeEanbled&&i&&(t.compactMode=!t.compactMode)}}(),function(e){var t,i=e||{},o=this,a=null,s=this.pieces.specList
;if(i.byCommand&&vn(),!this.record||i.partial||o.multiplayerGameId){if(s){
var l,c,u,d,h=2*s[0].image.bounds.margin,p=0,g=0;s.forEach((function(e){p+=e.width-h,g+=e.height-h})),p*=1.05/s.length,
g*=1.05/s.length,l=p/4,c=g/4,u=p/8,d=g/8
;var m,f,v,y=o.compactMode||_.boxTop.isShowing()&&!o.showEdgesOnly()&&o.percentComplete()<=50,b=Ge?Math.max(0,Ge-p/2):0,w=(n.width-b)/p,P=n.height/g,E=w-Math.floor(w)>=.5?1:0,k=P-Math.floor(P)>=.5?1:0,S=p*(w/(Math.floor(w)+E)),C=g*(P/(Math.floor(P)+k)),T=S/2,z=C/2,I=b+p/2,L=g/2,O=n.width,A=C,M=n.height,j=3,B=[],N=999,R=999,D=this.getScatterSequence()
;!y&&s.length>=35&&(this.showEdgesOnly()||this.pieces.isEdgeComplete)&&(w=(n.width-l)/p,P=(n.height-c)/g,
E=w-Math.floor(w)>=.5?1:0,k=P-Math.floor(P)>=.5?1:0,S=p*(w/(Math.floor(w)+E)),C=g*(P/(Math.floor(P)+k)),I+=Ge?0:u,L+=d,
b=b||u,O=n.width-u,A=C+d,M=n.height-d);var G=n.width-this.subject.width,V=n.height-this.subject.height,H=[],q=[]
;G<V?R=Math.floor(G/S):N=Math.floor(V/C),D.forEach((function(e){var t=o.pieces.specList[e-1]
;if(!t)return r.warn.once("piece count mismatch: pl=%s, sl=%s, sql=%s, ind=%s",o.pieces.length,o.pieces.specList.length,D.length,e),
void x.sendReport("Piece count mismatch");var n=t.piece,a=!o.showEdgesOnly()||n.isEdge,s=n.state.eq(F)
;!n.group&&a&&s&&(q.push(n),n.hasMoved||H.push(n)),(n.group||n.hasMoved&&!i.shift)&&a&&s&&B.push(n),n.homePos=null})),
i.shift||q.length<=10&&q.length!==H.length&&o.pieces.isEdgeComplete&&!i.unmovedPiecesOnly?(m=q).forEach((function(e){
e.hasMoved=!1})):m=H;for(var W=m.length,U=0;m.length>0;){t=m.pop();var Y=function(){
var e=0===t.angle||180===t.angle?t.width:t.height,n=0===t.angle||180===t.angle?t.height:t.width,i={x:e/4,y:n/4}
;if(_.boxTop.isShowing()&&_.boxTop.containsPoint(I,L,i))return!0;for(var o=B.length-1;o>=0;o--){
var r=B[o],a=0===r.angle||180===r.angle?r.width:r.height,s=0===r.angle||180===r.angle?r.height:r.width,l=r.position,c=Math.abs(I-l.x),u=e/2+a/2,d=Math.abs(L-l.y)
;if(c<u&&d<n/2+s/2)return!0}return!1}(),X=!Y&&(3===j&&N>0||2===j&&N>0||0===j&&R>0||1===j&&R>0);if(X){
var J=Math.random()>=.5?1:-1,K=Math.random()>=.5?1:-1,Q=y?.03125:.0625,Z=J*Math.random()*p*Q,$=K*Math.random()*g*Q;U++,
i.animate?t.move(I+Z,L+$,{animate:!0,hasMoved:!1,throttle:!0}):t.position.assign(I+Z,L+$),t.homePos={x:I+Z,y:L+$}
}else m.push(t);var ee=Y?T:S,te=Y?z:C;switch(j){case 3:(f=I+ee-(y?u:0))>O-l?(j=1,N--,I=O-p/2,X&&(L+=te),R>0&&(O-=S)):I=f
;break;case 1:(v=L+te-(y?d:0))>M-c?(j=2,R--,L=M-g/2,X&&(I-=ee),N>0&&(M-=C)):L=v;break;case 2:(f=I-ee+(y?u:0))<b+l?(j=0,
N--,I=b+p/2,X&&(L-=te),R>0&&(b+=S)):I=f;break;case 0:(v=L-te+(y?d:0))<A+c?(j=3,R--,L=A+g/2,X&&(I+=ee),N>0&&(A+=C)):L=v}}
U!==W&&r.error("Laid wrong number of pieces. to-lay="+W+", laid="+U)}}else{
var ne,ie=this.record.pcs,oe=[],re=!1,ae=n.width/n.height,se=this.record.asp,le=!1;se&&(se=parseInt(se,10),
le=ae<1&&se>1||ae>1&&se<1)
;for(var ce=ie.length-1;ce>=0;ce--)ne=ie[ce],(t=this.pieces.getPiece(ne.id))||r.fault(new Error("null piece: i="+ce+", len="+ie.length+", id="+ne.id+", pcs="+this.pieces.length)),
t.angle=ne.a,t.hasMoved=ne.m,t.tuple=ne,ne.g?a?a.g===ne.g?(oe.push(t),0===ce&&(fn(oe),t.raise())):(fn(oe),oe[0].raise(),
oe.length=0,oe.push(t),a=ne):(oe.push(t),a=ne):(a&&(fn(oe),oe[0].raise(),oe.length=0,a=null),
le&&!ne.m?re=!0:t.position.assignNorm(ne.x,ne.y),t.raise());re&&o.scatter({partial:!0,unmovedPiecesOnly:!0}),
this.auditPieces(),this.relayer()}}),_.Puzzle.prototype.shader=null,_.Puzzle.prototype.dispose=function(){
var e=O.clips[te];this.capState=J,this.pieces&&this.pieces.length&&(this.updateRecord(!0),this.pieces.dispose()),
this.state=B,e.head&&e.head.item.dispose(),_.boxTop.dispose(),this.subject&&(this.subject.dispose(),this.subject=null)
;var t=O.Texture.getTexture(Te);t&&t.dispose(),(t=O.Texture.getTexture(ze))&&t.dispose(),
this.record&&(this.record.dispose(),this.record=null),this.capStateVar.dispose(),this.stateVar.dispose(),
_.Controller.purgeListeners(),_.Puzzle.curr=null,_.Piece.selectedPiece=null},_.Piece=(yn=0,bn=!1,wn=function(e,t,n,i){
if(!bn){if(i.group&&(bn=!0,i.group.members.forEach((function(t){t!==i&&(t.stateVar.val=e,
t.setUserStateSlot(0,e.eq(F,Y)?0:1))})),bn=!1),t.eq(F)&&e.neq(Y,X)&&_.trollShield.pieceHandled(),e.eq(Y,X)){
var o=e.eq(Y),r=o?3e4:3e3,a=new y(r,(function(e){var t=this;if(!t.isDisposed){var n=t.stateVar.val.eq(X)
;t.isTweening()?(e.meta.tweenDelays++,
e.set(1e3)):n?v.runningDuration>=r?(t.logState("remote control timeout, twdly="+e.meta.tweenDelays+", rdly="+e.meta.runningDelays+", x="+e.meta.x+", y="+e.meta.y+", start="+g.convertTimestampToTime(e.startDate)+", set="+g.convertTimestampToTime(e.meta.timestamp)+", chkd="+g.convertTimestampToTime(e.checked)+", dur="+e._duration+", cnt="+e.setCount),
t.remoteData&&t.remoteData.timer&&t.remoteData.timer.log(),t.stateVar.val=F):(e.meta.runningDelays++,e.set(),
e.meta.runningDelays>10&&x.sendReport("Unexpected remote timeout condition")):(t.logState("remote select timeout"),
t.stateVar.val=F,5==++yn&&(_.Piece.selectedPiece&&(_.Piece.selectedPiece.drop(),_.Piece.selectedPiece=null),yn=0,
d.leaveGame(),u.busy(!0)))}}),i)
;o||(yn=0),p.log(i.name+": set remote control timer: old="+t+", new="+e+", start="+g.convertTimestampToTime(a.startDate)+", count="+a.setCount),
a.meta={tweenDelays:0,runningDelays:0,x:i.position.x,y:i.position.y,timestamp:Date.now()},
i.stateVar.addListener((function(e,t,n,i){
return a.clear(),e.eq(F)&&t.eq(X)&&(!i.opacity||i.remoteData&&i.remoteData.dbgFlag)&&(i.logState("unexpected state"),
i.logHistory(!0)),"remove"}))}else i.remoteData&&i.remoteData.timer&&i.remoteData.timer.clear(),i.remoteData=null,
i.remotePlayerName=null;i.setUserStateSlot(0,e.eq(F,Y)?0:1),_.Piece.selectedPiece=e.eq(H,q,W)?i:null,
d.joinedToGameVar.val&&!i.isInMainAssembly()&&!d.gameInfo.lsync&&t.eq(F)&&e.eq(H,q,W)&&d.sendEvent("select",i)}},
xn=function(e,t,n,i){
return!(e&&!i.group&&i.homePos&&Math.abs(i.homePos.x-i.position.x)<=i.spec.core.width/3&&Math.abs(i.homePos.y-i.position.y)<=i.spec.core.height/3)||{
correction:!1}},function(e){var t=this,n=null;O.Clip.call(t,e),t.id=e.id,e.piece=t,t.spec=e,t.group=null,
t.neighbors=new Array(4),t.caterNeighbors=new Array(4),t.recTuple={},t.isEdge=!1,t.remoteData=null,t.pivotPiece=null,
t.stateVar=p.define(t,"state",new p(F,t.name+".state",p.LOG_CHANGES)),t.stateVar.addListener(wn),
p.define(t,"group",new p(null,t.name+".group",p.LOG_CHANGES)),
p.define(t,"hasMoved",new p(!1,t.name+".hasMoved",xn,p.LOG_CHANGES)),Object.defineProperty(t,"remotePlayerName",{
get:function(){
return this.stateVar.val.eq(Y,X)?this.group&&this.group.refPiece!==this?this.group.refPiece.remotePlayerName:n:null},
set:function(e){
e&&!this.stateVar.val.eq(Y,X)||(this.group&&this.group.refPiece!==this?this.group.refPiece.remotePlayerName=e:n=e)}})}),
Pn=null,_n=!1,En=function(){c.debug4&&!_n&&Pn&&1!==Pn.opacity&&(_n=!0,Pn.logState(),Pn.logHistory(),
x.sendReport("Ghost piece detected"))},Object.defineProperty(_.Piece,"selectedPiece",{get:function(){return En(),Pn},
set:function(e){var t=_.Puzzle.curr;En(),e&&Pn&&(e===Pn||e.group&&e.group===Pn.group||setTimeout((function(e){
e.isDisposed||e.drop()}),0,Pn)),Pn=e,En(),t&&t.capState.neq(Q,Z)&&u.cursor(e?u.NO_CURSOR:u.DEFAULT_CURSOR)}}),
_.Piece.firstPieceMoved=!1,_.Piece.capturedList=[],_.Piece.prototype=Object.create(O.Clip.prototype),
_.Piece.prototype.getUserStateSlot=function(e){return this.userState>>e&255
},_.Piece.prototype.setUserStateSlot=function(e,t){this.userState=this.userState&~(255<<e)|t<<e},
_.Piece.prototype.logState=function(e,t){var n=t?p.log:r.log
;this.isDisposed?n((e?e+": ":"")+this.name+" is disposed"):n(this.name+': msg="'+(e||"n/a")+'", st='+this.stateVar.val.name+", gid="+(this.group?this.group.id:"n/a")+", glen="+(this.group?this.group.length:"n/a")+", ed="+this.isEdge+", ged="+(this.group?this.group.isEdge:"n/a")+", mv="+this.hasMoved+", x="+this.position.x+", y="+this.position.y+", ang="+this.angle+", op="+this.opacity+", act="+this.active+", tw="+this.isTweening())
},_.Piece.prototype.logHistory=function(e){var t=this
;r.log("------------------- piece-"+t.id+" history: ----------------------"),r.log(p.getLogs((function(n){
return e?n.includes(t.name)||!!t.group&&n.includes(t.group.name):n.includes(t.name)}),{limit:35}))},
_.Piece.prototype.isInMainAssembly=function(){var e=_.Puzzle.curr
;return this.group&&(this.group.edgeCount>e.pieces.numEdges/2||this.group.length>e.pieces.length/2)},
_.Piece.prototype.isCaptured=function(){var e=this;switch(e.stateVar.val){case U:return!0;case Y:case X:
return _.Piece.capturedList.some((function(t){return t===e||t.group&&t.group===e.group}));default:return!1}},
_.Piece.prototype.decapture=function(){for(var e=_.Piece.capturedList,t=null,n=e.length-1;n>=0;n--){var i=e[n]
;if(this===i||this.group&&this.group===i.group){t=n;break}}return null!==t&&(e.splice(t,1),
e.length||u.cursor(u.OPEN_HAND_CURSOR),!0)},_.Piece.prototype.capture=function(){var e=function(e){e.stateVar.val=U,
e.fadeOut(Se)};return function(){var t=_.Puzzle.curr;this.isTweening()||(this.applyTask(e),
_.Piece.capturedList.push(this),t.capState=Q)}}(),_.Piece.releaseAll=function(){var e=!1,t=function(t){
t.isDisposed||(t.stateVar.val=F,e?t.opacity=1:t.fadeIn(Se))};return function(n){var i=_.Piece.capturedList
;for(e=!!n;i.length;)i.pop().applyTask(t)}}(),_.Piece.release=function(){var e,t=function(e,t){e.stateVar.val=F,
e.fadeIn(Se,t)};return function(n,i){var o=_.Puzzle.curr,r=_.Piece.capturedList;if(o&&r.length){var a=n.x,s=n.y
;if(!i&&o.capState.eq(Z)&&e){var l=Math.abs(a-e.position.x),c=Math.abs(s-e.position.y)
;if(l<1.1*e.width&&c<1.1*e.height)return;n.shakeDetector=null}
var h,p=r.pop(),g=null,m=!(n.event&&n.event.type.includes("move"));if(p.isDisposed)return
;m&&r.length&&!i&&!o.multiplayerGameId&&(n.shakeDetector=new jn((function(){var e=n.x,t=n.y;for(n.x=a,
n.y=s;r.length;)_.Piece.release(n,!0);n.x=e,n.y=t,n.shakeDetector=null}),p.position,Math.max(p.width,p.height)),
o.capStateVar.addListener((function(e){if(e.neq(Z))return n.shakeDetector=null,"remove"}))),p.move(a,s),p.raise(),
h=m&&p.neighborWithinSnapRange(!0),
d.joinedToGameVar.val&&h&&(g=p.group&&h.group?p.group.members.slice():p.group?[h]:[p]),p.applyTask(t,(function(){
d.joinedToGameVar.val&&d.sendUpdate(p,{wasCaptured:!0}),h&&p.angle===h.angle&&p.join(h),g&&g.forEach((function(e){
d.sendGroupUpdate(e)}))})),o.capState=Z,o.numMoves++,_.Puzzle.curr.updateRecord(),
r.length||u.cursor(u.OPEN_HAND_CURSOR),e=p}}}(),_.Piece.prototype.applyTask=function(t,n,i){
var o=this,r=i||o.group&&o.group.members;if(r){var a=n?function(e,t,n){var i=n.length;return function(){0==--i&&t(e)}
}(o,n,r):null;if(!1===t(o,a))return!1;for(var s=0;s<r.length;s++){var l=r[s];if(l!==o&&!1===t(l,a))return!1
;x.extendedStackTrace&&(x.extendedStackTrace=!1,x.sendReport("Rogue assembly movement - "+e.rogueVersion))}return!0}
return x.extendedStackTrace&&(x.extendedStackTrace=!1,x.sendReport("Rogue assembly movement - "+e.rogueVersion)),
!1!==t(o,(function(){n&&n(o)}))},_.Piece.prototype.handleEvent=(kn=function(){
var e="",t=null,n=null,i=!1,o=!1,r=function(e,t,n,i){
var o=e.name+" event: e="+t.type+", x="+(t.controller?t.controller.x:"n/a")+", y="+(t.controller?t.controller.y:"n/a")+(i?", rot="+e.angle:"")+(e.group?", gid="+e.group.id:"")
;if(n)return o+", delayed";p.log(o)};return function(s,l,u){if(c.dbgEvents||a){e:if(!u&&n&&(p.log(n),n=null,o=!1),
l.type.includes("move"))e.includes("move")?(i||(i=!0,p.log(s.name+": additional movement...")),
t=r(s,l,!0,!1)):r(s,l,!1,!1);else{if(t&&(p.log(t),t=null,i=!1),u){if("rotate"!==e){r(s,l,!1,!0);break e}if(o){
n=r(s,l,!0,!0);break e}o=!0,p.log(s.name+": additional rotation..."),n=r(s,l,!0,!0);break e}r(s,l,!1,!1)}
e=u?"rotate":l.type}}}(),Sn=function(e,t){if(e.group&&2===e.group.members.length){var n,i,o,r,a=e.group.members,s=a[0]
;for(r=a.length-1;r>=0;r--)(s=a[r])!==e&&(_.Piece.gap.measure(s,e,!1,0),n=_.Piece.gap.x,i=_.Piece.gap.y,
_.Piece.gap.measure(s,e,!0,0),90===e.angle?(o=n,n=-i,i=o):180===e.angle?(n=-n,i=-i):270===e.angle&&(o=i,i=-n,n=o),
n!==_.Piece.gap.x||i!==_.Piece.gap.y?p.log(e.name+": Gap problem detected"):t&&p.log(e.name+": No gap detected. x="+e.position.x+", y="+e.position.y+", id2="+s.id+", x2="+s.position.x+", y2="+s.position.y+", dx="+n+", dy="+i))
}},function(t){var n,i,o,r,s=this,l=_.Puzzle.curr;if(!s.isDisposed){
var u=t.type.includes("wheel")&&!e.skunkOptions.disableScrollWheelRotate,d="piecerotate"===t.type||"keydown"===t.type&&(37===t.which||39===t.which)
;if(u||d)return kn(s,t,!0),s.rotate(t),t.preventDefHandler=!0,void("piecerotate"!==t.type&&(l.numMoves++,
l.updateRecord()));switch(kn(s,t,!1),s.state){case F:switch(t.type){case"mousedown":case"touchstart":case"pointerdown":
case"touchend":case"pointerup":l.capState.gte(K)?s.capture():(Sn(s),s.stateVar.val=H,t.controller.startTime=Date.now(),
t.controller.startX=t.controller.x,t.controller.startY=t.controller.y,s.move(s.position.x-1,s.position.y-1),
s.moveOffsetX=s.position.x-t.controller.x,s.moveOffsetY=s.position.y-t.controller.y,this.raise(),
t.controller.addListener("mousemove",this),t.controller.addListener("mouseup",this),
t.controller.addListener("touchmove",this),t.controller.addListener("touchend",this),
t.controller.addListener("pointermove",this),t.controller.addListener("pointerup",this),t.controller.capture(this),
Sn(s,!0),"touchend"!==t.type&&"pointerup"!==t.type||(s.stateVar.val=W,p.log(s.name+": touched 1")));break
;case"mousemove":case"touchmove":case"pointermove":l.capState.eq(Q)&&s.capture()}break;case H:switch(t.type){
case"mousemove":case"touchmove":case"pointermove":
Date.now()-t.controller.startTime>250&&(Math.abs(t.controller.x-t.controller.startX)>Oe||Math.abs(t.controller.y-t.controller.startY)>Oe)&&(s.stateVar.val=q),
n=s.moveOffsetX+t.controller.x,i=s.moveOffsetY+t.controller.y,s.move(n,i),b.check(s);break;case"mouseup":
t.controller.removeListener("mouseup",this);break;case"touchend":case"pointerup":s.stateVar.val=W,
p.log(s.name+": touched 2")}break;case q:switch(t.type){case"mousedown":case"mouseup":case"touchend":case"pointerup":
t.controller.removeListener("touchend",this),s.drop(!1),l.numMoves++,t.controller.removeListener("mousemove",this),
t.controller.removeListener("mouseup",this),t.controller.removeListener("touchmove",this),
t.controller.removeListener("touchend",this),t.controller.removeListener("pointermove",this),
t.controller.removeListener("pointerup",this),t.controller.release(this),l.updateRecord();break;case"mousemove":
case"touchmove":case"pointermove":n=s.moveOffsetX+t.controller.x,i=s.moveOffsetY+t.controller.y,s.move(n,i),b.check(s)}
break;case W:switch(t.type){case"mousemove":case"touchmove":case"pointermove":
if(s.isRotating()&&!l.pieces.getPieceAt(t.controller))break
;!t.fromMouseDevice&&Date.now()-t.controller.startTime>250&&(Math.abs(t.controller.x-t.controller.startX)>2*Oe||Math.abs(t.controller.y-t.controller.startY)>2*Oe)&&(s.stateVar.val=q),
n=s.moveOffsetX+t.controller.x,i=s.moveOffsetY+t.controller.y,s.move(n,i),b.check(s);break;case"touchstart":
case"pointerdown":if(t.controller.touchX=t.controller.x,t.controller.touchY=t.controller.y,
(r=l.pieces.getPieceAt(t.controller))===s)s.moveOffsetX=s.position.x-t.controller.x,
s.moveOffsetY=s.position.y-t.controller.y;else{if(r)s.drop(!1);else{if(s.isRotating())break
;s.move(t.controller.x,t.controller.y,{animate:!0,aniCallback:function(){s.drop(!t.fromMouseDevice),l.numMoves++,
l.updateRecord()}})}t.controller.removeListener("mousemove",this),t.controller.removeListener("mouseup",this),
t.controller.removeListener("touchmove",this),t.controller.removeListener("touchend",this),
t.controller.removeListener("pointermove",this),t.controller.removeListener("pointerup",this),
t.controller.release(this),t.preventDefHandler=!0,r&&r.state.eq(F)&&(t.controller.touchX=t.controller.x,
t.controller.touchY=t.controller.y,r.moveOffsetX=r.position.x-t.controller.x,r.moveOffsetY=r.position.y-t.controller.y,
r.handleEvent(t))}break;case"touchend":case"pointerup":r=l.pieces.getPieceAt(t.controller),
o=!t.fromMouseDevice&&Math.abs(t.controller.x-t.controller.touchX)<=2*Oe&&Math.abs(t.controller.y-t.controller.touchY)<=2*Oe,
this===r&&(o&&l.rotatable?((c.dbgEvents||a)&&p.log(s.name+" tap rotate: from_angle="+this.angle),this.rotate(t),
l.numMoves++,l.updateRecord()):(s.drop(!1),l.numMoves++,t.controller.removeListener("mousemove",this),
t.controller.removeListener("mouseup",this),t.controller.removeListener("touchmove",this),
t.controller.removeListener("touchend",this),t.controller.removeListener("pointermove",this),
t.controller.removeListener("pointerup",this),t.controller.release(this),t.preventDefHandler=!0,l.updateRecord()))}}}}),
_.Piece.gap={measure:function(e,t,n,i){if(n&&e.angle!==t.angle)return this.x=NaN,void(this.y=NaN)
;var o=n?e.position.x:e.spec.image.bounds.centerX,r=n?e.position.y:e.spec.image.bounds.centerY,a=n?t.position.x:t.spec.image.bounds.centerX,s=n?t.position.y:t.spec.image.bounds.centerY
;switch(i="number"==typeof i?i:e.angle){case 0:this.x=a-o,this.y=s-r;break;case 90:this.x=r-s,this.y=a-o;break;case 180:
this.x=o-a,this.y=r-s;break;case 270:this.x=s-r,this.y=o-a;break;default:
throw new Error("Bad angle. id1="+e.id+", id2="+t.id+", angle="+i+", actual="+n)}}},
_.Piece.prototype.moveToFit=function(e,t){if(this.angle!==e.angle)throw this.logState("Bad piece fit 1",!0),
this.logHistory(!0),
e.logState("Bad piece fit 2",!0),e.logHistory(!0),new Error("Bad piece fit: angle1="+this.angle+", angle2="+e.angle)
;var n=t||{},i=n.aniCallback;n.joining=!0,n.offset=n.offset||0,i&&(n.animate=!0,n.aniInterval=n.aniInterval||500,
n.aniCallback=function(t){t.matchLevelOf(e),i&&i(t)}),_.Piece.gap.measure(this,e)
;var o=e.position.x-_.Piece.gap.x+n.offset,r=e.position.y-_.Piece.gap.y+n.offset;this.move(o,r,n),
i||this.matchLevelOf(e)},_.Piece.prototype.neighborWithinSnapRange=(zn=_.Piece.gap,In=function(e,t){
if(1===t.opacity&&e.angle===t.angle){var n=t.position.x-e.position.x,i=t.position.y-e.position.y
;if(e.isRotating()||t.isRotating()||n>2*e.width||i>2*e.height)return!1
;var o=Tn?Math.min(e.width,e.height)/4:_.Puzzle.curr.snapDistance;return zn.measure(e,t),
Math.abs(zn.x-n)<=o&&Math.abs(zn.y-i)<=o}return!1},Ln=function(e){for(var t=e.neighbors.length-1;t>=0;t--){
var n=e.neighbors[t];if(n&&(!e.group||e.group!==n.group)&&In(e,n))return Cn=n,!1}},function(e){
return _.trollShield.alarm()?null:(Tn=e,Cn=null,this.isDisposed||this.applyTask(Ln),Cn)}),
_.Piece.prototype.isJoinedTo=function(e){return this.group&&this.group===e.group},_.Piece.checkConn=function(e,t,n){
var i;return!(!t||!e.isJoinedTo(t)||0!=((i=e.getUserStateSlot(8))&n))&&(e.setUserStateSlot(8,i|n),!0)},
_.Piece.prototype.join=(On=null,_.delayedActions.add((function(){On||(On=new t.Sonic("snap"))})),function(t,n){
var i=_.Puzzle.curr,o=null,a=_.Piece.checkConn,s=(t.group?t.group.isEdge:t.isEdge)&&(this.group?this.group.isEdge:this.isEdge)&&(t.group||this.group)
;if(this.group?(this.group.join(this,t),o=t.group?null:t):t.group?(t.group.join(this,t),
o=this.group?null:this):new _.Group(this,t),this.hasMoved=!0,t.hasMoved=!0,o){var l=o.neighbors,c=o.caterNeighbors
;a(o,l[be],de)&&a(l[be],o,pe),a(o,l[we],he)&&a(l[we],o,ge),a(o,l[xe],pe)&&a(l[xe],o,de),a(o,l[Pe],ge)&&a(l[Pe],o,he),
a(o,c[be],me)&&a(c[be],o,ve),a(o,c[we],fe)&&a(c[we],o,ye),a(o,c[xe],ve)&&a(c[xe],o,me),a(o,c[Pe],ye)&&a(c[Pe],o,fe)
}else this.group.members.forEach((function(e){var t=e.neighbors,n=e.caterNeighbors;a(e,t[be],de),a(e,t[we],he),
a(e,t[xe],pe),a(e,t[Pe],ge),a(e,n[be],me),a(e,n[we],fe),a(e,n[xe],ve),a(e,n[Pe],ye)}))
;if(s&&i.pieces.isEdgeComplete&&i.showEdgesOnly()){var u=this.remoteData&&this.remoteData.immediate?re:oe
;d.joinedToGameVar.val&&d.isMaster()&&d.changeSetting("edo",!1),i.showEdgesOnly(!1,u,500)}
this.group.length!==i.pieces.length||d.completeWhenLoaded||i.onComplete(),n||function(t,n){
(e.audioMuted()||t.stateVar.val.eq(X)||n.stateVar.val.eq(X))&&b.show(t,n),
On?On.play():r.log.once("snap sound not loaded")}(this,t)}),_.Piece.prototype.drop=function(e){
var t=_.Puzzle.curr,n=d.joinedToGameVar.val,i=this.neighborWithinSnapRange(e),o=null
;if(i?(n&&(o=this.group&&i.group?this.group.members.slice():this.group?[i]:[this]),o?(d.sendUpdate(this),this.join(i),
o.forEach((function(e){d.sendGroupUpdate(e)
}))):this.join(i)):(this.position.normX<1&&this.position.normY<1&&this.move(this.position.x+1,this.position.y+1),
this.stateVar.val=F,
!n||d.gameInfo.lsync&&!d.isMaster()||1!==d.getNumPlayers()&&this.isInMainAssembly()||d.sendUpdate(this)),
(c.dbgEvents||a)&&p.log(this.name+" drop: x="+this.position.x+", y="+this.position.y+(this.group?", gid="+this.group.id+", glen="+this.group.members.length:"")),
this.group)this.group.length>t.pieces.length/2?(this.group.sendToBottom(),
!this.group.isEdge&&t.pieces.isEdgeComplete&&t.pieces.getPiece(1).group.sendToBottom()):this.group.isEdge&&t.pieces.isEdgeComplete&&this.group.sendToBottom();else{
var r=this.position,s=this.spec.core,l=O.clips.getClipAt(r.x-s.width,r.y,ne,!0),u=null
;l&&!l.hasMoved&&(u=(u=O.clips.getClipAt(r.x+s.width,r.y,ne,!0))&&!u.hasMoved?u:null),
l&&u||(l=O.clips.getClipAt(r.x,r.y-s.height,ne,!0))&&!l.hasMoved&&(u=(u=O.clips.getClipAt(r.x,r.y+s.height,ne,!0))&&!u.hasMoved?u:null),
l&&u&&(this.hasMoved=!1)}},_.Piece.prototype.move=function(e,t,i){
var o=_.Puzzle.curr,a=i&&i.joining,s=i&&i.animate,l=i&&i.aniInterval,c=i&&i.aniCallback,u=i&&i.throttle
;!a&&o.state.gte(G)&&(e<Ge?e=Ge:e>n.width&&(e=n.width),t<0?t=0:t>n.height&&(t=n.height))
;var d=e-this.position.x,h=t-this.position.y,p=!(i&&void 0!==i.hasMoved&&!this.group)||i.hasMoved
;this.applyTask((function(e,t){
s?e.position.tween(e.position.x+d,e.position.y+h,l||100,t,O.EASE_OUT,u):e.position.moveBy(d,h),e.hasMoved=p}),c),
!_.Piece.firstPieceMoved&&o.state.gte(V)&&(_.Piece.firstPieceMoved=!0,r.log("first piece moved")),
o.state.eq(G)&&o.start()},_.Piece.prototype.rotateTo=function(e,t,n){var i=0
;if("number"!=typeof e)throw new Error("toAngle must be a number, not "+typeof e);switch(e-this.angle){case 90:case-270:
i=2;break;case 180:case-180:i=3;break;case 270:case-90:i=1}if(i){var o={type:"piecerotate",clockwise:i>=2,slow:t}
;3===i?(this.rotate(o),this.rotate(o,!0,n)):this.rotate(o,!1,n)}else n&&n()},_.Piece.prototype.rotate=(An=function(e){
var t,n,i,o,r=e.target,a=r.group?r.group.pivotPiece:r;a&&(t=e.radius,n=r._angle.renderedValue-e.angleDelta,
i=t*g.cosine(n),o=t*g.sine(n),r.position.assign(a.position.x-i,a.position.y-o))},function(e,t,n){
var i=_.Puzzle.curr,o="piecerotate"===e.type;if(p.log(this.name+" rotate attempt. puzzle.rotatable="+i.rotatable),
i.rotatable||o){var a,s=200
;if("piecerotate"===e.type)a=e.clockwise,s=e.slow?500:200;else if("keydown"===e.type)a=39===e.which;else if(void 0!==e.deltaY&&0!==e.deltaY)a=e.deltaY>0;else{
if("touchend"!==e.type&&"pointerup"!==e.type)return void r.warn("unexpected rotate message type: "+e.type);a=!0}
var l=O.perfNow(),c=null;if(this.group){
if(i.multiplayerGameId&&0===this.angle&&this.isInMainAssembly())return void(n&&(this.remoteData&&(this.remoteData.a=0),
n()))
;(c=this.isRotating()&&this.group?this.group.pivotPiece:this)||r.warn("detected rotating group with no pivot piece")}
var u=c||this;if(u.applyTask((function(e,n){return function(e,t,n,i,o,r,a){
var s=e.angle+(n?90:-90),l=new O.Tweener2("angle",s,i,a);if(l.onStep=An,l.startTime=o,l.origEvent=null,l.nextEvent=null,
l.radius=null,l.angleDelta=null,l.throttle=!r,e.group&&(e.group.pivotPiece=t),t){var c=_.Piece.gap;c.measure(e,t,!1,0),
l.angleDelta=Math.atan2(-c.y,c.x)/g.RADIANS_PER_DEGREE,l.radius=Math.sqrt(c.x*c.x+c.y*c.y)}return e.angle=l
}(e,c,a,s,l,t,n)}),(function(){u.position.assign(u.position),u.group&&u.moveToFit(u),
u.stateVar.val.neq(Y,X)&&b.check(u),n&&n()}))){
if(i.state.eq(G)&&i.start(),d.joinedToGameVar.val&&"piecerotate"!==e.type){var h=c||this
;h.stateVar.val.eq(F)?d.sendUpdate(h,{isPivot:!0}):d.sendEvent("rotate",h)}return!0}}return!1}),
_.Piece.prototype.raise=(Mn=function(e){e.moveToTop()},function(){this.applyTask(Mn)}),
_.Piece.prototype.matchLevelOf=function(e){this.applyTask((function(t){t.sendToLevelOf(e)}))},_.Group=function(e,t){
var n=t||e[0];if(this.refPiece=n,this.id=n.id,this.name="group-"+this.id+"-",this.members=[],
Array.isArray(arguments[0])){var i,o,a=arguments[0],s=_.Piece.checkConn;for(this.members.push(n),
this.edgeCount=n.isEdge?1:0,this.isEdge=n.isEdge,n.group=this,i=1,o=a.length;i<o;i++){e=a[i],this.members.push(e),
_.Piece.gap.measure(e,n),e.move(n.position.x-_.Piece.gap.x,n.position.y-_.Piece.gap.y,{joining:!0}),e.group=this,
e.hasMoved=!0,this.isEdge=this.isEdge||e.isEdge,e.isEdge&&this.edgeCount++;var l=e.neighbors,c=e.caterNeighbors
;s(e,l[be],de)&&s(l[be],e,pe),s(e,l[we],he)&&s(l[we],e,ge),s(e,l[xe],pe)&&s(l[xe],e,de),s(e,l[Pe],ge)&&s(l[Pe],e,he),
s(e,c[be],me)&&s(c[be],e,ve),s(e,c[we],fe)&&s(c[we],e,ye),s(e,c[xe],ve)&&s(c[xe],e,me),s(e,c[Pe],ye)&&s(c[Pe],e,fe)}
}else e.stateVar.val=t.stateVar.val,this.members.push(t,e),_.Piece.gap.measure(e,t),
e.move(t.position.x-_.Piece.gap.x,t.position.y-_.Piece.gap.y,{joining:!0}),t.moveToTop(),e.group=this,t.group=this,
this.edgeCount=(e.isEdge?1:0)+(t.isEdge?1:0),this.isEdge=!!this.edgeCount
;!_.Puzzle.firstPieceJoined&&_.Puzzle.curr.state.gte(V)&&(_.Puzzle.firstPieceJoined=!0,r.log("first piece joined")),
_.Puzzle.partiallyComplete=!0},_.Group.prototype={members:null,isEdge:!1,get length(){return this.members.length},
join:function(e,t){e.moveToFit(t),e.stateVar.val=t.stateVar.val,t.group&&e.group?(t.group.edgeCount+=e.group.edgeCount,
e.group.members.forEach((function(e){t.group.members.push(e),e.group=t.group,t.group.isEdge=t.group.isEdge||e.isEdge
}))):t.group?(t.group.members.push(e),e.group=t.group,t.group.isEdge=t.group.isEdge||e.isEdge,
e.isEdge&&t.group.edgeCount++):(e.remotePlayerName=t.remotePlayerName,e.group.members.push(t),t.group=e.group,
e.group.isEdge=e.group.isEdge||t.isEdge,t.isEdge&&e.group.edgeCount++)},sendToBottom:function(){
for(var e=this.members.length-1;e>=0;e--){var t=this.members[e];try{t.moveToBottom()}catch(e){
throw r.log("trap data: gid="+this.id+", glen="+this.length+", id="+t.id+", disposed="+t.isDisposed+", node="+t.node+", grp="+(t.group?t.group.id:-1)+", same="+(this===t.group)),
_.Puzzle.curr.pieces.audit(),e}}}},_.Puzzle.firstPieceJoined=!1,_.Puzzle.partiallyComplete=!1
;var Bn,Nn,Rn,Dn,Gn,Vn,Fn,Hn,qn,Wn,Un,Yn,Xn,Jn,Kn,Qn,Zn,$n,ei,ti,ni,ii,oi,ri,ai,si,li,ci,ui,di,hi,pi
;_.traditionalKnife=(Bn=12,Nn=function(){for(var e=[],t=[],n=11;n>=0;n--)e[n]={};for(e[0].fromBase=.0113636363636364,
e[0].alongBase=.0946969696969697,e[1].fromBase=-.0303030303030303,e[1].alongBase=.227272727272727,
e[2].fromBase=-.117424242424242,e[2].alongBase=.537878787878788,e[3].fromBase=.132575757575758,
e[3].alongBase=.382575757575758,e[4].fromBase=.34469696969697,e[4].alongBase=.284090909090909,
e[5].fromBase=.268939393939394,e[5].alongBase=.541666666666667,e[6].fromBase=.208333333333333,
e[6].alongBase=.681818181818182,e[7].fromBase=.0568181818181818,e[7].alongBase=.575757575757576,
e[8].fromBase=-.0795454545454545,e[8].alongBase=.515151515151515,e[9].fromBase=-.0189393939393939,
e[9].alongBase=.761363636363636,e[10].fromBase=.0113636363636364,e[10].alongBase=.90530303030303,e[11].fromBase=0,
e[11].alongBase=1,n=11;n>=0;n--)t[n]={};return t[0].fromBase=.0113636363636364,t[0].alongBase=-.0946969696969697,
t[1].fromBase=-.0189393939393939,t[1].alongBase=-.238636363636364,t[2].fromBase=-.0795454545454545,
t[2].alongBase=-.484848484848485,t[3].fromBase=.0568181818181818,t[3].alongBase=-.424242424242424,
t[4].fromBase=.208333333333333,t[4].alongBase=-.318181818181818,t[5].fromBase=.268939393939394,
t[5].alongBase=-.458333333333333,t[6].fromBase=.34469696969697,t[6].alongBase=-.715909090909091,
t[7].fromBase=.132575757575758,t[7].alongBase=-.617424242424242,t[8].fromBase=-.117424242424242,
t[8].alongBase=-.462121212121212,t[9].fromBase=-.0303030303030303,t[9].alongBase=-.772727272727273,
t[10].fromBase=.0113636363636364,t[10].alongBase=-.90530303030303,t[11].fromBase=0,t[11].alongBase=-1,{name:"sock",
pts:e,ptsReversed:t,tabHeights:[[],[],[],[]],holeHeights:[[],[],[],[]]}}(),Rn=function(){
for(var e=[],t=[],n=11;n>=0;n--)e[n]={};for(e[0].fromBase=0,e[0].alongBase=.0492424242424242,
e[1].fromBase=-.0227272727272727,e[1].alongBase=.159090909090909,e[2].fromBase=-.0681818181818182,
e[2].alongBase=.545454545454545,e[3].fromBase=.125,e[3].alongBase=.412878787878788,e[4].fromBase=.34469696969697,
e[4].alongBase=.253787878787879,e[5].fromBase=.272727272727273,e[5].alongBase=.473484848484849,
e[6].fromBase=.238636363636364,e[6].alongBase=.553030303030303,e[7].fromBase=.121212121212121,
e[7].alongBase=.549242424242424,e[8].fromBase=-.109848484848485,e[8].alongBase=.5,e[9].fromBase=-.0189393939393939,
e[9].alongBase=.761363636363636,e[10].fromBase=.0113636363636364,e[10].alongBase=.90530303030303,e[11].fromBase=0,
e[11].alongBase=1,n=11;n>=0;n--)t[n]={};return t[0].fromBase=.0113636363636364,t[0].alongBase=-.0946969696969697,
t[1].fromBase=-.0189393939393939,t[1].alongBase=-.238636363636364,t[2].fromBase=-.109848484848485,t[2].alongBase=-.5,
t[3].fromBase=.121212121212121,t[3].alongBase=-.450757575757576,t[4].fromBase=.238636363636364,
t[4].alongBase=-.446969696969697,t[5].fromBase=.272727272727273,t[5].alongBase=-.526515151515151,
t[6].fromBase=.34469696969697,t[6].alongBase=-.746212121212121,t[7].fromBase=.125,t[7].alongBase=-.587121212121212,
t[8].fromBase=-.0681818181818182,t[8].alongBase=-.454545454545455,t[9].fromBase=-.0227272727272727,
t[9].alongBase=-.840909090909091,t[10].fromBase=0,t[10].alongBase=-.950757575757576,t[11].fromBase=0,t[11].alongBase=-1,
{name:"finger",pts:e,ptsReversed:t,tabHeights:[[],[],[],[]],holeHeights:[[],[],[],[]]}}(),Dn=function(){
for(var e=[],t=[],n=11;n>=0;n--)e[n]={};for(e[0].fromBase=-.00378787878787879,e[0].alongBase=.0643939393939394,
e[1].fromBase=-.0265151515151515,e[1].alongBase=.162878787878788,e[2].fromBase=-.0984848484848485,
e[2].alongBase=.534090909090909,e[3].fromBase=.0568181818181818,e[3].alongBase=.431818181818182,
e[4].fromBase=.287878787878788,e[4].alongBase=.265151515151515,e[5].fromBase=.295454545454545,e[5].alongBase=.5,
e[6].fromBase=.287878787878788,e[6].alongBase=.715909090909091,e[7].fromBase=.0568181818181818,
e[7].alongBase=.575757575757576,e[8].fromBase=-.0795454545454545,e[8].alongBase=.515151515151515,
e[9].fromBase=-.0189393939393939,e[9].alongBase=.761363636363636,e[10].fromBase=.0113636363636364,
e[10].alongBase=.90530303030303,e[11].fromBase=0,e[11].alongBase=1,n=11;n>=0;n--)t[n]={}
;return t[0].fromBase=.0113636363636364,t[0].alongBase=-.0946969696969697,t[1].fromBase=-.0189393939393939,
t[1].alongBase=-.238636363636364,t[2].fromBase=-.0795454545454545,t[2].alongBase=-.484848484848485,
t[3].fromBase=.0568181818181818,t[3].alongBase=-.424242424242424,t[4].fromBase=.287878787878788,
t[4].alongBase=-.284090909090909,t[5].fromBase=.295454545454545,t[5].alongBase=-.5,t[6].fromBase=.287878787878788,
t[6].alongBase=-.734848484848485,t[7].fromBase=.0568181818181818,t[7].alongBase=-.568181818181818,
t[8].fromBase=-.0984848484848485,t[8].alongBase=-.465909090909091,t[9].fromBase=-.0265151515151515,
t[9].alongBase=-.837121212121212,t[10].fromBase=-.00378787878787879,t[10].alongBase=-.935606060606061,t[11].fromBase=0,
t[11].alongBase=-1,{name:"ball",pts:e,ptsReversed:t,tabHeights:[[],[],[],[]],holeHeights:[[],[],[],[]]}}(),
Gn=function(){for(var e=[],t=[],n=11;n>=0;n--)e[n]={};for(e[0].fromBase=.00757575757575758,
e[0].alongBase=.0946969696969697,e[1].fromBase=-.0492424242424242,e[1].alongBase=.21969696969697,
e[2].fromBase=-.117424242424242,e[2].alongBase=.397727272727101,e[3].fromBase=.0189393939393114,
e[3].alongBase=.378787878787097,e[4].fromBase=.234848484848119,e[4].alongBase=.363636363636116,
e[5].fromBase=.151515151515102,e[5].alongBase=.617424242424111,e[6].fromBase=.109848484848083,
e[6].alongBase=.708333333333032,e[7].fromBase=-.01515151515151,e[7].alongBase=.617424242424097,
e[8].fromBase=-.181818181818111,e[8].alongBase=.518939393939082,e[9].fromBase=-.0303030303030032,
e[9].alongBase=.837121212121097,e[10].fromBase=.0037878787878711,e[10].alongBase=.909090909090105,e[11].fromBase=0,
e[11].alongBase=1,n=11;n>=0;n--)t[n]={};return t[0].fromBase=.00378787878787108,t[0].alongBase=-.0909090909090111,
t[1].fromBase=-.0303030303030114,t[1].alongBase=-.162878787878097,t[2].fromBase=-.181818181818067,
t[2].alongBase=-.481060606060032,t[3].fromBase=-.015151515151505,t[3].alongBase=-.382575757575049,
t[4].fromBase=.109848484848048,t[4].alongBase=-.29166666666605,t[5].fromBase=.151515151515032,
t[5].alongBase=-.382575757575169,t[6].fromBase=.234848484848032,t[6].alongBase=-.636363636363116,
t[7].fromBase=.0189393939393104,t[7].alongBase=-.621212121212103,t[8].fromBase=-.117424242424105,
t[8].alongBase=-.602272727272114,t[9].fromBase=-.0492424242424121,t[9].alongBase=-.78030303030112,
t[10].fromBase=.00757575757575111,t[10].alongBase=-.90530303030067,t[11].fromBase=0,t[11].alongBase=-1,{name:"stub",
pts:e,ptsReversed:t,tabHeights:[[],[],[],[]],holeHeights:[[],[],[],[]]}}(),{buildMask:function(){
var t,n,i,o,a,s,c=document.createElement("canvas"),u=_.createContext(c),d=(_.Puzzle.curr,function(e){
if(e.border)u.lineTo(e.endX,e.endY);else{
var t,n,i,o,r,a,s,l,c=e.startX===e.endX,d=c?Math.abs(e.startY-e.endY):Math.abs(e.startX-e.endX),h=e.bend?e.curves.pts:e.curves.ptsReversed
;switch(e.side){case 0:s=e.tab?-1:1,l=e.bend?1:-1;break;case 1:s=e.tab?1:-1,l=e.bend?1:-1;break;case 2:s=e.tab?1:-1,
l=e.bend?-1:1;break;case 3:s=e.tab?-1:1,l=e.bend?-1:1}for(var p=0;p<Bn;)r=h[p++],a=h[p++],c?(t=e.startX+d*r.fromBase*s,
n=e.startY+d*r.alongBase*l,i=e.startX+d*a.fromBase*s,o=e.startY+d*a.alongBase*l):(t=e.startX+d*r.alongBase*l,
n=e.startY+d*r.fromBase*s,i=e.startX+d*a.alongBase*l,o=e.startY+d*a.fromBase*s),u.quadraticCurveTo(t,n,i,o)}
}),h=function(e,t,n){var i,o=e.core.width,r=e.core.height,a=e.edges;u.beginPath(),u.fillStyle=Le,u.moveTo(t,n),
(i=a.left).startX=t,i.startY=n,i.endX=t,i.endY=n+r,d(i),(i=a.bottom).startX=t,i.startY=n+r,i.endX=t+o,i.endY=n+r,d(i),
(i=a.right).startX=t+o,i.startY=n+r,i.endX=t+o,i.endY=n,d(i),(i=a.top).startX=t+o,i.startY=n,i.endX=t,i.endY=n,d(i),
u.fill()},p=(i={reset:function(){this.startX=0,this.startY=0,this.endX=0,this.endY=0,this.bend=!0,this.tab=!1,
this.side=0}},o=function(){var e,t=u.jigexGetImageData(0,0,c.width,c.height);if(t){e=t.data
;var o,a,s,l=Math.round(n/(i.tab?2:3)),d=4*c.width,h=c.width*c.height*4,p=h/2,g=0,m=!1;switch(i.side){case 0:o=l*d-4,
s=-4,m=!0;break;case 1:o=4*l,s=d;break;case 2:o=l*d,s=4,m=!0;break;case 3:o=h-4*l,s=-d}
for(var f=0;f<n&&0!==e[o];f++)g++,o+=s;for(a=o=m?o%d:o-o%d,f=0;f<n&&o!==p;f++)0===e[o]?o+=m?4*c.width:4:(g++,a=o=a+s,
f=0)
;i.tab?(i.border||0!==g||(r.warn("Warning: Zero curve height detected!  tab: st="+i.curves.name+", sd="+i.side+", sz="+n+", h="+g),
g=1),
i.curves.tabHeights[i.side][n]=g):(i.border||0!==g||(r.warn("Warning: Zero curve height detected!  hole: st="+i.curves.name+", sd="+i.side+", sz="+n+", h="+g+", img="+t.width+"x"+t.height),
g=1),i.curves.holeHeights[i.side][n]=g)}else r.error.once("failed to measure curve due to getImageData failure")},
a=function(e){for(var t=c.width,r=c.height,a=0;a<=3;a++)if(!e.tabHeights[a][n]){switch(i.reset(),a){case 0:i.startX=t,
i.startY=0,i.endX=t,i.endY=n;break;case 1:i.startX=0,i.startY=0,i.endX=n,i.endY=0;break;case 2:i.startX=0,i.startY=n,
i.endX=0,i.endY=0;break;case 3:i.startX=n,i.startY=r,i.endX=0,i.endY=r}u.fillStyle=Ie,u.fillRect(0,0,t,r),u.beginPath(),
u.fillStyle=Le,u.moveTo(i.startX,i.startY),i.side=a,i.curves=e,d(i),u.fill(),o(),u.fillStyle=Ie,u.fillRect(0,0,t,r),
u.beginPath(),u.fillStyle=Le,u.moveTo(i.startX,i.startY),i.tab=!0,d(i),u.fill(),o()}},s=function(){a(Dn),a(Rn),a(Nn),
a(Gn)},function(e){
var t=e[0].core.width,i=e[0].core.height,o=e[e.length-1].core.width,r=e[e.length-1].core.height,a=Math.max(Math.max(t,i),Math.max(o,r))
;c.width=a,c.height=a,u.fillStyle=Ie,u.fillRect(0,0,c.width,c.height),n=t,s(),i!==t&&(u.fillStyle=Ie,
u.fillRect(0,0,c.width,c.height),n=i,s()),o!==t&&o!==i&&(u.fillStyle=Ie,u.fillRect(0,0,c.width,c.height),n=o,s()),
r!==t&&r!==i&&r!==o&&(u.fillStyle=Ie,u.fillRect(0,0,c.width,c.height),n=r,s())}),g=function(e){var n;switch(n=Ee[t]){
case 0:e.curves=Dn,e.bend=!1;break;case 1:e.curves=Dn,e.bend=!0;break;case 2:e.curves=Rn,e.bend=!1;break;case 3:
e.curves=Rn,e.bend=!0;break;case 4:e.curves=Gn,e.bend=!1;break;case 5:e.curves=Gn,e.bend=!0;break;default:e.curves=Nn,
e.bend=n%2==1}++t>=37&&(t=0)};return function(n,i,o){var a=_.Puzzle.curr,s=a.tabHoleRightIndex,d=a.tabHoleBottomIndex
;t=a.shapeIndex,p(n);var m,f,v,y=n[0].image.bounds.margin,b=0,w=0,x=0,P=y,E=0,k=0,S=new Array(i),C=new Array(i),T=0,z=0
;-1===a.tabIndexRight?a.tabIndexRight=s:s=a.tabIndexRight,-1===a.tabIndexBottom?a.tabIndexBottom=d:d=a.tabIndexBottom
;for(var I=i-1;I>=0;I--)S[I]=0;for(f=0;f<i;f++){for(v=0;v<o;v++){
var L=(m=n[b]).edges.top,O=m.edges.left,A=m.edges.right,M=m.edges.bottom,j=m.core.width,B=m.core.height;if(L.side=3,
O.side=0,M.side=1,A.side=2,L.border=0===f,O.border=0===v,M.border=f===i-1,A.border=v===o-1,
"Q29weXJpZ2h0IMKpIDIwMTIgQ2Fyb2xpbmEgUm9hZCBTb2Z0d2FyZSwgTC5MLkMu".length>16&&(g(A),g(M)),L.border)A.tab=_e[s++],
L.thickness=0,s===_e.length&&(s=0);else{var N=n[b-o];A.tab=!N.edges.right.tab,L.tab=!N.edges.bottom.tab,
L.bend=!N.edges.bottom.bend,
L.curves=N.edges.bottom.curves,L.tab?L.thickness=L.curves.tabHeights[3][j]:L.thickness=L.curves.holeHeights[3][j]}
if(L.thickness>E&&(E=L.thickness),
A.border?A.thickness=0:A.thickness=A.tab?A.curves.tabHeights[2][B]:A.curves.holeHeights[2][B],O.border)M.tab=_e[d++],
O.thickness=0,d===_e.length&&(d=0);else{var R=n[b-1];M.tab=!R.edges.bottom.tab,O.tab=!R.edges.right.tab,
O.bend=!R.edges.right.bend,
O.curves=R.edges.right.curves,O.tab?O.thickness=O.curves.tabHeights[0][B]:O.thickness=O.curves.holeHeights[0][B]}
M.border?M.thickness=0:M.thickness=M.tab?M.curves.tabHeights[1][j]:M.curves.holeHeights[1][j],
M.thickness>k&&(k=M.thickness),m.width=O.thickness+j+A.thickness+2*y,m.height=L.thickness+B+M.thickness+2*y,T+=m.width,
z+=m.height,
m.core.x=O.thickness+y,m.core.y=L.thickness+y,m.touchRect=m.core,m.edges.top.thickness>S[f]&&(S[f]=m.edges.top.thickness),
w+=m.width,b++}x=Math.max(w,x),C[f]=Math.floor(E/2)+m.core.height+k+2*y,P+=C[f],w=0,E=0,k=0}
a.avgPieceWidth=Math.round(T/n.length),
a.avgPieceHeight=Math.round(z/n.length),.05*a.avgPieceWidth*l>a.snapDistance?a.snapDistance=Math.round(.05*a.avgPieceWidth*l):.5*a.avgPieceWidth*l<a.snapDistance&&(a.snapDistance=Math.max(2,Math.round(.5*a.avgPieceWidth*l))),
c.width=x,c.height=P,u.fillStyle=Ie,u.fillRect(0,0,c.width,c.height),b=0;var D=0,G=0,V=0,F=y;for(f=0;f<i;f++){
for(1===f&&(F+=Math.floor(S[f]/2)+y),v=0;v<o;v++)V+=(m=n[b]).edges.left.thickness+y,h(m,V,F),
m.image.bounds.x=D-m.edges.left.thickness,m.image.bounds.y=G-m.edges.top.thickness,m.image.bounds.width=m.width,
m.image.bounds.height=m.height,m.image.bounds.centerX=m.image.bounds.x+m.width/2,
m.image.bounds.centerY=m.image.bounds.y+m.height/2,m.image.bounds.maskX=V-m.edges.left.thickness-y,
m.image.bounds.maskY=F-m.edges.top.thickness-y,m.refPos.x=m.image.bounds.x+m.width/2,
m.refPos.y=m.image.bounds.y+m.height/2,m.slope={},m.slope.x=V,m.slope.y=F,m.slope.x2=V+m.core.width,
m.slope.y2=F+m.core.height,m.slope.val=-m.core.height/m.core.width,V+=m.core.width+m.edges.right.thickness+y,
D+=m.core.width,b++;V=0,F+=C[f],D=0,G+=m.core.height}var H,q=0,W=0,U=0,Y=u.jigexGetImageData(0,0,c.width,c.height)
;if(Y&&(H=u.jigexGetImageData(0,0,c.width,c.height)),Y&&H){var X,J,K,Q=Y.data,Z=H.data,$=4*Y.width,ee=0
;switch(Y.name=Te,H&&(H.name=ze),m.shadowDepth){case 2:X=100,J=50;break;case 3:X=99,J=33;break;case 4:X=100,J=25;break
;case 5:X=100,J=20;break;default:X=102,J=17}var te=function(e,t,n,i,o,r,a){
for(var s,l,c,u,d,h,p=n.slope,g=e,m=0,f=Math.floor(g/$),v=g-f*$>>2;m++<t;){if(s=Q[g],0===i){
if(v>p.x2&&f<p.y)Q[g+1]=me;else if(v>p.x2&&f>p.y2)Q[g+1]=fe;else if(v<p.x&&f>p.y2)Q[g+1]=ve;else if(v<p.x&&f<p.y)Q[g+1]=ye;else if(v<=p.x)Q[g+1]=ge;else if(f<p.y)Q[g+1]=de;else{
var y=(f-p.y2)/(v-p.x),b=(f-p.y)/(v-p.x);y<=p.val?Q[g+1]=b<=-p.val?de:ge:Q[g+1]=b<=-p.val?he:pe}v++,f++}if(u=0,
s&&255===s)q?q++:(q=1,U=0),W++;else if(s){if(W++,U=0,q){var w=0===Q[g+o];u=Math.round(X*(w?1:.5)*(255-s)/255),ee=u}
}else if(U?U++:(U=1,W=0,q=0),U<=n.shadowDepth){
for(u=X-J*ee/255,c=1;c<=n.shadowDepth;c++)0===(l=Q[g-c*o])?u-=J:l<255&&(u-=Math.round(J*(255-l)/255));u=Math.round(u),
ee=0}if(W>0){if(d=0,W<=n.bevelDepth+1){
for(d=36,K=36/n.bevelDepth,c=1;c<=n.bevelDepth;c++)255===(l=Q[g-c*o])?d-=K:l>0&&(d-=Math.round(K*l/255))
;d=Math.max(0,Math.round(d))}
for(h=60,K=60/n.bevelDepth,c=1;c<=n.bevelDepth+1;c++)255===(l=Q[g+c*o])?h-=K:l>0&&(h-=Math.round(K*l/255))
;u=u+(h=Math.max(0,Math.round(h)))>=d?Math.min(128,u+h):Math.max(129,255-d)}r[g+a]=u>0?u:0,g+=o}}
;n.forEach((function(e){
for(var t,n,i,o,r,a,s,l,c,u=e.image.bounds,d=e.width>e.height,h=$*u.maskY+4*u.maskX,p=d?e.height:e.width,g=0;g<=270;g+=90){
var m=!1,f=1,v=!1;switch(g){case 0:i=h+4*(e.width-1),n=(o=h)+(d?0:(e.height-e.width)*$),r=-4,a=$,s=$+4,l=Q,c=2;break
;case 90:i=h,n=(o=h+(e.height-1)*$)+(d?4*(e.width-e.height):0),r=$,a=4,s=4-$,l=Z,c=0;break;case 180:i=h+(e.height-1)*$,
n=(o=h+(e.height-1)*$+4*(e.width-1))-(d?0:(e.height-e.width)*$),r=4,a=-$,s=-$-4,l=Z,c=1;break;case 270:
i=h+(e.height-1)*$+4*(e.width-1),n=(o=h+4*(e.width-1))-(d?4*(e.width-e.height):0),r=-$,a=-4,s=$-4,l=Z,c=2}for(b=i,
t=i;f>0;)te(b,f,e,g,s,l,c),m?t+=a:b===o?(t+=a,m=!0):t+=r,v?f--:f<p?f++:b===n&&(v=!0),b=t}e.image.mask=Y,e.image.mask2=H
})),e.testImage&&new _.Piece({layer:ne,image:{data:e.testImage}})}else r.error("getImageData failure during mask setup")
}}()}),_.knife={style:_.traditionalKnife,cutChoices:(Hn=[],function(e){var t,n,i=e.subject,o=e.minNop,a=e.defNop
;if(!i)return null;if(i.width===Vn&&i.height===Fn){for(t=Hn.length-1;t>=0;t--)if((n=Hn[t]).selected){e.selectedNop=n
;break}if(e.selectedNop)return Hn}var s,l,c=0,d=0,h=0,p=i.width,g=i.height,m=Math.floor(p>g?p/3:g/3),f=!1
;for(u.numPiecesMenu.resetFlag=!0,Hn=[],Vn=i.width,Fn=i.height;h<1e3&&m>10;){
if((h=(c=Math.floor(g/m))*(d=Math.floor(p/m)))>=6&&h>=o){var v=!f&&h>=a;Hn.push({nop:h,rows:c,cols:d,size:m,selected:v
}),v&&(f=!0,e.selectedNop=Hn[Hn.length-1])}s=Math.floor(g/(c+1)),l=Math.floor(p/(d+1)),m=Math.max(s,l)}
if(!f)for(t=Hn.length-1;t>=0;t--)if(n=Hn[t],0===t||n.size>=36||h<=o){n.selected=!0,e.selectedNop=n;break}
return e.selectedNop?(e.selectedNop.rows||r.error("bad nop object"),
Hn):(r.error("null nop object: nop="+h+", size="+m+", choices.len="+Hn.length+", choice="+!!n+", minNop="+o+", subw="+p+", subh="+g),
null)}),cut:function(t,i){var o=_.Puzzle.curr,a=o.record||null,s=1553800500976
;a&&a.num!==a.pcs.length&&(a.pcs.length||a.date.strt!==a.date.mod)&&(a.date.mod>s&&r.warn("Corrupt record encountered"),
u.msgbox("Corrupt record encountered for saved puzzle. Puzzle progress cannot be restored."),o.record=a=null)
;var c,d,h=a?a.shp.rw*a.shp.cl:i.rows*i.cols,p=i.rows,m=i.cols,f=i.size;if(o.pieces.dispose(),
r.log("cnvs.w="+n.width+", cnvs.h="+n.height+", sbjct.w="+t.width+", sbjct.h="+t.height+", numPcs="+h),
r.log("nop.rows="+i.rows+", nop.cols="+i.cols+", nop.nop="+i.nop+", nop.size="+i.size),
a&&(r.log("rec.rows=%d, rec.cols=%d, rec.num=%d, rec.pcs.len=%d, rec.upd=%s, oldRec=%s",a.shp.rw,a.shp.cl,a.num,a.pcs.length,new Date(a.date.mod).toDateString(),a.date.mod<s),
a.num!==a.pcs.length&&a.date.mod>s&&(x.setAuxData("Bad Record",a,!0),r.warn("Corrupt record encountered"))),
f<30?(o.lightingLevel=0,c=2,d=1):f<40?(o.lightingLevel=1,c=3,d=2):f<50?(o.lightingLevel=2,c=4,
d=2):f<60?(o.lightingLevel=3,c=4,d=2):f<100?(o.lightingLevel=4,c=5,d=2):(o.lightingLevel=5,c=6,d=3),
l>1)switch(c=Math.min(6,Math.round(l*c))){case 2:d=1;break;case 3:case 4:case 5:d=2;break;default:d=3}if(!o.shader)try{
!function(e,t){e&&e.shader&&e.shader.dispose()
;var n="precision mediump float;uniform sampler2D u_image;uniform sampler2D u_mask;uniform vec2 u_texPixelDim1;varying vec2 v_texCoord0;varying vec2 v_texCoord1;varying vec2 v_rot;varying float v_state;varying float v_opacity;"
;switch(n+="uniform sampler2D u_mask2;",
n+="float rnd(float val) {;    return (fract(val) >= 0.5) ? ceil(val) : floor(val);}void main() {vec4 sPixel = texture2D(u_image, v_texCoord0);vec4 mPixel = texture2D(u_mask, v_texCoord1);",
n+="vec4 m2Pixel = texture2D(u_mask2, v_texCoord1);float rawShad = (v_rot.s > 0.707) ? m2Pixel.r :    ((v_rot.t < -0.707) ? m2Pixel.g :    ((v_rot.s < -0.707) ? m2Pixel.b :    mPixel.b));",
n+="const vec3 black = vec3(0.0, 0.0, 0.0);vec4 pend1, pend2;float state = rnd(v_state);bool sel = (mod(state, 256.0) > 0.0);float edge = rnd(mPixel.g * 255.0);float connEds = mod(state / 256.0, 256.0);bool conn = (mod(floor(connEds / edge), 2.0) > 0.0);float alpha = mPixel.r;bool isVis = (alpha > 0.0);bool isLightBev = (rawShad > 0.5020);float lightShad = isLightBev ? ((1.0 - rawShad) * (conn ? 0.5 : 1.0)) : 0.0;float darkShad = isLightBev ? 0.0 : (isVis ? (rawShad * (conn ? 0.5 : 1.0)) : 0.0);float shadow = isVis ? 0.0 : (1.0 - (rawShad * (sel ? 1.0 : 0.75)));float shad = isLightBev ? lightShad : (isVis ? -darkShad : shadow);pend1.a = (isLightBev || (alpha > 0.60) || (darkShad == 0.0) || conn) ? alpha : 0.60;pend1.a = pend1.a * v_opacity;pend1.rgb = clamp(sPixel.rgb + shad, 0.0, 1.0) * pend1.a;",
t){case 2:
n+="shad = sel ? rawShad : max(0.0, rawShad - (0.0980 - (0.0039 * (1.0 - smoothstep(0.1961, 0.3922, rawShad)))));";break
;case 3:
n+="shad = sel ? rawShad : max(0.0, rawShad - (0.0971 - (0.0078 * (1.0 - smoothstep(0.1294, 0.3882, rawShad)))));";break
;case 4:
n+="shad = sel ? rawShad : max(0.0, rawShad - (0.0980 - (0.0118 * (1.0 - smoothstep(0.0980, 0.3922, rawShad)))));";break
;case 5:
n+="shad = sel ? rawShad : max(0.0, rawShad - (0.0980 - (0.0157 * (1.0 - smoothstep(0.0784, 0.3922, rawShad)))));";break
;default:
n+="shad = sel ? rawShad : max(0.0, rawShad - (0.1000 - (0.0196 * (1.0 - smoothstep(0.0667, 0.4000, rawShad)))));"}
n+="pend2.rgb = black;pend2.a = conn ? 0.0 : shad * v_opacity;gl_FragColor = (alpha == 0.0) ? pend2 : pend1;}"
;var i=new O.Shader("pieceShader",n);e&&(e.shader=i)}(o,c)}catch(e){return A=!1,O.error="shaders",j(),!1}
for(var v,y,b,w,P=[],E=1,k=t.width%f,S=t.height%f,C=Math.floor(k/m),T=Math.floor(S/p),z=k%m,I=S%p,L=g.getRandomGenerator(o.getSeed()),M=0;M<p;M++){
for(var B=0;B<m;B++)y=f,b=f,k>0&&(k-=C,y+=C,z>0&&(y++,z--)),S>0&&(b+=T,I>0&&b++),(v={name:"piece-"+(w=E++)+"-",id:w,
layer:ne,image:{data:t.image,bounds:{margin:7}},position:{x:0,y:0},core:{x:0,y:0,width:0,height:0},refPos:{},
shadowDepth:0,shader:null,sortOrder:L(),angle:0,onMove:e.onPieceMove}).core.width=y,v.core.height=b,v.shadowDepth=c,
v.bevelDepth=d,v.shader=o.shader,v.edges={top:{},left:{},right:{},bottom:{}},P.push(v);z=(k=t.width%f)%m,S-=T,I--}
if(this.style.buildMask(P,p,m),!e.testImage){o.primer=new O.Clip({name:"primer-piece",layer:te,width:1,height:1,image:{
data:t.image,mask:P[0].image.mask,mask2:P[0].image.mask2,bounds:{x:0,y:0,width:1,height:1}},position:{x:0,y:0},
shader:o.shader});for(var N=0,R=P.length;N<R;N++)new _.Piece(P[N]);for(N=0,R=P.length;N<R;N++){
var D=P[N].edges,G=P[N].piece,V=G.neighbors,F=G.caterNeighbors;V[Pe]=D.left.border?null:P[N-1].piece,
V[we]=D.right.border?null:P[N+1].piece,V[be]=D.top.border?null:P[N-m].piece,V[xe]=D.bottom.border?null:P[N+m].piece,
F[Pe]=D.left.border||D.top.border?null:P[N-m-1].piece,F[we]=D.right.border||D.bottom.border?null:P[N+m+1].piece,
F[be]=D.top.border||D.right.border?null:P[N-m+1].piece,F[xe]=D.bottom.border||D.left.border?null:P[N+m-1].piece,
G.isEdge=D.left.border||D.right.border||D.top.border||D.bottom.border}o.pieces.specList=P,
o.multiplayerGameId||o.scatter()}return!0}},_.clock=(qn=0,Wn=0,Un=0,Yn={set:function(e){qn||(u.setClock(e),Un=e,
Wn=1e3*e)},pause:function(){var e=_.Puzzle.curr;if(e&&(qn||e.multiplayerGameId)){
var t="This "+e.pieces.length+" piece jigsaw puzzle is "+e.percentComplete()+"% complete.";if(e.multiplayerGameId){
if(e.isComplete)t="This "+e.pieces.length+" piece jigsaw puzzle was completed on "+d.timer.stopDateString();else if(d.joinedToGameVar.val){
var n=g.secureString(d.gameInfo.scode),i=n?"https://jigex.com/"+n:"(not available)"
;t+="<br/><br/>Players currently present in this game:<br/>&nbsp;&nbsp;&nbsp;&nbsp;"+d.getPlayerNames().join("<br/>&nbsp;&nbsp;&nbsp;&nbsp;")+"<br/><br/>Game link: &nbsp;"+i+'<br/><br/><br/><span style="color: #aaa">(Multiplayer games may not be paused)</span>'
}else t+="<br/><br/>You are not currently connected to this multiplayer game";u.msgbox(t)}else this.stop(),u.pause(t)}},
resume:function(){var e=_.Puzzle.curr;!qn&&(e&&!e.isComplete||d.getNumPlayers()>1)&&(qn=Date.now())},stop:function(){
qn&&(Wn+=Date.now()-qn,qn=0)},getElapsedSecs:function(){var e=qn?Date.now()-qn:0;return Math.round((Wn+e)/1e3)},
getElapsedMins:function(){return Math.round(this.getElapsedSecs()/60)},onClick:function(){Yn.pause()},onTick:function(){
var e=_.Puzzle.curr,t=e&&e.multiplayerGameId?d.timer.getElapsedSecs():Yn.getElapsedSecs();t!==Un&&(u.setClock(t),Un=t)},
info:function(){return"elapsed="+this.getElapsedSecs()+", running="+!!qn}},Xn=function(){Yn.stop(),
Yn.set(d.timer.getElapsedSecs()),d.timer.conditionalStart()},d.joinedToGameVar.addListener((function(e){e&&Xn()})),
d.timer.onRunningChange=function(e){e?(Xn(),Yn.resume()):Yn.stop()},t.onInitComplete((function(){
m.getBtn("jigex-clock").onclick=Yn.onClick,
O.createTask(Yn.onTick,200,!0),e.skunkOptions=JSON.parse(g.localStore.getItem("jigex-options")||"{}")})),Yn),
_.puzzleRecord=function(){var t,i=function(){var t=_.Puzzle.curr;return{
info:"Jigsaw Explorer - Saved Jigsaw Puzzle File",home:e.homeDomain,ver:8,progv:c.progVersion,id:g.genGuuid(Re),
pid:t.name,nam:null,cred:_.Puzzle.urlParms.cred,credu:_.Puzzle.urlParms.credu,date:{strt:Date.now(),mod:Date.now()},
thm:h.val.ordinal,num:t.pieces.length,rot:t.rotatable,cmplt:t.isComplete,tmr:0,edo:0,cmpt:t.compactMode,seed:0,aseed:0,
asp:0,hnts:0,pau:0,shp:{sty:1,rw:t.pieces.numRows,cl:t.pieces.numCols,ri:t.tabIndexRight,bi:t.tabIndexBottom,
si:t.shapeIndex},bt:{v:0,x:.5,y:.5,p:0},pcs:[],chksm:0}},o=null,a=function(){var e=function(e){e.save()}
;return function(t){
_.recordsManager.cache(this),t?(o&&(o.cancel(),o=null),this.save()):o?o.when=Date.now()+500:(o=O.createTask(e,500)).data=this
}}(),s=(t=0,function(){var e,i,a=_.Puzzle.curr,s=[],l=a.pieces.tail,c=0;for(a.auditPieces(),
this.gid=a.multiplayerGameId,this.date.mod=Date.now(),this.thm=h.val.ordinal,this.tmr=_.clock.getElapsedSecs(),
this.rot=a.rotatable,this.edo=a.showEdgesOnly(),this.num=a.pieces.length,this.cmplt=a.isComplete,this.seed=a.getSeed(),
this.aseed=a.getAngleSeed(),this.cmpt=a.compactMode,this.asp=(n.width/n.height).toFixed(2),this.hnts=0,this.pau=0,
this.bt.v=_.boxTop.isPresent?1:0,this.bt.x=_.boxTop.posX,this.bt.y=_.boxTop.posY,this.bt.p=0,
this.shp.ri=a.tabIndexRight,this.shp.bi=a.tabIndexBottom,this.shp.si=a.shapeIndex,this.shp.rw=a.pieces.numRows,
this.shp.cl=a.pieces.numCols;l;)(e=(i=l.item).recTuple).id=i.id,e.x=i.position.normX.toFixed(5),
e.y=i.position.normY.toFixed(5),e.a=i.angle,e.m=i.hasMoved?1:0,e.g=i.group?i.group.id:0,s.push(e),l=l.prev,i.group||c++
;s.length===this.num?(this.pcs=s,-1!==this.chksm&&(this.chksm=function(e,t){var n=_.Puzzle.curr.pieces.length,i=37
;return i+=n*n,i+=e*e,i+=t,i*=37,n<50&&(i*=37),i
}(c,this.tmr)),this.num&&this.shp.rw*this.shp.cl===this.num?(_.recordsManager.store(this),
t=0):3==++t?r.fault(new Error("Attempted to save bad record. rows="+this.shp.rw+", cols="+this.shp.cl+", num="+this.num)):r.error("Attempted to save bad record. rows="+this.shp.rw+", cols="+this.shp.cl+", num="+this.num),
o=null):r.error(new Error("Wrong number of tuples recorded. len="+s.length+", num="+this.num+", rws="+this.shp.rw+", cls="+this.shp.cl))
}),l=function(e){for(var t=this.pcs,n=t.length-1;n>=0;n--){var i=t[n];if(i.id===e)return i}return null},u=function(){
o&&(o.cancel(),o=null)},d=function(){_.recordsManager.delete(this.id),this.dispose()};return function(e,t){
return e?(e.ver<=6?e=function(e){var t,n,o,r,a=i(),s=a.pcs,l=e.puzzle,c=l.spec,u=1;for(var d in a.nam=e.nam,
a.pid=c.nam?c.nam:c.id,a.cred=l.cred,a.credu=l.credu,a.thm=c.thm,a.num=c.num,a.rot=c.rot,a.tmr=c.tmr,a.edo=c.edo,
a.hnts=0,a.pau=0,a.shp.sty=l.shp.sty,a.shp.rw=l.shp.rw,a.shp.cl=l.shp.cl,a.bt.v=l.bt.v,a.bt.x=l.bt.x,a.bt.p=l.bt.p,
a.chksm=l.spec.chksm,l.pcs)if(l.pcs.hasOwnProperty(d))if(n=l.pcs[d],d.includes("sgl"))t={id:n.i,x:n.x,y:n.y,a:n.a,m:n.m,
z:n.z,g:0},s.push(t);else if(d.includes("grp")){for(var h in r=!0,n)n.hasOwnProperty(h)&&(o=n[h],h.includes("sgl")&&(t={
id:o.i,x:n.x,y:n.y,a:n.a,m:1,p:n.p,z:n.z,g:u},r&&(r=!1,t.first=1),s.push(t)));u++}return s.sort((function(e,t){
return e.z===t.z?e.first?1:t.first?-1:0:e.z<t.z?1:-1})),_.recordsManager.store(a),a}(e):t&&_.recordsManager.store(e),
function(e){var t=e.chksm,n=0,i=e.pcs;if(0===t)return r.log("zero rec checksum"),!1
;for(var o=i.length-1;o>=0;o--)i[o].g||n++;return e.num<50&&(t/=37),t/=37,t-=e.tmr,t-=n*n,
37!=(t-=e.num*e.num)&&r.log("record checksum failure: id=%s, mod=%s",e.id,new Date(e.date.mod).toString()),37===t
}(e)||(e.chksm=-1)):e=i(),e.update=a,e.findTuple=l,e.save=s,e.dispose=u,e.purge=d,e}}(),_.recordsManager=function(){
var e,t,n,i,o=g.localStore,a={},s=[],l={},c=!1,d=null,h=function(e){
return e&&(0===e.indexOf(Re)||0===e.indexOf("rec-")&&e.length>=17&&"1"===e[4]&&"-"===e[15])},p=function(){var e=null
;for(var t in a)h(t)&&(n=a[t],(!e||n.date.mod<e.date.mod)&&(e=n));return e},m=0;for(e=o.length-1;e>=0;e--)if(t=o.key(e),
h(t)){try{n=_.puzzleRecord(JSON.parse(o.getItem(t)))}catch(e){r.log("corrupt record encountered. id="+t),n=null}
n&&0!==n.num?(n.id=t,a[t]=n,m++):s.push(t)}var f={};e:for(var v in a)if(h(v)){for(var y in n=a[v],
a)if(v!==y&&h(y)&&(i=a[y],n.pid===i.pid&&n.date.mod<i.date.mod)){s.push(v),m--;continue e}n.cmplt?(m--,
s.push(v)):f[v]=a[v]}for(a=f;m>10;)t=p().id,delete a[t],s.push(t),m--;return r.log("number of saved records: "+m),
s.forEach((function(e){o.removeItem(e)})),l.youngest=function(){var e=d;if(e)return e;var t=null
;for(var n in a)h(n)&&(e=a[n],(!t||e.date.mod>t.date.mod)&&(t=e));return t},l.cache=function(e){d=e},l.find=function(e){
if((n=d)&&(e===n.nam||e===n.pid)&&n.num)return n;var t=null
;for(var i in a)h(i)&&(e!==(n=a[i]).nam&&e!==n.pid||!n.num||(!t||n.date.mod>t.date.mod)&&(t=n));return t},
l.store=function(e){try{g.localStore.setItem(e.id,JSON.stringify(e)),a[e.id]=e}catch(e){if(!c){
var t="Warning: Progress on this puzzle may not be saved by the program due to "+(e.message&&e.message.includes("QuotaExceededError")?"lack of storage ":"a storage error ")+"in the browser."
;c=!0,setTimeout(u.msgbox.bind(null,t,null,null,!0),100),r.warn("failed to store record.",e)}}},l.delete=function(e){
a.hasOwnProperty(e)&&(delete a[e],g.localStore.removeItem(e))},l}(),_.Credits=(Jn=function(t,n){
var i=_.Puzzle.curr,o="",r=n?"color:white;":"color:blue;",a=n?"color:LightGray;":"color:GrayText;",s=t?n?t.excerpt:t.desc:"",l=t?t.photo:null,c=l?l.license:null,u=c&&"SSTOCK"===c
;if(t&&_.Puzzle.urlParms.url){if(t.cred){if(o=g.secureString(t.cred),t.credu){var d=t.credu
;0!==d.indexOf("http")&&(d="http://"+d),o='<a href="'+d+'" target="_blank" style="'+r+'" rel="nofollow">'+o+"</a>"}
}else n||(o="No credits are available for this puzzle subject.")
;o="<p style=\"font-family: 'Roboto', sans-serif; font-size: 16px; text-align: center\">"+o+"</p>"}else if(t){
var h=l.photographer;if(!n){var p,m,f=s.indexOf("<a href=");-1!==f&&(m=s.indexOf(">",f+10),
(-1===(p=s.indexOf("target=",f+10))||p>m)&&(s=s.substr(0,m)+' target="_blank"'+s.substr(m)))}
if(o='<p class="jigex-credit'+(n?' jigex-credit-short">':'">')+'<span class="jigex-credit">'+s+"</span>",h&&!u){
var v=h.name;if(h.profile&&(v='<a href="'+h.profile+'" target="_blank" style="'+r+'">'+h.name+"</a>"),
o+="<br/><br/>Photographer: "+v,h.gallery){var y=h.gallery.includes("flickr.com")?"photo gallery":"website"
;o+='<br/><a href="'+h.gallery+'" target="_blank" style="'+r+'">Visit '+h.name+"'s "+y+"</a>"}}
if(u)o+=(n?"<br/><br/>":"<br/><br/><br/>")+'<span style="'+a+'">Image credit: '+(h&&h.name?h.name+"/":"")+"Shutterstock.com</span>";else if(l.source&&(o+='<br/><a href="'+l.source+'" target="_blank" style="'+r+'">Source photo</a>',
c)){var b
;if("PD"===c)b='<a href="http://en.wikipedia.org/wiki/Public_domain" target="_blank" style="'+r+'">All rights granted</a>';else if(c.includes("CC")){
var x;switch(c){case"CCA":x="http://creativecommons.org/licenses/by/2.0/";break;case"CCASA":
x="http://creativecommons.org/licenses/by-sa/2.0/";break;case"CCAND":x="http://creativecommons.org/licenses/by-nd/2.0/"
;break;case"CCANC":x="http://creativecommons.org/licenses/by-nc/2.0/";break;case"CCANCSA":
x="http://creativecommons.org/licenses/by-nc-sa/2.0/";break;case"CCANCND":
x="http://creativecommons.org/licenses/by-nc-nd/2.0/"}
b='<a href="'+x+'" target="_blank" style="'+r+'">Some rights reserved</a>'
}else b='<a href="http://www.copyright.gov/" target="_blank" style="'+r+'">Copyright &copy; All rights reserved</a>'
;o+=" &nbsp;&#8212;&nbsp; "+b}
w||(o+='<br/><br/><a href="https://www.facebook.com/sharer/sharer.php?u='+e.homeDomain+"puzzles/"+_.Puzzle.urlParms.puzzleId+(i.mysteryProfile?"":"-jigsaw-puzzle")+'" style="'+r+'" target="_blank">Share this puzzle on Facebook!</a></p>')
}return o},function(e){this.shortCredits=Jn(e,!0),this.longCredits=Jn(e,!1)}),_.Credits.prototype.show=function(){
this.shortCredits&&u.toast.show(this.shortCredits)},_.delayedActions.add((function(){
var e=document.getElementById("jigex-credits-content");m.getBtn("jigex-credits-tab").onclick=function(){
var t=_.Puzzle.curr;if(t){var n=t.credits
;n&&n.longCredits?n.longCredits.includes("No credits are available for this puzzle")||!t.mysteryProfile&&!t.customMystery||t.isComplete?e.innerHTML=n.longCredits:e.innerHTML='<p style="text-align: center">The credits for this puzzle are not available until the puzzle is completed.</p><br/>':e.innerHTML='<p style="text-align: center">No credits are available for this puzzle.</p><br/>'
}else e.innerHTML='<p style="text-align: center">An error has occurred. Please reload this puzzle.</p><br/>'}})),
_.applause=function(){var i,o,r=null,a=null,s=[],l=null,c=0,u=!1,d=function(){var e=5*Math.round(.05*n.height+60)
;if((a=r.response).height>e){var t=Math.round(a.width*e/a.height);a.width=t+(3-t%3),a.height=e+(5-e%5)}new O.Clip({
name:"texture-holder",layer:ie,image:{data:a}}).active=!1};_.delayedActions.add((function(){
(r=new g.WebReq(e.imagesPath+"applause-2.png",e.altImagesPath?e.altImagesPath+"applause-2.png":null)).onload=d,r.send(),
l||(l=new t.Sonic("applause"))}));var h=function(e){
"keydown"!==e.type&&"mousedown"!==e.type&&"pointerdown"!==e.type&&"touchstart"!==e.type||u||(u=!0,m(),l&&l.fadeOut())
},p=function(){if(++o===s.length){for(var e=_.Puzzle.curr;s.length;)s.pop().dispose();_.onEscape.remove(h),
n.removeEventListener("mousedown",h),n.removeEventListener("pointerdown",h),n.removeEventListener("touchstart",h),c=0,
e&&e.credits&&e.credits.show()}},m=function(){if(2===c){o=0,c=3;for(var e=s.length-1;e>=0;e--){
var t=s[e],i=1===t.crowdRow?0:2===t.crowdRow?300:600
;t.position.tween(t.position.x,n.height+t.height/2,2e3-i,p,O.EASE_NONE)}}},f=function(){++i===s.length&&(c=2,u&&m())
},v=function(e){e.clip.position.tween(e.toX,e.toY,1e3,f,O.EASE_OUT_SLOW)},y=function(){s.length||function(){
for(var e,t=a.width/3,i=a.height/5,o=t/2-30,r=n.height+i/2,l=n.width+t/2,c=1,u=0,d=0;;)if((e=new O.Clip({layer:ie,
name:"applause",image:{data:a,animation:{frameCount:15,frameRows:5,fps:12.5,startFrame:u}}})).id=d++,
e.position.assign(o,r),e.crowdRow=c,s.push(e),u=10===u?0:u+5,(o+=t-30+(3===c?30:0))>=l){if(o=t/2-30-216*c,r+=8,
!(c<3))break;c++}}();for(var e=0;e<s.length;e++){var t=s[e],o=t.crowdRow,r=t.position,u=t.height;t.animator.play(),
1===o?O.createTask(v,400,!1).data={clip:t,toX:r.x,toY:r.y-u}:2===o?O.createTask(v,200,!1).data={clip:t,toX:r.x,toY:r.y-u
}:t.position.tween(r.x,r.y-u,1e3,f,O.EASE_OUT_SLOW)}l&&l.play(),c=1,i=0,setTimeout(m,1e4)};return{play:function(){
var e=_.Puzzle.curr;0===c&&(u=!1,_.onEscape.add(h),n.addEventListener("mousedown",h,!1),
n.addEventListener("pointerdown",h,!1),n.addEventListener("touchstart",h,!1),a?y():(l&&l.play(),
e.credits&&e.credits.show()))}}}(),function(){var e=!1,t=NaN,n=NaN,i=function(){var e=_.Puzzle.curr
;e?e.rescale():_.background.rescale()},o=function(){e=!1,O&&O.isAvailable&&(u.busy(!0),O.resize(i))}
;window.addEventListener("resize",(function i(){if(!e){if(u.textInputMode())return void u.onTextInputBlur(i)
;if(d.isConnecting())return void d.joinedToGameVar.addListener((function(){return setTimeout(i,0),"remove"}))
;var r=z.getWidth(),a=z.getHeightMinusToolbar();r===t&&a===n||(t=r,n=a,e=!0,_.delayedActions.add(o))}}),!1)}(),
w||(r.log("%d completions",g.localStore.getItem(Ne)||g.localStore.getItem(Be)),r.emitBreak()),_.test=function(e){},
_.testShowLS=function(){r.log("localStorage: "+JSON.stringify(localStorage))},_.testClearLS=function(){
g.localStore.clear()},_.missingPieceCheck=function(){var e=_.Puzzle.curr;if(e&&e.stateVar.val.eq(V)){
var t=e.pieces,n=t.getPiece(1),i=t.getPiece(2),o=n&&n.group||i&&i.group,a=null;if(e&&o&&t.length-1===o.length){
for(var s=t.length;s>0;s--){var l=t.getPiece(s);if(!l.group){a=l;break}}a&&r.warn("potential missing piece detected.",{
id:a.id,state:a.state.toString(),x:a.position.x,y:a.position.y,hasMoved:a.hasMoved,angle:a.angle,opacity:a.opacity,
active:a.active,disposed:a.isDisposed,zOrder:a.zOrder,width:a.width,height:a.height,isEdge:a.isEdge})}}},
_.restoreGame=function(){var e=_.Puzzle.curr;if(e&&d.joinedToGameVar.val){var t=d.gameInfo;e.rotatable=!!t.rot&&ue,
d.placePieces(),e.auditPieces(),e.relayer(),e.stateVar.val=G,e.showEdgesOnly()===t.edo?e.scatter({partial:!0,
unmovedPiecesOnly:!0}):e.showEdgesOnly(t.edo,oe),t.lsync&&e.pieces.applyTask((function(e){
0===Math.floor(e.position.x)&&0===Math.floor(e.position.y)&&e.move(n.width/2,n.height/2)}))}},ai=function(e,t){
var n=_.Puzzle.curr,i=e.remoteData,o=e.isCaptured()
;e.stateVar.val=o?U:F,t||e.opacity||o||!(!n.showEdgesOnly()||e.isEdge||e.group&&e.group.isEdge)||(i&&i.immediate?e.applyTask((function(e){
e.opacity=1})):e.applyTask((function(e){e.fadeIn(Se)}))),i&&i.timer&&i.timer.clear(),e.remoteData=null},
si=function(e,t){var n=e.remoteData||(t?t.remoteData:null),i=function(){
e.isDisposed||t&&t.isDisposed||(t?(p.log(e.name+" & "+t.name+": mp drop piece"),
!e.opacity&&t.group&&t.group.isEdge&&e.applyTask((function(e){e.opacity=1})),e.angle!==t.angle&&(e.angle=t.angle),
e.join(t)):(p.log(e.name+": mp drop piece"),e.move(n.x,n.y)),ai(e))}
;t?(p.log(e.name+" & "+t.name+": remote join and drop pieces ("+(n&&n.immediate?"i)":")")),t.meta={otherPiece:e
}):p.log(e.name+": remote drop piece ("+(document.hidden?"h)":"v)")),
n?n.immediate?i():n.timer=new y(100,i):(e.logState(),
e.logHistory(),x.sendReport("dropPiece called from unexpected source"),i())},Kn=function(e,t){e.fadeOut(Se,t)},
li=function(e,t){e.remoteData.immediate?(e.opacity=0,t&&t()):e.applyTask(Kn,t)},Qn=function(e,t){e.fadeIn(Se,t)},
ci=function(e,t){var n=e.remoteData;n&&n.immediate?(e.opacity=1,t&&t()):e.applyTask(Qn,t)},ui=function(e,t){
var n=e.remoteData
;return e.isCaptured()?(e.decapture(),p.log(e.name+": remote decapture fade-in"+(n&&n.immediate?", immediate":"")),
ci(e,t),!0):t?(t(),!1):void 0},di=function(e){var t=e.remoteData,n=function(){e.opacity=1,e.angle=t.a,e.move(t.x,t.y),
ai(e)};if(!e.isDisposed)if(t.immediate)n();else{if(e.angle!==t.a)return void e.rotateTo(t.a,!1,(function(){di(e,t,!1)}))
;t.wc?e.isCaptured()?(p.log(e.name+": remote move piece (1)"),e.move(t.x,t.y),e.raise(),
ui(e,si)):(p.log(e.name+": remote fade out before move"),li(e,(function(){t.timer=new y(300,(function(){
p.log(e.name+": remote fade in and move piece"+(t.immediate?", immediate":"")),t.immediate?n():(e.move(t.x,t.y),
e.raise(),ci(e,si))}))}))):ui(e,(function(){p.log(e.name+": remote move piece (2)"),t.dbgFlag=!0,e.raise(),
e.move(e.position.x-1,e.position.y-1),t.timer=new y(500,(function(){
p.log(e.name+": remote move piece (3)"+(t.immediate?", immediate":"")),t.dbgFlag=!1,t.immediate?n():e.move(t.x-1,t.y-1,{
animate:!0,aniInterval:500,aniCallback:function(){si(e)}})}))}))}},Zn=function(e,t,n){
p.log(e.name+" & "+t.name+": remote move to fit for join ("+n+")"),e.moveToFit(t,{offset:-1,aniCallback:function(){
si(e,t)}})},hi=function(e,t){var n=_.Puzzle.curr,i=e.remoteData;if(!t||e.group&&t.group&&e.group.id===t.group.id){
var o=t||n.pieces.getPiece(i.g);e.angle=o.angle,_.Piece.gap.measure(e,o)
;var r=o.position.x-_.Piece.gap.x,a=o.position.y-_.Piece.gap.y;e.position.assign(r,a),ai(e),t&&ai(t)
}else i.immediate?(e.angle=t.angle,e.join(t,!0),ai(e)):(ui(t),ui(e,(function(){e.raise(),
e.move(e.position.x-1,e.position.y-1),
e.angle===t.angle?Zn(e,t,1):0===e.angle&&e.isInMainAssembly()?t.rotateTo(0,!1,Zn.bind(null,t,e,2)):e.rotateTo(t.angle,!1,Zn.bind(null,e,t,3))
})))},$n=function(e,t,n,i,o){
p.log("debug track "+e+" :: pc="+t.name+", ref="+(n?n.name:"n/a")+", piv="+(i?i.name:"n/a")+" :: "+o.toString())},
ei=function(e,t,n){var i=_.Puzzle.curr,o=e.remoteData;if(void 0===o.x&&void 0!==o.g)$n(1,e,t,n,o),hi(e,t);else{
var r=e.angle!==o.a,a=o.m||e.group||!e.homePos?o.x:e.homePos.x,s=o.m||e.group||!e.homePos?o.y:e.homePos.y,l=!n&&(Math.abs(e.position.x-a)>e.spec.core.width/8||Math.abs(e.position.y-s)>e.spec.core.height/8)
;t?($n(2,e,t,n,o),hi(e,t)):!l||e.isInMainAssembly()||d.gameInfo.lsync&&i.stateVar.val.gte(G)?r?($n(4,e,t,n,o),
function(e,t){var n=e.remoteData,i=t||e;i.angle===n.a?ai(i):n.immediate||i.isCaptured()?(i.angle=n.a,
ai(i)):i.rotateTo(n.a,!1,(function(){ai(i)}))}(e,n)):($n(5,e,t,n,o),ai(e,!0),n&&ai(n,!0)):($n(3,e,t,n,o),o.x=a,o.y=s,
di(e))}},pi=function(e){
var t=_.Puzzle.curr,n=e.cachedPiece||t.pieces.getPiece(e.id),i=!n.isDisposed&&n.stateVar.val.eq(F,Y,U)&&!n.isTweening(),o=null,s=e.pivotPiece||(e.pv&&!e.immediate?t.pieces.getPiece(e.pv):null)
;if(!s||n.group&&n.group===s.group||(s=null),void 0!==e.cmd){switch(!d.timer.isRunning()&&t.state.eq(D,G)&&t.start(),
e.cmd){case"select":i&&(n.applyTask(ui),n.stateVar.val=Y,n.remotePlayerName=e.nam,
(c.dbgEvents||a)&&p.log(n.name+": remote select by player "+e.nam));break;case"rotate":i&&n.rotateTo(e.ang);break
;default:r.warn.once("Unrecognized remote event: "+("string"==typeof e.cmd?e.cmd:"type "+typeof e.cmd))}return!0}
if(e.g&&!s&&(!n.group||e.g!==n.group.id)&&(o=n===(o=e.cachedRefPiece||t.pieces.getPiece(e.g))||n.group&&o.group===n.group?null:o)&&o.isDisposed)return!0
;var l=!!o&&o.stateVar.val.eq(F,Y,U)&&!o.isTweening(),u=!!s&&s.stateVar.val.eq(F,Y,U)&&!s.isTweening()
;return!i||o&&!l||s&&!u?(e.cachedPiece||p.log(n.name+": remote processing delayed"),e.cachedPiece=n,e.cachedRefPiece=o,
e.cachedPivotPiece=s,!1):(n.remoteData=e,e.immediate||(n.stateVar.val=X,n.remotePlayerName=e.p||n.remotePlayerName),
o&&!e.immediate?(o.stateVar.val=X,o.remotePlayerName=e.p||n.remotePlayerName):s&&!e.immediate&&(s.stateVar.val=X,
s.remotePlayerName=e.p||n.remotePlayerName),ei(n,o,s),!0)},d.onAction=function(e){
var t=_.Puzzle.curr,n=t?t.stateVar.val:B
;return!(n.gte(D)||n.eq(N,R)&&d.placingPieces)||((c.dbgEvents||a)&&p.log(e.toString()),pi(e))},d.onEvent=d.onAction,
d.onSettingChange=function(e,t,n){var i=_.Puzzle.curr
;i&&"edo"===e&&i.showEdgesOnly()!==t&&i.stateVar.val.gte(G)&&!i.pieces.isEdgeComplete&&i.showEdgesOnly(t,n?re:oe)},
ti=2e3,ni=null,ii=null,oi=function(){if(ni){var t=_.Puzzle.curr
;"rejoining"===ii&&t&&t.stateVar.val.gte(e.PS_WAITING)&&!d.isConnecting()&&(ii="delaying",ni=setTimeout(ri,ti))}},
ri=function(){var t=_.Puzzle.curr
;"delaying"===ii&&t&&t.stateVar.val.gte(e.PS_WAITING)&&!d.isConnecting()&&(window.navigator.onLine&&!document.hidden&&v.stoppedDuration<1e4?(d.errorVar.addListener(oi),
ii="rejoining",d.leaveGame(),d.joinGame()):ni=setTimeout(ri,ti))},d.joinedToGameVar.addListener((function(t){
var n=_.Puzzle.curr;t?(ni&&(clearTimeout(ni),ni=null,ii=null,d.errorVar.removeListener(oi),
n&&n.stateVar.val.gte(D)&&(_.restoreGame(),
u.busy(!1))),n&&n.pieces.length&&n.pieces.length!==d.gameInfo.nop&&n.rescale()):n&&!n.isComplete&&n.stateVar.val.gte(e.PS_WAITING)&&!d.isConnecting()&&(r.log("connection lost. attempting to reconnect to the game server..."),
u.busy(!0),ii="delaying",ni=setTimeout(ri,ti),u.toast.show("Reconnecting to game..."))})),t.onProgramStart=function(){
var n,i,o=function(){var e=_.Puzzle.curr;if(e.state.eq(D))e.state=G;else if(e.state.lt(D))return
;u.starterDlg.visible(!1),u.invitePanel&&u.invitePanel.visible()&&u.invitePanel.visible(!1)};n=function(){
_.Puzzle.curr.nopChangePrep(),u.numPiecesMenu.visible("toggle")},i=function(e){
"ok"===e&&_.Puzzle.curr&&(_.Puzzle.curr.capState=J,n())},(u=e.modules.ui).numPiecesBtn.onclick=function(){
var e=_.Puzzle.curr
;e&&(e.isComplete||!e.numMoves&&!e.record?n():u.msgbox('Changing the number of pieces in the puzzle will cause you to lose any progress you have made on the puzzle so far.<br/><br/>Choose "Continue" to proceed or "Cancel" to abort.',["jigex-mb-continue","jigex-mb-cancel"],i))
};var a,s,l,c,p,m=(s=null,l=null,c=function(t){var n=e.parms().reset()
;if(!s)return r.error("selected puzzle file is null"),void window.alert("The selected file could not be opened.")
;if(s.isOptions)try{var i=JSON.parse(t.target.result);for(var o in i)i.hasOwnProperty(o)&&(e.skunkOptions[o]=i[o])
;g.localStore.setItem("jigex-options",JSON.stringify(e.skunkOptions)),u.msgbox("New options accepted.")}catch(e){
window.alert("An error occurred while processing the specified file:\n"+e.message)}else if(s.isJigsaw){var a,c,d,h=!0
;try{c=JSON.parse(t.target.result)}catch(e){}
if(c&&c.info&&"string"==typeof c.info&&c.info.includes("Jigsaw Explorer")&&c.ver>=8)return(d=_.recordsManager.find(s.name))||(c.nam=s.name,
d=new _.puzzleRecord(c,!0)),void(d.pid?0===d.pid.indexOf("http")?(n.url=d.pid,c.cred&&(n.cred=c.cred),
c.credu&&(n.credu=c.credu),new _.Puzzle(n)):(n.saveName=s.name,n.puzzleId=d.pid,new _.Puzzle(n)):c.img?(n.name=s.name,
n.data="data:image/jpeg;base64,"+c.img,new _.Puzzle(n)):(x.setAuxData("Bad Record",d,!0),
x.setAuxData("Old Record",JSON.stringify(c).substr(0,1024)+"..."),
r.fault(new Error("Record with no pid. file name="+s.name)),
u.msgbox("The selected puzzle could not be opened. Please contact Support for help.")));try{a=function(e){
for(var t=e.split('"sgl":'),n="",i=0,o=0,r=0,a=t.length-1;r<a;r++)n+=t[r]+'"sgl'+i+++'":'
;for(t=(n+=t[a]).split('"grp":'),n="",r=0,a=t.length-1;r<a;r++)n+=t[r]+'"grp'+o+++'":';return n+t[a]}(t.target.result),
a=JSON.parse(a)}catch(e){h=!1}
h&&a.puzzle&&a.info&&a.info.includes("Jigsaw Explorer")&&a.puzzle.ver&&a.puzzle.ver>=6?((d=_.recordsManager.find(s.name))||(a.ver=6,
a.nam=s.name,d=new _.puzzleRecord(a)),d.pid?0===d.pid.indexOf("http")?(n.url=d.pid,n.saveName=s.name,
a.puzzle.cred&&(n.cred=a.puzzle.cred),a.puzzle.credu&&(n.credu=a.puzzle.credu),new _.Puzzle(n)):(n.saveName=s.name,
n.puzzleId=d.pid,new _.Puzzle(n)):a.puzzle.img?(n.name=s.name,n.data="data:image/jpeg;base64,"+a.puzzle.img,
new _.Puzzle(n)):(x.setAuxData("Bad Record",d,!0),x.setAuxData("Old Record",JSON.stringify(a).substr(0,1024)+"..."),
r.fault(new Error("Record with no pid. file name="+s.name)),
u.msgbox("The selected puzzle could not be opened. Please contact Support for help."))):u.msgbox("The selected jigsaw file is either not recognized or it is an outdated format. Contact Support for help.")
}else u.busy(!0),l=t.target.result,n.name=s.name,n.data=l,r.log("create puzzle from file "+s.name),new _.Puzzle(n)},
p=function(){u.msgbox("An error occurred while loading file "+s.name+":\n\n"+a.error)},function(t){
var n=_.Puzzle&&_.Puzzle.curr
;if(!(s&&Date.now()-s.timestamp<1e3))if(n&&n.state.eq(N,R))u.msgbox("An image file or saved puzzle cannot be opened while the loading of another puzzle is already in progress.");else if(n&&n.multiplayerGameId||e.parms().gameId)u.msgbox("An image file or saved puzzle cannot be opened from within a multiplayer game session.");else if(s=t.target&&t.target.files?t.target.files[0]:null,
u.starterDlg.visible(!1),s){
if(s.isJigsaw=s&&(-1!==s.name.indexOf(".jigsaw")||-1!==s.name.toLowerCase().indexOf("saved puzzle")),
s.isOptions=s&&s.name.includes("jigex-options"),
s.timestamp=Date.now(),0!==s.type.indexOf("image/jpg")&&0!==s.type.indexOf("image/png")&&0!==s.type.indexOf("image/gif")&&0!==s.type.indexOf("image/bmp")&&0!==s.type.indexOf("image/jpeg")&&0!==s.type.indexOf("image/webp")&&!s.isJigsaw&&!s.isOptions)return void u.msgbox("Only image files of type JPG, PNG, WEBP, GIF, or BMP may be opened as a jigsaw puzzle.")
;a=new FileReader,r.emitBreak(),r.log("open file: name="+s.name+", type="+s.type),a.onloadend=c,a.onerror=p,
s.isJigsaw||s.isOptions?a.readAsText(s):a.readAsDataURL(s)}}),f=function(){var e=_.Puzzle.curr
;e&&e.state.gt(R)&&(e.rotatable=!e.rotatable)},v=function(e){
_.Controller.recentTouch()&&!u.help.isShowing()&&e.preventDefault()},y=function(t){
if("puzzle-completion-event-request"===t.data){var n=_.Puzzle.curr;t.source?n?n.isCompleteVar.addListener((function(i){
if(i){var o=e.parms(),r=JSON.stringify({puzzleId:o.puzzleId||o.url||"[unknown]",numberOfPieces:n.pieces.length,
elapsedTime:_.clock.getElapsedSecs()});t.source.postMessage(r,t.origin)}
})):r.warn("Puzzle completion event requested in absence of a puzzle"):r.warn("Request for puzzle completion event failed because event.source is null")
}},b=!1;return function(){var n=e.parms();b||(b=!0,window.addEventListener("contextmenu",v,!1),
window.addEventListener("message",y,!1),u.themeBtn.onclick=function(){u.colorMenu.visible("toggle")},
u.startBtn.onclick=o,u.rotateBtn.onclick=f,u.onFileSelect=m,h.isLoaded.addListener((function(){
return n.gameId&&(u.busy(!1),
d.isSupported?u.joinPanel.show():u.msgbox("This web browser does not support multiplayer mode.")),t.Sonic.prep(),
"remove"})),h.setToDefault()),n.gameId&&!d.joinedToGameVar.val?d.joinedToGameVar.addListener((function(e){if(e){
var t=d.gameInfo;return(n=n.reset()).puzzleId=t.pid,t.url&&(n.url=t.url,n.cred=t.cred,n.credu=t.credu),new _.Puzzle(n),
"remove"}})):new _.Puzzle(n)}}(),t.player=_}else j()};n.dependenciesReady=function(){
var e="Player dependencies: base="+!!t.base+", utils="+!!t.utils+", nb="+!!t.niftybar+", cgl="+!!t.ClipGL+", ui="+!!t.ui+", sonic="+!!t.Sonic+", theme="+!!t.theme+", multiplayer="+!!t.multiplayer
;return e!==n.prevMsg&&(console.log(e),
n.prevMsg=e),!!(t.base&&t.utils&&t.niftybar&&t.ClipGL&&t.ui&&t.snapIndicator&&t.Sonic&&t.theme&&t.multiplayer)},
t.addModInit("player",n)}}();