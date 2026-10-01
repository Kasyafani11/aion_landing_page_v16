/* ============================================================
   NAVBAR — scroll state, mobile full-screen menu, account
   Depends on: NOVA namespace (main.js)
   ============================================================ */
(function(){
    'use strict';
    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.getElementById('navbar');
        if(!navbar) return;

        // Pages that open with a light/white top (no dark hero) need a dark
        // navbar text from the very start, otherwise the white wordmark and
        // links are invisible against the page background.
        const main = document.getElementById('main-content') || document.querySelector('main');
        const startsDark = !!(main && main.querySelector('.hero--dark, .hero-section, .vehicle-banner'));
        window.NOVA.pageStartsDark = startsDark;

        // Update navbar appearance on scroll
        function updateScroll(){
            if(!startsDark){
                // Light pages keep a frosted bar from the very top
                navbar.classList.add('nav-frost');
                navbar.classList.add('scrolled');
            }else if(window.scrollY > 30){
                navbar.classList.add('scrolled');
            }else{
                // keep opaque if a mega menu is open
                if(!navbar.classList.contains('menu-active')){
                    navbar.classList.remove('scrolled');
                }
            }
        }
        window.addEventListener('scroll', updateScroll, { passive:true });
        updateScroll();

        // ---------- Mobile menu ----------
        const menuToggle = navbar.querySelector('.menu-toggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        const body = document.body;

        function openMobile(){
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden','false');
            menuToggle.setAttribute('aria-expanded','true');
            body.classList.add('lock');
            closeAllMega();
        }
        function closeMobile(){
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden','true');
            menuToggle.setAttribute('aria-expanded','false');
            body.classList.remove('lock');
        }
        window.NOVA.closeMobile = closeMobile;

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMobile() : openMobile();
        });
        closeBtn.addEventListener('click', closeMobile);

        // Escape closes mobile
        document.addEventListener('keydown', (e)=>{
            if(e.key==='Escape') closeMobile();
        });

        // Submenu accordions
        mobileMenu.querySelectorAll('.mobile-item-btn').forEach(btn => {
            btn.addEventListener('click', ()=>{
                const item = btn.closest('.mobile-item');
                const wasOpen = item.classList.contains('open');
                mobileMenu.querySelectorAll('.mobile-item.open').forEach(o=>{
                    o.classList.remove('open');
                    o.querySelector('.mobile-sub').style.maxHeight = null;
                    o.querySelector('.mobile-item-btn').setAttribute('aria-expanded','false');
                });
                if(!wasOpen){
                    item.classList.add('open');
                    const sub = item.querySelector('.mobile-sub');
                    sub.style.maxHeight = sub.scrollHeight + 'px';
                    btn.setAttribute('aria-expanded','true');
                }
            });
        });

    });

    // helper to close all mega menus (defined in mega-menu.js)
    function closeAllMega(){ if(window.NOVA && window.NOVA.closeAllMenus) window.NOVA.closeAllMenus(); }
})();
