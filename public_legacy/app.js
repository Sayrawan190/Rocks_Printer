const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  me: null, users: [], filaments: [], notifications: [], page: 'home',
  language: localStorage.getItem('printHubLanguage') || 'en',
  theme: localStorage.getItem('printHubTheme') || 'light',
  countdownTimer: null, notificationTimer: null, cache: {}
};

const words = {
  en: {
    welcome:'Welcome back',loginSubtitle:'Sign in to manage the shared printer.',username:'Username',password:'Password',rememberMe:'Remember me',login:'Login',
    printerManager:'Printer Manager',home:'Home',queue:'Queue',favorites:'Favorite',inventory:'Inventory',statistics:'Statistics',history:'History',maintenance:'Maintenance',adminPanel:'Admin Panel',serverConnected:'Server connected',
    updates:'UPDATES',notifications:'Notifications',markAllRead:'Mark all as read',account:'ACCOUNT',settings:'Settings',changePassword:'Change password',currentPassword:'Current password',newPassword:'New password',confirmPassword:'Confirm password',updatePassword:'Update password',logout:'Logout',admin:'Admin',member:'Member',
    dashboard:'Dashboard',dashboardSubtitle:'A live view of the shared printer.',currentPrinting:'Current printing',printerStatus:'Printer status',timeRemaining:'Time remaining',queueCount:'Queue count',spools:'Filament spools',remainingGrams:'Remaining filament',printsMonth:'Prints this month',failedPrints:'Failed prints',canceledPrints:'Canceled prints',maintenanceCost:'Maintenance cost',idle:'Idle',printing:'Printing',paused:'Paused',noActivePrint:'No active print',queueHint:'Start the next job from the Queue page.',recentPrints:'Recent prints',yourSummary:'Your summary',requests:'Requests',activeQueue:'Active queue',favoriteItems:'Favorite items',totalPrints:'Total prints',successful:'Successful',gramsUsed:'Grams used',owner:'Owner',filament:'Filament',started:'Started',estimatedFinish:'Estimated finish',estimatedGrams:'Estimated grams',duration:'Duration',pause:'Pause',resume:'Resume',finish:'Finish',cancel:'Cancel',
    queueTitle:'Print queue',queueSubtitle:'Requests waiting for the shared printer.',addRequest:'Add request',search:'Search...',allOwners:'All owners',allStatuses:'All statuses',allPriorities:'All priorities',product:'Product',priority:'Priority',status:'Status',added:'Added',actions:'Actions',pending:'Pending',done:'Done',failed:'Failed',canceled:'Canceled',startPrinting:'Start printing',edit:'Edit',delete:'Delete',moveUp:'Up',moveDown:'Down',noQueue:'No queue requests',noQueueText:'Add the first print request.',
    favoriteTitle:'Favorite ideas',favoriteSubtitle:'Save models you want to print later.',addFavorite:'Add favorite',tags:'Tags',preferredFilament:'Preferred filament',moveToQueue:'Move to queue',noFavorites:'No favorite ideas',
    inventoryTitle:'Filament inventory',inventorySubtitle:'Track ownership, cost, and remaining material.',addFilament:'Add filament',material:'Material',color:'Color',owners:'Owners',remaining:'Remaining',pricePerGram:'Price / gram',usage:'Usage',normal:'Normal',lowFilament:'Low filament',empty:'Empty',viewLog:'Usage log',noFilaments:'No filaments found',
    statisticsTitle:'Statistics',statisticsSubtitle:'Printing and maintenance performance.',globalOverview:'Global overview',userPerformance:'User performance',successRate:'Success rate',totalConsumed:'Total consumed',mostUsedFilament:'Most used filament',mostUsedColor:'Most used color',mostActiveUser:'Most active user',maintenanceOverview:'Maintenance overview',repairs:'Repairs',upgrades:'Upgrades',parts:'Purchased parts',commonType:'Most common type',totalPaid:'Total paid',
    historyTitle:'Print history',historySubtitle:'Completed, failed, and canceled jobs.',allResults:'All results',result:'Result',date:'Date',note:'Note',noHistory:'No print history',
    maintenanceTitle:'Maintenance records',maintenanceSubtitle:'Repairs, upgrades, cleaning, and shared costs.',addMaintenance:'Add maintenance',allTypes:'All types',responsible:'Responsible user',store:'Store',cost:'Cost',description:'Description',lastMaintenance:'Last maintenance',mostExpensive:'Most expensive',noMaintenance:'No maintenance records',
    adminTitle:'Admin panel',adminSubtitle:'Permissions, data, and account controls.',currentAdmin:'Current Admin',transferAdmin:'Transfer Admin',transferWarning:'The current Admin will lose access immediately.',transfer:'Transfer access',dataTools:'Data tools',exportData:'Export JSON',importData:'Import JSON',resetData:'Reset app data',resetWarning:'This clears activity data and returns Admin access to Abdullah.',quickLinks:'Quick links',openInventory:'Open inventory',openHistory:'Open history',allNotifications:'All notifications',completed:'Completed',maintenance:'Maintenance',repair:'Repair','purchased part':'Purchased Part',upgrade:'Upgrade',cleaning:'Cleaning',calibration:'Calibration','consumable purchase':'Consumable Purchase',other:'Other',
    save:'Save',close:'Close',modelLink:'Model/file link',imageUrl:'Image URL',notes:'Notes',durationMinutes:'Duration (minutes)',selectFilament:'Select filament',low:'Low',high:'High',title:'Title',type:'Type',printer:'Printer',totalCost:'Total cost (SAR)',invoiceLink:'Invoice link',receiptImage:'Receipt image URL',amountPaid:'Amount paid',paymentsEqual:'Payments must equal the total cost.',purchaseDate:'Purchase date',totalWeight:'Total weight (g)',remainingWeight:'Remaining weight (g)',price:'Price (SAR)',colorHex:'Color preview',resultNote:'Result note / reason',actualGrams:'Actual or wasted grams',confirm:'Confirm',createdBy:'Created by',finishedBy:'Finished by',noData:'No data available',minutes:'min',grams:'g',sar:'SAR',view:'View'
  },
  ar: {
    welcome:'حياك من جديد',loginSubtitle:'سجّل دخولك لإدارة الطابعة المشتركة.',username:'اسم المستخدم',password:'كلمة المرور',rememberMe:'تذكرني',login:'تسجيل الدخول',
    printerManager:'إدارة الطابعة',home:'الرئيسية',queue:'الطابور',favorites:'المفضلة',inventory:'المخزون',statistics:'الإحصائيات',history:'السجل',maintenance:'الصيانة',adminPanel:'لوحة المدير',serverConnected:'الخادم متصل',
    updates:'التحديثات',notifications:'الإشعارات',markAllRead:'تحديد الكل كمقروء',account:'الحساب',settings:'الإعدادات',changePassword:'تغيير كلمة المرور',currentPassword:'كلمة المرور الحالية',newPassword:'كلمة المرور الجديدة',confirmPassword:'تأكيد كلمة المرور',updatePassword:'تحديث كلمة المرور',logout:'تسجيل الخروج',admin:'مدير',member:'عضو',
    dashboard:'لوحة التحكم',dashboardSubtitle:'عرض مباشر للطابعة المشتركة.',currentPrinting:'الطباعة الحالية',printerStatus:'حالة الطابعة',timeRemaining:'الوقت المتبقي',queueCount:'طلبات الطابور',spools:'بكرات الفيلمنت',remainingGrams:'الفيلمنت المتبقي',printsMonth:'طبعات هذا الشهر',failedPrints:'الطبعات الفاشلة',canceledPrints:'الطبعات الملغاة',maintenanceCost:'تكلفة الصيانة',idle:'متوقفة',printing:'تطبع',paused:'متوقفة مؤقتًا',noActivePrint:'لا توجد طباعة حالية',queueHint:'ابدأ المهمة التالية من صفحة الطابور.',recentPrints:'آخر الطبعات',yourSummary:'ملخص حسابك',requests:'الطلبات',activeQueue:'الطابور النشط',favoriteItems:'عناصر المفضلة',totalPrints:'إجمالي الطبعات',successful:'الناجحة',gramsUsed:'الجرامات المستخدمة',owner:'المالك',filament:'الفيلمنت',started:'وقت البدء',estimatedFinish:'النهاية المتوقعة',estimatedGrams:'الجرامات المتوقعة',duration:'المدة',pause:'إيقاف مؤقت',resume:'استئناف',finish:'إنهاء',cancel:'إلغاء',
    queueTitle:'طابور الطباعة',queueSubtitle:'طلبات تنتظر الطابعة المشتركة.',addRequest:'إضافة طلب',search:'بحث...',allOwners:'كل المالكين',allStatuses:'كل الحالات',allPriorities:'كل الأولويات',product:'المنتج',priority:'الأولوية',status:'الحالة',added:'تاريخ الإضافة',actions:'الإجراءات',pending:'معلق',done:'مكتمل',failed:'فاشل',canceled:'ملغى',startPrinting:'بدء الطباعة',edit:'تعديل',delete:'حذف',moveUp:'رفع',moveDown:'خفض',noQueue:'لا توجد طلبات',noQueueText:'أضف أول طلب طباعة.',
    favoriteTitle:'الأفكار المفضلة',favoriteSubtitle:'احفظ المجسمات التي تريد طباعتها لاحقًا.',addFavorite:'إضافة للمفضلة',tags:'الوسوم',preferredFilament:'الفيلمنت المفضل',moveToQueue:'نقل للطابور',noFavorites:'لا توجد أفكار مفضلة',
    inventoryTitle:'مخزون الفيلمنت',inventorySubtitle:'تابع الملكية والتكلفة والكمية المتبقية.',addFilament:'إضافة فيلمنت',material:'المادة',color:'اللون',owners:'الملاك',remaining:'المتبقي',pricePerGram:'سعر الجرام',usage:'الاستخدام',normal:'طبيعي',lowFilament:'فيلمنت منخفض',empty:'فارغ',viewLog:'سجل الاستخدام',noFilaments:'لا توجد بكرات',
    statisticsTitle:'الإحصائيات',statisticsSubtitle:'أداء الطباعة والصيانة.',globalOverview:'النظرة العامة',userPerformance:'أداء المستخدمين',successRate:'نسبة النجاح',totalConsumed:'إجمالي الاستهلاك',mostUsedFilament:'الأكثر استخدامًا',mostUsedColor:'اللون الأكثر استخدامًا',mostActiveUser:'أنشط مستخدم',maintenanceOverview:'ملخص الصيانة',repairs:'الإصلاحات',upgrades:'الترقيات',parts:'القطع المشتراة',commonType:'النوع الأكثر تكرارًا',totalPaid:'إجمالي المدفوع',
    historyTitle:'سجل الطباعة',historySubtitle:'الطبعات المكتملة والفاشلة والملغاة.',allResults:'كل النتائج',result:'النتيجة',date:'التاريخ',note:'الملاحظة',noHistory:'لا يوجد سجل طباعة',
    maintenanceTitle:'سجل الصيانة',maintenanceSubtitle:'الإصلاحات والترقيات والتنظيف والتكاليف المشتركة.',addMaintenance:'إضافة صيانة',allTypes:'كل الأنواع',responsible:'المسؤول',store:'المتجر',cost:'التكلفة',description:'الوصف',lastMaintenance:'آخر صيانة',mostExpensive:'الأعلى تكلفة',noMaintenance:'لا توجد سجلات صيانة',
    adminTitle:'لوحة المدير',adminSubtitle:'الصلاحيات والبيانات وإدارة الحساب.',currentAdmin:'المدير الحالي',transferAdmin:'نقل صلاحية المدير',transferWarning:'المدير الحالي سيفقد صلاحياته مباشرة.',transfer:'نقل الصلاحية',dataTools:'أدوات البيانات',exportData:'تصدير JSON',importData:'استيراد JSON',resetData:'تصفير بيانات التطبيق',resetWarning:'يحذف بيانات النشاط ويعيد صلاحية المدير لعبدالله.',quickLinks:'روابط سريعة',openInventory:'فتح المخزون',openHistory:'فتح السجل',allNotifications:'كل الإشعارات',completed:'مكتملة',printing:'تطبع',paused:'متوقفة مؤقتًا',maintenance:'صيانة',repair:'إصلاح','purchased part':'قطعة مشتراة',upgrade:'ترقية',cleaning:'تنظيف',calibration:'معايرة','consumable purchase':'شراء مستهلكات',other:'أخرى',
    save:'حفظ',close:'إغلاق',modelLink:'رابط الملف/المجسم',imageUrl:'رابط الصورة',notes:'ملاحظات',durationMinutes:'المدة (بالدقائق)',selectFilament:'اختر الفيلمنت',low:'منخفضة',high:'عالية',title:'العنوان',type:'النوع',printer:'الطابعة',totalCost:'إجمالي التكلفة (ر.س)',invoiceLink:'رابط الفاتورة',receiptImage:'رابط صورة الإيصال',amountPaid:'المبلغ المدفوع',paymentsEqual:'يجب أن يساوي مجموع المدفوعات التكلفة الإجمالية.',purchaseDate:'تاريخ الشراء',totalWeight:'الوزن الإجمالي (جم)',remainingWeight:'الوزن المتبقي (جم)',price:'السعر (ر.س)',colorHex:'معاينة اللون',resultNote:'ملاحظة النتيجة / السبب',actualGrams:'الجرامات الفعلية أو المهدرة',confirm:'تأكيد',createdBy:'أضيف بواسطة',finishedBy:'أنهاها',noData:'لا توجد بيانات',minutes:'دقيقة',grams:'جم',sar:'ر.س',view:'عرض'
  }
};

