(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[329],{5770:function(e,r,t){Promise.resolve().then(t.bind(t,6858))},6858:function(e,r,t){"use strict";t.r(r);var n=t(7437),s=t(2265),o=t(5549),a=t(4033);r.default=function(){let e=(0,a.useRouter)(),r=localStorage.getItem("game_mode"),{appState:t,dispatch:c}=(0,o.b)(),l=s.useRef(0),[i,u]=s.useState(2);return s.useEffect(()=>{let n=0;return n=setInterval(()=>{100!==l.current&&(l.current=l.current+1,u(l.current),100===l.current&&("offline"===r?e.push("/play-game/ai",{scroll:!1}):"online"===r&&(console.log(t.socket,"run this==============>"),t.socket&&(t.socket.onRendomMatch(),e.push("/match-make",{scroll:!1}))),clearInterval(n)))},50),()=>{clearInterval(n)}},[l.current,r,e]),(0,n.jsx)("main",{children:(0,n.jsx)("div",{className:"view_container",children:(0,n.jsxs)("div",{className:"load_wrapper",children:[(0,n.jsx)("div",{className:"load_background",children:(0,n.jsxs)("div",{className:"inner_wrapper",children:[(0,n.jsx)("div",{className:"loadeing_text"}),(0,n.jsx)("div",{className:"loadeing_bg",children:(0,n.jsx)("img",{src:"/loding/loding bar.png",width:20,height:30,alt:"loader",style:{width:"".concat(i,"%"),objectFit:"cover",height:"100%",borderRadius:"10px"}},l.current)})]})}),(0,n.jsx)("div",{className:"splash_logo"})]})})})}},622:function(e,r,t){"use strict";var n=t(2265),s=Symbol.for("react.element"),o=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,c=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function i(e,r,t){var n,o={},i=null,u=null;for(n in void 0!==t&&(i=""+t),void 0!==r.key&&(i=""+r.key),void 0!==r.ref&&(u=r.ref),r)a.call(r,n)&&!l.hasOwnProperty(n)&&(o[n]=r[n]);if(e&&e.defaultProps)for(n in r=e.defaultProps)void 0===o[n]&&(o[n]=r[n]);return{$$typeof:s,type:e,key:i,ref:u,props:o,_owner:c.current}}r.Fragment=o,r.jsx=i,r.jsxs=i},7437:function(e,r,t){"use strict";e.exports=t(622)},4033:function(e,r,t){e.exports=t(94)}},function(e){e.O(0,[549,971,472,744],function(){return e(e.s=5770)}),_N_E=e.O()}]);