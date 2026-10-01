/* ============================================================
   MEGA MENU — desktop hover-to-open, delayed close, page dim
   Depends on: NOVA namespace
   ============================================================ */
(function(){
    'use strict';
    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.getElementById('navbar');
        const groups = Array.from(document.querySelectorAll('.nav-group'));
        if(!navbar || !groups.length) return;

        // Dim overlay behind the menu
        let overlay = document.getElementById('megaOverlay');
        if(!overlay){
            overlay = document.createElement('div');
            overlay.id = 'megaOverlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:990;opacity:0;visibility:hidden;transition:opacity .33s ease,visibility .33s;';
            document.body.appendChild(overlay);
        }

        let closeTimer = null;
        let activeGroup = null;
        const OPEN_DELAY = 0;
        const CLOSE_DELAY = 220;

        function openMenu(group){
            clearTimeout(closeTimer);
            if(activeGroup && activeGroup!==group) activeGroup.classList.remove('open');
            activeGroup = group;
            group.classList.add('open');
            navbar.classList.add('menu-active');
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            group.querySelector('.nav-link').setAttribute('aria-expanded','true');
        }
        function scheduleClose(){
            clearTimeout(closeTimer);
            closeTimer = setTimeout(()=>{ closeAllMenus(); }, CLOSE_DELAY);
        }
        function closeAllMenus(){
            clearTimeout(closeTimer);
            groups.forEach(g=>g.classList.remove('open'));
            if(activeGroup) activeGroup.querySelector('.nav-link').setAttribute('aria-expanded','false');
            activeGroup = null;
            navbar.classList.remove('menu-active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            // keep the (frosted) navbar on light pages; on dark-hero pages
            // only reset the ghost when back at the very top
            if(window.NOVA && window.NOVA.pageStartsDark){
                if(window.scrollY <= 30) navbar.classList.remove('scrolled');
            }else{
                navbar.classList.add('nav-frost');
                navbar.classList.add('scrolled');
            }
        }
        window.NOVA.closeAllMenus = closeAllMenus;

        // Hover / focus open with delay handling
        groups.forEach(group => {
            const menu = group.querySelector('.mega-menu');

            group.addEventListener('mouseenter', ()=> openMenu(group));
            group.addEventListener('mouseleave', ()=> scheduleClose());
            // keep open while inside the menu
            menu.addEventListener('mouseenter', ()=> clearTimeout(closeTimer));
            menu.addEventListener('mouseleave', ()=> scheduleClose());

            // Keyboard: Enter/Space on nav button toggles; Escape closes
            group.querySelector('.nav-link').addEventListener('click', (e)=>{
                e.preventDefault();
                if(group.classList.contains('open')) scheduleClose();
                else openMenu(group);
            });
        });

        // Clicking the dim overlay closes
        overlay.addEventListener('click', closeAllMenus);

        // Closing when clicking a menu link
        document.querySelectorAll('.mega-menu a,.mega-menu .mm-car').forEach(el=>{
            el.addEventListener('click', ()=>{
                // allow normal navigation, then close
                setTimeout(closeAllMenus, 100);
            });
        });
    });
})();
