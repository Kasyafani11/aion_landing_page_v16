/* ============================================================
   CHARGING — map pins, station list, search, filter
   ============================================================ */
(function(){
    'use strict';
    const R = window.NOVA.R;

    const STATIONS = [
        { name:'AION Fast Charge', loc:'Jakarta, Indonesia', avail:'8/12', speed:'250 kW', type:'Fast Charging', x:20, y:34 },
        { name:'AION Fast Charge', loc:'Surabaya, Indonesia',avail:'4/8',  speed:'250 kW', type:'Fast Charging', x:42, y:58 },
        { name:'Destination',      loc:'Bali, Indonesia',     avail:'6/10', speed:'11 kW',  type:'Destination',  x:58, y:42 },
        { name:'Public Charging',  loc:'Bandung, Indonesia',  avail:'9/12', speed:'150 kW', type:'Public Charging', x:70, y:62 },
        { name:'Home Charger',     loc:'Jakarta, Indonesia',  avail:'—',    speed:'7 kW',   type:'Home',         x:30, y:70 },
        { name:'AION Fast Charge', loc:'Medan, Indonesia',    avail:'6/8',  speed:'250 kW', type:'Fast Charging', x:12, y:22 }
    ];

    document.addEventListener('DOMContentLoaded', ()=>{
        const mapRoot = document.getElementById('charging-map-root');
        const listRoot = document.getElementById('station-list-root');
        if(!listRoot) return;

        let filter = 'All', query = '';

        renderMap(mapRoot);
        renderList(listRoot, filter, query);

        const search = document.getElementById('chargeSearch');
        if(search) search.addEventListener('input', e=>{
            query = e.target.value.trim().toLowerCase();
            renderList(listRoot, filter, query);
        });

        document.querySelectorAll('[data-charge-filter]').forEach(chip=>{
            chip.addEventListener('click', ()=>{
                document.querySelectorAll('[data-charge-filter]').forEach(c=>c.classList.remove('active'));
                chip.classList.add('active');
                filter = chip.getAttribute('data-charge-filter');
                renderList(listRoot, filter, query);
            });
        });
    });

    function renderMap(root){
        if(!root) return;
        root.innerHTML = `
            <div class="map-mock">
                ${STATIONS.map((s,i)=>`<span class="map-pin" style="left:${s.x}%;top:${s.y}%" title="${s.name}"></span>`).join('')}
            </div>`;
    }

    function renderList(root, filter, query){
        const list = STATIONS.filter(s=>{
            const typeOk = filter==='All' || s.type===filter;
            const qOk = !query || (s.loc+' '+s.name+' '+s.type).toLowerCase().includes(query);
            return typeOk && qOk;
        });
        root.innerHTML = list.length
            ? list.map(s=>`
                <div class="find-card">
                    <div>
                        <h4>${s.name}</h4>
                        <p>${s.loc}</p>
                        <p>Charging: ${s.speed}</p>
                    </div>
                    <span class="distance">${s.avail}</span>
                </div>`).join('')
            : `<div class="inv-empty">No stations match your search.</div>`;
    }
})();
