var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function i(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function r(t,n,e,o){return t[1]&&o?function(t,n){for(const e in n)t[e]=n[e];return t}(e.ctx.slice(),t[1](o(n))):e.ctx}function a(t,n,e,o,i,c,a){const l=function(t,n,e,o){if(t[2]&&o){const i=t[2](o(e));if(void 0===n.dirty)return i;if("object"==typeof i){const t=[],e=Math.max(n.dirty.length,i.length);for(let o=0;o<e;o+=1)t[o]=n.dirty[o]|i[o];return t}return n.dirty|i}return n.dirty}(n,o,i,c);if(l){const i=r(n,e,o,a);t.p(i,l)}}function l(t,n){t.appendChild(n)}function u(t,n,e){t.insertBefore(n,e||null)}function s(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function p(){return f(" ")}function m(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function $(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function h(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function g(t,n){t.value=null==n?"":n}function v(t,n,e){t.classList[e?"add":"remove"](n)}let y;function w(t){y=t}function x(){if(!y)throw new Error("Function called outside component initialization");return y}function b(){const t=x();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const i=function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(n,e);o.slice().forEach((n=>{n.call(t,i)}))}}}const k=[],_=[],j=[],C=[],O=Promise.resolve();let S=!1;function E(t){j.push(t)}function B(t){C.push(t)}let P=!1;const T=new Set;function A(){if(!P){P=!0;do{for(let t=0;t<k.length;t+=1){const n=k[t];w(n),I(n.$$)}for(w(null),k.length=0;_.length;)_.pop()();for(let t=0;t<j.length;t+=1){const n=j[t];T.has(n)||(T.add(n),n())}j.length=0}while(k.length);for(;C.length;)C.pop()();S=!1,P=!1,T.clear()}}function I(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(E)}}const X=new Set;let N;function U(t,n){t&&t.i&&(X.delete(t),t.i(n))}function L(t,n,e,o){if(t&&t.o){if(X.has(t))return;X.add(t),N.c.push((()=>{X.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}function V(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function M(t){t&&t.c()}function D(t,e,c){const{fragment:r,on_mount:a,on_destroy:l,after_update:u}=t.$$;r&&r.m(e,c),E((()=>{const e=a.map(n).filter(i);l?l.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(E)}function q(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function H(t,n){-1===t.$$.dirty[0]&&(k.push(t),S||(S=!0,O.then(A)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function z(n,i,c,r,a,l,u=[-1]){const d=y;w(n);const f=n.$$={fragment:null,ctx:null,props:l,update:t,not_equal:a,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:e(),dirty:u,skip_bound:!1};let p=!1;if(f.ctx=c?c(n,i.props||{},((t,e,...o)=>{const i=o.length?o[0]:e;return f.ctx&&a(f.ctx[t],f.ctx[t]=i)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](i),p&&H(n,t)),e})):[],f.update(),p=!0,o(f.before_update),f.fragment=!!r&&r(f.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);f.fragment&&f.fragment.l(t),t.forEach(s)}else f.fragment&&f.fragment.c();i.intro&&U(n.$$.fragment),D(n,i.target,i.anchor),A()}w(d)}class J{$destroy(){q(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}class F extends J{constructor(t){super(),z(this,t,null,null,c,{})}}function G(t){let n,e,c,g,v,y,w,x,b,k,_,j,C,O,S,E,B,P,T,A=t[1].label+"",I=t[2].prefix+"",X=t[2].label+"";const N=t[4].default,V=function(t,n,e,o){if(t){const i=r(t,n,e,o);return t[0](i)}}(N,t,t[3],null);return{c(){n=d("div"),e=d("h1"),c=f(t[0]),g=p(),v=d("form"),y=d("div"),V&&V.c(),w=p(),x=d("button"),b=f(A),k=p(),_=d("div"),j=d("p"),C=f(I),O=p(),S=d("p"),E=f(X),$(e,"class","containter text-3xl text-coolGreen-default font-bold big-text pt-20 lg:pt-11 pb-3 leading-9"),$(x,"type","button"),$(x,"data-automation-id","form-button"),$(x,"class","text-gray-50 bg-coolGreen-default py-1 px-5 text-xl uppercase font-medium mt-10 rounded-3xl"),$(v,"class","m-auto"),$(S,"class","cursor-pointer"),$(_,"class","grid grid-cols-2 col-auto mt-9 pb-5 lg:pb-10"),$(n,"class","md:shadow-xl max-w-none max-h-none w-full md:max-w-sm  m-auto bg-opacity-50 rounded-3xl border-white md:border-gray-200 border-2 bg-white")},m(o,r){var a;u(o,n,r),l(n,e),l(e,c),l(n,g),l(n,v),l(v,y),V&&V.m(y,null),l(v,w),l(v,x),l(x,b),l(n,k),l(n,_),l(_,j),l(j,C),l(_,O),l(_,S),l(S,E),B=!0,P||(T=[m(x,"click",(a=function(){i(t[1].onclick)&&t[1].onclick.apply(this,arguments)},function(t){return t.preventDefault(),a.call(this,t)})),m(S,"click",(function(){i(t[2].onclick)&&t[2].onclick.apply(this,arguments)}))],P=!0)},p(n,[e]){t=n,(!B||1&e)&&h(c,t[0]),V&&V.p&&8&e&&a(V,N,t,t[3],e,null,null),(!B||2&e)&&A!==(A=t[1].label+"")&&h(b,A),(!B||4&e)&&I!==(I=t[2].prefix+"")&&h(C,I),(!B||4&e)&&X!==(X=t[2].label+"")&&h(E,X)},i(t){B||(U(V,t),B=!0)},o(t){L(V,t),B=!1},d(t){t&&s(n),V&&V.d(t),P=!1,o(T)}}}function R(t,n,e){let{$$slots:o={},$$scope:i}=n,{title:c}=n,{actionButton:r}=n,{linkButton:a}=n;return t.$$set=t=>{"title"in t&&e(0,c=t.title),"actionButton"in t&&e(1,r=t.actionButton),"linkButton"in t&&e(2,a=t.linkButton),"$$scope"in t&&e(3,i=t.$$scope)},[c,r,a,i,o]}class Y extends J{constructor(t){super(),z(this,t,R,G,c,{title:0,actionButton:1,linkButton:2})}}function K(t){let n,e,i;return{c(){n=d("input"),$(n,"class","sobaka-input mt-5"),$(n,"type","password"),$(n,"data-automation-id","pwd-input"),$(n,"placeholder",t[1])},m(o,c){u(o,n,c),g(n,t[0]),e||(i=[m(n,"input",t[7]),m(n,"input",t[3])],e=!0)},p(t,e){2&e&&$(n,"placeholder",t[1]),1&e&&n.value!==t[0]&&g(n,t[0])},d(t){t&&s(n),e=!1,o(i)}}}function Q(t){let n,e,i;return{c(){n=d("input"),$(n,"class","sobaka-input mt-5"),$(n,"data-automation-id","pwd-input"),$(n,"type","text"),$(n,"placeholder",t[1])},m(o,c){u(o,n,c),g(n,t[0]),e||(i=[m(n,"input",t[6]),m(n,"input",t[3])],e=!0)},p(t,e){2&e&&$(n,"placeholder",t[1]),1&e&&n.value!==t[0]&&g(n,t[0])},d(t){t&&s(n),e=!1,o(i)}}}function W(n){let e,o,i,c,r;function a(t,n){return t[2]?Q:K}let f=a(n),h=f(n);return{c(){h.c(),e=p(),o=d("div"),i=d("div"),i.innerHTML='<img src="images/show-password.svg" alt="show-password"/>',$(i,"class","svelte-1fciskn"),v(i,"show",n[2]),$(o,"class","pt-8 absolute float-right ml-48 md:ml-52 cursor-pointer")},m(t,a){h.m(t,a),u(t,e,a),u(t,o,a),l(o,i),c||(r=m(o,"click",n[8]),c=!0)},p(t,[n]){f===(f=a(t))&&h?h.p(t,n):(h.d(1),h=f(t),h&&(h.c(),h.m(e.parentNode,e))),4&n&&v(i,"show",t[2])},i:t,o:t,d(t){h.d(t),t&&s(e),t&&s(o),c=!1,r()}}}function Z(t,n,e){let{value:o}=n,{placeholder:i}=n,{isValid:c=!1}=n,{validator:r}=n,a=!1;return t.$$set=t=>{"value"in t&&e(0,o=t.value),"placeholder"in t&&e(1,i=t.placeholder),"isValid"in t&&e(4,c=t.isValid),"validator"in t&&e(5,r=t.validator)},[o,i,a,()=>{e(4,c=!r||r(o))},c,r,function(){o=this.value,e(0,o)},function(){o=this.value,e(0,o)},()=>e(2,a=!a)]}class tt extends J{constructor(t){super(),z(this,t,Z,W,c,{value:0,placeholder:1,isValid:4,validator:5})}}function nt(n){let e,i,c,r,a;return{c(){e=d("input"),i=p(),c=d("input"),$(e,"type","text"),$(e,"class","sobaka-input code w-1/5"),$(e,"data-automation-id","country-code--input"),e.required=!0,$(c,"class","sobaka-input tel w-4/5"),$(c,"type","text"),$(c,"data-automation-id","phone-input"),$(c,"placeholder","XXXX-XXX-XXX"),c.required=!0},m(t,o){u(t,e,o),g(e,n[1]),u(t,i,o),u(t,c,o),g(c,n[0]),r||(a=[m(e,"input",n[5]),m(c,"input",n[6]),m(c,"input",n[2])],r=!0)},p(t,[n]){2&n&&e.value!==t[1]&&g(e,t[1]),1&n&&c.value!==t[0]&&g(c,t[0])},i:t,o:t,d(t){t&&s(e),t&&s(i),t&&s(c),r=!1,o(a)}}}function et(t,n,e){let{value:o}=n,{isValid:i=!1}=n,{countryCode:c}=n,{validator:r}=n;return t.$$set=t=>{"value"in t&&e(0,o=t.value),"isValid"in t&&e(3,i=t.isValid),"countryCode"in t&&e(1,c=t.countryCode),"validator"in t&&e(4,r=t.validator)},[o,c,()=>{e(3,i=!r||r(o))},i,r,function(){c=this.value,e(1,c)},function(){o=this.value,e(0,o)}]}class ot extends J{constructor(t){super(),z(this,t,et,nt,c,{value:0,isValid:3,countryCode:1,validator:4})}}const it="http://ec2-18-195-116-110.eu-central-1.compute.amazonaws.com:80",ct=it.concat("/login"),rt=it.concat("/authentication"),at=it.concat("/signup"),lt=it.concat("/logout"),ut=it.concat("/statement"),st={credentials:"include",headers:{"Content-Type":"application/json"}},dt=(t,n)=>{const e=new Date(t),o=e.getMonth(),i=e.getFullYear();return"current"===n?{from:new Date(i,o).valueOf(),to:t}:((t,n)=>{const e=t>0?t-1:11;return{from:new Date(11!==e?n:n-1,e).valueOf(),to:new Date(n,t).valueOf()}})(o,i)},ft=async(t,n)=>{const{from:e,to:o}=dt(t,n);return await fetch(ut,{credentials:"include",headers:{"Content-Type":"application/json","Cache-Control":"no-cache, no-store, must-revalidate"},method:"POST",body:JSON.stringify({account:0,from:e,to:o})}).then((t=>t.json))};function pt(t){let n,e,o,i,c,r,a,f,m;function h(n){t[4].call(null,n)}let g={countryCode:$t};function v(n){t[5].call(null,n)}void 0!==t[0]&&(g.value=t[0]),o=new ot({props:g}),_.push((()=>V(o,"value",h)));let y={placeholder:"Password"};return void 0!==t[1]&&(y.value=t[1]),a=new tt({props:y}),_.push((()=>V(a,"value",v))),{c(){n=d("div"),e=d("div"),M(o.$$.fragment),c=p(),r=d("div"),M(a.$$.fragment),$(e,"class","phone flex justify-center w-3/4 self-center"),$(r,"class","flex items-center justify-center w-full self-center"),$(n,"class","flex flex-col justify-center w-full")},m(t,i){u(t,n,i),l(n,e),D(o,e,null),l(n,c),l(n,r),D(a,r,null),m=!0},p(t,n){const e={};!i&&1&n&&(i=!0,e.value=t[0],B((()=>i=!1))),o.$set(e);const c={};!f&&2&n&&(f=!0,c.value=t[1],B((()=>f=!1))),a.$set(c)},i(t){m||(U(o.$$.fragment,t),U(a.$$.fragment,t),m=!0)},o(t){L(o.$$.fragment,t),L(a.$$.fragment,t),m=!1},d(t){t&&s(n),q(o),q(a)}}}function mt(t){let n,e;return n=new Y({props:{title:"Sign in to Exodus",linkButton:t[3],actionButton:t[2],$$slots:{default:[pt]},$$scope:{ctx:t}}}),{c(){M(n.$$.fragment)},m(t,o){D(n,t,o),e=!0},p(t,[e]){const o={};515&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(U(n.$$.fragment,t),e=!0)},o(t){L(n.$$.fragment,t),e=!1},d(t){q(n,t)}}}let $t="380";function ht(t,n,e){let o;var i=this&&this.__awaiter||function(t,n,e,o){return new(e||(e=Promise))((function(i,c){function r(t){try{l(o.next(t))}catch(t){c(t)}}function a(t){try{l(o.throw(t))}catch(t){c(t)}}function l(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,a)}l((o=o.apply(t,n||[])).next())}))};let c,r;const a=b(),l={label:"Sign In",onclick:()=>i(void 0,void 0,void 0,(function*(){const t=yield(async(t,n)=>{console.log(it);const e=await fetch(ct,Object.assign(Object.assign({},st),{method:"POST",body:JSON.stringify({username:t,password:n})})),{status:o}=e;if(200===o){const{user_id:t}=await e.json();return{status:o,user_id:t}}const{message:i}=await e.json();return{status:o,message:i}})(o,r);a("login",t)}))},u={prefix:"New to Exodus?",label:"Join Now",onclick:()=>a("openSignUp",{})};return t.$$.update=()=>{1&t.$$.dirty&&(o=$t+c)},[c,r,l,u,function(t){c=t,e(0,c)},function(t){r=t,e(1,r)}]}class gt extends J{constructor(t){super(),z(this,t,ht,mt,c,{})}}function vt(n){let e;return{c(){e=d("main"),e.innerHTML='<div class="mono pt-4 svelte-r4zdom"><a href="https://api.monobank.ua" class="flex rounded-lg svelte-r4zdom"><img src="images/mono-logo.png" alt="mono"/></a></div>',$(e,"class","flex justify-center mt-5 bg-white ml-2")},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&s(e)}}}class yt extends J{constructor(t){super(),z(this,t,null,vt,c,{})}}function wt(t){let n,e,i,c,r,a,f,h,v,y,w,x,b,k,j,C,O,S,E,P,T;function A(n){t[7].call(null,n)}let I={placeholder:"Password"};function X(n){t[8].call(null,n)}void 0!==t[1]&&(I.value=t[1]),a=new tt({props:I}),_.push((()=>V(a,"value",A)));let N={placeholder:"Confirm Password"};return void 0!==t[3]&&(N.value=t[3]),y=new tt({props:N}),_.push((()=>V(y,"value",X))),S=new yt({}),{c(){n=d("div"),e=d("div"),i=d("input"),c=p(),r=d("div"),M(a.$$.fragment),h=p(),v=d("div"),M(y.$$.fragment),x=p(),b=d("div"),k=d("div"),j=d("input"),C=p(),O=d("div"),M(S.$$.fragment),$(i,"class","sobaka-input"),$(i,"type","text"),$(i,"placeholder","Phone number"),i.required=!0,$(e,"class","items-center"),$(r,"class","flex items-center justify-center w-full relative"),$(v,"class","flex items-center justify-center w-full relative"),$(j,"class","text-lg w-full text-gray-700 placeholder-gray-500 border-gray-200 rounded-lg border-2 py-1 pl-2 mt-8"),$(j,"type","text"),$(j,"placeholder","Monobank token"),j.required=!0,$(O,"class",""),$(k,"class","w-3/4 flex"),$(b,"class","flex items-center w-full justify-center"),$(n,"class","flex justify-center flex-col")},m(o,s){u(o,n,s),l(n,e),l(e,i),g(i,t[0]),l(n,c),l(n,r),D(a,r,null),l(n,h),l(n,v),D(y,v,null),l(n,x),l(n,b),l(b,k),l(k,j),g(j,t[2]),l(k,C),l(k,O),D(S,O,null),E=!0,P||(T=[m(i,"input",t[6]),m(j,"input",t[9])],P=!0)},p(t,n){1&n&&i.value!==t[0]&&g(i,t[0]);const e={};!f&&2&n&&(f=!0,e.value=t[1],B((()=>f=!1))),a.$set(e);const o={};!w&&8&n&&(w=!0,o.value=t[3],B((()=>w=!1))),y.$set(o),4&n&&j.value!==t[2]&&g(j,t[2])},i(t){E||(U(a.$$.fragment,t),U(y.$$.fragment,t),U(S.$$.fragment,t),E=!0)},o(t){L(a.$$.fragment,t),L(y.$$.fragment,t),L(S.$$.fragment,t),E=!1},d(t){t&&s(n),q(a),q(y),q(S),P=!1,o(T)}}}function xt(t){let n,e;return n=new Y({props:{title:"Sign Up",actionButton:t[4],linkButton:t[5],$$slots:{default:[wt]},$$scope:{ctx:t}}}),{c(){M(n.$$.fragment)},m(t,o){D(n,t,o),e=!0},p(t,[e]){const o={};16399&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(U(n.$$.fragment,t),e=!0)},o(t){L(n.$$.fragment,t),e=!1},d(t){q(n,t)}}}function bt(t,n,e){var o=this&&this.__awaiter||function(t,n,e,o){return new(e||(e=Promise))((function(i,c){function r(t){try{l(o.next(t))}catch(t){c(t)}}function a(t){try{l(o.throw(t))}catch(t){c(t)}}function l(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,a)}l((o=o.apply(t,n||[])).next())}))};let i,c,r,a,l;const u=b();return[i,c,r,a,{label:"Sign Up",onclick:()=>o(void 0,void 0,void 0,(function*(){if(console.log("AAAAA"),l=((t,n)=>t===n)(c,a),console.log("onclick: => pwdCheck",l),l){const t=yield(async(t,n,e)=>{const o=Object.assign(Object.assign({},st),{method:"POST",body:JSON.stringify({username:t,password:n,xtoken:e})}),i=await fetch(at,o),{status:c}=i;if(200===c){const{user_id:t}=await i.json();return{status:c,user_id:t}}const{message:r}=await i.json();return{status:c,message:r}})(i,c,r);return u("signUp",t)}alert("Passwords do not match")}))},{prefix:"Have an account?",label:"Sign In",onclick:()=>u("openSignIn",{})},function(){i=this.value,e(0,i)},function(t){c=t,e(1,c)},function(t){a=t,e(3,a)},function(){r=this.value,e(2,r)}]}class kt extends J{constructor(t){super(),z(this,t,bt,xt,c,{})}}function _t(n){let e,o,i,c,r,a,l;return{c(){e=d("div"),e.textContent="YO MOTHERFUCKER",o=p(),i=d("div"),i.textContent="TI PTCHIOLA",c=p(),r=d("div"),r.textContent="Logout"},m(t,s){u(t,e,s),u(t,o,s),u(t,i,s),u(t,c,s),u(t,r,s),a||(l=m(r,"click",n[1]),a=!0)},p:t,i:t,o:t,d(t){t&&s(e),t&&s(o),t&&s(i),t&&s(c),t&&s(r),a=!1,l()}}}function jt(t){const n=b();return[n,async()=>{await(async()=>{await fetch(lt,st)})(),n("logout",{})}]}class Ct extends J{constructor(t){super(),z(this,t,jt,_t,c,{})}}function Ot(n){let e;return{c(){e=f("Loading")},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&s(e)}}}function St(n){let e,o;return e=new kt({}),e.$on("signUp",n[1]),e.$on("openSignIn",n[4]),{c(){M(e.$$.fragment)},m(t,n){D(e,t,n),o=!0},p:t,i(t){o||(U(e.$$.fragment,t),o=!0)},o(t){L(e.$$.fragment,t),o=!1},d(t){q(e,t)}}}function Et(n){let e,o;return e=new gt({}),e.$on("login",n[1]),e.$on("openSignUp",n[3]),{c(){M(e.$$.fragment)},m(t,n){D(e,t,n),o=!0},p:t,i(t){o||(U(e.$$.fragment,t),o=!0)},o(t){L(e.$$.fragment,t),o=!1},d(t){q(e,t)}}}function Bt(n){let e,o;return e=new Ct({}),e.$on("logout",n[2]),{c(){M(e.$$.fragment)},m(t,n){D(e,t,n),o=!0},p:t,i(t){o||(U(e.$$.fragment,t),o=!0)},o(t){L(e.$$.fragment,t),o=!1},d(t){q(e,t)}}}function Pt(t){let n,e,i,c,r,a,f,m;n=new F({});const h=[Bt,Et,St,Ot],g=[];function v(t,n){return"home"===t[0]?0:"signIn"===t[0]?1:"signUp"===t[0]?2:3}return c=v(t),r=g[c]=h[c](t),{c(){M(n.$$.fragment),e=p(),i=d("main"),r.c(),a=p(),f=d("link"),$(i,"class","font-main h-screen text-center flex content-center"),$(f,"rel","icon"),$(f,"type","image/png"),$(f,"href","images/favicon.png")},m(t,o){D(n,t,o),u(t,e,o),u(t,i,o),g[c].m(i,null),u(t,a,o),l(document.head,f),m=!0},p(t,[n]){let e=c;c=v(t),c===e?g[c].p(t,n):(N={r:0,c:[],p:N},L(g[e],1,1,(()=>{g[e]=null})),N.r||o(N.c),N=N.p,r=g[c],r?r.p(t,n):(r=g[c]=h[c](t),r.c()),U(r,1),r.m(i,null))},i(t){m||(U(n.$$.fragment,t),U(r),m=!0)},o(t){L(n.$$.fragment,t),L(r),m=!1},d(t){q(n,t),t&&s(e),t&&s(i),g[c].d(),t&&s(a),s(f)}}}function Tt(t,n,e){var o=this&&this.__awaiter||function(t,n,e,o){return new(e||(e=Promise))((function(i,c){function r(t){try{l(o.next(t))}catch(t){c(t)}}function a(t){try{l(o.throw(t))}catch(t){c(t)}}function l(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,a)}l((o=o.apply(t,n||[])).next())}))};let i,{url:c=""}=n,r="loading";const a=Date.now();var l;l=()=>o(void 0,void 0,void 0,(function*(){i=yield(async()=>{const{ok:t}=await fetch(rt,st);return t})(),e(0,r=i?"home":"signIn")})),x().$$.on_mount.push(l);return t.$$set=t=>{"url"in t&&e(5,c=t.url)},t.$$.update=()=>{1&t.$$.dirty&&console.log(r)},[r,({detail:t})=>o(void 0,void 0,void 0,(function*(){if(200===t.status)return e(0,r="home"),yield ft(a,"previous"),void setTimeout((()=>o(void 0,void 0,void 0,(function*(){yield ft(a,"current")}))),7e4)})),()=>{e(0,r="signIn")},()=>{e(0,r="signUp")},()=>{e(0,r="signIn")},c]}return new class extends J{constructor(t){super(),z(this,t,Tt,Pt,c,{url:5})}}({target:document.body,props:{name:"world",hydrate:!0}})}();
//# sourceMappingURL=bundle.js.map
