import{i as u,A as B,S as C,P as A,a as O}from"./assets/vendor-Cxast_l0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const f=document.getElementById("orderModalBackdrop"),$=document.getElementById("orderModalCloseBtn"),i=document.getElementById("orderForm");let x=null;const I="#1212ca",v=document.getElementById("loader");function m(){f.classList.add("is-hidden"),document.body.classList.remove("no-scroll"),i.reset(),L()}$.addEventListener("click",m);f.addEventListener("click",e=>{e.target===f&&m()});document.addEventListener("keydown",e=>{e.key==="Escape"&&!f.classList.contains("is-hidden")&&m()});function M(){v.classList.remove("hidden")}function R(){v.classList.add("hidden")}i.addEventListener("submit",async e=>{e.preventDefault();const t=i.elements.email,r=i.elements.tel,n=i.elements.comment,s=t.value.trim(),o=r.value.trim(),l=n.value.trim();L();let p=!1;if(s||(g(t,"Поле Email обов’язкове"),p=!0),o||(g(r,"Поле Телефон обов’язкове"),p=!0),p){u.error({title:"Помилка",message:"Заповніть всі обов’язкові поля.",position:"topRight"});return}M();const P={email:s,phone:o,modelId:x,color:I,comment:l},a=i.querySelector('button[type="submit"]');a.disabled=!0,a.textContent="Надсилання...",a.style.cursor="wait";try{const d=await fetch("https://furniture-store.b.goit.study/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(P)});if(!d.ok){const S=await d.json();throw new Error(S.message||"Не вдалося надіслати заявку")}u.success({title:"Готово",message:"Заявка успішно надіслана!",position:"topRight"}),m()}catch(d){u.error({title:"Помилка",message:d.message,position:"topRight"})}finally{R(),a.disabled=!1,a.textContent="Надіслати заявку",a.style.cursor="pointer"}});function g(e,t){e.classList.add("input-error");let r=e.nextElementSibling;if(r&&r.classList.contains("error-message")){r.textContent=t;return}r=document.createElement("div"),r.className="error-message",r.textContent=t,e.insertAdjacentElement("afterend",r)}function h(e){e.classList.remove("input-error");const t=e.nextElementSibling;t&&t.classList.contains("error-message")&&t.remove()}function L(){h(i.elements.email),h(i.elements.tel)}new B(".accordion-container",{duration:400,triggerClass:"ac-trigger",panelClass:"ac-panel",activeClass:"is-active",showMultiple:!1});const F=document.querySelector(".feedback-list"),E=document.querySelector(".loader"),w=document.querySelector(".feedback-btn-left"),k=document.querySelector(".feedback-btn-right"),q=document.querySelector(".feedback-pagination-btn-wrap");let c,y=!1;async function N(){const e="https://furniture-store.b.goit.study/api/feedbacks",t=new URLSearchParams({page:1,limit:10});return(await O(`${e}?${t}`)).data}function j(){E.classList.remove("hidden")}function T(){E.classList.add("hidden")}function D(e){u.error({message:e,backgroundColor:"#ef4040",messageColor:"#fff",position:"topRight"})}function b(){const e=c.isBeginning,t=c.isEnd;w.disabled=e,k.disabled=t}function G(e){const t=Math.round(e*2)/2,r=Math.floor(t),n=t%1!==0;return`
    <div class="rating rating-static rating-small value-${r} ${n?"half":""} star-icon">
      <div class="star-container">
        ${Array.from({length:5},()=>`
          <div class="star">
            <svg class="star-empty">
              <use href="#star-empty"></use>
            </svg>
            <svg class="star-half">
              <use href="#star-half"></use>
            </svg>
            <svg class="star-filled">
              <use href="#star-filled"></use>
            </svg>
          </div>
        `).join("")}
      </div>
    </div>
  `}function V(e){return e.map(({descr:t,name:r,rate:n})=>`
      <div class="feedback-card swiper-slide">
        ${G(n)}
        <p class="feedback-text feedback-opinion">"${t}"</p>
        <p class="feedback-text feedback-user">${r}</p>
      </div>
    `).join("")}async function z(){j();try{const e=await N(),t=V(e.feedbacks);F.insertAdjacentHTML("beforeend",t),c||(c=new C(".swiper",{modules:[A],direction:"horizontal",loop:!1,slidesPerView:1,slidesPerGroup:1,pagination:{el:".swiper-pagination",clickable:!0,type:"bullets"},breakpoints:{768:{slidesPerView:2,slidesPerGroup:1},1440:{slidesPerView:3,slidesPerGroup:1}},on:{slideChange:b}}),b()),y||(w.addEventListener("click",()=>c.slidePrev()),k.addEventListener("click",()=>c.slideNext()),y=!0),q.classList.remove("hidden")}catch{D("Failed to fetch data from API.")}finally{T()}}z();
//# sourceMappingURL=index.js.map
