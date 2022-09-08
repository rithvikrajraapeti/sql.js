
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});null;
e.onRuntimeInitialized=function(){function a(g,m){switch(typeof m){case "boolean":dc(g,m?1:0);break;case "number":ec(g,m);break;case "string":fc(g,m,-1,-1);break;case "object":if(null===m)jb(g);else if(null!=m.length){var p=aa(m);gc(g,p,m.length,-1);ba(p)}else ua(g,"Wrong API use : tried to return a value of an unknown type ("+m+").",-1);break;default:jb(g)}}function b(g,m){for(var p=[],r=0;r<g;r+=1){var u=k(m+4*r,"i32"),w=hc(u);if(1===w||2===w)u=ic(u);else if(3===w)u=jc(u);else if(4===w){w=u;u=kc(w);
w=lc(w);for(var K=new Uint8Array(u),E=0;E<u;E+=1)K[E]=n[w+E];u=K}else u=null;p.push(u)}return p}function c(g,m){this.La=g;this.db=m;this.Ja=1;this.eb=[]}function d(g,m){this.db=m;m=ca(g)+1;this.Ya=da(m);if(null===this.Ya)throw Error("Unable to allocate memory for the SQL string");t(g,y,this.Ya,m);this.cb=this.Ya;this.Ua=this.ib=null}function f(g){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=g){var m=this.filename,p="/",r=m;p&&(p="string"==typeof p?p:ea(p),r=m?z(p+"/"+m):p);m=fa(!0,
!0);r=ha(r,(void 0!==m?m:438)&4095|32768,0);if(g){if("string"==typeof g){p=Array(g.length);for(var u=0,w=g.length;u<w;++u)p[u]=g.charCodeAt(u);g=p}ia(r,m|146);p=A(r,577);ja(p,g,0,g.length,0,void 0);ka(p);ia(r,m)}}this.handleError(q(this.filename,h));this.db=k(h,"i32");mc(this.db);this.Za={};this.Na={}}var h=B(4),l=e.cwrap,q=l("sqlite3_open","number",["string","number"]),v=l("sqlite3_close_v2","number",["number"]),x=l("sqlite3_exec","number",["number","string","number","number","number"]),C=l("sqlite3_changes",
"number",["number"]),S=l("sqlite3_prepare_v2","number",["number","string","number","number","number"]),mb=l("sqlite3_sql","string",["number"]),nc=l("sqlite3_normalized_sql","string",["number"]),nb=l("sqlite3_prepare_v2","number",["number","number","number","number","number"]),oc=l("sqlite3_bind_text","number",["number","number","number","number","number"]),ob=l("sqlite3_bind_blob","number",["number","number","number","number","number"]),pc=l("sqlite3_bind_double","number",["number","number","number"]),
qc=l("sqlite3_bind_int","number",["number","number","number"]),rc=l("sqlite3_bind_parameter_index","number",["number","string"]),sc=l("sqlite3_step","number",["number"]),tc=l("sqlite3_errmsg","string",["number"]),uc=l("sqlite3_column_count","number",["number"]),vc=l("sqlite3_data_count","number",["number"]),wc=l("sqlite3_column_double","number",["number","number"]),pb=l("sqlite3_column_text","string",["number","number"]),xc=l("sqlite3_column_blob","number",["number","number"]),yc=l("sqlite3_column_bytes",
"number",["number","number"]),zc=l("sqlite3_column_type","number",["number","number"]),Ac=l("sqlite3_column_name","string",["number","number"]),Bc=l("sqlite3_reset","number",["number"]),Cc=l("sqlite3_clear_bindings","number",["number"]),Dc=l("sqlite3_finalize","number",["number"]),qb=l("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),hc=l("sqlite3_value_type","number",["number"]),kc=l("sqlite3_value_bytes","number",["number"]),jc=l("sqlite3_value_text",
"string",["number"]),lc=l("sqlite3_value_blob","number",["number"]),ic=l("sqlite3_value_double","number",["number"]),ec=l("sqlite3_result_double","",["number","number"]),jb=l("sqlite3_result_null","",["number"]),fc=l("sqlite3_result_text","",["number","string","number","number"]),gc=l("sqlite3_result_blob","",["number","number","number","number"]),dc=l("sqlite3_result_int","",["number","number"]),ua=l("sqlite3_result_error","",["number","string","number"]),rb=l("sqlite3_aggregate_context","number",
["number","number"]),mc=l("RegisterExtensionFunctions","number",["number"]);c.prototype.bind=function(g){if(!this.La)throw"Statement closed";this.reset();return Array.isArray(g)?this.xb(g):null!=g&&"object"===typeof g?this.yb(g):!0};c.prototype.step=function(){if(!this.La)throw"Statement closed";this.Ja=1;var g=sc(this.La);switch(g){case 100:return!0;case 101:return!1;default:throw this.db.handleError(g);}};c.prototype.sb=function(g){null==g&&(g=this.Ja,this.Ja+=1);return wc(this.La,g)};c.prototype.Cb=
function(g){null==g&&(g=this.Ja,this.Ja+=1);g=pb(this.La,g);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(g)};c.prototype.Db=function(g){null==g&&(g=this.Ja,this.Ja+=1);return pb(this.La,g)};c.prototype.getBlob=function(g){null==g&&(g=this.Ja,this.Ja+=1);var m=yc(this.La,g);g=xc(this.La,g);for(var p=new Uint8Array(m),r=0;r<m;r+=1)p[r]=n[g+r];return p};c.prototype.get=function(g,m){m=m||{};null!=g&&this.bind(g)&&this.step();g=[];for(var p=vc(this.La),r=0;r<p;r+=
1)switch(zc(this.La,r)){case 1:var u=m.useBigInt?this.Cb(r):this.sb(r);g.push(u);break;case 2:g.push(this.sb(r));break;case 3:g.push(this.Db(r));break;case 4:g.push(this.getBlob(r));break;default:g.push(null)}return g};c.prototype.getColumnNames=function(){for(var g=[],m=uc(this.La),p=0;p<m;p+=1)g.push(Ac(this.La,p));return g};c.prototype.getAsObject=function(g,m){g=this.get(g,m);m=this.getColumnNames();for(var p={},r=0;r<m.length;r+=1)p[m[r]]=g[r];return p};c.prototype.getSQL=function(){return mb(this.La)};
c.prototype.getNormalizedSQL=function(){return nc(this.La)};c.prototype.run=function(g){null!=g&&this.bind(g);this.step();return this.reset()};c.prototype.nb=function(g,m){null==m&&(m=this.Ja,this.Ja+=1);g=la(g);var p=aa(g);this.eb.push(p);this.db.handleError(oc(this.La,m,p,g.length-1,0))};c.prototype.wb=function(g,m){null==m&&(m=this.Ja,this.Ja+=1);var p=aa(g);this.eb.push(p);this.db.handleError(ob(this.La,m,p,g.length,0))};c.prototype.mb=function(g,m){null==m&&(m=this.Ja,this.Ja+=1);this.db.handleError((g===
(g|0)?qc:pc)(this.La,m,g))};c.prototype.zb=function(g){null==g&&(g=this.Ja,this.Ja+=1);ob(this.La,g,0,0,0)};c.prototype.ob=function(g,m){null==m&&(m=this.Ja,this.Ja+=1);switch(typeof g){case "string":this.nb(g,m);return;case "number":this.mb(g,m);return;case "bigint":this.nb(g.toString(),m);return;case "boolean":this.mb(g+0,m);return;case "object":if(null===g){this.zb(m);return}if(null!=g.length){this.wb(g,m);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+g+").";};c.prototype.yb=
function(g){var m=this;Object.keys(g).forEach(function(p){var r=rc(m.La,p);0!==r&&m.ob(g[p],r)});return!0};c.prototype.xb=function(g){for(var m=0;m<g.length;m+=1)this.ob(g[m],m+1);return!0};c.prototype.reset=function(){this.freemem();return 0===Cc(this.La)&&0===Bc(this.La)};c.prototype.freemem=function(){for(var g;void 0!==(g=this.eb.pop());)ba(g)};c.prototype.free=function(){this.freemem();var g=0===Dc(this.La);delete this.db.Za[this.La];this.La=0;return g};d.prototype.next=function(){if(null===
this.Ya)return{done:!0};null!==this.Ua&&(this.Ua.free(),this.Ua=null);if(!this.db.db)throw this.gb(),Error("Database closed");var g=na(),m=B(4);oa(h);oa(m);try{this.db.handleError(nb(this.db.db,this.cb,-1,h,m));this.cb=k(m,"i32");var p=k(h,"i32");if(0===p)return this.gb(),{done:!0};this.Ua=new c(p,this.db);this.db.Za[p]=this.Ua;return{value:this.Ua,done:!1}}catch(r){throw this.ib=D(this.cb),this.gb(),r;}finally{pa(g)}};d.prototype.gb=function(){ba(this.Ya);this.Ya=null};d.prototype.getRemainingSQL=
function(){return null!==this.ib?this.ib:D(this.cb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(d.prototype[Symbol.iterator]=function(){return this});f.prototype.run=function(g,m){if(!this.db)throw"Database closed";if(m){g=this.prepare(g,m);try{g.step()}finally{g.free()}}else this.handleError(x(this.db,g,0,0,h));return this};f.prototype.exec=function(g,m,p){if(!this.db)throw"Database closed";var r=na(),u=null;try{var w=ca(g)+1,K=B(w);t(g,n,K,w);var E=K;var F=B(4);for(g=[];0!==
k(E,"i8");){oa(h);oa(F);this.handleError(nb(this.db,E,-1,h,F));var G=k(h,"i32");E=k(F,"i32");if(0!==G){w=null;u=new c(G,this);for(null!=m&&u.bind(m);u.step();)null===w&&(w={columns:u.getColumnNames(),values:[]},g.push(w)),w.values.push(u.get(null,p));u.free()}}return g}catch(ma){throw u&&u.free(),ma;}finally{pa(r)}};f.prototype.each=function(g,m,p,r,u){"function"===typeof m&&(r=p,p=m,m=void 0);g=this.prepare(g,m);try{for(;g.step();)p(g.getAsObject(null,u))}finally{g.free()}if("function"===typeof r)return r()};
f.prototype.prepare=function(g,m){oa(h);this.handleError(S(this.db,g,-1,h,0));g=k(h,"i32");if(0===g)throw"Nothing to prepare";var p=new c(g,this);null!=m&&p.bind(m);return this.Za[g]=p};f.prototype.iterateStatements=function(g){return new d(g,this)};f.prototype["export"]=function(){Object.values(this.Za).forEach(function(m){m.free()});Object.values(this.Na).forEach(qa);this.Na={};this.handleError(v(this.db));var g=ra(this.filename);this.handleError(q(this.filename,h));this.db=k(h,"i32");return g};
f.prototype.close=function(){null!==this.db&&(Object.values(this.Za).forEach(function(g){g.free()}),Object.values(this.Na).forEach(qa),this.Na={},this.handleError(v(this.db)),sa("/"+this.filename),this.db=null)};f.prototype.handleError=function(g){if(0===g)return null;g=tc(this.db);throw Error(g);};f.prototype.getRowsModified=function(){return C(this.db)};f.prototype.create_function=function(g,m){Object.prototype.hasOwnProperty.call(this.Na,g)&&(qa(this.Na[g]),delete this.Na[g]);var p=ta(function(r,
u,w){u=b(u,w);try{var K=m.apply(null,u)}catch(E){ua(r,E,-1);return}a(r,K)},"viii");this.Na[g]=p;this.handleError(qb(this.db,g,m.length,1,0,p,0,0,0));return this};f.prototype.create_aggregate=function(g,m){var p=m.init||function(){return null},r=m.finalize||function(F){return F},u=m.step;if(!u)throw"An aggregate function must have a step function in "+g;var w={};Object.hasOwnProperty.call(this.Na,g)&&(qa(this.Na[g]),delete this.Na[g]);m=g+"__finalize";Object.hasOwnProperty.call(this.Na,m)&&(qa(this.Na[m]),
delete this.Na[m]);var K=ta(function(F,G,ma){var Y=rb(F,1);Object.hasOwnProperty.call(w,Y)||(w[Y]=p());G=b(G,ma);G=[w[Y]].concat(G);try{w[Y]=u.apply(null,G)}catch(Fc){delete w[Y],ua(F,Fc,-1)}},"viii"),E=ta(function(F){var G=rb(F,1);try{var ma=r(w[G])}catch(Y){delete w[G];ua(F,Y,-1);return}a(F,ma);delete w[G]},"vi");this.Na[g]=K;this.Na[m]=E;this.handleError(qb(this.db,g,u.length-1,1,0,0,K,E,0));return this};e.Database=f};
var va=Object.assign({},e),wa="./this.program",xa="object"==typeof window,ya="function"==typeof importScripts,za="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,H="",Aa,Ba,Ca,fs,Da,Ea;
if(za)H=ya?require("path").dirname(H)+"/":__dirname+"/",Ea=()=>{Da||(fs=require("fs"),Da=require("path"))},Aa=function(a,b){Ea();a=Da.normalize(a);return fs.readFileSync(a,b?void 0:"utf8")},Ca=a=>{a=Aa(a,!0);a.buffer||(a=new Uint8Array(a));return a},Ba=(a,b,c)=>{Ea();a=Da.normalize(a);fs.readFile(a,function(d,f){d?c(d):b(f.buffer)})},1<process.argv.length&&(wa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!=typeof module&&(module.exports=e),e.inspect=function(){return"[Emscripten Module object]"};
else if(xa||ya)ya?H=self.location.href:"undefined"!=typeof document&&document.currentScript&&(H=document.currentScript.src),H=0!==H.indexOf("blob:")?H.substr(0,H.replace(/[?#].*/,"").lastIndexOf("/")+1):"",Aa=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},ya&&(Ca=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Ba=(a,b,c)=>{var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";
d.onload=()=>{200==d.status||0==d.status&&d.response?b(d.response):c()};d.onerror=c;d.send(null)};var Fa=e.print||console.log.bind(console),I=e.printErr||console.warn.bind(console);Object.assign(e,va);va=null;e.thisProgram&&(wa=e.thisProgram);var Ga=[],Ha;
function ta(a,b){if(!Ha){Ha=new WeakMap;for(var c=J.length,d=0;d<0+c;d++){var f=J.get(d);f&&Ha.set(f,d)}}if(Ha.has(a))return Ha.get(a);if(Ga.length)c=Ga.pop();else{try{J.grow(1)}catch(q){if(!(q instanceof RangeError))throw q;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=J.length-1}try{J.set(c,a)}catch(q){if(!(q instanceof TypeError))throw q;if("function"==typeof WebAssembly.Function){f={i:"i32",j:"i64",f:"f32",d:"f64"};var h={parameters:[],results:"v"==b[0]?[]:[f[b[0]]]};for(d=1;d<
b.length;++d)h.parameters.push(f[b[d]]);b=new WebAssembly.Function(h,a)}else{f=[1,0,1,96];h=b.slice(0,1);b=b.slice(1);var l={i:127,j:126,f:125,d:124};f.push(b.length);for(d=0;d<b.length;++d)f.push(l[b[d]]);"v"==h?f.push(0):f=f.concat([1,l[h]]);f[1]=f.length-2;b=new Uint8Array([0,97,115,109,1,0,0,0].concat(f,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));b=new WebAssembly.Module(b);b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f}J.set(c,b)}Ha.set(a,c);return c}
function qa(a){Ha.delete(J.get(a));Ga.push(a)}var Ia;e.wasmBinary&&(Ia=e.wasmBinary);var noExitRuntime=e.noExitRuntime||!0;"object"!=typeof WebAssembly&&L("no native wasm support detected");
function oa(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":n[a>>0]=0;break;case "i8":n[a>>0]=0;break;case "i16":Ja[a>>1]=0;break;case "i32":M[a>>2]=0;break;case "i64":N=[0,(O=0,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];M[a>>2]=N[0];M[a+4>>2]=N[1];break;case "float":Ka[a>>2]=0;break;case "double":La[a>>3]=0;break;default:L("invalid type for setValue: "+b)}}
function k(a,b="i8"){"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return n[a>>0];case "i8":return n[a>>0];case "i16":return Ja[a>>1];case "i32":return M[a>>2];case "i64":return M[a>>2];case "float":return Ka[a>>2];case "double":return Number(La[a>>3]);default:L("invalid type for getValue: "+b)}return null}var Ma,Na=!1;
function Oa(a,b,c,d){var f={string:function(x){var C=0;if(null!==x&&void 0!==x&&0!==x){var S=(x.length<<2)+1;C=B(S);t(x,y,C,S)}return C},array:function(x){var C=B(x.length);n.set(x,C);return C}};a=e["_"+a];var h=[],l=0;if(d)for(var q=0;q<d.length;q++){var v=f[c[q]];v?(0===l&&(l=na()),h[q]=v(d[q])):h[q]=d[q]}c=a.apply(null,h);return c=function(x){0!==l&&pa(l);return"string"===b?D(x):"boolean"===b?!!x:x}(c)}var Pa=0,Qa=1;
function aa(a){var b=Pa==Qa?B(a.length):da(a.length);a.subarray||a.slice||(a=new Uint8Array(a));y.set(a,b);return b}var Ra="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Sa(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.buffer&&Ra)return Ra.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var h=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|h);else{var l=a[b++]&63;f=224==(f&240)?(f&15)<<12|h<<6|l:(f&7)<<18|h<<12|l<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function D(a,b){return a?Sa(y,a,b):""}
function t(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var h=0;h<a.length;++h){var l=a.charCodeAt(h);if(55296<=l&&57343>=l){var q=a.charCodeAt(++h);l=65536+((l&1023)<<10)|q&1023}if(127>=l){if(c>=d)break;b[c++]=l}else{if(2047>=l){if(c+1>=d)break;b[c++]=192|l>>6}else{if(65535>=l){if(c+2>=d)break;b[c++]=224|l>>12}else{if(c+3>=d)break;b[c++]=240|l>>18;b[c++]=128|l>>12&63}b[c++]=128|l>>6&63}b[c++]=128|l&63}}b[c]=0;return c-f}
function ca(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}function Ta(a){var b=ca(a)+1,c=da(b);c&&t(a,n,c,b);return c}var Ua,n,y,Ja,M,Ka,La;
function Va(){var a=Ma.buffer;Ua=a;e.HEAP8=n=new Int8Array(a);e.HEAP16=Ja=new Int16Array(a);e.HEAP32=M=new Int32Array(a);e.HEAPU8=y=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Ka=new Float32Array(a);e.HEAPF64=La=new Float64Array(a)}var J,Wa=[],Xa=[],Ya=[];function Za(){var a=e.preRun.shift();Wa.unshift(a)}var $a=0,ab=null,bb=null;e.preloadedImages={};e.preloadedAudios={};
function L(a){if(e.onAbort)e.onAbort(a);a="Aborted("+a+")";I(a);Na=!0;throw new WebAssembly.RuntimeError(a+". Build with -s ASSERTIONS=1 for more info.");}function cb(){return P.startsWith("data:application/octet-stream;base64,")}var P;P="sql-wasm.wasm";if(!cb()){var db=P;P=e.locateFile?e.locateFile(db,H):H+db}function eb(){var a=P;try{if(a==P&&Ia)return new Uint8Array(Ia);if(Ca)return Ca(a);throw"both async and sync fetching of the wasm failed";}catch(b){L(b)}}
function fb(){if(!Ia&&(xa||ya)){if("function"==typeof fetch&&!P.startsWith("file://"))return fetch(P,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+P+"'";return a.arrayBuffer()}).catch(function(){return eb()});if(Ba)return new Promise(function(a,b){Ba(P,function(c){a(new Uint8Array(c))},b)})}return Promise.resolve().then(function(){return eb()})}var O,N;
function gb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(e);else{var c=b.Jb;"number"==typeof c?void 0===b.fb?J.get(c)():J.get(c)(b.fb):c(void 0===b.fb?null:b.fb)}}}function hb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}
function z(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=hb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}function ib(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function kb(a){if("/"===a)return"/";a=z(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}
function lb(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var a=new Uint8Array(1);return function(){crypto.getRandomValues(a);return a[0]}}if(za)try{var b=require("crypto");return function(){return b.randomBytes(1)[0]}}catch(c){}return function(){L("randomDevice")}}
function sb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!=typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=hb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var tb=[];function ub(a,b){tb[a]={input:[],output:[],Xa:b};vb(a,wb)}
var wb={open:function(a){var b=tb[a.node.rdev];if(!b)throw new Q(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.Xa.flush(a.tty)},flush:function(a){a.tty.Xa.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.Xa.tb)throw new Q(60);for(var f=0,h=0;h<d;h++){try{var l=a.tty.Xa.tb(a.tty)}catch(q){throw new Q(29);}if(void 0===l&&0===f)throw new Q(6);if(null===l||void 0===l)break;f++;b[c+h]=l}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.Xa.jb)throw new Q(60);
try{for(var f=0;f<d;f++)a.tty.Xa.jb(a.tty,b[c+f])}catch(h){throw new Q(29);}d&&(a.node.timestamp=Date.now());return f}},xb={tb:function(a){if(!a.input.length){var b=null;if(za){var c=Buffer.alloc(256),d=0;try{d=fs.readSync(process.stdin.fd,c,0,256,-1)}catch(f){if(f.toString().includes("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==typeof readline&&(b=
readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=la(b,!0)}return a.input.shift()},jb:function(a,b){null===b||10===b?(Fa(Sa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Fa(Sa(a.output,0)),a.output=[])}},yb={jb:function(a,b){null===b||10===b?(I(Sa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(I(Sa(a.output,0)),a.output=[])}},R={Qa:null,Ra:function(){return R.createNode(null,"/",16895,0)},
createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new Q(63);R.Qa||(R.Qa={dir:{node:{Pa:R.Ga.Pa,Oa:R.Ga.Oa,lookup:R.Ga.lookup,$a:R.Ga.$a,rename:R.Ga.rename,unlink:R.Ga.unlink,rmdir:R.Ga.rmdir,readdir:R.Ga.readdir,symlink:R.Ga.symlink},stream:{Ta:R.Ha.Ta}},file:{node:{Pa:R.Ga.Pa,Oa:R.Ga.Oa},stream:{Ta:R.Ha.Ta,read:R.Ha.read,write:R.Ha.write,lb:R.Ha.lb,ab:R.Ha.ab,bb:R.Ha.bb}},link:{node:{Pa:R.Ga.Pa,Oa:R.Ga.Oa,readlink:R.Ga.readlink},stream:{}},pb:{node:{Pa:R.Ga.Pa,Oa:R.Ga.Oa},
stream:zb}});c=Ab(a,b,c,d);16384===(c.mode&61440)?(c.Ga=R.Qa.dir.node,c.Ha=R.Qa.dir.stream,c.Ia={}):32768===(c.mode&61440)?(c.Ga=R.Qa.file.node,c.Ha=R.Qa.file.stream,c.Ma=0,c.Ia=null):40960===(c.mode&61440)?(c.Ga=R.Qa.link.node,c.Ha=R.Qa.link.stream):8192===(c.mode&61440)&&(c.Ga=R.Qa.pb.node,c.Ha=R.Qa.pb.stream);c.timestamp=Date.now();a&&(a.Ia[b]=c,a.timestamp=c.timestamp);return c},Kb:function(a){return a.Ia?a.Ia.subarray?a.Ia.subarray(0,a.Ma):new Uint8Array(a.Ia):new Uint8Array(0)},qb:function(a,
b){var c=a.Ia?a.Ia.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Ia,a.Ia=new Uint8Array(b),0<a.Ma&&a.Ia.set(c.subarray(0,a.Ma),0))},Gb:function(a,b){if(a.Ma!=b)if(0==b)a.Ia=null,a.Ma=0;else{var c=a.Ia;a.Ia=new Uint8Array(b);c&&a.Ia.set(c.subarray(0,Math.min(b,a.Ma)));a.Ma=b}},Ga:{Pa:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;16384===(a.mode&61440)?b.size=4096:32768===(a.mode&61440)?
b.size=a.Ma:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Ab=4096;b.blocks=Math.ceil(b.size/b.Ab);return b},Oa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&R.Gb(a,b.size)},lookup:function(){throw Bb[44];},$a:function(a,b,c,d){return R.createNode(a,b,c,d)},rename:function(a,b,c){if(16384===(a.mode&61440)){try{var d=Cb(b,c)}catch(h){}if(d)for(var f in d.Ia)throw new Q(55);
}delete a.parent.Ia[a.name];a.parent.timestamp=Date.now();a.name=c;b.Ia[c]=a;b.timestamp=a.parent.timestamp;a.parent=b},unlink:function(a,b){delete a.Ia[b];a.timestamp=Date.now()},rmdir:function(a,b){var c=Cb(a,b),d;for(d in c.Ia)throw new Q(55);delete a.Ia[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],c;for(c in a.Ia)a.Ia.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=R.createNode(a,b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new Q(28);
return a.link}},Ha:{read:function(a,b,c,d,f){var h=a.node.Ia;if(f>=a.node.Ma)return 0;a=Math.min(a.node.Ma-f,d);if(8<a&&h.subarray)b.set(h.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=h[f+d];return a},write:function(a,b,c,d,f,h){b.buffer===n.buffer&&(h=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ia||a.Ia.subarray)){if(h)return a.Ia=b.subarray(c,c+d),a.Ma=d;if(0===a.Ma&&0===f)return a.Ia=b.slice(c,c+d),a.Ma=d;if(f+d<=a.Ma)return a.Ia.set(b.subarray(c,c+d),f),d}R.qb(a,f+
d);if(a.Ia.subarray&&b.subarray)a.Ia.set(b.subarray(c,c+d),f);else for(h=0;h<d;h++)a.Ia[f+h]=b[c+h];a.Ma=Math.max(a.Ma,f+d);return d},Ta:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Ma);if(0>b)throw new Q(28);return b},lb:function(a,b,c){R.qb(a.node,b+c);a.node.Ma=Math.max(a.node.Ma,b+c)},ab:function(a,b,c,d,f,h){if(0!==b)throw new Q(28);if(32768!==(a.node.mode&61440))throw new Q(43);a=a.node.Ia;if(h&2||a.buffer!==Ua){if(0<d||d+c<a.length)a.subarray?a=a.subarray(d,
d+c):a=Array.prototype.slice.call(a,d,d+c);d=!0;c=65536*Math.ceil(c/65536);(h=Db(65536,c))?(y.fill(0,h,h+c),c=h):c=0;if(!c)throw new Q(48);n.set(a,c)}else d=!1,c=a.byteOffset;return{Fb:c,vb:d}},bb:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new Q(43);if(f&2)return 0;R.Ha.write(a,b,0,d,c,!1);return 0}}},Eb=null,Fb={},T=[],Gb=1,U=null,Hb=!0,Q=null,Bb={},V=(a,b={})=>{a=sb("/",a);if(!a)return{path:"",node:null};b=Object.assign({rb:!0,kb:0},b);if(8<b.kb)throw new Q(32);a=hb(a.split("/").filter(l=>
!!l),!1);for(var c=Eb,d="/",f=0;f<a.length;f++){var h=f===a.length-1;if(h&&b.parent)break;c=Cb(c,a[f]);d=z(d+"/"+a[f]);c.Va&&(!h||h&&b.rb)&&(c=c.Va.root);if(!h||b.Sa)for(h=0;40960===(c.mode&61440);)if(c=Ib(d),d=sb(ib(d),c),c=V(d,{kb:b.kb+1}).node,40<h++)throw new Q(32);}return{path:d,node:c}},ea=a=>{for(var b;;){if(a===a.parent)return a=a.Ra.ub,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}},Jb=(a,b)=>{for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>
0)%U.length},Kb=a=>{var b=Jb(a.parent.id,a.name);if(U[b]===a)U[b]=a.Wa;else for(b=U[b];b;){if(b.Wa===a){b.Wa=a.Wa;break}b=b.Wa}},Cb=(a,b)=>{var c;if(c=(c=Lb(a,"x"))?c:a.Ga.lookup?0:2)throw new Q(c,a);for(c=U[Jb(a.id,b)];c;c=c.Wa){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ga.lookup(a,b)},Ab=(a,b,c,d)=>{a=new Mb(a,b,c,d);b=Jb(a.parent.id,a.name);a.Wa=U[b];return U[b]=a},Nb={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},Ob=a=>{var b=["r","w","rw"][a&3];a&512&&(b+="w");return b},Lb=(a,
b)=>{if(Hb)return 0;if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0},Pb=(a,b)=>{try{return Cb(a,b),20}catch(c){}return Lb(a,"wx")},Qb=(a,b,c)=>{try{var d=Cb(a,b)}catch(f){return f.Ka}if(a=Lb(a,"wx"))return a;if(c){if(16384!==(d.mode&61440))return 54;if(d===d.parent||"/"===ea(d))return 10}else if(16384===(d.mode&61440))return 31;return 0},Rb=(a=0,b=4096)=>{for(;a<=b;a++)if(!T[a])return a;throw new Q(33);},Tb=(a,b)=>{Sb||
(Sb=function(){},Sb.prototype={});a=Object.assign(new Sb,a);b=Rb(b,void 0);a.fd=b;return T[b]=a},zb={open:a=>{a.Ha=Fb[a.node.rdev].Ha;a.Ha.open&&a.Ha.open(a)},Ta:()=>{throw new Q(70);}},vb=(a,b)=>{Fb[a]={Ha:b}},Ub=(a,b)=>{var c="/"===b,d=!b;if(c&&Eb)throw new Q(10);if(!c&&!d){var f=V(b,{rb:!1});b=f.path;f=f.node;if(f.Va)throw new Q(10);if(16384!==(f.mode&61440))throw new Q(54);}b={type:a,Lb:{},ub:b,Eb:[]};a=a.Ra(b);a.Ra=b;b.root=a;c?Eb=a:f&&(f.Va=b,f.Ra&&f.Ra.Eb.push(b))},ha=(a,b,c)=>{var d=V(a,{parent:!0}).node;
a=kb(a);if(!a||"."===a||".."===a)throw new Q(28);var f=Pb(d,a);if(f)throw new Q(f);if(!d.Ga.$a)throw new Q(63);return d.Ga.$a(d,a,b,c)},W=(a,b)=>ha(a,(void 0!==b?b:511)&1023|16384,0),Vb=(a,b,c)=>{"undefined"==typeof c&&(c=b,b=438);ha(a,b|8192,c)},Wb=(a,b)=>{if(!sb(a))throw new Q(44);var c=V(b,{parent:!0}).node;if(!c)throw new Q(44);b=kb(b);var d=Pb(c,b);if(d)throw new Q(d);if(!c.Ga.symlink)throw new Q(63);c.Ga.symlink(c,b,a)},Xb=a=>{var b=V(a,{parent:!0}).node;a=kb(a);var c=Cb(b,a),d=Qb(b,a,!0);if(d)throw new Q(d);
if(!b.Ga.rmdir)throw new Q(63);if(c.Va)throw new Q(10);b.Ga.rmdir(b,a);Kb(c)},sa=a=>{var b=V(a,{parent:!0}).node;if(!b)throw new Q(44);a=kb(a);var c=Cb(b,a),d=Qb(b,a,!1);if(d)throw new Q(d);if(!b.Ga.unlink)throw new Q(63);if(c.Va)throw new Q(10);b.Ga.unlink(b,a);Kb(c)},Ib=a=>{a=V(a).node;if(!a)throw new Q(44);if(!a.Ga.readlink)throw new Q(28);return sb(ea(a.parent),a.Ga.readlink(a))},Yb=(a,b)=>{a=V(a,{Sa:!b}).node;if(!a)throw new Q(44);if(!a.Ga.Pa)throw new Q(63);return a.Ga.Pa(a)},Zb=a=>Yb(a,!0),
ia=(a,b)=>{a="string"==typeof a?V(a,{Sa:!0}).node:a;if(!a.Ga.Oa)throw new Q(63);a.Ga.Oa(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()})},$b=(a,b)=>{if(0>b)throw new Q(28);a="string"==typeof a?V(a,{Sa:!0}).node:a;if(!a.Ga.Oa)throw new Q(63);if(16384===(a.mode&61440))throw new Q(31);if(32768!==(a.mode&61440))throw new Q(28);var c=Lb(a,"w");if(c)throw new Q(c);a.Ga.Oa(a,{size:b,timestamp:Date.now()})},A=(a,b,c,d)=>{if(""===a)throw new Q(44);if("string"==typeof b){var f=Nb[b];if("undefined"==typeof f)throw Error("Unknown file open mode: "+
b);b=f}c=b&64?("undefined"==typeof c?438:c)&4095|32768:0;if("object"==typeof a)var h=a;else{a=z(a);try{h=V(a,{Sa:!(b&131072)}).node}catch(l){}}f=!1;if(b&64)if(h){if(b&128)throw new Q(20);}else h=ha(a,c,0),f=!0;if(!h)throw new Q(44);8192===(h.mode&61440)&&(b&=-513);if(b&65536&&16384!==(h.mode&61440))throw new Q(54);if(!f&&(c=h?40960===(h.mode&61440)?32:16384===(h.mode&61440)&&("r"!==Ob(b)||b&512)?31:Lb(h,Ob(b)):44))throw new Q(c);b&512&&$b(h,0);b&=-131713;d=Tb({node:h,path:ea(h),flags:b,seekable:!0,
position:0,Ha:h.Ha,Ib:[],error:!1},d);d.Ha.open&&d.Ha.open(d);!e.logReadFiles||b&1||(ac||(ac={}),a in ac||(ac[a]=1));return d},ka=a=>{if(null===a.fd)throw new Q(8);a.hb&&(a.hb=null);try{a.Ha.close&&a.Ha.close(a)}catch(b){throw b;}finally{T[a.fd]=null}a.fd=null},bc=(a,b,c)=>{if(null===a.fd)throw new Q(8);if(!a.seekable||!a.Ha.Ta)throw new Q(70);if(0!=c&&1!=c&&2!=c)throw new Q(28);a.position=a.Ha.Ta(a,b,c);a.Ib=[]},cc=(a,b,c,d,f)=>{if(0>d||0>f)throw new Q(28);if(null===a.fd)throw new Q(8);if(1===(a.flags&
2097155))throw new Q(8);if(16384===(a.node.mode&61440))throw new Q(31);if(!a.Ha.read)throw new Q(28);var h="undefined"!=typeof f;if(!h)f=a.position;else if(!a.seekable)throw new Q(70);b=a.Ha.read(a,b,c,d,f);h||(a.position+=b);return b},ja=(a,b,c,d,f,h)=>{if(0>d||0>f)throw new Q(28);if(null===a.fd)throw new Q(8);if(0===(a.flags&2097155))throw new Q(8);if(16384===(a.node.mode&61440))throw new Q(31);if(!a.Ha.write)throw new Q(28);a.seekable&&a.flags&1024&&bc(a,0,2);var l="undefined"!=typeof f;if(!l)f=
a.position;else if(!a.seekable)throw new Q(70);b=a.Ha.write(a,b,c,d,f,h);l||(a.position+=b);return b},ra=a=>{var b="binary";if("utf8"!==b&&"binary"!==b)throw Error('Invalid encoding type "'+b+'"');var c;var d=A(a,d||0);a=Yb(a).size;var f=new Uint8Array(a);cc(d,f,0,a,0);"utf8"===b?c=Sa(f,0):"binary"===b&&(c=f);ka(d);return c},Ec=()=>{Q||(Q=function(a,b){this.node=b;this.Hb=function(c){this.Ka=c};this.Hb(a);this.message="FS error"},Q.prototype=Error(),Q.prototype.constructor=Q,[44].forEach(a=>{Bb[a]=
new Q(a);Bb[a].stack="<generic error, no stack>"}))},Gc,fa=(a,b)=>{var c=0;a&&(c|=365);b&&(c|=146);return c},Ic=(a,b,c)=>{a=z("/dev/"+a);var d=fa(!!b,!!c);Hc||(Hc=64);var f=Hc++<<8|0;vb(f,{open:h=>{h.seekable=!1},close:()=>{c&&c.buffer&&c.buffer.length&&c(10)},read:(h,l,q,v)=>{for(var x=0,C=0;C<v;C++){try{var S=b()}catch(mb){throw new Q(29);}if(void 0===S&&0===x)throw new Q(6);if(null===S||void 0===S)break;x++;l[q+C]=S}x&&(h.node.timestamp=Date.now());return x},write:(h,l,q,v)=>{for(var x=0;x<v;x++)try{c(l[q+
x])}catch(C){throw new Q(29);}v&&(h.node.timestamp=Date.now());return x}});Vb(a,d,f)},Hc,X={},Sb,ac;function Jc(a,b,c){if("/"===b[0])return b;if(-100===a)a="/";else{a=T[a];if(!a)throw new Q(8);a=a.path}if(0==b.length){if(!c)throw new Q(44);return a}return z(a+"/"+b)}
function Kc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&z(b)!==z(ea(f.node)))return-54;throw f;}M[c>>2]=d.dev;M[c+4>>2]=0;M[c+8>>2]=d.ino;M[c+12>>2]=d.mode;M[c+16>>2]=d.nlink;M[c+20>>2]=d.uid;M[c+24>>2]=d.gid;M[c+28>>2]=d.rdev;M[c+32>>2]=0;N=[d.size>>>0,(O=d.size,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];M[c+40>>2]=N[0];M[c+44>>2]=N[1];M[c+48>>2]=4096;M[c+52>>2]=d.blocks;M[c+56>>2]=d.atime.getTime()/1E3|0;M[c+60>>2]=
0;M[c+64>>2]=d.mtime.getTime()/1E3|0;M[c+68>>2]=0;M[c+72>>2]=d.ctime.getTime()/1E3|0;M[c+76>>2]=0;N=[d.ino>>>0,(O=d.ino,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];M[c+80>>2]=N[0];M[c+84>>2]=N[1];return 0}var Lc=void 0;function Mc(){Lc+=4;return M[Lc-4>>2]}function Z(a){a=T[a];if(!a)throw new Q(8);return a}
function Nc(a,b,c){function d(v){return(v=v.toTimeString().match(/\(([A-Za-z ]+)\)$/))?v[1]:"GMT"}var f=(new Date).getFullYear(),h=new Date(f,0,1),l=new Date(f,6,1);f=h.getTimezoneOffset();var q=l.getTimezoneOffset();M[a>>2]=60*Math.max(f,q);M[b>>2]=Number(f!=q);a=d(h);b=d(l);a=Ta(a);b=Ta(b);q<f?(M[c>>2]=a,M[c+4>>2]=b):(M[c>>2]=b,M[c+4>>2]=a)}function Oc(a,b,c){Oc.Bb||(Oc.Bb=!0,Nc(a,b,c))}var Pc;Pc=za?()=>{var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:()=>performance.now();var Qc={};
function Rc(){if(!Sc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:wa||"./this.program"},b;for(b in Qc)void 0===Qc[b]?delete a[b]:a[b]=Qc[b];var c=[];for(b in a)c.push(b+"="+a[b]);Sc=c}return Sc}var Sc;function Mb(a,b,c,d){a||(a=this);this.parent=a;this.Ra=a.Ra;this.Va=null;this.id=Gb++;this.name=b;this.mode=c;this.Ga={};this.Ha={};this.rdev=d}
Object.defineProperties(Mb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});Ec();U=Array(4096);Ub(R,"/");W("/tmp");W("/home");W("/home/web_user");
(()=>{W("/dev");vb(259,{read:()=>0,write:(b,c,d,f)=>f});Vb("/dev/null",259);ub(1280,xb);ub(1536,yb);Vb("/dev/tty",1280);Vb("/dev/tty1",1536);var a=lb();Ic("random",a);Ic("urandom",a);W("/dev/shm");W("/dev/shm/tmp")})();(()=>{W("/proc");var a=W("/proc/self");W("/proc/self/fd");Ub({Ra:()=>{var b=Ab(a,"fd",16895,73);b.Ga={lookup:(c,d)=>{var f=T[+d];if(!f)throw new Q(8);c={parent:null,Ra:{ub:"fake"},Ga:{readlink:()=>f.path}};return c.parent=c}};return b}},"/proc/self/fd")})();
function la(a,b){var c=Array(ca(a)+1);a=t(a,c,0,c.length);b&&(c.length=a);return c}
var Uc={a:function(a,b,c,d){L("Assertion failed: "+D(a)+", at: "+[b?D(b):"unknown filename",c,d?D(d):"unknown function"])},h:function(a,b){try{return a=D(a),ia(a,b),0}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return-c.Ka}},H:function(a,b,c){try{b=D(b);b=Jc(a,b);if(c&-8)var d=-28;else{var f=V(b,{Sa:!0}).node;f?(a="",c&4&&(a+="r"),c&2&&(a+="w"),c&1&&(a+="x"),d=a&&Lb(f,a)?-2:0):d=-44}return d}catch(h){if("undefined"==typeof X||!(h instanceof Q))throw h;return-h.Ka}},i:function(a,b){try{var c=
T[a];if(!c)throw new Q(8);ia(c.node,b);return 0}catch(d){if("undefined"==typeof X||!(d instanceof Q))throw d;return-d.Ka}},g:function(a){try{var b=T[a];if(!b)throw new Q(8);var c=b.node;var d="string"==typeof c?V(c,{Sa:!0}).node:c;if(!d.Ga.Oa)throw new Q(63);d.Ga.Oa(d,{timestamp:Date.now()});return 0}catch(f){if("undefined"==typeof X||!(f instanceof Q))throw f;return-f.Ka}},b:function(a,b,c){Lc=c;try{var d=Z(a);switch(b){case 0:var f=Mc();return 0>f?-28:A(d.path,d.flags,0,f).fd;case 1:case 2:return 0;
case 3:return d.flags;case 4:return f=Mc(),d.flags|=f,0;case 5:return f=Mc(),Ja[f+0>>1]=2,0;case 6:case 7:return 0;case 16:case 8:return-28;case 9:return M[Tc()>>2]=28,-1;default:return-28}}catch(h){if("undefined"==typeof X||!(h instanceof Q))throw h;return-h.Ka}},G:function(a,b){try{var c=Z(a);return Kc(Yb,c.path,b)}catch(d){if("undefined"==typeof X||!(d instanceof Q))throw d;return-d.Ka}},B:function(a,b){try{var c=T[a];if(!c)throw new Q(8);if(0===(c.flags&2097155))throw new Q(28);$b(c.node,b);return 0}catch(d){if("undefined"==
typeof X||!(d instanceof Q))throw d;return-d.Ka}},A:function(a,b){try{if(0===b)return-28;if(b<ca("/")+1)return-68;t("/",y,a,b);return a}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return-c.Ka}},E:function(a,b){try{return a=D(a),Kc(Zb,a,b)}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return-c.Ka}},x:function(a,b){try{return a=D(a),a=z(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),W(a,b),0}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return-c.Ka}},
D:function(a,b,c,d){try{b=D(b);var f=d&256;b=Jc(a,b,d&4096);return Kc(f?Zb:Yb,b,c)}catch(h){if("undefined"==typeof X||!(h instanceof Q))throw h;return-h.Ka}},u:function(a,b,c,d){Lc=d;try{b=D(b);b=Jc(a,b);var f=d?Mc():0;return A(b,c,f).fd}catch(h){if("undefined"==typeof X||!(h instanceof Q))throw h;return-h.Ka}},s:function(a,b,c,d){try{b=D(b);b=Jc(a,b);if(0>=d)var f=-28;else{var h=Ib(b),l=Math.min(d,ca(h)),q=n[c+l];t(h,y,c,d+1);n[c+l]=q;f=l}return f}catch(v){if("undefined"==typeof X||!(v instanceof
Q))throw v;return-v.Ka}},r:function(a){try{return a=D(a),Xb(a),0}catch(b){if("undefined"==typeof X||!(b instanceof Q))throw b;return-b.Ka}},F:function(a,b){try{return a=D(a),Kc(Yb,a,b)}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return-c.Ka}},o:function(a,b,c){try{return b=D(b),b=Jc(a,b),0===c?sa(b):512===c?Xb(b):L("Invalid flags passed to unlinkat"),0}catch(d){if("undefined"==typeof X||!(d instanceof Q))throw d;return-d.Ka}},m:function(a,b,c){try{b=D(b);b=Jc(a,b,!0);if(c){var d=
M[c>>2],f=M[c+4>>2];h=1E3*d+f/1E6;c+=8;d=M[c>>2];f=M[c+4>>2];l=1E3*d+f/1E6}else var h=Date.now(),l=h;a=h;var q=V(b,{Sa:!0}).node;q.Ga.Oa(q,{timestamp:Math.max(a,l)});return 0}catch(v){if("undefined"==typeof X||!(v instanceof Q))throw v;return-v.Ka}},e:function(){return Date.now()},j:function(a,b){a=new Date(1E3*M[a>>2]);M[b>>2]=a.getSeconds();M[b+4>>2]=a.getMinutes();M[b+8>>2]=a.getHours();M[b+12>>2]=a.getDate();M[b+16>>2]=a.getMonth();M[b+20>>2]=a.getFullYear()-1900;M[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),
0,1);M[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;M[b+36>>2]=-(60*a.getTimezoneOffset());var d=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();c=c.getTimezoneOffset();M[b+32>>2]=(d!=c&&a.getTimezoneOffset()==Math.min(c,d))|0},v:function(a,b,c,d,f,h,l){try{var q=T[f];if(!q)return-8;if(0!==(c&2)&&0===(d&2)&&2!==(q.flags&2097155))throw new Q(2);if(1===(q.flags&2097155))throw new Q(2);if(!q.Ha.ab)throw new Q(43);var v=q.Ha.ab(q,a,b,h,c,d);var x=v.Fb;M[l>>2]=v.vb;return x}catch(C){if("undefined"==
typeof X||!(C instanceof Q))throw C;return-C.Ka}},w:function(a,b,c,d,f,h){try{var l=T[f];if(l&&c&2){var q=y.slice(a,a+b);l&&l.Ha.bb&&l.Ha.bb(l,q,h,b,d)}}catch(v){if("undefined"==typeof X||!(v instanceof Q))throw v;return-v.Ka}},n:Oc,p:function(){return 2147483648},d:Pc,c:function(a){var b=y.length;a>>>=0;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);var f=Math;d=Math.max(a,d);f=f.min.call(f,2147483648,d+(65536-d%65536)%65536);a:{try{Ma.grow(f-Ua.byteLength+
65535>>>16);Va();var h=1;break a}catch(l){}h=void 0}if(h)return!0}return!1},y:function(a,b){var c=0;Rc().forEach(function(d,f){var h=b+c;f=M[a+4*f>>2]=h;for(h=0;h<d.length;++h)n[f++>>0]=d.charCodeAt(h);n[f>>0]=0;c+=d.length+1});return 0},z:function(a,b){var c=Rc();M[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});M[b>>2]=d;return 0},f:function(a){try{var b=Z(a);ka(b);return 0}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return c.Ka}},l:function(a,b){try{var c=Z(a);n[b>>
0]=c.tty?2:16384===(c.mode&61440)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){if("undefined"==typeof X||!(d instanceof Q))throw d;return d.Ka}},t:function(a,b,c,d){try{a:{for(var f=Z(a),h=a=0;h<c;h++){var l=M[b+(8*h+4)>>2],q=cc(f,n,M[b+8*h>>2],l,void 0);if(0>q){var v=-1;break a}a+=q;if(q<l)break}v=a}M[d>>2]=v;return 0}catch(x){if("undefined"==typeof X||!(x instanceof Q))throw x;return x.Ka}},k:function(a,b,c,d,f){try{var h=Z(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=
a)return-61;bc(h,a,d);N=[h.position>>>0,(O=h.position,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];M[f>>2]=N[0];M[f+4>>2]=N[1];h.hb&&0===a&&0===d&&(h.hb=null);return 0}catch(l){if("undefined"==typeof X||!(l instanceof Q))throw l;return l.Ka}},C:function(a){try{var b=Z(a);return b.Ha&&b.Ha.fsync?-b.Ha.fsync(b):0}catch(c){if("undefined"==typeof X||!(c instanceof Q))throw c;return c.Ka}},q:function(a,b,c,d){try{a:{for(var f=
Z(a),h=a=0;h<c;h++){var l=ja(f,n,M[b+8*h>>2],M[b+(8*h+4)>>2],void 0);if(0>l){var q=-1;break a}a+=l}q=a}M[d>>2]=q;return 0}catch(v){if("undefined"==typeof X||!(v instanceof Q))throw v;return v.Ka}}};
(function(){function a(f){e.asm=f.exports;Ma=e.asm.I;Va();J=e.asm.Aa;Xa.unshift(e.asm.J);$a--;e.monitorRunDependencies&&e.monitorRunDependencies($a);0==$a&&(null!==ab&&(clearInterval(ab),ab=null),bb&&(f=bb,bb=null,f()))}function b(f){a(f.instance)}function c(f){return fb().then(function(h){return WebAssembly.instantiate(h,d)}).then(function(h){return h}).then(f,function(h){I("failed to asynchronously prepare wasm: "+h);L(h)})}var d={a:Uc};$a++;e.monitorRunDependencies&&e.monitorRunDependencies($a);
if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return I("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return Ia||"function"!=typeof WebAssembly.instantiateStreaming||cb()||P.startsWith("file://")||"function"!=typeof fetch?c(b):fetch(P,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(h){I("wasm streaming compile failed: "+h);I("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();
e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.J).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.K).apply(null,arguments)};e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.L).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.M).apply(null,arguments)};var Tc=e.___errno_location=function(){return(Tc=e.___errno_location=e.asm.N).apply(null,arguments)};
e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.O).apply(null,arguments)};e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.P).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.Q).apply(null,arguments)};e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.R).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.S).apply(null,arguments)};
e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.T).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.U).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.V).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.W).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.X).apply(null,arguments)};
e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.Y).apply(null,arguments)};e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.Z).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm._).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.$).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.aa).apply(null,arguments)};
e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ba).apply(null,arguments)};e._sqlite3_sql=function(){return(e._sqlite3_sql=e.asm.ca).apply(null,arguments)};e._sqlite3_aggregate_context=function(){return(e._sqlite3_aggregate_context=e.asm.da).apply(null,arguments)};e._sqlite3_column_count=function(){return(e._sqlite3_column_count=e.asm.ea).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.fa).apply(null,arguments)};
e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ga).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ha).apply(null,arguments)};e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ia).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ja).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ka).apply(null,arguments)};
e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.la).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.ma).apply(null,arguments)};e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.na).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.pa).apply(null,arguments)};
e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.qa).apply(null,arguments)};e._sqlite3_normalized_sql=function(){return(e._sqlite3_normalized_sql=e.asm.ra).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.sa).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.ta).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.ua).apply(null,arguments)};
e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.va).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.wa).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.xa).apply(null,arguments)};var da=e._malloc=function(){return(da=e._malloc=e.asm.ya).apply(null,arguments)},ba=e._free=function(){return(ba=e._free=e.asm.za).apply(null,arguments)};
e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.Ba).apply(null,arguments)};var Db=e._emscripten_builtin_memalign=function(){return(Db=e._emscripten_builtin_memalign=e.asm.Ca).apply(null,arguments)},na=e.stackSave=function(){return(na=e.stackSave=e.asm.Da).apply(null,arguments)},pa=e.stackRestore=function(){return(pa=e.stackRestore=e.asm.Ea).apply(null,arguments)},B=e.stackAlloc=function(){return(B=e.stackAlloc=e.asm.Fa).apply(null,arguments)};
e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(h){return"number"===h});return"string"!==b&&f&&!d?e["_"+a]:function(){return Oa(a,b,c,arguments)}};e.UTF8ToString=D;e.stackSave=na;e.stackRestore=pa;e.stackAlloc=B;var Vc;bb=function Wc(){Vc||Xc();Vc||(bb=Wc)};
function Xc(){function a(){if(!Vc&&(Vc=!0,e.calledRun=!0,!Na)){e.noFSInit||Gc||(Gc=!0,Ec(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Ic("stdin",e.stdin):Wb("/dev/tty","/dev/stdin"),e.stdout?Ic("stdout",null,e.stdout):Wb("/dev/tty","/dev/stdout"),e.stderr?Ic("stderr",null,e.stderr):Wb("/dev/tty1","/dev/stderr"),A("/dev/stdin",0),A("/dev/stdout",1),A("/dev/stderr",1));Hb=!1;gb(Xa);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=
[e.postRun]);e.postRun.length;){var b=e.postRun.shift();Ya.unshift(b)}gb(Ya)}}if(!(0<$a)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)Za();gb(Wa);0<$a||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=Xc;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();Xc();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    var config = data["config"] ? data["config"] : {};
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"], config)
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done, config);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
