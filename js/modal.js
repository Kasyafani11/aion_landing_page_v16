/* ============================================================
   MODAL — generic open/close, backdrop, escape, focus
   Depends on: NOVA namespace
   Usage: window.NOVA.openModal(el)
          window.NOVA.closeModal(el)
   ============================================================ */
(function(){
    'use strict';

    function openModal(modal){
        if(!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');
        document.body.classList.add('lock');
        // focus first field/close
        const f = modal.querySelector('input,select,button,a');
        if(f) f.focus();
    }

    function closeModal(modal){
        if(!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
        if(!document.querySelector('.modal.open')) document.body.classList.remove('lock');
    }

    window.NOVA.openModal = openModal;
    window.NOVA.closeModal = closeModal;

    document.addEventListener('DOMContentLoaded', ()=>{
        // backdrop click + close buttons
        document.addEventListener('click', (e)=>{
            const backdrop = e.target.closest('[data-close]');
            if(backdrop){
                const m = backdrop.closest('.modal');
                if(m) closeModal(m);
            }
            const closer = e.target.closest('[data-close-modal]');
            if(closer){
                const m = closer.closest('.modal');
                if(m) closeModal(m);
            }
            // account quick form (mock) handled by page scripts
        });

        // close on Escape
        document.addEventListener('keydown', (e)=>{
            if(e.key==='Escape'){
                document.querySelectorAll('.modal.open').forEach(closeModal);
            }
        });
    });
})();
