(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();class J{constructor(){this.routes={},this.currentPage=null,this.contentEl=null,this.onNavigate=null,window.addEventListener("hashchange",()=>this._handleRoute())}init(t){this.contentEl=t,this._handleRoute()}register(t,n){this.routes[t]=n}navigate(t){window.location.hash=`#${t}`}_handleRoute(){const t=window.location.hash.slice(1)||"dashboard",n=this.routes[t];if(!n){window.location.hash="#dashboard";return}this.currentPage=t,this.contentEl.innerHTML="",n(this.contentEl),window.lucide&&window.lucide.createIcons(),document.querySelectorAll(".nav-link").forEach(s=>{s.classList.toggle("active",s.dataset.page===t)}),this.onNavigate&&this.onNavigate(t)}getCurrentPage(){return this.currentPage}}const m=[{id:"housing",label:"Housing",icon:"🏠",color:"#818cf8"},{id:"groceries",label:"Groceries",icon:"🛒",color:"#34d399"},{id:"dining",label:"Dining Out",icon:"🍽️",color:"#f97316"},{id:"transport",label:"Transportation",icon:"🚗",color:"#60a5fa"},{id:"utilities",label:"Utilities",icon:"💡",color:"#a78bfa"},{id:"entertainment",label:"Entertainment",icon:"🎬",color:"#f472b6"},{id:"shopping",label:"Shopping",icon:"🛍️",color:"#fbbf24"},{id:"health",label:"Health",icon:"🏥",color:"#2dd4bf"},{id:"subscriptions",label:"Subscriptions",icon:"📱",color:"#c084fc"},{id:"personal",label:"Personal Care",icon:"💆",color:"#fb923c"},{id:"savings",label:"Savings",icon:"💰",color:"#4ade80"},{id:"misc",label:"Miscellaneous",icon:"📦",color:"#94a3b8"}];function W(e){return m.find(t=>t.label.toLowerCase()===e.toLowerCase())||m[m.length-1]}function v(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}function j(e){return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function $(e){const[t,n]=e.split("-");return new Date(parseInt(t),parseInt(n)-1).toLocaleDateString("en-US",{month:"long",year:"numeric"})}function T(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function H(e){const[t,n]=e.split("-").map(Number),s=new Date(t,n-2);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function z(e){const[t,n]=e.split("-").map(Number),s=new Date(t,n);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function U(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function q(e){const[t,n]=e.split("-").map(Number);return new Date(t,n,0).getDate()}function l(e,t=document){return t.querySelector(e)}function Y(e,t=document){return[...t.querySelectorAll(e)]}function L(e,t={},n=[]){const s=document.createElement(e);for(const[a,o]of Object.entries(t))a==="className"?s.className=o:a==="innerHTML"?s.innerHTML=o:a==="textContent"?s.textContent=o:a.startsWith("on")?s.addEventListener(a.slice(2).toLowerCase(),o):s.setAttribute(a,o);for(const a of n)typeof a=="string"?s.appendChild(document.createTextNode(a)):a&&s.appendChild(a);return s}let k=null;function x(e,t="success",n=3e3){k||(k=document.getElementById("toast-container"));const s={success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'},a=L("div",{className:`toast ${t}`});a.innerHTML=`
    <span class="toast-icon">${s[t]||s.info}</span>
    <span>${e}</span>
  `,k.appendChild(a),setTimeout(()=>{a.classList.add("hiding"),setTimeout(()=>a.remove(),300)},n)}function M(e,t,n=800){const s=parseFloat(e.textContent.replace(/[^0-9.-]/g,""))||0,a=performance.now();function o(r){const i=r-a,c=Math.min(i/n,1),d=1-Math.pow(1-c,3),p=s+(t-s)*d;e.textContent=v(p),c<1&&requestAnimationFrame(o)}requestAnimationFrame(o)}function K(e,t){if(t<=0)return"safe";const n=e/t*100;return n>=100?"danger":n>=75?"caution":"safe"}function Q(e,t){return t<=0?0:Math.min(e/t*100,100)}const V="budgetduo_settings",N={apiUrl:"",person1Name:"Person 1",person2Name:"Person 2",budgets:{housing:2e3,groceries:600,dining:400,transport:300,utilities:250,entertainment:200,shopping:300,health:200,subscriptions:100,personal:150,savings:500,misc:200}};function b(){try{const e=localStorage.getItem(V);if(e){const t=JSON.parse(e);return{...N,...t,budgets:{...N.budgets,...t.budgets}}}}catch(e){console.warn("Failed to load settings:",e)}return{...N}}function P(e){try{localStorage.setItem(V,JSON.stringify(e))}catch(t){console.warn("Failed to save settings:",t)}}function Z(e){const[t,n]=e.split("-").map(Number),s=q(e),a=[],o=["Person 1","Person 2"],r={housing:["Rent","Mortgage Payment","Home Insurance"],groceries:["Whole Foods","Trader Joe's","Costco","Target Groceries","Local Market"],dining:["Chipotle","Sushi Place","Pizza Night","Coffee Shop","Brunch","Thai Takeout"],transport:["Gas","Uber","Metro Pass","Car Wash","Parking"],utilities:["Electric Bill","Water Bill","Internet","Gas Bill"],entertainment:["Netflix","Movie Tickets","Concert","Books","Game Purchase"],shopping:["Amazon","Target","New Shoes","Home Decor","Clothing"],health:["Gym Membership","Pharmacy","Doctor Visit","Supplements"],subscriptions:["Spotify","Apple iCloud","YouTube Premium","News Subscription"],personal:["Haircut","Skincare","Dry Cleaning"],savings:["Emergency Fund","401k Extra","Investment"],misc:["Gift","Donation","Miscellaneous"]},i={housing:[1200,1500,1800,2e3],groceries:[45,65,85,120,35,55],dining:[15,25,35,48,22,60],transport:[40,55,12,25,8],utilities:[80,120,65,95],entertainment:[15,25,50,12,60],shopping:[30,55,80,25,120],health:[50,30,150,25],subscriptions:[10,3,14,12],personal:[35,45,15],savings:[200,300,500],misc:[20,50,15,30]},c=30+Math.floor(Math.random()*30);for(let d=0;d<c;d++){const p=m[Math.floor(Math.random()*m.length)],g=r[p.id]||["Expense"],u=i[p.id]||[50],h=Math.min(Math.floor(Math.random()*s)+1,s);a.push({row:d+2,date:`${t}-${String(n).padStart(2,"0")}-${String(h).padStart(2,"0")}`,person:o[Math.floor(Math.random()*2)],category:p.label,description:g[Math.floor(Math.random()*g.length)],amount:u[Math.floor(Math.random()*u.length)]+Math.round(Math.random()*10)})}return a.sort((d,p)=>d.date.localeCompare(p.date)),a}const E={};function R(e){return E[e]||(E[e]=Z(e)),E[e]}async function A(e){const t=b();if(!t.apiUrl)return R(e);try{const n=`${t.apiUrl}?action=getTransactions&month=${e}`,s=await fetch(n);if(!s.ok)throw new Error(`HTTP ${s.status}`);return(await s.json()).transactions||[]}catch(n){throw console.error("Failed to fetch transactions:",n),n}}async function X({date:e,person:t,category:n,description:s,amount:a}){const o=b();if(!o.apiUrl){const r=e.substring(0,7),i=R(r),c={row:i.length+2,date:e,person:t,category:n,description:s,amount:parseFloat(a)};return i.push(c),i.sort((d,p)=>d.date.localeCompare(p.date)),{success:!0,transaction:c}}try{const r=await fetch(o.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"addTransaction",date:e,person:t,category:n,description:s,amount:parseFloat(a)})});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json()}catch(r){throw console.error("Failed to add transaction:",r),r}}async function ee(e,t){const n=b();if(!n.apiUrl){const s=R(t),a=s.findIndex(o=>o.row===e);return a!==-1&&s.splice(a,1),{success:!0}}try{const s=await fetch(n.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"deleteTransaction",row:e})});if(!s.ok)throw new Error(`HTTP ${s.status}`);return await s.json()}catch(s){throw console.error("Failed to delete transaction:",s),s}}function O(e,t){const n={totalSpent:0,byCategory:{},byPerson:{},byDay:{},transactionCount:e.length};m.forEach(s=>{n.byCategory[s.label]={spent:0,limit:t.budgets[s.id]||0,count:0}}),n.byPerson[t.person1Name]=0,n.byPerson[t.person2Name]=0;for(const s of e){const a=parseFloat(s.amount)||0;n.totalSpent+=a,n.byCategory[s.category]?(n.byCategory[s.category].spent+=a,n.byCategory[s.category].count+=1):(n.byCategory.Miscellaneous.spent+=a,n.byCategory.Miscellaneous.count+=1);const o=s.person===t.person1Name||s.person==="Person 1"?t.person1Name:t.person2Name;n.byPerson[o]=(n.byPerson[o]||0)+a;const r=s.date.split("-")[2];n.byDay[r]=(n.byDay[r]||0)+a}return n}m.map(e=>e.color);m.map(e=>e.color+"33");window.Chart&&(Chart.defaults.color="#94a3b8",Chart.defaults.font.family="'Inter', sans-serif",Chart.defaults.font.size=12,Chart.defaults.plugins.legend.labels.usePointStyle=!0,Chart.defaults.plugins.legend.labels.pointStyle="circle",Chart.defaults.plugins.legend.labels.padding=16,Chart.defaults.animation.duration=800,Chart.defaults.animation.easing="easeOutQuart");function te(e,t){const n=[],s=[],a=[];for(const o of m){const r=t[o.label];r&&r.spent>0&&(n.push(o.label),s.push(r.spent),a.push(o.color))}return new Chart(e,{type:"doughnut",data:{labels:n,datasets:[{data:s,backgroundColor:a,borderColor:"rgba(10, 14, 26, 0.8)",borderWidth:3,hoverBorderWidth:0,hoverOffset:8}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"65%",plugins:{legend:{position:"bottom",labels:{padding:12,font:{size:11,weight:"500"}}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,titleFont:{weight:"600"},callbacks:{label:o=>{const r=o.dataset.data.reduce((c,d)=>c+d,0),i=(o.parsed/r*100).toFixed(1);return` ${o.label}: ${v(o.parsed)} (${i}%)`}}}}}})}function se(e,t){const n=Object.keys(t),s=Object.values(t);return new Chart(e,{type:"bar",data:{labels:n,datasets:[{data:s,backgroundColor:["rgba(129, 140, 248, 0.7)","rgba(244, 114, 182, 0.7)"],borderColor:["#818cf8","#f472b6"],borderWidth:2,borderRadius:8,barPercentage:.5}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{label:a=>` ${v(a.parsed.x)}`}}},scales:{x:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:a=>v(a),font:{size:11}}},y:{grid:{display:!1},ticks:{font:{size:13,weight:"600"}}}}}})}function ae(e,t,n){const s=[],a=[];for(let o=1;o<=n;o++){const r=String(o).padStart(2,"0");s.push(o),a.push(t[r]||0)}return new Chart(e,{type:"line",data:{labels:s,datasets:[{label:"Daily Spending",data:a,borderColor:"#818cf8",backgroundColor:"rgba(129, 140, 248, 0.08)",borderWidth:2.5,fill:!0,tension:.4,pointRadius:0,pointHitRadius:20,pointHoverRadius:5,pointHoverBackgroundColor:"#818cf8",pointHoverBorderColor:"#fff",pointHoverBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{title:o=>`Day ${o[0].label}`,label:o=>` Spent: ${v(o.parsed.y)}`}}},scales:{x:{grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{font:{size:10},maxTicksLimit:15}},y:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:o=>"$"+o,font:{size:11}},beginAtZero:!0}}}})}function ne(e,t,n){var r,i;const s=[],a=[],o=[];for(const c of m){const d=((r=t[c.label])==null?void 0:r.spent)||0,p=((i=n[c.label])==null?void 0:i.spent)||0;(d>0||p>0)&&(s.push(c.label),a.push(d),o.push(p))}return new Chart(e,{type:"bar",data:{labels:s,datasets:[{label:"This Month",data:a,backgroundColor:"rgba(129, 140, 248, 0.7)",borderColor:"#818cf8",borderWidth:1.5,borderRadius:6},{label:"Last Month",data:o,backgroundColor:"rgba(255, 255, 255, 0.08)",borderColor:"rgba(255, 255, 255, 0.2)",borderWidth:1.5,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{font:{size:11,weight:"500"},padding:16}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,cornerRadius:8,padding:12,callbacks:{label:c=>` ${c.dataset.label}: ${v(c.parsed.y)}`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10},maxRotation:45}},y:{grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1},ticks:{callback:c=>"$"+c,font:{size:11}},beginAtZero:!0}}}})}let f=T(),C=[];function _(){C.forEach(e=>e.destroy()),C=[]}function oe(e){_(),f=T(),e.innerHTML=`
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
          <span class="month-label" id="month-label">${$(f)}</span>
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
  `,l("#prev-month",e).addEventListener("click",()=>{f=H(f),D(e)}),l("#next-month",e).addEventListener("click",()=>{f=z(f),D(e)}),D(e)}async function D(e){const t=b();_();const n=l("#month-label",e);n&&(n.textContent=$(f));const s=l("#p1-label",e),a=l("#p2-label",e);s&&(s.textContent=t.person1Name),a&&(a.textContent=t.person2Name);try{const[o,r]=await Promise.all([A(f),A(H(f))]),i=O(o,t),c=O(r,t);M(l("#total-spent",e),i.totalSpent),l("#total-txns",e).textContent=i.transactionCount,M(l("#p1-total",e),i.byPerson[t.person1Name]||0),M(l("#p2-total",e),i.byPerson[t.person2Name]||0),re(e,i);const d=l("#chart-category",e),p=l("#chart-person",e),g=l("#chart-daily",e),u=l("#chart-comparison",e);d&&C.push(te(d,i.byCategory)),p&&C.push(se(p,i.byPerson)),g&&C.push(ae(g,i.byDay,q(f))),u&&C.push(ne(u,i.byCategory,c.byCategory)),ie(e,o,t)}catch(o){console.error("Failed to load dashboard:",o)}window.lucide&&window.lucide.createIcons()}function re(e,t){const n=l("#budget-grid",e);if(n){n.innerHTML="";for(const s of m){const a=t.byCategory[s.label];if(!a)continue;const o=a.spent,r=a.limit,i=Q(o,r),c=K(o,r),d=L("div",{className:"card budget-item"});d.innerHTML=`
      <div class="budget-item-header">
        <div class="budget-category">
          <span class="budget-dot" style="background: ${s.color}"></span>
          <span>${s.icon} ${s.label}</span>
        </div>
        <div class="budget-amounts">
          <span class="spent">${v(o)}</span> / ${v(r)}
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${c}" style="width: ${i}%"></div>
      </div>
      <div class="budget-percentage ${c==="danger"?"text-danger":c==="caution"?"text-warning":"text-success"}">
        ${i.toFixed(0)}%
      </div>
    `,n.appendChild(d)}}}function ie(e,t,n){const s=l("#recent-transactions",e);if(!s)return;const a=[...t].reverse().slice(0,8);if(a.length===0){s.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
        <h3>No transactions yet</h3>
        <p>Start tracking your expenses by adding your first transaction.</p>
      </div>
    `;return}s.innerHTML="";for(const o of a){const r=W(o.category),i=o.person===n.person1Name||o.person==="Person 1",c=L("div",{className:"recent-tx-item"});c.innerHTML=`
      <div class="recent-tx-left">
        <div class="recent-tx-cat-icon" style="background: ${r.color}20; color: ${r.color}">
          ${r.icon}
        </div>
        <div class="recent-tx-details">
          <span class="recent-tx-desc">${o.description}</span>
          <span class="recent-tx-meta">${j(o.date)} · <span class="${i?"text-accent":""}" style="${i?"":"color: #f472b6"}">${o.person}</span></span>
        </div>
      </div>
      <span class="recent-tx-amount">${v(o.amount)}</span>
    `,s.appendChild(c)}}function le(e){const t=b();e.innerHTML=`
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
              ${m.map(i=>`<option value="${i.label}">${i.icon} ${i.label}</option>`).join("")}
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
              value="${U()}"
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
  `;const n=l("#person-toggle",e);let s=t.person1Name;n.addEventListener("click",i=>{const c=i.target.closest(".person-btn");c&&(n.querySelectorAll(".person-btn").forEach(d=>d.classList.remove("active")),c.classList.add("active"),s=c.dataset.person)});const a=l("#expense-form",e),o=l("#success-state",e),r=l("#submit-expense",e);a.addEventListener("submit",async i=>{i.preventDefault();const c=parseFloat(l("#expense-amount",e).value),d=l("#expense-category",e).value,p=l("#expense-description",e).value.trim(),g=l("#expense-date",e).value;if(!c||!d||!p||!g){x("Please fill in all fields","error");return}r.disabled=!0,r.textContent="Adding...";try{await X({date:g,person:s,category:d,description:p,amount:c}),a.style.display="none",o.style.display="block",l("#success-message",e).textContent=`${v(c)} for "${p}" added under ${d}`,x("Expense added successfully!","success"),window.lucide&&window.lucide.createIcons()}catch{x("Failed to add expense. Please try again.","error"),r.disabled=!1,r.textContent="Add Expense"}}),e.addEventListener("click",i=>{(i.target.id==="add-another"||i.target.closest("#add-another"))&&(a.style.display="block",o.style.display="none",a.reset(),l("#expense-date",e).value=U(),r.disabled=!1,r.textContent="Add Expense",n.querySelectorAll(".person-btn").forEach(c=>c.classList.remove("active")),n.querySelector(".person-1").classList.add("active"),s=t.person1Name,setTimeout(()=>l("#expense-amount",e).focus(),100))})}let y=T();function ce(e){y=T();const t=b();e.innerHTML=`
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
          <span class="month-label" id="tx-month-label">${$(y)}</span>
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
        ${m.map(n=>`<option value="${n.label}">${n.icon} ${n.label}</option>`).join("")}
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
            <th style="width:60px;"></th>
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
  `,l("#tx-prev-month",e).addEventListener("click",()=>{y=H(y),S(e)}),l("#tx-next-month",e).addEventListener("click",()=>{y=z(y),S(e)}),l("#filter-person",e).addEventListener("change",()=>F(e)),l("#filter-category",e).addEventListener("change",()=>F(e)),l("#export-csv",e).addEventListener("click",()=>pe(e)),S(e)}let B=[];async function S(e){b();const t=l("#tx-month-label",e);t&&(t.textContent=$(y));try{B=await A(y),F(e)}catch{x("Failed to load transactions","error")}window.lucide&&window.lucide.createIcons()}function F(e){var o,r;const t=b(),n=((o=l("#filter-person",e))==null?void 0:o.value)||"all",s=((r=l("#filter-category",e))==null?void 0:r.value)||"all";let a=[...B];n!=="all"&&(a=a.filter(i=>n===t.person1Name?i.person===t.person1Name||i.person==="Person 1":i.person===t.person2Name||i.person==="Person 2")),s!=="all"&&(a=a.filter(i=>i.category===s)),de(e,a,t)}function de(e,t,n){const s=l("#transactions-body",e),a=l("#tx-count",e),o=l("#tx-total",e);if(!s)return;if(t.length===0){s.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; padding: var(--space-2xl);">
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new expense.</p>
          </div>
        </td>
      </tr>
    `,a.textContent="0 transactions",o.textContent="Total: $0.00",window.lucide&&window.lucide.createIcons();return}const r=[...t].sort((g,u)=>u.date.localeCompare(g.date));let i=0;s.innerHTML="";const c='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';for(const g of r){const u=W(g.category),h=g.person===n.person1Name||g.person==="Person 1",w=parseFloat(g.amount)||0;i+=w;const I=L("tr");I.innerHTML=`
      <td>${j(g.date)}</td>
      <td>
        <span class="person-badge ${h?"p1":"p2"}">
          ${h?n.person1Name:n.person2Name}
        </span>
      </td>
      <td>
        <span class="category-badge">
          <span class="budget-dot" style="background:${u.color};width:8px;height:8px;"></span>
          ${u.icon} ${g.category}
        </span>
      </td>
      <td>${g.description}</td>
      <td style="text-align:right; font-weight:600;">${v(w)}</td>
      <td>
        <button class="btn-danger delete-tx" data-row="${g.row}" title="Delete">
          ${c}
        </button>
      </td>
    `,s.appendChild(I)}let d=null,p=null;s.onclick=async g=>{const u=g.target.closest(".delete-tx");if(!u)return;g.preventDefault(),g.stopPropagation();const h=parseInt(u.dataset.row);if(!isNaN(h)){if(d===h){clearTimeout(p),d=null,u.disabled=!0,u.style.opacity="0.4",u.innerHTML="...";try{await ee(h,y),x("Transaction deleted","info"),await S(e)}catch{x("Failed to delete transaction","error"),u.disabled=!1,u.style.opacity="1",u.innerHTML=c}return}if(d!==null){const w=s.querySelector(`.delete-tx[data-row="${d}"]`);w&&(w.innerHTML=c,w.style.background=""),clearTimeout(p)}d=h,u.innerHTML='<span style="font-size:11px;font-weight:700;">Sure?</span>',u.style.background="var(--danger-bg)",p=setTimeout(()=>{d=null,u.innerHTML=c,u.style.background=""},3e3)}},a.textContent=`${r.length} transaction${r.length!==1?"s":""}`,o.textContent=`Total: ${v(i)}`}function pe(e){var g,u;const t=b(),n=((g=l("#filter-person",e))==null?void 0:g.value)||"all",s=((u=l("#filter-category",e))==null?void 0:u.value)||"all";let a=[...B];n!=="all"&&(a=a.filter(h=>h.person===n||n===t.person1Name&&h.person==="Person 1")),s!=="all"&&(a=a.filter(h=>h.category===s));const o=["Date","Person","Category","Description","Amount"],r=a.map(h=>[h.date,h.person,h.category,`"${h.description}"`,h.amount]),i=[o.join(","),...r.map(h=>h.join(","))].join(`
`),c=new Blob([i],{type:"text/csv"}),d=URL.createObjectURL(c),p=document.createElement("a");p.href=d,p.download=`budget_${y}.csv`,p.click(),URL.revokeObjectURL(d),x("CSV exported!","success")}function ue(e){const t=b();e.innerHTML=`
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
          ${m.map(s=>`
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
            Total monthly budget: <strong style="color:var(--text-primary);">${v(Object.values(t.budgets).reduce((s,a)=>s+a,0))}</strong>
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
  `,l("#save-api-url",e).addEventListener("click",()=>{const s=l("#api-url",e).value.trim(),a=b();a.apiUrl=s,P(a);const o=l("#api-status",e);s?o.innerHTML='<span style="color:var(--success);">✓ Saved — connected to Google Sheets</span>':o.innerHTML='<span style="color:var(--warning);">⚠ Demo mode — using sample data</span>',x(s?"Connected to Google Sheets!":"Using demo mode","success")}),l("#save-names",e).addEventListener("click",()=>{const s=b();s.person1Name=l("#person1-name",e).value.trim()||"Person 1",s.person2Name=l("#person2-name",e).value.trim()||"Person 2",P(s),x("Names updated!","success")});const n=Y(".budget-edit-input",e);n.forEach(s=>{s.addEventListener("input",()=>{const a=n.reduce((r,i)=>r+(parseFloat(i.value)||0),0),o=l("#total-budget-label",e);o&&(o.innerHTML=`Total monthly budget: <strong style="color:var(--text-primary);">${v(a)}</strong>`)})}),l("#save-budgets",e).addEventListener("click",()=>{const s=b();n.forEach(a=>{const o=a.dataset.category;s.budgets[o]=parseFloat(a.value)||0}),P(s),x("Budget limits saved!","success")})}function G(){const e=new J,t=l("#main-content");e.register("dashboard",oe),e.register("add-expense",le),e.register("transactions",ce),e.register("settings",ue),Y(".nav-link").forEach(r=>{r.addEventListener("click",i=>{i.preventDefault();const c=r.dataset.page;e.navigate(c),o()})});const n=l("#mobile-menu-btn"),s=l("#sidebar"),a=l("#sidebar-overlay");n&&n.addEventListener("click",()=>{s.classList.toggle("open"),a.classList.toggle("active")}),a&&a.addEventListener("click",o);function o(){s.classList.remove("open"),a.classList.remove("active")}ge(),window.lucide&&window.lucide.createIcons(),e.init(t)}function ge(){const e=b(),t=l("#sync-status");if(l("#mobile-sync-status"),e.apiUrl){if(t){t.classList.add("connected"),t.classList.remove("disconnected");const n=t.querySelector(".sync-text");n&&(n.textContent="Connected")}}else if(t){t.classList.remove("connected"),t.classList.add("disconnected");const n=t.querySelector(".sync-text");n&&(n.textContent="Demo Mode")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",G):G();
