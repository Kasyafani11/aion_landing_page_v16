/* ============================================================
   CALCULATOR — simulasi cicilan (flat rate), harga resmi OTR Jkt
   ============================================================ */
(function(){
    'use strict';

    // Harga OTR Jakarta resmi (aionindonesia.com, per Sep 2026).
    const PRICE_LIST = [
        { key:'aion-ut-standard',   label:'AION UT Standard',        price:345000000 },
        { key:'aion-ut-premium',    label:'AION UT Premium',         price:395000000 },
        { key:'aion-y-plus-exclusive', label:'AION Y Plus Exclusive', price:419000000 },
        { key:'aion-y-plus-premium',   label:'AION Y Plus Premium',   price:479000000 },
        { key:'aion-v-exclusive',   label:'AION V Exclusive',        price:499000000 },
        { key:'aion-v-luxury',      label:'AION V Luxury',           price:560000000 },
        { key:'hyptec-ht-premium',  label:'HYPTEC HT Premium',       price:755000000 }
    ];

    function fmtRp(n){ return 'Rp' + Math.round(n).toLocaleString('id-ID'); }

    document.addEventListener('DOMContentLoaded', ()=>{
        const modelSel = document.getElementById('calcModel');
        if(!modelSel) return;

        const otrInput   = document.getElementById('calcOtr');
        const dpPct      = document.getElementById('calcDpPct');
        const dpPctLabel = document.getElementById('calcDpPctLabel');
        const dpAmt      = document.getElementById('calcDpAmt');
        const dpAmtLabel = document.getElementById('calcDpAmtLabel');
        const tenorSel   = document.getElementById('calcTenor');
        const rateSel    = document.getElementById('calcRate');

        const outMonthly = document.getElementById('calcMonthly');
        const outOtr   = document.getElementById('calcOutOtr');
        const outDp    = document.getElementById('calcOutDp');
        const outPokok = document.getElementById('calcOutPokok');
        const outBunga = document.getElementById('calcOutBunga');
        const outTotal = document.getElementById('calcOutTotal');

        modelSel.innerHTML = PRICE_LIST.map(v=>`<option value="${v.key}">${v.label} — ${fmtRp(v.price)}</option>`).join('');

        let syncing = false;

        function currentPrice(){
            const v = PRICE_LIST.find(v=>v.key===modelSel.value);
            return v ? v.price : 0;
        }

        function syncDpFromPct(){
            const price = currentPrice();
            const amt = price * (parseInt(dpPct.value)/100);
            dpAmt.max = price;
            if(!syncing){ syncing = true; dpAmt.value = Math.round(amt); syncing = false; }
        }

        function syncDpFromAmt(){
            const price = currentPrice() || 1;
            const pct = Math.round((parseInt(dpAmt.value)/price)*100);
            if(!syncing){ syncing = true; dpPct.value = Math.min(90, Math.max(10, pct)); syncing = false; }
        }

        function render(){
            const price = currentPrice();
            otrInput.value = fmtRp(price);
            dpAmt.max = price;

            const dp = Math.min(parseInt(dpAmt.value)||0, price);
            const pokok = Math.max(price - dp, 0);
            const tenorBulan = parseInt(tenorSel.value);
            const rateYear = parseFloat(rateSel.value)/100;
            const tenorYear = tenorBulan/12;

            const totalBunga = pokok * rateYear * tenorYear;
            const totalBayar = pokok + totalBunga;
            const monthly = tenorBulan ? totalBayar/tenorBulan : 0;

            dpPctLabel.textContent = dpPct.value + '%';
            dpAmtLabel.textContent = fmtRp(dp);
            outMonthly.textContent = fmtRp(monthly) + ' /bln';
            outOtr.textContent = fmtRp(price);
            outDp.textContent = fmtRp(dp);
            outPokok.textContent = fmtRp(pokok);
            outBunga.textContent = fmtRp(totalBunga);
            outTotal.textContent = fmtRp(totalBayar + dp);
        }

        modelSel.addEventListener('change', ()=>{ syncDpFromPct(); render(); });
        dpPct.addEventListener('input', ()=>{ syncDpFromPct(); render(); });
        dpAmt.addEventListener('input', ()=>{ syncDpFromAmt(); render(); });
        tenorSel.addEventListener('change', render);
        rateSel.addEventListener('change', render);

        syncDpFromPct();
        render();
    });
})();
