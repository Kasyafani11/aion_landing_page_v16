/* ============================================================
   ANIMATIONS — scroll reveal, parallax, stagger
   Respects prefers-reduced-motion.
   Uses .reveal elements; add .in-view via IntersectionObserver.
   ============================================================ */
(function(){
    'use strict';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', ()=>{
        const revealEls = document.querySelectorAll('.reveal');

        if(reduced || !('IntersectionObserver' in window)){
            revealEls.forEach(el=>el.classList.add('in-view'));
            return;
        }

        const io = new IntersectionObserver((entries)=>{
            entries.forEach(en=>{
                if(en.isIntersecting){
                    const el = en.target;
                    const delay = el.dataset.delay ? parseFloat(el.dataset.delay)*60 : 0;
                    setTimeout(()=> el.classList.add('in-view'), delay);
                    io.unobserve(el);
                }
            });
        }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });

        revealEls.forEach(el=>io.observe(el));

        // Counters
        document.querySelectorAll('[data-count]').forEach(el=>{
            const target = parseFloat(el.getAttribute('data-count'));
            const decimals = parseInt(el.getAttribute('data-decimal')||'0',10);
            const suffix = el.getAttribute('data-suffix')||'';
            let animated = false;
            const cio = new IntersectionObserver((entries)=>{
                entries.forEach(en=>{
                    if(en.isIntersecting && !animated){
                        animated = true;
                        animate(el, target, decimals, suffix);
                        cio.unobserve(el);
                    }
                });
            }, { threshold:0.5 });
            cio.observe(el);
        });
    });

    function animate(el, target, decimals, suffix){
        if(reduced){ el.textContent = target.toFixed(decimals) + suffix; return; }
        const dur = 1600;
        const start = performance.now();
        function step(now){
            const p = Math.min((now-start)/dur, 1);
            const eased = 1 - Math.pow(1-p, 3);
            const val = target * eased;
            el.textContent = (decimals? val.toFixed(decimals) : Math.floor(val)) + suffix;
            if(p<1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(step);
    }

    /* ==========================================================
       FAQ ACCORDION — dipakai di halaman mana saja yang punya .faq-item
       ========================================================== */
    document.querySelectorAll('.faq-item').forEach(item=>{
        const btn = item.querySelector('.faq-q');
        const ans = item.querySelector('.faq-a');
        if(!btn || !ans) return;
        btn.addEventListener('click', ()=>{
            const isOpen = item.classList.contains('open');
            // Tutup semua item lain (accordion single-open), lalu toggle yang diklik.
            document.querySelectorAll('.faq-item.open').forEach(other=>{
                if(other!==item){
                    other.classList.remove('open');
                    other.querySelector('.faq-q').setAttribute('aria-expanded','false');
                    other.querySelector('.faq-a').style.maxHeight = null;
                }
            });
            item.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
            ans.style.maxHeight = !isOpen ? ans.scrollHeight + 'px' : null;
        });
    });
})();
