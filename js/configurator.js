/* ============================================================
   CONFIGURATOR — dynamic build, price, preview
   Usage: <div id="configurator-root" data-model="aion-ut"></div>
   The model page passes data-model; options defined below.
   NOTE: Prices/specs for AION UT, AION Y Plus, AION V, HYPTEC HT
   follow official OTR Jakarta prices per aionindonesia.com
   (as of Sep 2026). AION ES, Hyper HT, Hyper SSR are NOT real
   AION products in Indonesia — kept as concept/demo entries only,
   no official price/color data exists for them.
   ============================================================ */
(function(){
    'use strict';

    const MODELS = {
        'aion-ut':        { name:'AION UT',        currency:'IDR', base:345000000,
            img:{ solid:'index-aion-ut.jpeg',        premium:'index-aion-ut.jpeg', performance:'index-aion-ut.jpeg' } },
        'aion-y-plus':    { name:'AION Y Plus',    currency:'IDR', base:419000000,
            img:{ solid:'index-aion-y-plus.jpeg',    premium:'index-aion-y-plus.jpeg', performance:'index-aion-y-plus.jpeg' } },
        'aion-v':         { name:'AION V',         currency:'IDR', base:499000000,
            img:{ solid:'index-aion-V.jpeg',         premium:'index-aion-V.jpeg', performance:'index-aion-V.jpeg' } },
        'hyptec-ht':      { name:'HYPTEC HT',      currency:'IDR', base:755000000,
            img:{ solid:'aion-hypetech.jpeg', premium:'aion-hypetech.jpeg', performance:'aion-hypetech.jpeg' } },
        'aion-es':        { name:'AION ES',        currency:'USD', base:41990,
            img:{ solid:'aion-exterior/aion-es/hero.jpg', premium:'aion-exterior/aion-es/hero.jpg', performance:'aion-exterior/aion-es/hero.jpg' } },
        'aion-hyper-ht':  { name:'AION Hyper HT',  currency:'USD', base:64990,
            img:{ solid:'aion-exterior/aion-hyper-ht/hero.jpg', premium:'aion-exterior/aion-hyper-ht/hero.jpg', performance:'aion-exterior/aion-hyper-ht/hero.jpg' } },
        'aion-hyper-ssr': { name:'AION Hyper SSR', currency:'USD', base:78990,
            img:{ solid:'aion-exterior/aion-hyper-ssr/hero.jpg', premium:'aion-exterior/aion-hyper-ssr/hero.jpg', performance:'aion-exterior/aion-hyper-ssr/hero.jpg' } }
    };

    // Warna hanya ditampilkan jika file image-nya ada. Tanpa image -> tidak ada warna.
    const COLORS = [];
    const NO_COLOR = { name:'-', hex:'transparent', price:0, img:null, none:true };

    // Nama warna mengikuti nama file image di assets/images/colors/.
    // Warna tanpa file image sengaja DIHAPUS (tidak ada tint palsu).
    const MODEL_COLORS = {
        'aion-ut': [
            { name:'Emerald Green',           hex:'#0e6b4f', price:0, img:'colors/aion-ut/emerald-green.png' },
            { name:'Almond Beige',            hex:'#d8cbb2', price:0, img:'colors/aion-ut/almond-beige.png' },
            { name:'Lunar White',             hex:'#f2f3f4', price:0, img:'colors/aion-ut/lunar-white.png' },
            { name:'Urban Black',              hex:'#17191d', price:0, img:'colors/aion-ut/urban-black.png' },
        ],
        'aion-y-plus': [
            { name:'Vitality Green',                  hex:'#2e9e5b', price:0, img:'colors/aion-y-pluss/aion-y-pluss-vitality-green.png' },
            { name:'Pure White',                      hex:'#f2f2f1', price:0, img:'colors/aion-y-pluss/aion-y-pluss-pure-white.png' },
            { name:'Glamour Black',                   hex:'#15161a', price:0, img:'colors/aion-y-pluss/aion-y-pluss-glamor-black.png' },
            { name:'Speedy Silver',                   hex:'#c9cbce', price:0, img:'colors/aion-y-pluss/aion-y-pluss-speedy-sliver.png' },
            { name:'Vitality Green with Black Roof',  hex:'#2e9e5b', price:5000000, img:'colors/aion-y-pluss/aion-y-pluss-vitalityxblackroof.png' },
            { name:'Pure White with Black Roof',      hex:'#f2f2f1', price:5000000, img:'colors/aion-y-pluss/aion-y-pluss-purewhitexblackroof.png', split:['#15161a','#f2f2f1'] }
        ],
'aion-v': [
            { name:'Wilderness Sand',        hex:'#c2a893', price:0, img:'colors/aion-v/wilderness-sand.png' },
            { name:'Holographic Silver',     hex:'#d6d8da', price:0, img:'colors/aion-v/holographic-silver.png' },
            { name:'Night Shadow Black',     hex:'#111114', price:0, img:'colors/aion-v/night-shadow-black.png' },
            { name:'Arctic White',           hex:'#eef0f1', price:0, img:'colors/aion-v/arctic-white.png' },
            { name:'Sea Fluorescent Gray',   hex:'#9aa2a8', price:0, img:'colors/aion-v/sea-f-gray.png' },
            { name:'Galaxy Blue',            hex:'#2452a6', price:0, img:'colors/aion-v/galaxy-blue.png' },
        ],
        'hyptec-ht': [
            { name:'White Pearl',    hex:'#f4f4f2', price:0, img:'colors/aion-hypetech/hypetech-white-pearl.png' },
            { name:'Silver Bullet',  hex:'#c6c9c7', price:0, img:'colors/aion-hypetech/hypetech-silver-bullet.png' },
            { name:'Orange Sunset',  hex:'#d96a1f', price:0, img:'colors/aion-hypetech/hypetech-orange-sunset.png' },
            { name:'Purple Midnight', hex:'#5a3d87', price:0, img:'colors/aion-hypetech/hypetech-purple-midnight.png' },
            { name:'Grey Stone',     hex:'#8b8f8c', price:0, img:'colors/aion-hypetech/hypetech-grey-stone.png' },
            { name:'Black Abyss',    hex:'#191a1c', price:0, img:'colors/aion-hypetech/hypetech-black-abyss.png' }
        ],
        'aion-es': [
        ],
        'aion-hyper-ht': [
        ],
        'aion-hyper-ssr': [
        ]
    };

    const WHEELS = [
        { name:'Standard Wheels',   price:0,   img:'wheel-standard.svg' },
        { name:'Sport Wheels',      price:1500,img:'wheel-sport.svg' },
        { name:'Performance Wheels',price:2500,img:'wheel-performance.svg' }
    ];

    const INTERIORS = [
        { name:'All Black',    price:0 },
        { name:'Black & White',price:1000 },
        { name:'Synthetic Tan',price:1500 }
    ];

    const TRIMS = {
        'aion-ut': [
            { name:'Standard',   add:0,        range:400, s60:8.3 },
            { name:'Premium',    add:50000000, range:500, s60:8.3 }
        ],
        'aion-y-plus': [
            { name:'Exclusive',  add:0,        range:410, s60:7.9 },
            { name:'Premium',    add:60000000, range:490, s60:7.9 }
        ],
        'aion-v': [
            { name:'Exclusive',  add:0,        range:505, s60:7.5 },
            { name:'Luxury',     add:61000000, range:602, s60:7.5 }
        ],
        'hyptec-ht': [
            // Hanya satu varian resmi terdaftar di aionindonesia.com (per Sep 2026).
            { name:'Premium', add:0, range:600, s60:6.9 }
        ],
        'aion-es': [
            { name:'Standard',   add:0,    range:310, s60:6.5 },
            { name:'Long Range', add:9000, range:420, s60:4.5 }
        ],
        'aion-hyper-ht': [
            { name:'Standard',   add:0,     range:500, s60:5.9 },
            { name:'Long Range', add:12000, range:610, s60:4.9 }
        ],
        'aion-hyper-ssr': [
            { name:'Standard',      add:0,     range:480, s60:3.4 },
            { name:'Performance',   add:15000, range:500, s60:2.9 }
        ]
    };

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('configurator-root');
        if(!root) return;
        const modelKey = root.getAttribute('data-model') || 'aion-ut';
        const cfg = MODELS[modelKey];
        // Removed/unlisted models (e.g. old aion-es page left orphaned)
        // show a graceful note instead of throwing.
        if(!cfg){
            root.innerHTML = '<div class="cfg-page" style="max-width:880px;margin:0 auto;padding:60px 20px;text-align:center"><h3>Configurator tidak tersedia untuk model ini.</h3></div>';
            return;
        }
        const trims = TRIMS[modelKey] || [{ name:'Standard', add:0, range:600, s60:6.9 }];
        const colors = MODEL_COLORS[modelKey] || COLORS;
        const hasColors = colors.length > 0;
        const unit = cfg.currency==='IDR' ? 'km' : 'mi';
        const accel = cfg.currency==='IDR' ? '0–100 km/h' : '0–60 mph';

        const state = {
            trim: trims[0],
            color: colors[0] || NO_COLOR,
            wheel: WHEELS[0],
            interior: INTERIORS[0],
            assist: false
        };

        renderConfigurator(root, cfg, state);

        function renderConfigurator(root, cfg, state){
            const carSrc = (c)=> window.NOVA.R + 'assets/images/' + (c.img || cfg.img.solid);
            const tintClass = (state.color.img || state.color.none) ? '' : ' on';
            root.innerHTML = `
            <div class="cfg-page" id="configure">
                <div class="cfg-layout">
                    <div class="cfg-preview">
                        <div class="stage">
                            <div class="cfg-car-wrap">
                                <img class="cfg-car" id="cfgCar" data-src="${carSrc(state.color)}" src="${carSrc(state.color)}" alt="${cfg.name}">
                                <div class="cfg-tint${tintClass}" id="cfgTint" style="background:${state.color.hex}"></div>
                            </div>
                            <div class="cfg-floor"></div>
                        </div>
                        <div class="cfg-live-price" aria-live="polite">
                            <small>Estimated Price</small>
                            <b>${fmt(price(cfg,state), cfg.currency)}</b>
                        </div>
                    </div>
                    <div class="cfg-controls">
                        <div class="cfg-summary">
                            <h1>${cfg.name}</h1>
                        </div>

                        <div class="cfg-group">
                            <div class="cfg-group-title">Trim</div>
                            <div class="cfg-options" data-role="trim">
                                ${trims.map((t,i)=>`
                                    <button class="cfg-option ${i===0?'active':''}" data-i="${i}" data-price="${t.add}">
                                        ${t.name}<br><small style="font-weight:400;color:var(--text-muted)">${fmt(t.add,cfg.currency)} · ${t.range} ${unit} · ${t.s60}s</small>
                                    </button>`).join('')}
                            </div>
                        </div>

                        ${hasColors ? `<div class="cfg-group">
                            <div class="cfg-group-title">Exterior Color</div>
                            <div class="cfg-swatches" data-role="color">
                                ${colors.map((c,i)=>`<button class="cfg-swatch ${i===0?'active':''}${c.split?' cfg-swatch--split':''}" style="background:${c.hex}${c.split?`;--sw-top:${c.split[0]};--sw-bottom:${c.split[1]}`:''}" title="${c.name}" data-i="${i}" aria-label="${c.name}"></button>`).join('')}
                            </div>
                        </div>` : ''}

                        <div class="cfg-group">
                            <div class="cfg-group-title">Wheels</div>
                            <div class="cfg-options" data-role="wheel">
                                ${WHEELS.map((w,i)=>`<button class="cfg-option ${i===0?'active':''}" data-i="${i}">${w.name}<br><small style="font-weight:400;color:var(--text-muted)">${fmt(w.price,cfg.currency)}</small></button>`).join('')}
                            </div>
                        </div>

                        <div class="cfg-group">
                            <div class="cfg-group-title">Interior</div>
                            <div class="cfg-options" data-role="interior">
                                ${INTERIORS.map((x,i)=>`<button class="cfg-option ${i===0?'active':''}" data-i="${i}">${x.name}<br><small style="font-weight:400;color:var(--text-muted)">${fmt(x.price,cfg.currency)}</small></button>`).join('')}
                            </div>
                        </div>

                        <div class="cfg-group">
                            <div class="cfg-group-title">AION Smart Driving Assist</div>
                            <div class="cfg-options">
                                <button class="cfg-option" data-role="assist" data-value="${state.assist?'1':'0'}">
                                    AION Smart Driving<br><small style="font-weight:400;color:var(--text-muted)">+${fmt(6000,cfg.currency)}</small>
                                </button>
                            </div>
                        </div>

                        <div class="cfg-order-bar">
                            <div>
                                <div style="font-size:13px;color:var(--text-muted)">Estimated Delivery</div>
                                <div style="font-weight:600">Dec – Jan</div>
                            </div>
                            <div style="display:flex;gap:10px;flex-wrap:wrap">
                                <a class="btn btn-outline" href="${window.NOVA.R}find-us/demo.html?vehicle=${encodeURIComponent(cfg.name)}">Book Test Drive</a>
                                <button class="btn btn-outline" data-wa-order>Chat WhatsApp</button>
                                <button class="btn btn-dark" data-order>Order Now</button>
                            </div>
                        </div>
                        <div class="cfg-summary" id="cfgSpecs" style="margin-top:18px;padding-top:18px;border-top:1px solid var(--line)">
                            <div class="info-bands" style="margin:0;background:transparent;gap:8px;grid-template-columns:repeat(3,1fr)">
                                <div class="info-band" style="padding:14px"><b>${state.trim.range} ${unit}</b><span>Range</span></div>
                                <div class="info-band" style="padding:14px"><b>${state.trim.s60}s</b><span>${accel}</span></div>
                                <div class="info-band" style="padding:14px"><b>${state.color.name.split(' ')[0]}</b><span>Color</span></div>
                            </div>
                        </div>
                        <p class="cfg-note">Prices shown are estimates for illustration. HYPTEC HT uses the official price of Rp 755.000.000 (OTR Jakarta). Option add-ons are illustrative placeholders. AION Smart Driving is an assisted driving feature and requires active driver supervision.</p>

                        <div class="cfg-tradein" style="margin-top:22px;padding-top:22px;border-top:1px solid var(--line)">
                            <button type="button" class="btn btn-outline btn-block" data-tradein-toggle>Tukar Tambah Mobil Lama? Hitung Estimasi</button>
                            <div id="tradeinPanel" hidden style="margin-top:16px;display:flex;flex-direction:column;gap:14px">
                                <div class="field">
                                    <label for="tiBrand">Merek &amp; Model Mobil Lama</label>
                                    <input id="tiBrand" type="text" placeholder="contoh: Toyota Avanza">
                                </div>
                                <div class="form-grid">
                                    <div class="field">
                                        <label for="tiPrice">Harga Beli Baru (OTR, Rp)</label>
                                        <input id="tiPrice" type="number" min="0" step="1000000" placeholder="250000000">
                                    </div>
                                    <div class="field">
                                        <label for="tiYear">Tahun Beli</label>
                                        <input id="tiYear" type="number" min="2005" max="2026" placeholder="2020">
                                    </div>
                                </div>
                                <div class="field">
                                    <label for="tiKm">Kilometer Saat Ini</label>
                                    <input id="tiKm" type="number" min="0" step="1000" placeholder="45000">
                                </div>
                                <div id="tiResult" class="info-band" style="display:none;padding:16px">
                                    <b id="tiResultValue">Rp0</b><span>Estimasi Nilai Tukar Tambah</span>
                                </div>
                                <button type="button" class="btn btn-dark btn-block" data-tradein-submit>Ajukan Tukar Tambah via WhatsApp</button>
                                <p class="cfg-note" style="margin:0">Estimasi kasar berdasarkan usia &amp; jarak tempuh, bukan penawaran final. Nilai akhir ditentukan setelah inspeksi fisik oleh dealer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            const priceEl = root.querySelector('.cfg-live-price b');

            const refreshSpecs = ()=>{
                root.querySelector('#cfgSpecs .info-band:nth-child(1) b').textContent = state.trim.range+' '+unit;
                root.querySelector('#cfgSpecs .info-band:nth-child(2) b').textContent = state.trim.s60+'s';
                root.querySelector('#cfgSpecs .info-band:nth-child(3) b').textContent = state.color.name.split(' ')[0];
            };

            root.querySelector('[data-role="trim"]').addEventListener('click', (e)=>{
                const btn = e.target.closest('.cfg-option'); if(!btn) return;
                setActive(root.querySelector('[data-role="trim"]'), btn);
                state.trim = trims[parseInt(btn.dataset.i)];
                applyColor();
                updatePrice(priceEl);
                refreshSpecs();
            });

            const colorBox = root.querySelector('[data-role="color"]');
            if(colorBox) colorBox.addEventListener('click', (e)=>{
                const sw = e.target.closest('.cfg-swatch'); if(!sw) return;
                setActive(colorBox, sw);
                state.color = colors[parseInt(sw.dataset.i)];
                applyColor();
                updatePrice(priceEl);
                refreshSpecs();
            });

            root.querySelector('[data-role="wheel"]').addEventListener('click', (e)=>{
                const btn = e.target.closest('.cfg-option'); if(!btn) return;
                setActive(root.querySelector('[data-role="wheel"]'), btn);
                state.wheel = WHEELS[parseInt(btn.dataset.i)];
                updatePrice(priceEl);
            });

            root.querySelector('[data-role="interior"]').addEventListener('click', (e)=>{
                const btn = e.target.closest('.cfg-option'); if(!btn) return;
                setActive(root.querySelector('[data-role="interior"]'), btn);
                state.interior = INTERIORS[parseInt(btn.dataset.i)];
                updatePrice(priceEl);
            });

            const ap = root.querySelector('[data-role="assist"]');
            ap.addEventListener('click', ()=>{
                state.assist = !state.assist;
                ap.classList.toggle('active', state.assist);
                ap.dataset.value = state.assist?'1':'0';
                updatePrice(priceEl);
            });

            root.querySelector('[data-order]').addEventListener('click', ()=>{
                const m = document.getElementById('orderModal');
                if(m && window.NOVA.openModal) window.NOVA.openModal(m);
            });

            const leadForm = document.getElementById('leadForm');
            if(leadForm){
                leadForm.addEventListener('submit', (e)=>{
                    e.preventDefault();
                    const name  = document.getElementById('leadName').value.trim();
                    const phone = document.getElementById('leadPhone').value.trim();
                    const city  = document.getElementById('leadCity').value.trim();
                    const total = price(cfg,state);
                    const msg = `Halo AION, saya ingin memesan mobil.\n\nNama: ${name}\nNo. HP: ${phone}\nKota: ${city}\n\nModel: ${cfg.name} (${state.trim.name})\nWarna: ${state.color.name}\nEstimasi harga: ${fmt(total,cfg.currency)}\n\nMohon dihubungi untuk proses selanjutnya.`;
                    window.NOVA.track('generate_lead', { model:cfg.name, trim:state.trim.name, value:total });
                    window.NOVA.openWhatsApp(msg, 'whatsapp_click_lead');
                    const m = document.getElementById('orderModal');
                    if(m && window.NOVA.closeModal) window.NOVA.closeModal(m);
                    leadForm.reset();
                });
            }

            root.querySelector('[data-wa-order]').addEventListener('click', ()=>{
                const total = price(cfg,state);
                const msg = `Halo AION, saya tertarik dengan ${cfg.name} varian ${state.trim.name}, warna ${state.color.name}. Estimasi harga ${fmt(total,cfg.currency)}. Mohon info lebih lanjut.`;
                window.NOVA.openWhatsApp(msg, 'whatsapp_click_configurator');
            });

            /* ---------- Trade-In (tukar tambah) ---------- */
            const tiToggle = root.querySelector('[data-tradein-toggle]');
            const tiPanel  = root.querySelector('#tradeinPanel');
            if(tiToggle && tiPanel){
                tiToggle.addEventListener('click', ()=>{
                    tiPanel.hidden = !tiPanel.hidden;
                    tiToggle.textContent = tiPanel.hidden ? 'Tukar Tambah Mobil Lama? Hitung Estimasi' : 'Sembunyikan Kalkulator Tukar Tambah';
                });

                function estimateTradeIn(){
                    const otr  = parseFloat(document.getElementById('tiPrice').value) || 0;
                    const year = parseInt(document.getElementById('tiYear').value) || new Date().getFullYear();
                    const km   = parseFloat(document.getElementById('tiKm').value) || 0;
                    if(otr<=0) return 0;

                    const age = Math.max(new Date().getFullYear() - year, 0);
                    // Depresiasi: 15% tahun pertama, lalu 8%/tahun setelahnya.
                    let value = otr;
                    value *= age>=1 ? 0.85 : 1;
                    if(age>1) value *= Math.pow(0.92, age-1);

                    // Penalti KM berlebih dari rata-rata wajar 12.000 km/tahun.
                    const normalKm = age * 12000;
                    const excessKm = Math.max(km - normalKm, 0);
                    const kmPenalty = (excessKm/1000) * 500000;

                    let result = value - kmPenalty;
                    result = Math.max(result, otr*0.15); // lantai minimum 15% harga awal
                    return Math.round(result/1000000)*1000000;
                }

                function renderTiResult(){
                    const val = estimateTradeIn();
                    const box = document.getElementById('tiResult');
                    if(val>0){
                        box.style.display = '';
                        document.getElementById('tiResultValue').textContent = fmt(val, 'IDR');
                    } else {
                        box.style.display = 'none';
                    }
                }
                ['tiPrice','tiYear','tiKm'].forEach(id=>{
                    const el = document.getElementById(id);
                    if(el) el.addEventListener('input', renderTiResult);
                });

                root.querySelector('[data-tradein-submit]').addEventListener('click', ()=>{
                    const brand = document.getElementById('tiBrand').value.trim();
                    const otr   = document.getElementById('tiPrice').value;
                    const year  = document.getElementById('tiYear').value;
                    const km    = document.getElementById('tiKm').value;
                    const est   = estimateTradeIn();
                    const total = price(cfg,state);

                    if(!brand || !otr || !year){
                        alert('Isi minimal merek/model, harga beli, dan tahun beli mobil lama kamu.');
                        return;
                    }

                    const msg = `Halo AION, saya mau tanya program tukar tambah.\n\nMobil Lama: ${brand}\nTahun Beli: ${year}\nHarga Beli: ${fmt(parseFloat(otr),'IDR')}\nKM Saat Ini: ${km || '-'}\nEstimasi Nilai Tukar Tambah: ${fmt(est,'IDR')}\n\nMobil Baru Diminati: ${cfg.name} (${state.trim.name}), warna ${state.color.name}\nEstimasi Harga Mobil Baru: ${fmt(total,cfg.currency)}\n\nMohon info lanjut untuk proses tukar tambahnya.`;
                    window.NOVA.track('tradein_submit', { model:cfg.name, estimate:est });
                    window.NOVA.openWhatsApp(msg, 'whatsapp_click_tradein');
                });
            }

            updatePrice(priceEl);
        }

        function price(cfg,state){
            return cfg.base + state.trim.add + state.color.price + state.wheel.price + state.interior.price + (state.assist?6000:0);
        }
        function updatePrice(el){
            el.textContent = fmt(price(cfg,state), cfg.currency);
        }
        function swapCar(src){
            const el = root.querySelector('#cfgCar');
            el.classList.add('fade-out');
            setTimeout(()=>{
                el.src = window.NOVA.R+'assets/images/'+src;
                el.dataset.src = window.NOVA.R+'assets/images/'+src;
                el.classList.remove('fade-out');
            }, 300);
        }
        function applyColor(){
            const carEl = root.querySelector('#cfgCar');
            const tintEl = root.querySelector('#cfgTint');
            if(state.color.none){
                tintEl.classList.remove('on');
            }else if(state.color.img){
                tintEl.classList.remove('on');
                swapCar(state.color.img);
            }else{
                tintEl.style.background = state.color.hex;
                tintEl.classList.add('on');
                const baseSrc = window.NOVA.R+'assets/images/'+cfg.img.solid;
                if(carEl.dataset.src !== baseSrc){
                    swapCar(cfg.img.solid);
                }
            }
        }
        function setActive(container, el){
            container.querySelectorAll('.cfg-option,.cfg-swatch').forEach(c=>c.classList.remove('active'));
            el.classList.add('active');
        }
        function fmt(n, currency){
            if(currency==='IDR') return 'Rp ' + n.toLocaleString('id-ID');
            return '$' + n.toLocaleString('en-US');
        }
    });
})();
