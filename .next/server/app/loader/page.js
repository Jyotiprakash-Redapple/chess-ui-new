(()=>{var e={};e.id=329,e.ids=[329],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1017:e=>{"use strict";e.exports=require("path")},7310:e=>{"use strict";e.exports=require("url")},338:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>u,originalPathname:()=>d,pages:()=>p,routeModule:()=>m,tree:()=>c});var s=r(7096),a=r(6132),o=r(7284),n=r.n(o),i=r(2564),l={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);r.d(t,l);let c=["",{children:["loader",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,8953)),"/home/ratpc-042/Desktop/Jyoti-RedApple/chess-ui-new/src/app/loader/page.jsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,9113)),"/home/ratpc-042/Desktop/Jyoti-RedApple/chess-ui-new/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,5666)),"/home/ratpc-042/Desktop/Jyoti-RedApple/chess-ui-new/src/app/not-found.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],p=["/home/ratpc-042/Desktop/Jyoti-RedApple/chess-ui-new/src/app/loader/page.jsx"],d="/loader/page",u={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/loader/page",pathname:"/loader",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},102:(e,t,r)=>{Promise.resolve().then(r.bind(r,1791))},1018:(e,t,r)=>{"use strict";e.exports=r(7804)},1791:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var s=r(3854),a=r(4218),o=r.n(a),n=r(5947),i=r(1018);let l=function(){let e;let t=(0,i.useRouter)(),{appState:r,dispatch:a}=(0,n.b)(),l=o().useRef(0),[c,p]=o().useState(2);return o().useEffect(()=>{let s=0;return e=localStorage.getItem("game_mode"),s=setInterval(()=>{100!==l.current&&(l.current=l.current+1,p(l.current),100===l.current&&("offline"===e?t.push("/play-game/ai",{scroll:!1}):"online"===e&&(console.log(r.socket,"run this==============>"),r.socket&&(r.socket.onRendomMatch(),t.push("/match-make",{scroll:!1}))),clearInterval(s)))},50),()=>{clearInterval(s)}},[l.current,e,t]),s.jsx("main",{children:s.jsx("div",{className:"view_container",children:(0,s.jsxs)("div",{className:"load_wrapper",children:[s.jsx("div",{className:"load_background",children:(0,s.jsxs)("div",{className:"inner_wrapper",children:[s.jsx("div",{className:"loadeing_text"}),s.jsx("div",{className:"loadeing_bg",children:s.jsx("img",{src:"/loding/loding bar.png",width:20,height:30,alt:"loader",style:{width:`${c}%`,objectFit:"cover",height:"100%",borderRadius:"10px"}},l.current)})]})}),s.jsx("div",{className:"splash_logo"})]})})})}},8953:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>o,default:()=>l});var s=r(5153);let a=(0,s.createProxy)(String.raw`/home/ratpc-042/Desktop/Jyoti-RedApple/chess-ui-new/src/app/loader/page.jsx`),{__esModule:o,$$typeof:n}=a,i=a.default,l=i}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[271,846,360],()=>r(338));module.exports=s})();