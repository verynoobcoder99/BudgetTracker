(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();class Q{constructor(){this.routes={},this.currentPage=null,this.contentEl=null,this.onNavigate=null,window.addEventListener("hashchange",()=>this._handleRoute())}init(t){this.contentEl=t,this._handleRoute()}register(t,a){this.routes[t]=a}navigate(t){window.location.hash=`#${t}`}_handleRoute(){const t=window.location.hash.slice(1)||"dashboard",a=this.routes[t];if(!a){window.location.hash="#dashboard";return}this.currentPage=t,this.contentEl.innerHTML="",a(this.contentEl),window.lucide&&window.lucide.createIcons(),document.querySelectorAll(".nav-link").forEach(s=>{s.classList.toggle("active",s.dataset.page===t)}),this.onNavigate&&this.onNavigate(t)}getCurrentPage(){return this.currentPage}}const h=[{id:"housing",label:"Housing",icon:"🏠",color:"#818cf8"},{id:"groceries",label:"Groceries",icon:"🛒",color:"#34d399"},{id:"dining",label:"Dining Out",icon:"🍽️",color:"#f97316"},{id:"transport",label:"Transportation",icon:"🚗",color:"#60a5fa"},{id:"utilities",label:"Utilities",icon:"💡",color:"#a78bfa"},{id:"entertainment",label:"Entertainment",icon:"🎬",color:"#f472b6"},{id:"shopping",label:"Shopping",icon:"🛍️",color:"#fbbf24"},{id:"health",label:"Health",icon:"🏥",color:"#2dd4bf"},{id:"subscriptions",label:"Subscriptions",icon:"📱",color:"#c084fc"},{id:"personal",label:"Personal Care",icon:"💆",color:"#fb923c"},{id:"savings",label:"Savings",icon:"💰",color:"#4ade80"},{id:"misc",label:"Miscellaneous",icon:"📦",color:"#94a3b8"}];function Y(e){return h.find(t=>t.label.toLowerCase()===e.toLowerCase())||h[h.length-1]}function f(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}function V(e){return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function N(e){const[t,a]=e.split("-");return new Date(parseInt(t),parseInt(a)-1).toLocaleDateString("en-US",{month:"long",year:"numeric"})}function P(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function O(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a-2);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function _(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function W(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function J(e){const[t,a]=e.split("-").map(Number);return new Date(t,a,0).getDate()}function r(e,t=document){return t.querySelector(e)}function U(e,t=document){return[...t.querySelectorAll(e)]}function E(e,t={},a=[]){const s=document.createElement(e);for(const[o,n]of Object.entries(t))o==="className"?s.className=n:o==="innerHTML"?s.innerHTML=n:o==="textContent"?s.textContent=n:o.startsWith("on")?s.addEventListener(o.slice(2).toLowerCase(),n):s.setAttribute(o,n);for(const o of a)typeof o=="string"?s.appendChild(document.createTextNode(o)):o&&s.appendChild(o);return s}let D=null;function y(e,t="success",a=3e3){D||(D=document.getElementById("toast-container"));const s={success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'},o=E("div",{className:`toast ${t}`});o.innerHTML=`
    <span class="toast-icon">${s[t]||s.info}</span>
    <span>${e}</span>
  `,D.appendChild(o),setTimeout(()=>{o.classList.add("hiding"),setTimeout(()=>o.remove(),300)},a)}function A(e,t,a=800){const s=parseFloat(e.textContent.replace(/[^0-9.-]/g,""))||0,o=performance.now();function n(i){const l=i-o,c=Math.min(l/a,1),d=1-Math.pow(1-c,3),p=s+(t-s)*d;e.textContent=f(p),c<1&&requestAnimationFrame(n)}requestAnimationFrame(n)}function X(e,t){if(t<=0)return"safe";const a=e/t*100;return a>=100?"danger":a>=75?"caution":"safe"}function ee(e,t){return t<=0?0:Math.min(e/t*100,100)}const K="budgetduo_settings",F={apiUrl:"",person1Name:"Person 1",person2Name:"Person 2",budgets:{housing:2e3,groceries:600,dining:400,transport:300,utilities:250,entertainment:200,shopping:300,health:200,subscriptions:100,personal:150,savings:500,misc:200}};function v(){try{const e=localStorage.getItem(K);if(e){const t=JSON.parse(e);return{...F,...t,budgets:{...F.budgets,...t.budgets}}}}catch(e){console.warn("Failed to load settings:",e)}return{...F}}function H(e){try{localStorage.setItem(K,JSON.stringify(e))}catch(t){console.warn("Failed to save settings:",t)}}function te(e){const[t,a]=e.split("-").map(Number),s=J(e),o=[],n=["Person 1","Person 2"],i={housing:["Rent","Mortgage Payment","Home Insurance"],groceries:["Whole Foods","Trader Joe's","Costco","Target Groceries","Local Market"],dining:["Chipotle","Sushi Place","Pizza Night","Coffee Shop","Brunch","Thai Takeout"],transport:["Gas","Uber","Metro Pass","Car Wash","Parking"],utilities:["Electric Bill","Water Bill","Internet","Gas Bill"],entertainment:["Netflix","Movie Tickets","Concert","Books","Game Purchase"],shopping:["Amazon","Target","New Shoes","Home Decor","Clothing"],health:["Gym Membership","Pharmacy","Doctor Visit","Supplements"],subscriptions:["Spotify","Apple iCloud","YouTube Premium","News Subscription"],personal:["Haircut","Skincare","Dry Cleaning"],savings:["Emergency Fund","401k Extra","Investment"],misc:["Gift","Donation","Miscellaneous"]},l={housing:[1200,1500,1800,2e3],groceries:[45,65,85,120,35,55],dining:[15,25,35,48,22,60],transport:[40,55,12,25,8],utilities:[80,120,65,95],entertainment:[15,25,50,12,60],shopping:[30,55,80,25,120],health:[50,30,150,25],subscriptions:[10,3,14,12],personal:[35,45,15],savings:[200,300,500],misc:[20,50,15,30]},c=30+Math.floor(Math.random()*30);for(let d=0;d<c;d++){const p=h[Math.floor(Math.random()*h.length)],m=i[p.id]||["Expense"],u=l[p.id]||[50],g=Math.min(Math.floor(Math.random()*s)+1,s);o.push({row:d+2,date:`${t}-${String(a).padStart(2,"0")}-${String(g).padStart(2,"0")}`,person:n[Math.floor(Math.random()*2)],category:p.label,description:m[Math.floor(Math.random()*m.length)],amount:u[Math.floor(Math.random()*u.length)]+Math.round(Math.random()*10)})}return o.sort((d,p)=>d.date.localeCompare(p.date)),o}const T={};function j(e){return T[e]||(T[e]=te(e)),T[e]}async function R(e){const t=v();if(!t.apiUrl)return j(e);try{const a=`${t.apiUrl}?action=getTransactions&t=${Date.now()}`,s=await fetch(a);if(!s.ok)throw new Error(`HTTP ${s.status}`);let n=(await s.json()).transactions||[];return n=n.map(i=>({...i,date:se(i.date)})),e&&(n=n.filter(i=>i.date.substring(0,7)===e)),n}catch(a){throw console.error("Failed to fetch transactions:",a),a}}function se(e){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const t=new Date(e);if(!isNaN(t.getTime())){const a=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${s}-${o}`}return e}async function ae({date:e,person:t,category:a,description:s,amount:o}){const n=v();if(!n.apiUrl){const i=e.substring(0,7),l=j(i),c={row:l.length+2,date:e,person:t,category:a,description:s,amount:parseFloat(o)};return l.push(c),l.sort((d,p)=>d.date.localeCompare(p.date)),{success:!0,transaction:c}}try{const i=await fetch(n.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"addTransaction",date:e,person:t,category:a,description:s,amount:parseFloat(o)})});if(!i.ok)throw new Error(`HTTP ${i.status}`);return await i.json()}catch(i){throw console.error("Failed to add transaction:",i),i}}async function oe(e,t){const a=v();if(!a.apiUrl){const s=j(t),o=s.findIndex(n=>n.row===e);return o!==-1&&s.splice(o,1),{success:!0}}try{const s=await fetch(a.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"deleteTransaction",row:e})});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}catch(s){throw console.error("Failed to delete transaction:",s),s}}async function ne({row:e,date:t,person:a,category:s,description:o,amount:n}){const i=v();if(!i.apiUrl){for(const l of Object.keys(T)){const c=T[l],d=c.findIndex(p=>p.row===e);if(d!==-1){c[d]={...c[d],date:t,person:a,category:s,description:o,amount:parseFloat(n)};break}}return{success:!0}}try{const l=await fetch(i.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"editTransaction",row:e,date:t,person:a,category:s,description:o,amount:parseFloat(n)})});if(!l.ok)throw new Error(`HTTP ${l.status}`);return await l.json()}catch(l){throw console.error("Failed to edit transaction:",l),l}}function G(e,t){const a={totalSpent:0,byCategory:{},byPerson:{},byDay:{},transactionCount:e.length};h.forEach(s=>{a.byCategory[s.label]={spent:0,limit:t.budgets[s.id]||0,count:0}}),a.byPerson[t.person1Name]=0,a.byPerson[t.person2Name]=0;for(const s of e){const o=parseFloat(s.amount)||0;a.totalSpent+=o,a.byCategory[s.category]?(a.byCategory[s.category].spent+=o,a.byCategory[s.category].count+=1):(a.byCategory.Miscellaneous.spent+=o,a.byCategory.Miscellaneous.count+=1);const n=s.person===t.person1Name||s.person==="Person 1"?t.person1Name:t.person2Name;a.byPerson[n]=(a.byPerson[n]||0)+o;const i=s.date.split("-")[2];a.byDay[i]=(a.byDay[i]||0)+o}return a}h.map(e=>e.color);h.map(e=>e.color+"33");window.Chart&&(Chart.defaults.color="#94a3b8",Chart.defaults.font.family="'Inter', sans-serif",Chart.defaults.font.size=12,Chart.defaults.plugins.legend.labels.usePointStyle=!0,Chart.defaults.plugins.legend.labels.pointStyle="circle",Chart.defaults.plugins.legend.labels.padding=16,Chart.defaults.animation.duration=800,Chart.defaults.animation.easing="easeOutQuart");function re(e,t){const a=[],s=[],o=[];for(const n of h){const i=t[n.label];i&&i.spent>0&&(a.push(n.label),s.push(i.spent),o.push(n.color))}return new Chart(e,{type:"doughnut",data:{labels:a,datasets:[{data:s,backgroundColor:o,borderColor:"rgba(10, 14, 26, 0.8)",borderWidth:3,hoverBorderWidth:0,hoverOffset:8}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"65%",plugins:{legend:{position:"bottom",labels:{padding:12,font:{size:11,weight:"500"}}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,titleFont:{weight:"600"},callbacks:{label:n=>{const i=n.dataset.data.reduce((c,d)=>c+d,0),l=(n.parsed/i*100).toFixed(1);return` ${n.label}: ${f(n.parsed)} (${l}%)`}}}}}})}function ie(e,t){const a=Object.keys(t),s=Object.values(t);return new Chart(e,{type:"bar",data:{labels:a,datasets:[{data:s,backgroundColor:["rgba(129, 140, 248, 0.7)","rgba(244, 114, 182, 0.7)"],borderColor:["#818cf8","#f472b6"],borderWidth:2,borderRadius:8,barPercentage:.5}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{label:o=>` ${f(o.parsed.x)}`}}},scales:{x:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:o=>f(o),font:{size:11}}},y:{grid:{display:!1},ticks:{font:{size:13,weight:"600"}}}}}})}function le(e,t,a){const s=[],o=[];for(let n=1;n<=a;n++){const i=String(n).padStart(2,"0");s.push(n),o.push(t[i]||0)}return new Chart(e,{type:"line",data:{labels:s,datasets:[{label:"Daily Spending",data:o,borderColor:"#818cf8",backgroundColor:"rgba(129, 140, 248, 0.08)",borderWidth:2.5,fill:!0,tension:.4,pointRadius:0,pointHitRadius:20,pointHoverRadius:5,pointHoverBackgroundColor:"#818cf8",pointHoverBorderColor:"#fff",pointHoverBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{title:n=>`Day ${n[0].label}`,label:n=>` Spent: ${f(n.parsed.y)}`}}},scales:{x:{grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{font:{size:10},maxTicksLimit:15}},y:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:n=>"$"+n,font:{size:11}},beginAtZero:!0}}}})}function ce(e,t,a){var i,l;const s=[],o=[],n=[];for(const c of h){const d=((i=t[c.label])==null?void 0:i.spent)||0,p=((l=a[c.label])==null?void 0:l.spent)||0;(d>0||p>0)&&(s.push(c.label),o.push(d),n.push(p))}return new Chart(e,{type:"bar",data:{labels:s,datasets:[{label:"This Month",data:o,backgroundColor:"rgba(129, 140, 248, 0.7)",borderColor:"#818cf8",borderWidth:1.5,borderRadius:6},{label:"Last Month",data:n,backgroundColor:"rgba(255, 255, 255, 0.08)",borderColor:"rgba(255, 255, 255, 0.2)",borderWidth:1.5,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{font:{size:11,weight:"500"},padding:16}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{label:c=>` ${c.dataset.label}: ${f(c.parsed.y)}`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10},maxRotation:45}},y:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:c=>"$"+c,font:{size:11}},beginAtZero:!0}}}})}let x=P(),S=[];function Z(){S.forEach(e=>e.destroy()),S=[]}function de(e){Z(),x=P(),e.innerHTML=`
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Your spending overview at a glance</p>
        </div>
        <div class="month-selector" id="month-selector">
          <button class="month-btn" id="prev-month" aria-label="Previous month">
            <i data-lucide="chevron-left"></i>
          </button>
          <span class="month-label" id="month-label">${N(x)}</span>
          <button class="month-btn" id="next-month" aria-label="Next month">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid" id="stats-grid">
      <div class="card" id="stat-total">
        <div class="card-header">
          <span class="card-title">Total Spent</span>
          <div class="card-icon" style="background: rgba(129,140,248,0.15); color: #818cf8;">
            <i data-lucide="trending-up"></i>
          </div>
        </div>
        <div class="stat-value" id="total-spent">$0.00</div>
      </div>
      <div class="card" id="stat-transactions">
        <div class="card-header">
          <span class="card-title">Transactions</span>
          <div class="card-icon" style="background: rgba(96,165,250,0.15); color: #60a5fa;">
            <i data-lucide="receipt"></i>
          </div>
        </div>
        <div class="stat-value" id="total-txns">0</div>
      </div>
      <div class="card" id="stat-person1">
        <div class="card-header">
          <span class="card-title" id="p1-label">Person 1</span>
          <div class="card-icon" style="background: rgba(129,140,248,0.15); color: #818cf8;">
            <i data-lucide="user"></i>
          </div>
        </div>
        <div class="stat-value" id="p1-total">$0.00</div>
      </div>
      <div class="card" id="stat-person2">
        <div class="card-header">
          <span class="card-title" id="p2-label">Person 2</span>
          <div class="card-icon" style="background: rgba(244,114,182,0.15); color: #f472b6;">
            <i data-lucide="user"></i>
          </div>
        </div>
        <div class="stat-value" id="p2-total">$0.00</div>
      </div>
    </div>

    <!-- Budget Progress -->
    <div class="card" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <span class="card-title">Budget Overview</span>
      </div>
      <div class="budget-grid" id="budget-grid"></div>
    </div>

    <!-- Charts -->
    <div class="charts-grid" id="charts-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Spending by Category</span>
        </div>
        <div class="chart-container" style="height: 320px;">
          <canvas id="chart-category"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Spending by Person</span>
        </div>
        <div class="chart-container" style="height: 320px;">
          <canvas id="chart-person"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Daily Spending Trend</span>
        </div>
        <div class="chart-container" style="height: 280px;">
          <canvas id="chart-daily"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Month-over-Month</span>
        </div>
        <div class="chart-container" style="height: 280px;">
          <canvas id="chart-comparison"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card" style="margin-top: var(--space-xl);">
      <div class="card-header">
        <span class="card-title">Recent Transactions</span>
        <a href="#transactions" class="btn-secondary">View All</a>
      </div>
      <div class="recent-transactions" id="recent-transactions"></div>
    </div>
  `,r("#prev-month",e).addEventListener("click",()=>{x=O(x),B(e)}),r("#next-month",e).addEventListener("click",()=>{x=_(x),B(e)}),B(e)}async function B(e){const t=v();Z();const a=r("#month-label",e);a&&(a.textContent=N(x));const s=r("#p1-label",e),o=r("#p2-label",e);s&&(s.textContent=t.person1Name),o&&(o.textContent=t.person2Name);try{const[n,i]=await Promise.all([R(x),R(O(x))]),l=G(n,t),c=G(i,t);A(r("#total-spent",e),l.totalSpent),r("#total-txns",e).textContent=l.transactionCount,A(r("#p1-total",e),l.byPerson[t.person1Name]||0),A(r("#p2-total",e),l.byPerson[t.person2Name]||0),pe(e,l);const d=r("#chart-category",e),p=r("#chart-person",e),m=r("#chart-daily",e),u=r("#chart-comparison",e);d&&S.push(re(d,l.byCategory)),p&&S.push(ie(p,l.byPerson)),m&&S.push(le(m,l.byDay,J(x))),u&&S.push(ce(u,l.byCategory,c.byCategory)),ue(e,n,t)}catch(n){console.error("Failed to load dashboard:",n)}window.lucide&&window.lucide.createIcons()}function pe(e,t){const a=r("#budget-grid",e);if(a){a.innerHTML="";for(const s of h){const o=t.byCategory[s.label];if(!o)continue;const n=o.spent,i=o.limit,l=ee(n,i),c=X(n,i),d=E("div",{className:"card budget-item"});d.innerHTML=`
      <div class="budget-item-header">
        <div class="budget-category">
          <span class="budget-dot" style="background: ${s.color}"></span>
          <span>${s.icon} ${s.label}</span>
        </div>
        <div class="budget-amounts">
          <span class="spent">${f(n)}</span> / ${f(i)}
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${c}" style="width: ${l}%"></div>
      </div>
      <div class="budget-percentage ${c==="danger"?"text-danger":c==="caution"?"text-warning":"text-success"}">
        ${l.toFixed(0)}%
      </div>
    `,a.appendChild(d)}}}function ue(e,t,a){const s=r("#recent-transactions",e);if(!s)return;const o=[...t].reverse().slice(0,8);if(o.length===0){s.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
        <h3>No transactions yet</h3>
        <p>Start tracking your expenses by adding your first transaction.</p>
      </div>
    `;return}s.innerHTML="";for(const n of o){const i=Y(n.category),l=n.person===a.person1Name||n.person==="Person 1",c=E("div",{className:"recent-tx-item"});c.innerHTML=`
      <div class="recent-tx-left">
        <div class="recent-tx-cat-icon" style="background: ${i.color}20; color: ${i.color}">
          ${i.icon}
        </div>
        <div class="recent-tx-details">
          <span class="recent-tx-desc">${n.description}</span>
          <span class="recent-tx-meta">${V(n.date)} · <span class="${l?"text-accent":""}" style="${l?"":"color: #f472b6"}">${n.person}</span></span>
        </div>
      </div>
      <span class="recent-tx-amount">${f(n.amount)}</span>
    `,s.appendChild(c)}}function ge(e){const t=v();e.innerHTML=`
    <div class="page-header">
      <h1>Add Expense</h1>
      <p class="subtitle">Quickly log a new transaction</p>
    </div>

    <div class="form-container">
      <div class="card form-card">
        <form id="expense-form" autocomplete="off">
          <!-- Amount (first for prominence) -->
          <div class="form-group">
            <label class="form-label" for="expense-amount">Amount</label>
            <div class="amount-wrapper">
              <span class="currency-symbol">$</span>
              <input
                type="number"
                id="expense-amount"
                class="form-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                inputmode="decimal"
              />
            </div>
          </div>

          <!-- Person Toggle -->
          <div class="form-group">
            <label class="form-label">Who spent it?</label>
            <div class="person-toggle" id="person-toggle">
              <button type="button" class="person-btn person-1 active" data-person="${t.person1Name}">
                ${t.person1Name}
              </button>
              <button type="button" class="person-btn person-2" data-person="${t.person2Name}">
                ${t.person2Name}
              </button>
            </div>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label" for="expense-category">Category</label>
            <select id="expense-category" class="form-select" required>
              <option value="" disabled selected>Select a category</option>
              ${h.map(l=>`<option value="${l.label}">${l.icon} ${l.label}</option>`).join("")}
            </select>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label" for="expense-description">Description</label>
            <input
              type="text"
              id="expense-description"
              class="form-input"
              placeholder="What was this for?"
              required
            />
          </div>

          <!-- Date -->
          <div class="form-group">
            <label class="form-label" for="expense-date">Date</label>
            <input
              type="date"
              id="expense-date"
              class="form-input"
              value="${W()}"
              required
            />
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary" id="submit-expense">
            Add Expense
          </button>
        </form>

        <!-- Success state (hidden) -->
        <div id="success-state" style="display: none; text-align: center; padding: var(--space-xl) 0;">
          <div class="success-check">
            <i data-lucide="check"></i>
          </div>
          <h3 style="margin-bottom: var(--space-xs);">Expense Added!</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);" id="success-message"></p>
          <button class="btn-primary" id="add-another" style="max-width: 200px; margin: 0 auto;">
            Add Another
          </button>
        </div>
      </div>
    </div>
  `;const a=r("#person-toggle",e);let s=t.person1Name;a.addEventListener("click",l=>{const c=l.target.closest(".person-btn");c&&(a.querySelectorAll(".person-btn").forEach(d=>d.classList.remove("active")),c.classList.add("active"),s=c.dataset.person)});const o=r("#expense-form",e),n=r("#success-state",e),i=r("#submit-expense",e);o.addEventListener("submit",async l=>{l.preventDefault();const c=parseFloat(r("#expense-amount",e).value),d=r("#expense-category",e).value,p=r("#expense-description",e).value.trim(),m=r("#expense-date",e).value;if(!c||!d||!p||!m){y("Please fill in all fields","error");return}i.disabled=!0,i.textContent="Adding...";try{await ae({date:m,person:s,category:d,description:p,amount:c}),o.style.display="none",n.style.display="block",r("#success-message",e).textContent=`${f(c)} for "${p}" added under ${d}`,y("Expense added successfully!","success"),window.lucide&&window.lucide.createIcons()}catch{y("Failed to add expense. Please try again.","error"),i.disabled=!1,i.textContent="Add Expense"}}),e.addEventListener("click",l=>{(l.target.id==="add-another"||l.target.closest("#add-another"))&&(o.style.display="block",n.style.display="none",o.reset(),r("#expense-date",e).value=W(),i.disabled=!1,i.textContent="Add Expense",a.querySelectorAll(".person-btn").forEach(c=>c.classList.remove("active")),a.querySelector(".person-1").classList.add("active"),s=t.person1Name,setTimeout(()=>r("#expense-amount",e).focus(),100))})}let w=P();function ve(e){w=P();const t=v();e.innerHTML=`
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1>Transactions</h1>
          <p class="subtitle">All your expenses in one place</p>
        </div>
        <div class="month-selector">
          <button class="month-btn" id="tx-prev-month" aria-label="Previous month">
            <i data-lucide="chevron-left"></i>
          </button>
          <span class="month-label" id="tx-month-label">${N(w)}</span>
          <button class="month-btn" id="tx-next-month" aria-label="Next month">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row" id="filters-row">
      <select class="filter-select" id="filter-person">
        <option value="all">All People</option>
        <option value="${t.person1Name}">${t.person1Name}</option>
        <option value="${t.person2Name}">${t.person2Name}</option>
      </select>
      <select class="filter-select" id="filter-category">
        <option value="all">All Categories</option>
        ${h.map(a=>`<option value="${a.label}">${a.icon} ${a.label}</option>`).join("")}
      </select>
      <button class="btn-secondary" id="export-csv">
        <i data-lucide="download" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;"></i>
        Export CSV
      </button>
    </div>

    <!-- Table -->
    <div class="card table-container">
      <table class="data-table" id="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Person</th>
            <th>Category</th>
            <th>Description</th>
            <th style="text-align:right;">Amount</th>
            <th style="width:90px;"></th>
          </tr>
        </thead>
        <tbody id="transactions-body">
        </tbody>
      </table>
      <div class="table-footer" id="table-footer">
        <span id="tx-count">0 transactions</span>
        <span class="table-total" id="tx-total">Total: $0.00</span>
      </div>
    </div>

    <!-- Edit Modal Overlay -->
    <div class="edit-modal-overlay" id="edit-modal-overlay" style="display:none;">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h3>Edit Transaction</h3>
          <button class="edit-modal-close" id="edit-modal-close" title="Close">✕</button>
        </div>
        <form id="edit-form" autocomplete="off">
          <input type="hidden" id="edit-row" />

          <div class="form-group">
            <label class="form-label" for="edit-amount">Amount</label>
            <div class="amount-wrapper">
              <span class="currency-symbol">$</span>
              <input type="number" id="edit-amount" class="form-input" step="0.01" min="0.01" required inputmode="decimal" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Who spent it?</label>
            <div class="person-toggle" id="edit-person-toggle">
              <button type="button" class="person-btn person-1" data-person="${t.person1Name}">
                ${t.person1Name}
              </button>
              <button type="button" class="person-btn person-2" data-person="${t.person2Name}">
                ${t.person2Name}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-category">Category</label>
            <select id="edit-category" class="form-select" required>
              ${h.map(a=>`<option value="${a.label}">${a.icon} ${a.label}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-description">Description</label>
            <input type="text" id="edit-description" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-date">Date</label>
            <input type="date" id="edit-date" class="form-input" required />
          </div>

          <div class="edit-modal-actions">
            <button type="button" class="btn-secondary" id="edit-cancel">Cancel</button>
            <button type="submit" class="btn-primary" id="edit-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,r("#tx-prev-month",e).addEventListener("click",()=>{w=O(w),L(e)}),r("#tx-next-month",e).addEventListener("click",()=>{w=_(w),L(e)}),r("#filter-person",e).addEventListener("change",()=>I(e)),r("#filter-category",e).addEventListener("change",()=>I(e)),r("#export-csv",e).addEventListener("click",()=>fe(e)),he(e),L(e)}let q=[];async function L(e){v();const t=r("#tx-month-label",e);t&&(t.textContent=N(w));try{q=await R(w),I(e)}catch{y("Failed to load transactions","error")}window.lucide&&window.lucide.createIcons()}function I(e){var n,i;const t=v(),a=((n=r("#filter-person",e))==null?void 0:n.value)||"all",s=((i=r("#filter-category",e))==null?void 0:i.value)||"all";let o=[...q];a!=="all"&&(o=o.filter(l=>a===t.person1Name?l.person===t.person1Name||l.person==="Person 1":l.person===t.person2Name||l.person==="Person 2")),s!=="all"&&(o=o.filter(l=>l.category===s)),me(e,o,t)}function me(e,t,a){const s=r("#transactions-body",e),o=r("#tx-count",e),n=r("#tx-total",e);if(!s)return;if(t.length===0){s.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; padding: var(--space-2xl);">
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new expense.</p>
          </div>
        </td>
      </tr>
    `,o.textContent="0 transactions",n.textContent="Total: $0.00",window.lucide&&window.lucide.createIcons();return}const i=[...t].sort((u,g)=>g.date.localeCompare(u.date));let l=0;s.innerHTML="";const c='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',d='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>';for(const u of i){const g=Y(u.category),b=u.person===a.person1Name||u.person==="Person 1",C=parseFloat(u.amount)||0;l+=C;const $=E("tr");$.innerHTML=`
      <td>${V(u.date)}</td>
      <td>
        <span class="person-badge ${b?"p1":"p2"}">
          ${b?a.person1Name:a.person2Name}
        </span>
      </td>
      <td>
        <span class="category-badge">
          <span class="budget-dot" style="background:${g.color};width:8px;height:8px;"></span>
          ${g.icon} ${u.category}
        </span>
      </td>
      <td>${u.description}</td>
      <td style="text-align:right; font-weight:600;">${f(C)}</td>
      <td>
        <div class="tx-actions">
          <button class="btn-icon edit-tx" data-row="${u.row}" data-date="${u.date}" data-person="${u.person}" data-category="${u.category}" data-description="${u.description}" data-amount="${C}" title="Edit">
            ${d}
          </button>
          <button class="btn-danger delete-tx" data-row="${u.row}" title="Delete">
            ${c}
          </button>
        </div>
      </td>
    `,s.appendChild($)}let p=null,m=null;s.onclick=async u=>{const g=u.target.closest(".edit-tx");if(g){u.preventDefault(),u.stopPropagation(),be(e,g.dataset);return}const b=u.target.closest(".delete-tx");if(!b)return;u.preventDefault(),u.stopPropagation();const C=parseInt(b.dataset.row);if(!isNaN(C)){if(p===C){clearTimeout(m),p=null,b.disabled=!0,b.style.opacity="0.4",b.innerHTML="...";try{await oe(C,w),y("Transaction deleted","info"),await L(e)}catch{y("Failed to delete transaction","error"),b.disabled=!1,b.style.opacity="1",b.innerHTML=c}return}if(p!==null){const $=s.querySelector(`.delete-tx[data-row="${p}"]`);$&&($.innerHTML=c,$.style.background=""),clearTimeout(m)}p=C,b.innerHTML='<span style="font-size:11px;font-weight:700;">Sure?</span>',b.style.background="var(--danger-bg)",m=setTimeout(()=>{p=null,b.innerHTML=c,b.style.background=""},3e3)}},o.textContent=`${i.length} transaction${i.length!==1?"s":""}`,n.textContent=`Total: ${f(l)}`}let M="";function be(e,t){const a=r("#edit-modal-overlay",e);if(!a)return;const s=v();r("#edit-row",e).value=t.row,r("#edit-amount",e).value=t.amount,r("#edit-category",e).value=t.category,r("#edit-description",e).value=t.description,r("#edit-date",e).value=t.date,M=t.person,U(".person-btn",r("#edit-person-toggle",e)).forEach(n=>{n.classList.remove("active"),(n.dataset.person===t.person||t.person==="Person 1"&&n.dataset.person===s.person1Name||t.person==="Person 2"&&n.dataset.person===s.person2Name)&&(n.classList.add("active"),M=n.dataset.person)}),a.style.display="flex",requestAnimationFrame(()=>a.classList.add("active")),setTimeout(()=>r("#edit-amount",e).focus(),150)}function k(e){const t=r("#edit-modal-overlay",e);t&&(t.classList.remove("active"),setTimeout(()=>{t.style.display="none"},200))}function he(e){v(),r("#edit-modal-close",e).addEventListener("click",()=>k(e)),r("#edit-cancel",e).addEventListener("click",()=>k(e)),r("#edit-modal-overlay",e).addEventListener("click",a=>{a.target.id==="edit-modal-overlay"&&k(e)});const t=r("#edit-person-toggle",e);t.addEventListener("click",a=>{const s=a.target.closest(".person-btn");s&&(t.querySelectorAll(".person-btn").forEach(o=>o.classList.remove("active")),s.classList.add("active"),M=s.dataset.person)}),r("#edit-form",e).addEventListener("submit",async a=>{a.preventDefault();const s=parseInt(r("#edit-row",e).value),o=parseFloat(r("#edit-amount",e).value),n=r("#edit-category",e).value,i=r("#edit-description",e).value.trim(),l=r("#edit-date",e).value;if(!o||!n||!i||!l){y("Please fill in all fields","error");return}const c=r("#edit-save",e);c.disabled=!0,c.textContent="Saving...";try{await ne({row:s,date:l,person:M,category:n,description:i,amount:o}),y("Transaction updated!","success"),k(e),await L(e)}catch{y("Failed to update transaction","error")}finally{c.disabled=!1,c.textContent="Save Changes"}})}function fe(e){var m,u;const t=v(),a=((m=r("#filter-person",e))==null?void 0:m.value)||"all",s=((u=r("#filter-category",e))==null?void 0:u.value)||"all";let o=[...q];a!=="all"&&(o=o.filter(g=>g.person===a||a===t.person1Name&&g.person==="Person 1")),s!=="all"&&(o=o.filter(g=>g.category===s));const n=["Date","Person","Category","Description","Amount"],i=o.map(g=>[g.date,g.person,g.category,`"${g.description}"`,g.amount]),l=[n.join(","),...i.map(g=>g.join(","))].join(`
`),c=new Blob([l],{type:"text/csv"}),d=URL.createObjectURL(c),p=document.createElement("a");p.href=d,p.download=`budget_${w}.csv`,p.click(),URL.revokeObjectURL(d),y("CSV exported!","success")}function ye(e){const t=v();e.innerHTML=`
    <div class="page-header">
      <h1>Settings</h1>
      <p class="subtitle">Configure your budget tracker</p>
    </div>

    <div class="settings-grid">
      <!-- API Connection -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="link" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Google Sheets Connection
        </div>
        <div class="form-group" style="margin-bottom: var(--space-sm);">
          <label class="form-label" for="api-url">Apps Script Web App URL</label>
          <input
            type="url"
            id="api-url"
            class="api-url-input"
            placeholder="https://script.google.com/macros/s/.../exec"
            value="${t.apiUrl||""}"
          />
          <p class="settings-note">
            Paste your Google Apps Script web app URL here. Leave blank to use demo mode with sample data.
          </p>
        </div>
        <button class="btn-secondary" id="save-api-url" style="margin-top: var(--space-sm);">
          Save URL
        </button>
        <span id="api-status" style="margin-left: var(--space-md); font-size: 0.85rem;"></span>
      </div>

      <!-- Person Names -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="users" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          People
        </div>
        <div class="form-group">
          <label class="form-label" for="person1-name">Person 1 Name</label>
          <input
            type="text"
            id="person1-name"
            class="form-input"
            value="${t.person1Name}"
            placeholder="Person 1"
          />
        </div>
        <div class="form-group" style="margin-bottom: var(--space-sm);">
          <label class="form-label" for="person2-name">Person 2 Name</label>
          <input
            type="text"
            id="person2-name"
            class="form-input"
            value="${t.person2Name}"
            placeholder="Person 2"
          />
        </div>
        <button class="btn-secondary" id="save-names">Save Names</button>
      </div>

      <!-- Budget Limits -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="target" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Monthly Budget Limits
        </div>
        <p class="settings-note" style="margin-bottom: var(--space-md);">
          Set your monthly spending limit for each category. The dashboard will show green/yellow/red progress bars based on these limits.
        </p>
        <div id="budget-limits-list">
          ${h.map(s=>`
            <div class="budget-edit-row">
              <div class="budget-edit-label">
                <span class="budget-dot" style="background:${s.color}"></span>
                <span>${s.icon} ${s.label}</span>
              </div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:var(--text-muted);font-size:0.9rem;">$</span>
                <input
                  type="number"
                  class="budget-edit-input"
                  data-category="${s.id}"
                  value="${t.budgets[s.id]||0}"
                  min="0"
                  step="10"
                />
              </div>
            </div>
          `).join("")}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-md);">
          <span id="total-budget-label" style="font-size:0.85rem;color:var(--text-secondary);">
            Total monthly budget: <strong style="color:var(--text-primary);">${f(Object.values(t.budgets).reduce((s,o)=>s+o,0))}</strong>
          </span>
          <button class="btn-primary" id="save-budgets" style="width:auto;padding:var(--space-sm) var(--space-lg);">
            Save Budgets
          </button>
        </div>
      </div>

      <!-- Instructions -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="book-open" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Setup Guide
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
          <p><strong style="color:var(--text-primary);">Step 1:</strong> Create a new Google Sheet</p>
          <p><strong style="color:var(--text-primary);">Step 2:</strong> Add a "Transactions" tab with columns: Date | Person | Category | Description | Amount</p>
          <p><strong style="color:var(--text-primary);">Step 3:</strong> Go to Extensions → Apps Script</p>
          <p><strong style="color:var(--text-primary);">Step 4:</strong> Paste the provided Apps Script code</p>
          <p><strong style="color:var(--text-primary);">Step 5:</strong> Deploy → New deployment → Web app → Execute as "Me" → Anyone can access</p>
          <p><strong style="color:var(--text-primary);">Step 6:</strong> Copy the Web App URL and paste it above</p>
          <p><strong style="color:var(--text-primary);">Step 7:</strong> Share the Google Sheet with your partner</p>
          <p style="margin-top:var(--space-md);color:var(--text-muted);">
            Both of you can now add expenses through this dashboard or directly in the Google Sheet!
          </p>
        </div>
      </div>
    </div>
  `,r("#save-api-url",e).addEventListener("click",()=>{const s=r("#api-url",e).value.trim(),o=v();o.apiUrl=s,H(o);const n=r("#api-status",e);s?n.innerHTML='<span style="color:var(--success);">✓ Saved — connected to Google Sheets</span>':n.innerHTML='<span style="color:var(--warning);">⚠ Demo mode — using sample data</span>',y(s?"Connected to Google Sheets!":"Using demo mode","success")}),r("#save-names",e).addEventListener("click",()=>{const s=v();s.person1Name=r("#person1-name",e).value.trim()||"Person 1",s.person2Name=r("#person2-name",e).value.trim()||"Person 2",H(s),y("Names updated!","success")});const a=U(".budget-edit-input",e);a.forEach(s=>{s.addEventListener("input",()=>{const o=a.reduce((i,l)=>i+(parseFloat(l.value)||0),0),n=r("#total-budget-label",e);n&&(n.innerHTML=`Total monthly budget: <strong style="color:var(--text-primary);">${f(o)}</strong>`)})}),r("#save-budgets",e).addEventListener("click",()=>{const s=v();a.forEach(o=>{const n=o.dataset.category;s.budgets[n]=parseFloat(o.value)||0}),H(s),y("Budget limits saved!","success")})}function z(){const e=new Q,t=r("#main-content");e.register("dashboard",de),e.register("add-expense",ge),e.register("transactions",ve),e.register("settings",ye),U(".nav-link").forEach(i=>{i.addEventListener("click",l=>{l.preventDefault();const c=i.dataset.page;e.navigate(c),n()})});const a=r("#mobile-menu-btn"),s=r("#sidebar"),o=r("#sidebar-overlay");a&&a.addEventListener("click",()=>{s.classList.toggle("open"),o.classList.toggle("active")}),o&&o.addEventListener("click",n);function n(){s.classList.remove("open"),o.classList.remove("active")}xe(),window.lucide&&window.lucide.createIcons(),e.init(t)}function xe(){const e=v(),t=r("#sync-status");if(r("#mobile-sync-status"),e.apiUrl){if(t){t.classList.add("connected"),t.classList.remove("disconnected");const a=t.querySelector(".sync-text");a&&(a.textContent="Connected")}}else if(t){t.classList.remove("connected"),t.classList.add("disconnected");const a=t.querySelector(".sync-text");a&&(a.textContent="Demo Mode")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z();
