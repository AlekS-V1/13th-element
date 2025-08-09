import{i as p,A as S,S as x,P as C,a as M}from"./assets/vendor-Cxast_l0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const m=document.getElementById("orderModalBackdrop"),$=document.getElementById("orderModalCloseBtn"),a=document.getElementById("orderForm");let O=null;const A="#1212ca",b=document.getElementById("loader");function h(){m.classList.add("is-hidden"),document.body.classList.remove("no-scroll"),a.reset(),w()}$.addEventListener("click",h);m.addEventListener("click",e=>{e.target===m&&h()});document.addEventListener("keydown",e=>{e.key==="Escape"&&!m.classList.contains("is-hidden")&&h()});function F(){b.classList.remove("hidden")}function I(){b.classList.add("hidden")}a.addEventListener("submit",async e=>{e.preventDefault();const t=a.elements.email,r=a.elements.tel,o=a.elements.comment,s=t.value.trim(),i=r.value.trim(),l=o.value.trim();w();let n=!1;if(s||(g(t,"Поле Email обов’язкове"),n=!0),i||(g(r,"Поле Телефон обов’язкове"),n=!0),n){p.error({title:"Помилка",message:"Заповніть всі обов’язкові поля.",position:"topRight"});return}F();const c={email:s,phone:i,modelId:O,color:A,comment:l},d=a.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Надсилання...",d.style.cursor="wait";try{const f=await fetch("https://furniture-store.b.goit.study/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!f.ok){const B=await f.json();throw new Error(B.message||"Не вдалося надіслати заявку")}p.success({title:"Готово",message:"Заявка успішно надіслана!",position:"topRight"}),h()}catch(f){p.error({title:"Помилка",message:f.message,position:"topRight"})}finally{I(),d.disabled=!1,d.textContent="Надіслати заявку",d.style.cursor="pointer"}});function g(e,t){e.classList.add("input-error");let r=e.nextElementSibling;if(r&&r.classList.contains("error-message")){r.textContent=t;return}r=document.createElement("div"),r.className="error-message",r.textContent=t,e.insertAdjacentElement("afterend",r)}function v(e){e.classList.remove("input-error");const t=e.nextElementSibling;t&&t.classList.contains("error-message")&&t.remove()}function w(){v(a.elements.email),v(a.elements.tel)}new S(".accordion-container",{duration:400,triggerClass:"ac-trigger",panelClass:"ac-panel",activeClass:"is-active",showMultiple:!1});const R=document.querySelector(".feedback-list"),k=document.querySelector(".loader"),E=document.querySelector(".feedback-btn-left"),P=document.querySelector(".feedback-btn-right"),q=document.querySelector(".feedback-pagination-btn-wrap");let u,L=!1;async function N(){const e="https://furniture-store.b.goit.study/api/feedbacks",t=new URLSearchParams({page:1,limit:10});return(await M(`${e}?${t}`)).data}function z(){k.classList.remove("hidden")}function j(){k.classList.add("hidden")}function T(e){p.error({message:e,backgroundColor:"#ef4040",messageColor:"#fff",position:"topRight"})}function y(){const e=u.isBeginning,t=u.isEnd;E.disabled=e,P.disabled=t}function D(e){const t=Math.round(e*2)/2,r=Math.floor(t),o=t%1!==0,s=`
    <svg class="star-icon" id="star-filled" viewBox="0 0 34 32" >
            <title>star-filled</title>
            <path class="path-star-filled"
                  d="M16.941 25.621l10.179 6.144-2.701-11.579 8.993-7.791-11.842-1.005-4.628-10.92-4.628 10.92-11.842 1.005 8.993 7.791-2.701 11.579z" fill="#000000"/>
    </svg>
  `,i=`
    <svg viewBox="0 0 24 24" width="24" height="24">
  <defs>
    <clipPath id="left-half">
      <rect x="0" y="0" width="12" height="24" />
    </clipPath>
    <clipPath id="right-half">
      <rect x="12" y="0" width="12" height="24" />
    </clipPath>
  </defs>

  <!-- Ліва половина — заповнена -->
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="#000000"
    stroke="#000000"
    stroke-width="2"
    clip-path="url(#left-half)"
  />

  <!-- Права половина — тільки контур -->
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="none"
    stroke="#000000"
    stroke-width="2"
    clip-path="url(#right-half)"
  />
</svg>
  `,l=`
    <svg viewBox="0 0 24 24" width="24" height="24">
  <path
    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
       9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    fill="none"
    stroke="#000000"
    stroke-width="2"
  />
</svg>
  `;let n="";for(let c=0;c<5;c++)c<r?n+=`<div class="star">${s}</div>`:c===r&&o?n+=`<div class="star">${i}</div>`:n+=`<div class="star">${l}</div>`;return`
    <div class="rating rating-static rating-small star-icon">
      <div class="star-container">
        ${n}
      </div>
    </div>
  `}function G(e){return e.map(({descr:t,name:r,rate:o})=>`
      <div class="feedback-card swiper-slide">
        ${D(o)}
        <p class="feedback-text feedback-opinion">"${t}"</p>
        <p class="feedback-text feedback-user">${r}</p>
      </div>
    `).join("")}async function H(){z();try{const e=await N(),t=G(e.feedbacks);R.insertAdjacentHTML("beforeend",t),u||(u=new x(".swiper",{modules:[C],direction:"horizontal",loop:!1,slidesPerView:1,slidesPerGroup:1,pagination:{el:".swiper-pagination",clickable:!0,type:"bullets"},breakpoints:{768:{slidesPerView:2,slidesPerGroup:1},1440:{slidesPerView:3,slidesPerGroup:1}},on:{slideChange:y}}),y()),L||(E.addEventListener("click",()=>u.slidePrev()),P.addEventListener("click",()=>u.slideNext()),L=!0),q.classList.remove("hidden")}catch{T("Failed to fetch data from API.")}finally{j()}}H();
//# sourceMappingURL=index.js.map