function t(key) { return words[state.language][key] || words.en[key] || key; }
function esc(value = '') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function attr(value = '') { return esc(value); }
function fmtDate(value, includeTime = false) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(state.language === 'ar' ? 'ar-SA' : 'en-GB', includeTime ? { dateStyle:'medium', timeStyle:'short' } : { dateStyle:'medium' }).format(new Date(value));
}
function fmtNum(value, digits = 0) { return new Intl.NumberFormat(state.language === 'ar' ? 'ar-SA' : 'en-US', { maximumFractionDigits:digits }).format(Number(value || 0)); }
function badge(value) { return `<span class="badge ${String(value).toLowerCase().replaceAll(' ','-')}">${esc(t(String(value).toLowerCase()) || value)}</span>`; }
function empty(title, text = '') { return `<div class="empty"><strong>${esc(title)}</strong>${esc(text)}</div>`; }
function imageThumb(url) { return url ? `<img class="thumb" src="${attr(url)}" alt="" onerror="this.outerHTML='<span class=&quot;thumb placeholder&quot;>3D</span>'">` : '<span class="thumb placeholder">3D</span>'; }

async function api(url, options = {}) {
  const response = await fetch(url, { headers:{ 'Content-Type':'application/json', ...(options.headers || {}) }, ...options });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    if (response.status === 401 && url !== '/api/login') showLogin();
    throw new Error(data.error || data || 'Request failed');
  }
  return data;
}

