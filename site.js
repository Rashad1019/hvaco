// Shared helpers and the company detail sheet, used by both pages.
(function () {
  const C = window.COMPANIES || [];
  const byId = Object.fromEntries(C.map(c => [c.id, c]));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const short = n => n.replace(/,? LLC$/, '').replace(/ Heating (&|and) Air Conditioning( Services)?$/, ' Heating & Air').replace(/ Heating & Electrical Contractors$/, ' Heating & Electrical');
  const tel = p => 'tel:+1' + p.replace(/\D/g, '');
  const tierLabel = { priority: 'Call first', additional: 'Alternative', caution: 'Check carefully' };
  const PHONE = '<svg class="phone-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z"/></svg>';

  const rate = c => `<span class="rate"><strong>${c.rating.toFixed(1)} <span class="star" aria-hidden="true">★</span></strong><span class="muted">from ${c.n} reviews</span></span>`;
  const tags = c => `<span class="tags"><span class="tag ${c.tier}">${tierLabel[c.tier]}</span>${c.emergency ? '<span class="tag emerg">Emergency service</span>' : ''}${c.n < 30 ? '<span class="tag few">Few reviews</span>' : ''}</span>`;
  const callBtn = (c, cls) => c.phone
    ? `<a class="btn ${cls || 'btn-call'}" href="${tel(c.phone)}">${PHONE}Call ${esc(c.phone)}</a>` : '';

  // detail sheet
  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="sheet" id="sheet" aria-labelledby="sheetName">
      <div class="sheet-head">
        <h2 id="sheetName"></h2>
        <button class="x" id="sheetClose" aria-label="Close details">×</button>
        <div id="sheetRate" class="rate"></div>
      </div>
      <div class="sheet-body" id="sheetBody"></div>
      <div class="sheet-foot" id="sheetFoot"></div>
    </dialog>`);
  const sheet = document.getElementById('sheet');
  function openCo(id) {
    const c = byId[id]; if (!c) return;
    document.getElementById('sheetName').textContent = short(c.name);
    document.getElementById('sheetRate').innerHTML = rate(c) + tags(c);
    document.getElementById('sheetBody').innerHTML = `
      <div><h3>Best for</h3><p>${esc(c.fit)}</p></div>
      <div class="pc"><p class="good">${esc(c.strength)}</p><p class="watch">${esc(c.concern)}</p></div>
      <dl class="kv">
        <div><dt>BBB rating</dt><dd>${esc(c.bbb)}</dd></div>
        <div><dt>BBB complaints</dt><dd>${esc(c.complaints)}</dd></div>
        <div><dt>Area</dt><dd>${esc(c.area)}</dd></div>
        <div><dt>Emergency service</dt><dd>${c.emergency ? 'Advertised' : 'Not confirmed'}</dd></div>
      </dl>
      <div><h3>What we found</h3><p>${esc(c.details)}</p></div>
      <div><h3>Pricing</h3><p>${esc(c.price)}</p></div>
      <div><h3>What we checked</h3><p>${esc(c.verified)}</p></div>
      ${c.address ? `<div><h3>Address</h3><p>${esc(c.address)}</p></div>` : ''}
      <div><h3>Read the sources</h3><div class="linklist"><a href="${esc(c.sourceurl)}" target="_blank" rel="noopener">${esc(c.source)}</a>${(c.others || []).map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join('')}</div></div>`;
    document.getElementById('sheetFoot').innerHTML = callBtn(c) || '<p class="muted small">No phone number found. Use the source links above to contact them.</p>';
    sheet.showModal();
    document.getElementById('sheetBody').scrollTop = 0;
  }
  document.getElementById('sheetClose').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openCo(b.dataset.open); });

  window.HV = { C, byId, esc, short, tel, tierLabel, rate, tags, callBtn, openCo, PHONE };
})();
