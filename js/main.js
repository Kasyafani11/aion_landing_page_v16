/* ============================================================
   MAIN — shared namespace, config, header/footer injection
   Filename: js/main.js  (loads first)
   Each page sets window.ROOT ('' at root, '../' in subfolders).
   ============================================================ */
(function(){
    'use strict';
    const R = window.ROOT || '';

    window.AION = {
        R: R,
        NAV: {},
        helpers: {}
    };

    /* ==========================================================
       ANALYTICS — GA4 + Meta Pixel + event tracking helper
       GANTI 'G-XXXXXXXXXX' dan '0000000000000000' dengan ID asli.
       Script analytics BARU jalan setelah user klik "Terima" di
       cookie consent banner (lihat injectCookieConsent di bawah).
       ========================================================== */
    const GA4_ID = 'G-XXXXXXXXXX';
    const META_PIXEL_ID = '0000000000000000';
    const CONSENT_KEY = 'aion_cookie_consent'; // 'accepted' | 'rejected'

    function loadAnalyticsScripts(){
        if(!document.getElementById('ga4-script')){
            const s1 = document.createElement('script');
            s1.id = 'ga4-script';
            s1.async = true;
            s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
            document.head.appendChild(s1);

            const s2 = document.createElement('script');
            s2.textContent = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');
            `;
            document.head.appendChild(s2);
        }
        if(!document.getElementById('meta-pixel-script')){
            const s3 = document.createElement('script');
            s3.id = 'meta-pixel-script';
            s3.textContent = `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
            `;
            document.head.appendChild(s3);
        }
    }

    // Kalau user sebelumnya sudah accept, langsung load (tanpa nunggu klik lagi).
    try{
        if(localStorage.getItem(CONSENT_KEY) === 'accepted') loadAnalyticsScripts();
    }catch(e){}

    // Helper: panggil ini di mana saja untuk kirim event ke GA4 + Meta Pixel sekaligus.
    window.AION.track = function(eventName, params){
        try{ if(typeof gtag === 'function') gtag('event', eventName, params||{}); }catch(e){}
        try{ if(typeof fbq === 'function') fbq('trackCustom', eventName, params||{}); }catch(e){}
    };

    /* AION vehicle lineup (official models, per aionindonesia.com) */
    const VEHICLES = [
        { key:'hyptec-ht',      name:'HYPTEC HT',      type:'Luxury Electric SUV',        img:'aion-hypetech.jpeg',     link:'models/hyptec-ht.html' },
        { key:'aion-y-plus',    name:'AION Y Plus',    type:'Electric SUV',               img:'index-aion-y-plus.jpeg',  link:'models/aion-y-plus.html' },
        { key:'aion-v',         name:'AION V',         type:'Premium Electric SUV',       img:'index-aion-V.jpeg',       link:'models/aion-v.html' },
        { key:'aion-ut',        name:'AION UT',        type:'Compact Electric Hatchback', img:'index-aion-ut.jpeg',      link:'models/aion-ut.html' }
    ];

    const VEHICLE_LINKS = [
        'Current Offers','Demo Drive','Trade-In','Compare',
        'Safety','Help Me Choose','Trip Planner','Features'
    ];

    const VEHICLE_LINK_HREF = {
        'Current Offers': R + 'promo/index.html',
        'Demo Drive': R + 'find-us/demo.html',
        'Trip Planner': R + 'charging/index.html',
        'Compare': R + 'vehicles/index.html'
    };

    const ENERGY_ITEMS = [
        { name:'AION Energy',      img:'aion-exterior/generic/energy.jpg',   link:R+'energy/energy.html' },
        { name:'EV Charging',      img:'aion-exterior/generic/charging.jpg', link:R+'energy/ev-charging.html' },
        { name:'Smart Mobility',   img:'aion-exterior/generic/city.jpg',     link:R+'energy/smart-mobility.html' },
        { name:'Energy Management',img:'aion-exterior/generic/mobility.jpg',link:R+'energy/energy-management.html' }
    ];

    const CHARGING_ITEMS = [
        'Charging','Home Charging','Fast Charging','Trip Planner',
        'Charging Partners','Commercial Charging'
    ];
    const DISCOVER_ITEMS = [
        { name:'AION Technology',  img:'aion-exterior/generic/energy.jpg',   link:R+'support/index.html' },
        { name:'Battery Technology',img:'aion-exterior/generic/mobility.jpg',link:R+'support/index.html' },
        { name:'Sustainability',   img:'aion-exterior/generic/energy.jpg',   link:R+'support/index.html' },
        { name:'AION Innovation',  img:'aion-exterior/generic/city.jpg',     link:R+'support/index.html' },
        { name:'Demo Drive',       img:'aion-exterior/generic/road.jpg',     link:R+'find-us/demo.html' },
        { name:'Locations',        img:'aion-exterior/generic/night.jpg',    link:R+'find-us/index.html' }
    ];
    const SHOP_ITEMS = [
        'Shop','Charging','Vehicle Accessories','Apparel','Lifestyle'
    ];

    window.AION.NAV = { VEHICLES, VEHICLE_LINKS, ENERGY_ITEMS, CHARGING_ITEMS, DISCOVER_ITEMS, SHOP_ITEMS };

    /* keep the NOVA alias so older page-specific scripts still work */
    window.NOVA = {
        R: R,
        NAV: window.AION.NAV,
        helpers: {},
        track: window.AION.track
    };

    window.NOVA.helpers.svg = {
        account: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>`,
        menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg>`
    };

    const img = (n)=> R + 'assets/images/' + n;
    const model = (m)=> R + 'models/' + m + '.html';

    /* ==========================================================
       INJECT HEADER (navbar + desktop mega menus + mobile menu)
       ========================================================== */
    window.NOVA.renderHeader = function(){
        const root = document.getElementById('header-root');
        if(!root) return;
        const s = window.NOVA.helpers.svg;

        const groups = [
            {
                label:'Vehicles', key:'vehicles',
                panel: `
                    <div class="mm-grid-side">
                        <div class="mm-vehicles sidebar">
                            ${VEHICLES.map(v=>`
                                <div class="mm-car">
                                    <a href="${v.link}">
                                        <div class="mm-car-img"><img src="${img(v.img)}" alt="${v.name}" loading="lazy"></div>
                                        <div class="mm-car-name">${v.name}</div>
                                    </a>
                                    <div class="mm-car-links"><a href="${v.link}">Learn More</a><a href="${v.link}#configure">Configure</a></div>
                                </div>`).join('')}
                            <div class="mm-sidebar">
                                ${VEHICLE_LINKS.map(l=>`<a href="${VEHICLE_LINK_HREF[l]||'#'}">${l}</a>`).join('')}
                            </div>
                        </div>
                    </div>`
            },
            {
                label:'Energy', key:'energy',
                panel: `
                    <div class="mm-list">
                        ${ENERGY_ITEMS.map(e=>`<a href="${e.link}"><img src="${img(e.img)}" alt="${e.name}" loading="lazy">${e.name}</a>`).join('')}
                    </div>`
            },
            {
                label:'Charging', key:'charging',
                panel: `
                    <div class="mm-list">
                        ${CHARGING_ITEMS.map(c=>`<a href="${R+'charging/index.html'}">${c}</a>`).join('')}
                    </div>`
            },
            {
                label:'Discover', key:'discover',
                panel: `
                    <div class="mm-list">
                        ${DISCOVER_ITEMS.map(d=>`<a href="${d.link}"><img src="${img(d.img)}" alt="${d.name}" loading="lazy">${d.name}</a>`).join('')}
                    </div>`
            },
            {
                label:'Shop', key:'shop',
                panel: `
                    <div class="mm-list">
                        ${SHOP_ITEMS.map(c=>`<a href="#">${c}</a>`).join('')}
                    </div>`
            }
        ];

        const center = groups.map(g=>`
            <div class="nav-group" data-menu="${g.key}">
                <button class="nav-link" aria-haspopup="true" aria-expanded="false">${g.label}</button>
                <div class="mega-menu" role="menu" data-menu-panel="${g.key}">
                    <div class="mega-inner">${g.panel}</div>
                </div>
            </div>`).join('');

        const mobileGroups = groups.map(g=>{
            let sublinks = '';
            if(g.key==='vehicles') sublinks = VEHICLES.map(v=>`<a href="${v.link}">${v.name}</a>`).join('');
            else if(g.key==='energy') sublinks = ENERGY_ITEMS.map(e=>`<a href="${e.link}">${e.name}</a>`).join('');
            else if(g.key==='charging') sublinks = CHARGING_ITEMS.map(c=>`<a href="${R+'charging/index.html'}">${c}</a>`).join('');
            else if(g.key==='discover') sublinks = DISCOVER_ITEMS.map(d=>`<a href="${d.link}">${d.name}</a>`).join('');
            else if(g.key==='shop') sublinks = SHOP_ITEMS.map(c=>`<a href="#">${c}</a>`).join('');
            return `
                <div class="mobile-item">
                    <button class="mobile-item-btn" aria-expanded="false">${g.label}<span class="caret">›</span></button>
                    <div class="mobile-sub">${sublinks}</div>
                </div>`;
        }).join('');

        root.innerHTML = `
            <header class="navbar" id="navbar">
                <nav class="nav-inner" aria-label="Primary">
                    <a class="brand" href="${R+'index.html'}" aria-label="Home">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 20 12 4l9 16H3Z"/><path d="M7.5 14h9"/></svg>
                        <span>AION</span>
                    </a>
                    <div class="nav-center" aria-label="Menu">${center}</div>
                    <div class="nav-right">
                        <a class="nav-link" href="${R+'promo/index.html'}">Promo</a>
                        <a class="nav-link" href="${R+'kalkulator/index.html'}">Simulasi Cicilan</a>
                        <a class="nav-link" href="${R+'support/index.html'}">Support</a>
                        <button class="nav-link lang" aria-label="Language">ID</button>
                        <a class="nav-account" href="${R+'find-us/index.html'}" aria-label="Cari Dealer">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span class="nav-account-label">Cari Dealer</span>
                        </a>
                        <button class="nav-link menu-toggle" aria-label="Menu" aria-expanded="false">${s.menu}</button>
                    </div>
                </nav>
            </header>
            <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
                <div class="mobile-menu-header">
                    <span class="brand" style="padding-left:0">AION</span>
                    <button class="mobile-menu-close" aria-label="Close">${s.close}</button>
                </div>
                <nav class="mobile-nav">${mobileGroups}</nav>
                <div class="mobile-item" style="border-top:1px solid var(--line);margin-top:4px;padding-top:4px">
                    <a href="${R+'promo/index.html'}" style="display:block;padding:14px 0;font-weight:500">Promo</a>
                </div>
                <div class="mobile-item">
                    <a href="${R+'kalkulator/index.html'}" style="display:block;padding:14px 0;font-weight:500">Simulasi Cicilan</a>
                </div>
                <div class="mobile-item">
                    <a href="${R+'find-us/demo.html'}" style="display:block;padding:14px 0;font-weight:500">Book Test Drive</a>
                </div>
                <div class="mobile-item">
                    <a href="${R+'support/index.html'}" style="display:block;padding:14px 0;font-weight:500">Support</a>
                </div>
                <div class="mobile-menu-lang">Language</div>
            </div>`;
    };

    /* ==========================================================
       INJECT FOOTER
       ========================================================== */
    window.NOVA.renderFooter = function(){
        const root = document.getElementById('footer-root');
        if(!root) return;
        root.innerHTML = `
            <footer class="footer" style="padding-top:60px">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>Vehicles</h4>
                        ${VEHICLES.map(v=>`<a href="${v.link}">${v.name}</a>`).join('')}
                    </div>
                    <div class="footer-col">
                        <h4>Energy</h4>
                        ${ENERGY_ITEMS.map(e=>`<a href="${e.link}">${e.name}</a>`).join('')}
                    </div>
                    <div class="footer-col">
                        <h4>Charging</h4>
                        <a href="${R+'charging/index.html'}">Home Charging</a>
                        <a href="${R+'charging/index.html'}">Fast Charging</a>
                        <a href="${R+'charging/index.html'}">Charging Network</a>
                    </div>
                    <div class="footer-col">
                        <h4>Support</h4>
                        <a href="${R+'kalkulator/index.html'}">Simulasi Cicilan</a>
                        <a href="${R+'support/index.html'}">Contact Us</a>
                        <a href="${R+'support/index.html'}">Service</a>
                        <a href="${R+'find-us/index.html'}">Find Us</a>
                    </div>
                    <div class="footer-col">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Newsroom</a>
                        <a href="#">Investors</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <span>© 2026 AION. All rights reserved.</span>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Accessibility</a>
                    <a href="#">Locations</a>
                </div>
            </footer>`;
    };

    /* ==========================================================
       WHATSAPP CONTACT PICKER — pilih admin sebelum chat
       ========================================================== */
    const WA_CONTACTS = [
        { label:'Sales Handler',                   sub:'Sales',  phone:'+62 858-9052-3210' },
        { label:'Admin AION (markom_aion)',        sub:'Home',   phone:'+62 878-1883-0840' },
        { label:'Counter AION Smart Tunjungan',     sub:'Mobile', phone:'+62 851-9591-6800' }
    ];
    function cleanPhone(p){ return p.replace(/\D/g,''); }

    let pendingWa = null;

    function injectWaPicker(){
        if(document.getElementById('waPickerModal')) return;
        const wrap = document.createElement('div');
        wrap.id = 'waPickerModal';
        wrap.innerHTML = `
            <div class="wa-picker-backdrop"></div>
            <div class="wa-picker-panel">
                <button class="wa-picker-close" aria-label="Tutup">&times;</button>
                <h3>Mau chat dengan siapa?</h3>
                <div class="wa-picker-list">
                    ${WA_CONTACTS.map((c,i)=>`<button class="wa-picker-item" data-idx="${i}">
                        <span class="wa-picker-name">${c.label}</span>
                        <span class="wa-picker-phone">${c.phone}</span>
                    </button>`).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(wrap);

        const style = document.createElement('style');
        style.textContent = `
            #waPickerModal{ position:fixed; inset:0; z-index:1200; display:none; align-items:center; justify-content:center; padding:20px; }
            #waPickerModal.open{ display:flex; }
            .wa-picker-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.55); }
            .wa-picker-panel{ position:relative; background:#fff; color:#171a20; border-radius:16px; padding:26px; width:min(380px,100%); box-shadow:0 24px 60px rgba(0,0,0,.35); }
            .wa-picker-panel h3{ font-size:17px; margin:0 0 16px; font-weight:600; }
            .wa-picker-close{ position:absolute; right:14px; top:14px; background:none; border:none; font-size:16px; cursor:pointer; opacity:.55; line-height:1; padding:4px; }
            .wa-picker-close:hover{ opacity:1; }
            .wa-picker-list{ display:flex; flex-direction:column; gap:10px; }
            .wa-picker-item{ display:flex; flex-direction:column; align-items:flex-start; gap:3px; padding:13px 15px; border:1px solid #e2e4e8; border-radius:12px; background:#fff; cursor:pointer; text-align:left; transition:background .15s ease,border-color .15s ease; width:100%; }
            .wa-picker-item:hover{ background:#f2fbf6; border-color:#25D366; }
            .wa-picker-name{ font-weight:600; font-size:14.5px; }
            .wa-picker-phone{ font-size:12.5px; color:#6b7075; }
        `;
        document.head.appendChild(style);

        function isMobileDevice(){
            return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
        }

        wrap.querySelector('.wa-picker-backdrop').addEventListener('click', closeWaPicker);
        wrap.querySelector('.wa-picker-close').addEventListener('click', closeWaPicker);
        wrap.querySelectorAll('.wa-picker-item').forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const c = WA_CONTACTS[parseInt(btn.dataset.idx, 10)];
                if(pendingWa){
                    window.NOVA.track(pendingWa.eventName || 'whatsapp_click', {
                        contact: c.label,
                        message_preview: (pendingWa.message||'').slice(0,60)
                    });
                    const url = 'https://wa.me/' + cleanPhone(c.phone) + '?text=' + encodeURIComponent(pendingWa.message);
                    if(isMobileDevice()){
                        // Navigasi langsung (bukan tab baru) -> browser mobile paling reliable
                        // buat langsung lempar ke app WhatsApp yang terinstall.
                        window.location.href = url;
                    } else {
                        // Desktop: buka WhatsApp Web di tab baru, biar landing page tetap kebuka.
                        window.open(url, '_blank', 'noopener');
                    }
                }
                closeWaPicker();
            });
        });
    }

    function closeWaPicker(){
        const m = document.getElementById('waPickerModal');
        if(m) m.classList.remove('open');
        pendingWa = null;
    }

    window.NOVA.openWhatsApp = function(message, eventName){
        injectWaPicker();
        pendingWa = { message, eventName };
        document.getElementById('waPickerModal').classList.add('open');
    };

    /* ==========================================================
       WHATSAPP FLOATING BUTTON — global, semua halaman
       ========================================================== */
    window.NOVA.renderWhatsApp = function(){
        if(document.getElementById('waFloat')) return;
        const a = document.createElement('a');
        a.id = 'waFloat';
        a.href = '#';
        a.setAttribute('aria-label','Chat WhatsApp Sales AION');
        a.innerHTML = `<svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true"><path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.25.62 4.42 1.79 6.32L4 29l7.86-1.75a11.94 11.94 0 0 0 4.15.74h.01c6.63 0 12-5.38 12-12.01C28.02 8.38 22.64 3 16.01 3Zm0 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-4.66 1.04 1.06-4.55-.24-.37a9.75 9.75 0 0 1-1.5-5.33c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.94 2.87a9.73 9.73 0 0 1 2.87 6.93c0 5.41-4.4 9.79-9.92 9.79Zm5.38-7.34c-.29-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.94 1.16-.17.2-.35.22-.64.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.56-.35Z"/></svg>`;
        a.addEventListener('click', (e)=>{
            e.preventDefault();
            window.NOVA.openWhatsApp('Halo AION, saya mau tanya soal mobil listrik AION.', 'whatsapp_click_float');
        });
        document.body.appendChild(a);
        const style = document.createElement('style');
        style.textContent = `
            #waFloat{position:fixed;right:22px;bottom:22px;width:58px;height:58px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:980;transition:transform .2s ease;cursor:pointer}
            #waFloat:hover{transform:scale(1.08)}
            @media (max-width:480px){#waFloat{right:16px;bottom:16px;width:52px;height:52px}}
        `;
        document.head.appendChild(style);
    };

    /* ==========================================================
       COOKIE CONSENT BANNER — wajib sebelum load GA4/Meta Pixel
       Sesuai UU PDP: analytics/tracking baru jalan setelah consent.
       ========================================================== */
    window.NOVA.renderCookieConsent = function(){
        let saved = null;
        try{ saved = localStorage.getItem(CONSENT_KEY); }catch(e){}
        if(saved === 'accepted' || saved === 'rejected') return; // sudah pernah pilih

        if(document.getElementById('cookieConsent')) return;
        const bar = document.createElement('div');
        bar.id = 'cookieConsent';
        bar.innerHTML = `
            <div class="cc-text">
                Situs ini pakai cookie &amp; alat analitik (Google Analytics, Meta Pixel) untuk memahami penggunaan situs dan mengukur efektivitas promosi. Data tidak dijual ke pihak ketiga.
            </div>
            <div class="cc-actions">
                <button id="ccReject" class="btn btn-outline">Tolak</button>
                <button id="ccAccept" class="btn btn-dark">Terima</button>
            </div>
        `;
        document.body.appendChild(bar);

        const style = document.createElement('style');
        style.textContent = `
            #cookieConsent{
                position:fixed; left:16px; right:16px; bottom:16px; z-index:1300;
                max-width:640px; margin:0 auto;
                background:#171a20; color:#fff; border-radius:14px;
                padding:18px 20px; display:flex; flex-wrap:wrap; align-items:center; gap:14px;
                box-shadow:0 16px 40px rgba(0,0,0,.35);
            }
            #cookieConsent .cc-text{ flex:1 1 260px; font-size:13px; line-height:1.55; color:#d7d9dc; }
            #cookieConsent .cc-actions{ display:flex; gap:10px; flex-shrink:0; }
            #cookieConsent .btn{ padding:9px 18px; font-size:13px; white-space:nowrap; }
            #cookieConsent .btn-outline{ border-color:#4a4e57; color:#fff; }
            #cookieConsent .btn-outline:hover{ background:#23262d; }
            @media (max-width:480px){
                #cookieConsent{ left:10px; right:10px; bottom:10px; padding:16px; flex-direction:column; align-items:stretch; }
                #cookieConsent .cc-actions{ width:100%; }
                #cookieConsent .cc-actions .btn{ flex:1; }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('ccAccept').addEventListener('click', ()=>{
            try{ localStorage.setItem(CONSENT_KEY, 'accepted'); }catch(e){}
            loadAnalyticsScripts();
            bar.remove();
        });
        document.getElementById('ccReject').addEventListener('click', ()=>{
            try{ localStorage.setItem(CONSENT_KEY, 'rejected'); }catch(e){}
            bar.remove();
        });
    };

    /* ==========================================================
       BOOTSTRAP — inject shared header & footer
       ========================================================== */
    window.NOVA.renderHeader();
    window.NOVA.renderFooter();
    window.NOVA.renderWhatsApp();
    window.NOVA.renderCookieConsent();

})();