function toast(message, kind = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`; el.textContent = message;
  $('#toastRegion').append(el); setTimeout(() => el.remove(), 3800);
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('#themeButton').textContent = state.theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('printHubTheme', state.theme);
}

function applyLanguage(save = false) {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $('#languageButton').textContent = state.language === 'ar' ? 'EN' : 'AR';
  $('#loginLanguage').textContent = state.language === 'ar' ? 'English' : 'العربية';
  localStorage.setItem('printHubLanguage', state.language);
  if (save && state.me) api('/api/me/language', { method:'PUT', body:JSON.stringify({ language:state.language }) }).catch(() => {});
}

function setPageTitle(titleKey, subtitleKey) {
  $('#pageTitle').textContent = t(titleKey);
  $('#pageEyebrow').textContent = subtitleKey ? t(subtitleKey).toUpperCase() : 'PRINT HUB';
}

function showLogin() {
  state.me = null; clearInterval(state.countdownTimer); clearInterval(state.notificationTimer);
  $('#appView').classList.add('hidden'); $('#loginView').classList.remove('hidden'); closeDrawers();
}

async function boot() {
  applyTheme(); applyLanguage();
  try {
    const { user } = await api('/api/me'); state.me = user;
    await enterApp();
  } catch { showLogin(); }
}

async function enterApp() {
  $('#loginView').classList.add('hidden'); $('#appView').classList.remove('hidden');
  state.language = state.me.language || state.language; applyLanguage();
  await Promise.all([loadUsers(), loadFilaments(), loadNotifications()]);
  updateProfile(); await navigate('home');
  clearInterval(state.notificationTimer); state.notificationTimer = setInterval(loadNotifications, 30000);
}

async function loadUsers() { state.users = await api('/api/users'); }
async function loadFilaments() { state.filaments = await api('/api/filaments'); }
async function loadNotifications() {
  if (!state.me) return;
  state.notifications = await api('/api/notifications');
  renderNotifications();
}

function updateProfile() {
  const letter = state.me.display_name[0].toUpperCase(), role = state.me.is_admin ? t('admin') : t('member');
  $('#avatar').textContent = letter; $('#drawerAvatar').textContent = letter;
  $('#profileName').textContent = state.me.display_name; $('#drawerName').textContent = state.me.display_name;
  $('#profileRole').textContent = role; $('#drawerRole').textContent = role;
  $$('.admin-nav').forEach(el => el.classList.toggle('hidden', !state.me.is_admin));
}

function renderNotifications() {
  const unread = state.notifications.filter(n => !n.is_read && n.user_id === state.me?.id).length;
  $('#notificationCount').textContent = unread; $('#notificationCount').classList.toggle('hidden', !unread);
  $('#notificationList').innerHTML = state.notifications.length ? state.notifications.map(n => `
    <article class="notification ${n.is_read ? '' : 'unread'}" data-notification-id="${n.id}">
      <h4>${esc(n.title)} ${n.recipient_name && state.me.is_admin ? `<small>→ ${esc(n.recipient_name)}</small>` : ''}</h4>
      <p>${esc(n.message)}</p><time>${fmtDate(n.created_at,true)}</time>
    </article>`).join('') : empty(t('notifications'));
}

async function navigate(page) {
  if (page === 'admin' && !state.me.is_admin) page = 'home';
  state.page = page; localStorage.setItem('printHubPage', page);
  $$('#nav button').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
  $('#pageContent').innerHTML = '<div class="loader"></div>'; closeMobileNav();
  try {
    const renderers = { home:renderHome, queue:renderQueue, favorites:renderFavorites, inventory:renderInventory, statistics:renderStatistics, history:renderHistory, maintenance:renderMaintenance, admin:renderAdmin };
    await renderers[page]();
  } catch (error) { $('#pageContent').innerHTML = empty(error.message); toast(error.message,'error'); }
}

function statCard(label, value, note = '', icon = '•') {
  return `<article class="card stat-card"><div class="stat-top"><span>${esc(label)}</span><i class="stat-icon">${icon}</i></div><strong class="stat-value">${value}</strong><small class="stat-note">${esc(note)}</small></article>`;
}

async function renderHome() {
  setPageTitle('dashboard','dashboardSubtitle');
  const data = await api('/api/dashboard'); state.cache.dashboard = data;
  const c = data.cards, current = data.current;
  $('#pageContent').innerHTML = `
    <div class="stats-grid grid">
      ${statCard(t('printerStatus'), current ? t(current.status.toLowerCase()) : t('idle'), current ? current.product_name : t('noActivePrint'),'◉')}
      ${statCard(t('queueCount'),fmtNum(c.queue.pending),'','☷')}
      ${statCard(t('spools'),fmtNum(c.filaments.count),`${fmtNum(c.filaments.grams,1)} ${t('grams')}`,'◌')}
      ${statCard(t('printsMonth'),fmtNum(c.history.month),'','↗')}
      ${statCard(t('failedPrints'),fmtNum(c.history.failed),'','!')}
      ${statCard(t('canceledPrints'),fmtNum(c.history.canceled),'','×')}
      ${statCard(t('favoriteItems'),fmtNum(c.favorites),'','☆')}
      ${statCard(t('maintenanceCost'),`${fmtNum(c.maintenance,2)} ${t('sar')}`,'','⌘')}
    </div>
    <div class="grid two-col" style="margin-top:17px">
      ${renderCurrent(current)}
      <section class="card"><div class="section-title"><h3>${t('yourSummary')}</h3></div>
        <div class="bar-list">
          ${summaryRow(t('requests'),data.profile.total_requests)}${summaryRow(t('activeQueue'),data.profile.active_queue)}
          ${summaryRow(t('totalPrints'),data.profile.total_prints)}${summaryRow(t('successful'),data.profile.successful)}
          ${summaryRow(t('failedPrints'),data.profile.failed)}${summaryRow(t('gramsUsed'),`${fmtNum(data.profile.grams,1)}g`)}
        </div>
      </section>
    </div>
    <section class="card" style="margin-top:17px"><div class="section-title"><h3>${t('recentPrints')}</h3></div>${historyTable(data.recent, true)}</section>`;
  startCountdown(current);
}

function summaryRow(label,value) { return `<div class="item-meta"><span>${esc(label)}</span><strong>${value}</strong></div>`; }
function renderCurrent(current) {
  if (!current) return `<section class="card current-card"><div class="section-title"><h3>${t('currentPrinting')}</h3>${badge('Idle')}</div>${empty(t('noActivePrint'),t('queueHint'))}</section>`;
  return `<section class="card current-card"><div class="current-top"><div><p class="eyebrow">${t('currentPrinting').toUpperCase()}</p><h2>${esc(current.product_name)}</h2></div>${badge(current.status)}</div>
    ${current.image_url ? `<img class="item-image" src="${attr(current.image_url)}" alt="">` : ''}<div id="countdown" class="countdown">--:--:--</div><p class="muted">${t('timeRemaining')}</p>
    <div class="detail-grid"><div><small>${t('owner')}</small><b>${esc(current.owner_name)}</b></div><div><small>${t('filament')}</small><b>${esc(current.filament_name || '—')}</b></div><div><small>${t('estimatedGrams')}</small><b>${fmtNum(current.estimated_grams,1)}g</b></div><div><small>${t('started')}</small><b>${fmtDate(current.started_at,true)}</b></div><div><small>${t('estimatedFinish')}</small><b>${fmtDate(current.ends_at,true)}</b></div><div><small>${t('duration')}</small><b>${fmtNum(current.duration_minutes)} ${t('minutes')}</b></div></div>
    ${state.me.is_admin ? `<div class="current-actions">${current.status === 'Paused' ? `<button class="btn success" data-action="resume-print">${t('resume')}</button>` : `<button class="btn warning" data-action="pause-print">${t('pause')}</button>`}<button class="btn primary" data-action="finish-print" data-result="Completed">${t('finish')}</button><button class="btn danger outline" data-action="finish-print" data-result="Canceled">${t('cancel')}</button></div>` : ''}</section>`;
}

function startCountdown(current) {
  clearInterval(state.countdownTimer); if (!current) return;
  const tick = () => {
    const el = $('#countdown'); if (!el) return;
    let ms = current.status === 'Paused' ? new Date(current.ends_at)-new Date(current.paused_at) : new Date(current.ends_at)-Date.now();
    ms = Math.max(0,ms); const hours=Math.floor(ms/3600000), minutes=Math.floor(ms%3600000/60000), seconds=Math.floor(ms%60000/1000);
    el.textContent=[hours,minutes,seconds].map(v=>String(v).padStart(2,'0')).join(':');
  }; tick(); state.countdownTimer=setInterval(tick,1000);
}

function pageHead(title,subtitle,action='') { return `<div class="page-head"><div><h2>${esc(title)}</h2><p class="muted">${esc(subtitle)}</p></div>${action}</div>`; }
function filterOptions(list, allLabel) { return `<option value="">${esc(allLabel)}</option>${list.map(v=>`<option value="${attr(v)}">${esc(v)}</option>`).join('')}`; }
function filamentOptions(selected = '', ownOnly = false) {
  const list = ownOnly ? state.filaments.filter(f => f.owners.map(Number).includes(state.me.id)) : state.filaments;
  return `<option value="">${t('selectFilament')}</option>${list.map(f=>`<option value="${f.id}" ${Number(selected)===f.id?'selected':''}>${esc(f.name)} · ${fmtNum(f.remaining_grams,1)}g</option>`).join('')}`;
}

async function renderQueue() {
  setPageTitle('queue','queueSubtitle'); const items=await api('/api/queue'); state.cache.queue=items;
  $('#pageContent').innerHTML = `${pageHead(t('queueTitle'),t('queueSubtitle'),`<button class="btn primary" data-action="add-queue">+ ${t('addRequest')}</button>`)}
    <div class="toolbar"><div class="search-box"><input id="queueSearch" placeholder="${t('search')}"></div><select id="queueOwner">${filterOptions(state.users.map(u=>u.display_name),t('allOwners'))}</select><select id="queueStatus">${filterOptions(['Pending','Printing','Done','Failed','Canceled'],t('allStatuses'))}</select><select id="queuePriority">${filterOptions(['Low','Normal','High'],t('allPriorities'))}</select></div><div id="queueTable"></div>`;
  renderQueueRows();
}

function renderQueueRows() {
  const q=($('#queueSearch')?.value||'').toLowerCase(), owner=$('#queueOwner')?.value, status=$('#queueStatus')?.value, priority=$('#queuePriority')?.value;
  const items=(state.cache.queue||[]).filter(i=>[i.product_name,i.owner_name,i.filament_name,i.material,i.filament_color,i.notes,i.status,i.priority].join(' ').toLowerCase().includes(q)&&(!owner||i.owner_name===owner)&&(!status||i.status===status)&&(!priority||i.priority===priority));
  if(!items.length){$('#queueTable').innerHTML=empty(t('noQueue'),t('noQueueText'));return;}
  $('#queueTable').innerHTML=`<div class="table-wrap"><table><thead><tr><th>${t('product')}</th><th>${t('owner')}</th><th>${t('filament')}</th><th>${t('estimatedGrams')}</th><th>${t('priority')}</th><th>${t('status')}</th><th>${t('added')}</th><th>${t('actions')}</th></tr></thead><tbody>${items.map(i=>`<tr><td><div class="product-cell">${imageThumb(i.image_url)}<div><strong>${esc(i.product_name)}</strong>${i.model_link?`<br><a class="link" href="${attr(i.model_link)}" target="_blank">${t('view')}</a>`:''}</div></div></td><td>${esc(i.owner_name)}</td><td>${esc(i.filament_name||'—')}</td><td>${fmtNum(i.estimated_grams,1)}g</td><td>${badge(i.priority)}</td><td>${badge(i.status)}</td><td>${fmtDate(i.added_at)}</td><td><div class="row-actions">${queueActions(i)}</div></td></tr>`).join('')}</tbody></table></div>`;
}

function queueActions(i){const own=i.owner_id===state.me.id;if(i.status!=='Pending')return '';return `${state.me.is_admin?`<button class="btn primary small" data-action="start-queue" data-id="${i.id}">${t('startPrinting')}</button><button class="btn secondary small" data-action="reorder" data-id="${i.id}" data-direction="up">↑</button><button class="btn secondary small" data-action="reorder" data-id="${i.id}" data-direction="down">↓</button>`:''}${own||state.me.is_admin?`<button class="btn secondary small" data-action="edit-queue" data-id="${i.id}">${t('edit')}</button><button class="btn danger outline small" data-action="delete-queue" data-id="${i.id}">${t('delete')}</button>`:''}`}

async function renderFavorites(){setPageTitle('favorites','favoriteSubtitle');const items=await api('/api/favorites');state.cache.favorites=items;$('#pageContent').innerHTML=`${pageHead(t('favoriteTitle'),t('favoriteSubtitle'),`<button class="btn primary" data-action="add-favorite">+ ${t('addFavorite')}</button>`)}<div class="toolbar"><div class="search-box"><input id="favoriteSearch" placeholder="${t('search')}"></div></div><div id="favoriteGrid" class="grid item-grid"></div>`;renderFavoriteCards();}
function renderFavoriteCards(){const q=($('#favoriteSearch')?.value||'').toLowerCase();const items=(state.cache.favorites||[]).filter(i=>[i.product_name,i.owner_name,i.filament_name,i.notes,(i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));$('#favoriteGrid').innerHTML=items.length?items.map(i=>`<article class="card item-card">${i.image_url?`<img class="item-image" src="${attr(i.image_url)}" alt="">`:''}<div><h3>${esc(i.product_name)}</h3><p class="muted">${esc(i.notes||'')}</p></div><div class="owner-badges">${(i.tags||[]).map(tag=>`<span class="badge">${esc(tag)}</span>`).join('')}</div><div class="item-meta"><span>${esc(i.owner_name)}</span><span>${i.estimated_grams?`${fmtNum(i.estimated_grams,1)}g`:'—'}</span></div><div class="item-actions">${i.owner_id===state.me.id?`<button class="btn primary small" data-action="favorite-to-queue" data-id="${i.id}">${t('moveToQueue')}</button>`:''}${i.owner_id===state.me.id||state.me.is_admin?`<button class="btn danger outline small" data-action="delete-favorite" data-id="${i.id}">${t('delete')}</button>`:''}</div></article>`).join(''):empty(t('noFavorites'));}

async function renderInventory(){setPageTitle('inventory','inventorySubtitle');await loadFilaments();state.cache.filaments=state.filaments;$('#pageContent').innerHTML=`${pageHead(t('inventoryTitle'),t('inventorySubtitle'),state.me.is_admin?`<button class="btn primary" data-action="add-filament">+ ${t('addFilament')}</button>`:'')}<div class="toolbar"><div class="search-box"><input id="inventorySearch" placeholder="${t('search')}"></div><select id="materialFilter">${filterOptions(['PLA','PLA+','PETG','TPU','ABS','Other'],t('allTypes'))}</select></div><div id="inventoryGrid" class="grid item-grid"></div>`;renderFilaments();}
function filamentStatus(f){return Number(f.remaining_grams)<=0?'Empty':Number(f.remaining_grams)<100?'Low':'Normal'}
function renderFilaments(){const q=($('#inventorySearch')?.value||'').toLowerCase(),mat=$('#materialFilter')?.value;const items=state.filaments.filter(f=>[f.name,f.material,f.color,f.notes,(f.owner_details||[]).map(o=>o.name).join(' ')].join(' ').toLowerCase().includes(q)&&(!mat||f.material===mat));$('#inventoryGrid').innerHTML=items.length?items.map(f=>{const percent=Math.max(0,Math.min(100,Number(f.remaining_grams)/Number(f.total_grams)*100)),status=filamentStatus(f),price=f.price_sar?Number(f.price_sar)/Number(f.total_grams):null;return `<article class="card item-card"><div class="spool-head"><span class="color-dot" style="background:${attr(f.color_hex||'#64748b')}"></span><div><h3>${esc(f.name)}</h3><span class="muted">${esc(f.material)} · ${esc(f.color)}</span></div></div><div class="owner-badges">${(f.owner_details||[]).map(o=>`<span class="mini-avatar" title="${attr(o.name)}">${esc(o.name[0])}</span>`).join('')}</div><div><div class="item-meta"><span>${t('remaining')}</span><strong>${fmtNum(f.remaining_grams,1)} / ${fmtNum(f.total_grams,1)}g</strong></div><div class="progress ${status.toLowerCase()}"><span style="width:${percent}%"></span></div></div><div class="item-meta"><span>${t('pricePerGram')}</span><strong>${price?`${fmtNum(price,3)} ${t('sar')}`:'—'}</strong></div><div class="item-meta"><span>${t('usage')}</span><strong>${fmtNum(f.usage_count)}</strong></div><div>${badge(status)}</div><div class="item-actions"><button class="btn secondary small" data-action="filament-log" data-id="${f.id}">${t('viewLog')}</button>${state.me.is_admin?`<button class="btn secondary small" data-action="edit-filament" data-id="${f.id}">${t('edit')}</button><button class="btn danger outline small" data-action="delete-filament" data-id="${f.id}">${t('delete')}</button>`:''}</div></article>`}).join(''):empty(t('noFilaments'));}

async function renderStatistics(){setPageTitle('statistics','statisticsSubtitle');const d=await api('/api/statistics');state.cache.statistics=d;$('#pageContent').innerHTML=`${pageHead(t('statisticsTitle'),t('statisticsSubtitle'))}<div class="stats-grid grid">${statCard(t('totalPrints'),fmtNum(d.global.total),'','◉')}${statCard(t('successful'),fmtNum(d.global.successful),'','✓')}${statCard(t('failedPrints'),fmtNum(d.global.failed),'','!')}${statCard(t('totalConsumed'),`${fmtNum(d.global.grams,1)}g`,'','◌')}${statCard(t('mostUsedFilament'),esc(d.top.filament||'—'),'','◎')}${statCard(t('mostUsedColor'),esc(d.top.color||'—'),'','●')}${statCard(t('mostActiveUser'),esc(d.top.active_user||'—'),'','↗')}${statCard(t('maintenanceCost'),`${fmtNum(d.maintenance.total_cost,2)} ${t('sar')}`,'','⌘')}</div><div class="grid two-col" style="margin-top:17px"><section class="card"><div class="section-title"><h3>${t('userPerformance')}</h3></div><div class="bar-list">${d.users.map(u=>`<div class="bar-row"><b>${esc(u.display_name)}</b><div class="progress"><span style="width:${u.success_rate}%"></span></div><span>${fmtNum(u.success_rate,1)}%</span></div>`).join('')}</div><div class="table-wrap" style="margin-top:18px"><table><thead><tr><th>${t('owner')}</th><th>${t('totalPrints')}</th><th>${t('successful')}</th><th>${t('failedPrints')}</th><th>${t('canceledPrints')}</th><th>${t('gramsUsed')}</th></tr></thead><tbody>${d.users.map(u=>`<tr><td>${esc(u.display_name)}</td><td>${u.total_prints}</td><td>${u.successful}</td><td>${u.failed}</td><td>${u.canceled}</td><td>${fmtNum(u.grams,1)}g</td></tr>`).join('')}</tbody></table></div></section><section class="card"><div class="section-title"><h3>${t('maintenanceOverview')}</h3></div><div class="grid two-col">${summaryRow(t('repairs'),d.maintenance.repairs)}${summaryRow(t('upgrades'),d.maintenance.upgrades)}${summaryRow(t('parts'),d.maintenance.parts)}${summaryRow(t('commonType'),d.maintenance.common_type||'—')}</div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="bar-list">${d.payments.map(p=>summaryRow(`${t('totalPaid')} · ${p.display_name}`,`${fmtNum(p.paid,2)} ${t('sar')}`)).join('')}</div></section></div>`;}

async function renderHistory(){setPageTitle('history','historySubtitle');const items=await api('/api/history');state.cache.history=items;$('#pageContent').innerHTML=`${pageHead(t('historyTitle'),t('historySubtitle'))}<div class="toolbar"><div class="search-box"><input id="historySearch" placeholder="${t('search')}"></div><select id="historyOwner">${filterOptions(state.users.map(u=>u.display_name),t('allOwners'))}</select><select id="historyResult">${filterOptions(['Completed','Failed','Canceled'],t('allResults'))}</select><input id="historyDate" type="date" style="width:auto"></div><div id="historyTable"></div>`;renderHistoryRows();}
function historyTable(items, compact=false){if(!items.length)return empty(t('noHistory'));return `<div class="table-wrap"><table><thead><tr><th>${t('product')}</th><th>${t('owner')}</th><th>${t('filament')}</th><th>${t('result')}</th><th>${t('gramsUsed')}</th><th>${t('duration')}</th><th>${t('date')}</th>${compact?'':`<th>${t('note')}</th><th>${t('finishedBy')}</th>`}</tr></thead><tbody>${items.map(i=>`<tr><td><div class="product-cell">${imageThumb(i.image_url)}<strong>${esc(i.product_name)}</strong></div></td><td>${esc(i.owner_name)}</td><td>${esc(i.filament_name||'—')}<br><small class="muted">${esc(i.filament_color||'')}</small></td><td>${badge(i.result)}</td><td>${fmtNum(i.grams,1)}g</td><td>${fmtNum(i.duration_minutes)} ${t('minutes')}</td><td>${fmtDate(i.finished_at,true)}</td>${compact?'':`<td>${esc(i.note||'—')}</td><td>${esc(i.finished_by_name||'—')}</td>`}</tr>`).join('')}</tbody></table></div>`}
function renderHistoryRows(){const q=($('#historySearch')?.value||'').toLowerCase(),owner=$('#historyOwner')?.value,result=$('#historyResult')?.value,date=$('#historyDate')?.value;const items=(state.cache.history||[]).filter(i=>[i.product_name,i.owner_name,i.filament_name,i.filament_color,i.result,i.note].join(' ').toLowerCase().includes(q)&&(!owner||i.owner_name===owner)&&(!result||i.result===result)&&(!date||String(i.finished_at).slice(0,10)===date));$('#historyTable').innerHTML=historyTable(items);}

async function renderMaintenance(){setPageTitle('maintenance','maintenanceSubtitle');const items=await api('/api/maintenance');state.cache.maintenance=items;const total=items.reduce((s,i)=>s+Number(i.total_cost),0),repairs=items.filter(i=>i.type==='Repair').length,upgrades=items.filter(i=>i.type==='Upgrade').length,consumables=items.filter(i=>i.type==='Consumable Purchase').reduce((s,i)=>s+Number(i.total_cost),0),paid=name=>items.flatMap(i=>i.payments).filter(p=>p.user_name===name).reduce((s,p)=>s+Number(p.amount),0),expensive=[...items].sort((a,b)=>Number(b.total_cost)-Number(a.total_cost))[0];$('#pageContent').innerHTML=`${pageHead(t('maintenanceTitle'),t('maintenanceSubtitle'),state.me.is_admin?`<button class="btn primary" data-action="add-maintenance">+ ${t('addMaintenance')}</button>`:'')}<div class="stats-grid grid">${statCard(t('maintenanceCost'),`${fmtNum(total,2)} ${t('sar')}`)}${statCard(t('repairs'),repairs)}${statCard(t('upgrades'),upgrades)}${statCard(t('totalConsumed'),`${fmtNum(consumables,2)} ${t('sar')}`)}${state.users.map(u=>statCard(`${t('totalPaid')} · ${u.display_name}`,`${fmtNum(paid(u.display_name),2)} ${t('sar')}`)).join('')}${statCard(t('mostExpensive'),expensive?`${esc(expensive.title)} · ${fmtNum(expensive.total_cost,2)} ${t('sar')}`:'—')}</div><div class="toolbar" style="margin-top:20px"><div class="search-box"><input id="maintenanceSearch" placeholder="${t('search')}"></div><select id="maintenanceType">${filterOptions(['Maintenance','Repair','Purchased Part','Upgrade','Cleaning','Calibration','Consumable Purchase','Other'],t('allTypes'))}</select><select id="maintenanceUser">${filterOptions(state.users.map(u=>u.display_name),t('responsible'))}</select><input id="maintenanceDate" type="date" style="width:auto"></div><div id="maintenanceTable"></div>`;renderMaintenanceRows();}
function renderMaintenanceRows(){const q=($('#maintenanceSearch')?.value||'').toLowerCase(),type=$('#maintenanceType')?.value,user=$('#maintenanceUser')?.value,date=$('#maintenanceDate')?.value;const items=(state.cache.maintenance||[]).filter(i=>[i.title,i.description,i.type,i.store_name,i.notes,(i.payments||[]).map(p=>p.user_name).join(' ')].join(' ').toLowerCase().includes(q)&&(!type||i.type===type)&&(!user||i.payments.some(p=>p.user_name===user))&&(!date||i.maintenance_date.slice(0,10)===date));$('#maintenanceTable').innerHTML=items.length?`<div class="table-wrap"><table><thead><tr><th>${t('title')}</th><th>${t('type')}</th><th>${t('date')}</th><th>${t('cost')}</th><th>${t('responsible')}</th><th>${t('store')}</th><th>${t('actions')}</th></tr></thead><tbody>${items.map(i=>`<tr><td><strong>${esc(i.title)}</strong><br><small class="muted">${esc(i.description||'')}</small></td><td>${badge(i.type)}</td><td>${fmtDate(i.maintenance_date)}</td><td>${fmtNum(i.total_cost,2)} ${t('sar')}</td><td>${i.payments.map(p=>`${esc(p.user_name)}: ${fmtNum(p.amount,2)}`).join('<br>')}</td><td>${esc(i.store_name||'—')}</td><td><div class="row-actions">${state.me.is_admin?`<button class="btn secondary small" data-action="edit-maintenance" data-id="${i.id}">${t('edit')}</button><button class="btn danger outline small" data-action="delete-maintenance" data-id="${i.id}">${t('delete')}</button>`:''}</div></td></tr>`).join('')}</tbody></table></div>`:empty(t('noMaintenance'));}

async function renderAdmin(){if(!state.me.is_admin)return navigate('home');setPageTitle('adminPanel','adminSubtitle');const admin=state.users.find(u=>u.is_admin);$('#pageContent').innerHTML=`${pageHead(t('adminTitle'),t('adminSubtitle'))}<div class="grid three-col"><section class="card"><div class="section-title"><h3>${t('currentAdmin')}</h3></div><div class="profile-card"><div class="large-avatar">${esc(admin.display_name[0])}</div><h3>${esc(admin.display_name)}</h3>${badge('Admin')}</div></section><section class="card"><div class="section-title"><h3>${t('transferAdmin')}</h3></div><p class="muted">${t('transferWarning')}</p><form id="transferForm" class="stack-form"><select name="userId">${state.users.filter(u=>!u.is_admin).map(u=>`<option value="${u.id}">${esc(u.display_name)}</option>`).join('')}</select><button class="btn warning wide" type="submit">${t('transfer')}</button></form></section><section class="card"><div class="section-title"><h3>${t('dataTools')}</h3></div><p class="muted">${t('resetWarning')}</p><div class="stack-form"><button class="btn secondary wide" data-action="export-data">${t('exportData')}</button><button class="btn secondary wide" data-action="import-data">${t('importData')}</button><button class="btn danger outline wide" data-action="reset-data">${t('resetData')}</button></div></section></div><section class="card" style="margin-top:17px"><div class="section-title"><h3>${t('quickLinks')}</h3></div><div class="actions"><button class="btn secondary" data-page-link="inventory">${t('openInventory')}</button><button class="btn secondary" data-page-link="history">${t('openHistory')}</button><button class="btn secondary" data-action="open-notifications">${t('allNotifications')}</button></div></section>`;}

function openModal(title, body, eyebrow='PRINT HUB'){ $('#modalTitle').textContent=title;$('#modalEyebrow').textContent=eyebrow;$('#modalBody').innerHTML=body;$('#modal').classList.remove('hidden'); }
function closeModal(){ $('#modal').classList.add('hidden');$('#modalBody').innerHTML=''; }
function field(label,name,type='text',value='',extra='',full=false){return `<label class="${full?'full':''}"><span>${esc(label)}</span><input name="${name}" type="${type}" value="${attr(value??'')}" ${extra}></label>`}
function textarea(label,name,value='',full=true){return `<label class="${full?'full':''}"><span>${esc(label)}</span><textarea name="${name}">${esc(value??'')}</textarea></label>`}
function selectField(label,name,options,full=false){return `<label class="${full?'full':''}"><span>${esc(label)}</span><select name="${name}">${options}</select></label>`}
function formButtons(){return `<div class="form-actions"><button class="btn secondary" type="button" data-action="close-modal">${t('close')}</button><button class="btn primary" type="submit">${t('save')}</button></div>`}

function openQueueForm(item=null,start=false){const own=!state.me.is_admin||!start;openModal(start?t('startPrinting'):(item?t('edit'):t('addRequest')),`<form id="queueForm" class="form-grid" data-id="${item?.id||''}" data-start="${start}">${field(t('product'),'productName','text',item?.product_name,'required')}${selectField(t('filament'),'filamentId',filamentOptions(item?.filament_id,own))}${field(t('estimatedGrams'),'estimatedGrams','number',item?.estimated_grams,'required min="0.1" step="0.1"')}${field(t('durationMinutes'),'estimatedDurationMinutes','number',item?.estimated_duration_minutes||60,'required min="1"')}${selectField(t('priority'),'priority',['Low','Normal','High'].map(v=>`<option ${item?.priority===v?'selected':''}>${v}</option>`).join(''))}${field(t('modelLink'),'modelLink','url',item?.model_link,'')}${field(t('imageUrl'),'imageUrl','url',item?.image_url,'',true)}${textarea(t('notes'),'notes',item?.notes)}${formButtons()}</form>`);}
function openFavoriteForm(){openModal(t('addFavorite'),`<form id="favoriteForm" class="form-grid">${field(t('product'),'productName','text','','required')}${field(t('estimatedGrams'),'estimatedGrams','number','','min="0.1" step="0.1"')}${selectField(t('preferredFilament'),'filamentId',filamentOptions('',true))}${field(t('tags'),'tags','text','','placeholder="phone, useful"')}${field(t('modelLink'),'modelLink','url','')}${field(t('imageUrl'),'imageUrl','url','')}${textarea(t('notes'),'notes')}${formButtons()}</form>`);}
function openFavoriteQueue(item){openModal(t('moveToQueue'),`<form id="favoriteQueueForm" class="form-grid" data-id="${item.id}">${selectField(t('filament'),'filamentId',filamentOptions(item.preferred_filament_id,true),true)}${field(t('estimatedGrams'),'estimatedGrams','number',item.estimated_grams,'required min="0.1" step="0.1"')}${field(t('durationMinutes'),'estimatedDurationMinutes','number',60,'required min="1"')}${formButtons()}</form>`);}
function openFilamentForm(f=null){const checked=id=>f?.owners.map(Number).includes(id);openModal(f?t('edit'):t('addFilament'),`<form id="filamentForm" class="form-grid" data-id="${f?.id||''}">${field(t('title'),'name','text',f?.name,'required')}${selectField(t('material'),'material',['PLA','PLA+','PETG','TPU','ABS','Other'].map(v=>`<option ${f?.material===v?'selected':''}>${v}</option>`).join(''))}${field(t('color'),'color','text',f?.color,'required')}${field(t('colorHex'),'colorHex','color',f?.color_hex||'#64748b')}${field(t('totalWeight'),'totalGrams','number',f?.total_grams||1000,'required min="0.1" step="0.1"')}${field(t('remainingWeight'),'remainingGrams','number',f?.remaining_grams??1000,'required min="0" step="0.1"')}${field(t('price'),'priceSar','number',f?.price_sar,'min="0" step="0.01"')}${field(t('purchaseDate'),'purchaseDate','date',f?.purchase_date?.slice(0,10)||'')}<label class="full"><span>${t('owners')}</span><div class="owner-badges">${state.users.map(u=>`<label class="check-row"><input type="checkbox" name="owners" value="${u.id}" ${checked(u.id)?'checked':''}> ${esc(u.display_name)}</label>`).join('')}</div></label>${textarea(t('notes'),'notes',f?.notes)}${formButtons()}</form>`);}
function openFinishForm(result){openModal(`${t('finish')} · ${result}`,`<form id="finishForm" class="form-grid" data-result="${result}">${field(t('actualGrams'),'grams','number',0,'required min="0" step="0.1"',true)}${textarea(t('resultNote'),'note','',true)}${formButtons()}</form>`);}
function maintenanceForm(m=null){const amountFor=id=>m?.payments.find(p=>p.user_id===id)?.amount||0;openModal(m?t('edit'):t('addMaintenance'),`<form id="maintenanceForm" class="form-grid" data-id="${m?.id||''}">${field(t('title'),'title','text',m?.title,'required')}${selectField(t('type'),'type',['Maintenance','Repair','Purchased Part','Upgrade','Cleaning','Calibration','Consumable Purchase','Other'].map(v=>`<option ${m?.type===v?'selected':''}>${v}</option>`).join(''))}${field(t('date'),'date','date',m?.maintenance_date?.slice(0,10)||new Date().toISOString().slice(0,10),'required')}${field(t('printer'),'printerName','text',m?.printer_name||'Ender 3 V3 SE','required')}${field(t('totalCost'),'totalCost','number',m?.total_cost||0,'required min="0" step="0.01"')}${field(t('store'),'storeName','text',m?.store_name)}${field(t('invoiceLink'),'invoiceLink','url',m?.invoice_link)}${field(t('receiptImage'),'receiptImageUrl','url',m?.receipt_image_url)}${textarea(t('description'),'description',m?.description)}<div class="full"><span class="muted">${t('responsible')} / ${t('amountPaid')}</span>${state.users.map(u=>`<div class="payment-grid"><span>${esc(u.display_name)}</span><input name="payment_${u.id}" type="number" min="0" step="0.01" value="${amountFor(u.id)}"></div>`).join('')}<small class="muted">${t('paymentsEqual')}</small></div>${textarea(t('notes'),'notes',m?.notes)}${formButtons()}</form>`);}

async function showFilamentLog(id){const f=state.filaments.find(x=>x.id===Number(id)),logs=await api(`/api/filaments/${id}/logs`);openModal(`${t('viewLog')} · ${f?.name||''}`,logs.length?`<div class="table-wrap"><table><thead><tr><th>${t('product')}</th><th>${t('owner')}</th><th>${t('gramsUsed')}</th><th>${t('result')}</th><th>${t('date')}</th></tr></thead><tbody>${logs.map(l=>`<tr><td>${esc(l.product_name)}</td><td>${esc(l.owner_name||'—')}</td><td>${fmtNum(l.grams,1)}g</td><td>${badge(l.result)}</td><td>${fmtDate(l.created_at,true)}</td></tr>`).join('')}</tbody></table></div>`:empty(t('noData')));}

function closeDrawers(){ $$('.drawer').forEach(d=>{d.classList.remove('open');d.setAttribute('aria-hidden','true')}); }
function openDrawer(id){closeDrawers();const d=$(id);d.classList.add('open');d.setAttribute('aria-hidden','false');}
function closeMobileNav(){ $('#sidebar').classList.remove('open');$('#backdrop').classList.remove('open'); }

document.addEventListener('submit', async event => {
  event.preventDefault(); const form=event.target; const fd=new FormData(form); const data=Object.fromEntries(fd.entries());
  try {
    if(form.id==='loginForm'){ $('#loginError').textContent=''; const result=await api('/api/login',{method:'POST',body:JSON.stringify({username:data.username,password:data.password,rememberMe:fd.has('rememberMe')})});state.me=result.user;form.reset();await enterApp();return; }
    if(form.id==='passwordForm'){await api('/api/me/password',{method:'PUT',body:JSON.stringify(data)});form.reset();toast('Password updated');return;}
    if(form.id==='queueForm'){const id=form.dataset.id,start=form.dataset.start==='true';const url=start?`/api/queue/${id}/start`:id?`/api/queue/${id}`:'/api/queue';await api(url,{method:start?'POST':id?'PUT':'POST',body:JSON.stringify(data)});closeModal();toast(start?'Print started':'Queue saved');await navigate(start?'home':'queue');await loadNotifications();return;}
    if(form.id==='favoriteForm'){await api('/api/favorites',{method:'POST',body:JSON.stringify(data)});closeModal();toast('Favorite saved');await navigate('favorites');return;}
    if(form.id==='favoriteQueueForm'){await api(`/api/favorites/${form.dataset.id}/to-queue`,{method:'POST',body:JSON.stringify(data)});closeModal();toast('Added to queue');await navigate('queue');return;}
    if(form.id==='filamentForm'){data.owners=fd.getAll('owners').map(Number);const id=form.dataset.id;await api(id?`/api/filaments/${id}`:'/api/filaments',{method:id?'PUT':'POST',body:JSON.stringify(data)});closeModal();toast('Filament saved');await navigate('inventory');return;}
    if(form.id==='finishForm'){data.result=form.dataset.result;await api('/api/current/finish',{method:'POST',body:JSON.stringify(data)});closeModal();toast(`Print ${data.result}`);await Promise.all([loadFilaments(),loadNotifications()]);await navigate('home');return;}
    if(form.id==='maintenanceForm'){data.payments=state.users.map(u=>({userId:u.id,amount:Number(fd.get(`payment_${u.id}`)||0)})).filter(p=>p.amount>0);const id=form.dataset.id;await api(id?`/api/maintenance/${id}`:'/api/maintenance',{method:id?'PUT':'POST',body:JSON.stringify(data)});closeModal();toast('Maintenance saved');await navigate('maintenance');await loadNotifications();return;}
    if(form.id==='transferForm'){if(!confirm(t('transferWarning')))return;await api('/api/admin/transfer',{method:'POST',body:JSON.stringify({userId:Number(data.userId)})});const {user}=await api('/api/me');state.me=user;await loadUsers();updateProfile();toast('Admin transferred');await navigate('home');return;}
  } catch(error){ if(form.id==='loginForm')$('#loginError').textContent=error.message;else toast(error.message,'error'); }
});

document.addEventListener('click', async event => {
  const nav=event.target.closest('[data-page]'); if(nav)return navigate(nav.dataset.page);
  const pageLink=event.target.closest('[data-page-link]'); if(pageLink)return navigate(pageLink.dataset.pageLink);
  const button=event.target.closest('[data-action]'); if(!button)return;
  const {action,id}=button.dataset;
  try {
    if(action==='close-modal')return closeModal(); if(action==='open-notifications')return openDrawer('#notificationPanel');
    if(action==='add-queue')return openQueueForm();
    if(action==='edit-queue')return openQueueForm(state.cache.queue.find(i=>i.id===Number(id)));
    if(action==='start-queue')return openQueueForm(state.cache.queue.find(i=>i.id===Number(id)),true);
    if(action==='delete-queue'){if(confirm(t('delete')+'?')){await api(`/api/queue/${id}`,{method:'DELETE'});toast('Deleted');await navigate('queue')}return;}
    if(action==='reorder'){await api(`/api/queue/${id}/reorder`,{method:'POST',body:JSON.stringify({direction:button.dataset.direction})});return navigate('queue');}
    if(action==='pause-print'||action==='resume-print'){await api(action==='pause-print'?'/api/current/pause':'/api/current/resume',{method:'POST'});return navigate('home');}
    if(action==='finish-print')return openFinishForm(button.dataset.result);
    if(action==='add-favorite')return openFavoriteForm();
    if(action==='favorite-to-queue')return openFavoriteQueue(state.cache.favorites.find(i=>i.id===Number(id)));
    if(action==='delete-favorite'){if(confirm(t('delete')+'?')){await api(`/api/favorites/${id}`,{method:'DELETE'});await navigate('favorites')}return;}
    if(action==='add-filament')return openFilamentForm(); if(action==='edit-filament')return openFilamentForm(state.filaments.find(f=>f.id===Number(id)));
    if(action==='delete-filament'){if(confirm(t('delete')+'?')){await api(`/api/filaments/${id}`,{method:'DELETE'});await navigate('inventory')}return;}
    if(action==='filament-log')return showFilamentLog(id);
    if(action==='add-maintenance')return maintenanceForm(); if(action==='edit-maintenance')return maintenanceForm(state.cache.maintenance.find(m=>m.id===Number(id)));
    if(action==='delete-maintenance'){if(confirm(t('delete')+'?')){await api(`/api/maintenance/${id}`,{method:'DELETE'});await navigate('maintenance')}return;}
    if(action==='export-data'){const response=await fetch('/api/admin/export');if(!response.ok)throw new Error('Export failed');const blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`print-hub-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);return;}
    if(action==='import-data'){const input=document.createElement('input');input.type='file';input.accept='application/json,.json';input.onchange=async()=>{try{const parsed=JSON.parse(await input.files[0].text());if(!confirm('Import this backup and replace current data?'))return;await api('/api/admin/import',{method:'POST',body:JSON.stringify(parsed)});const {user}=await api('/api/me');state.me=user;await Promise.all([loadUsers(),loadFilaments(),loadNotifications()]);updateProfile();toast('Data imported');await navigate('home')}catch(error){toast(error.message,'error')}};input.click();return;}
    if(action==='reset-data'){const word=prompt('Type RESET to confirm');if(word==='RESET'){await api('/api/admin/reset',{method:'POST',body:JSON.stringify({confirm:'RESET'})});await loadUsers();await loadFilaments();toast('App data reset');await navigate('home')}return;}
  } catch(error){toast(error.message,'error')}
});

document.addEventListener('input',event=>{if(['queueSearch','queueOwner','queueStatus','queuePriority'].includes(event.target.id))renderQueueRows();if(event.target.id==='favoriteSearch')renderFavoriteCards();if(['inventorySearch','materialFilter'].includes(event.target.id))renderFilaments();if(['historySearch','historyOwner','historyResult','historyDate'].includes(event.target.id))renderHistoryRows();if(['maintenanceSearch','maintenanceType','maintenanceUser','maintenanceDate'].includes(event.target.id))renderMaintenanceRows();});
document.addEventListener('change',event=>event.target.dispatchEvent(new Event('input',{bubbles:true})));

$('#loginForm').addEventListener('submit',()=>{});
$('#loginLanguage').addEventListener('click',()=>{state.language=state.language==='en'?'ar':'en';applyLanguage();});
$('#languageButton').addEventListener('click',()=>{state.language=state.language==='en'?'ar':'en';applyLanguage(true);navigate(state.page);renderNotifications();updateProfile();});
$('#themeButton').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';applyTheme();});
$('#notificationButton').addEventListener('click',()=>openDrawer('#notificationPanel'));
$('#profileButton').addEventListener('click',()=>openDrawer('#profilePanel'));
$$('.drawer-close').forEach(b=>b.addEventListener('click',closeDrawers));
$('#readAllButton').addEventListener('click',async()=>{await api('/api/notifications/read-all',{method:'PUT'});await loadNotifications();});
$('#notificationList').addEventListener('click',async event=>{const n=event.target.closest('[data-notification-id]');if(n){await api(`/api/notifications/${n.dataset.notificationId}/read`,{method:'PUT'});await loadNotifications();}});
$('#logoutButton').addEventListener('click',async()=>{await api('/api/logout',{method:'POST'});showLogin();});
$('#modalClose').addEventListener('click',closeModal);$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
$('#menuButton').addEventListener('click',()=>{$('#sidebar').classList.toggle('open');$('#backdrop').classList.toggle('open')});$('#backdrop').addEventListener('click',closeMobileNav);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeModal();closeDrawers();closeMobileNav();}});

boot();
