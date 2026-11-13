/* Formulaire de contact — version statique (GitHub Pages).
   Remplace l'envoi WordPress/Divi par Formspree.
   Pour activer : mettre l'adresse du formulaire Formspree ci-dessous. */
(function () {
  var FORM_ENDPOINT = ''; // ex. 'https://formspree.io/f/abcdwxyz'
  var MERCI = '/merci/';

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }
  function showMsg(form, text, isError) {
    var box = form.parentNode.parentNode.querySelector('.et-pb-contact-message');
    if (!box) { alert(text); return; }
    box.innerHTML = '<p style="color:' + (isError ? '#c0392b' : 'inherit') + '">' + text + '</p>';
  }

  window.addEventListener('submit', function (ev) {
    var form = ev.target;
    if (!form || !form.classList || !form.classList.contains('et_pb_contact_form')) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();

    var data = {
      'Nom': val(form, 'et_pb_contact_name_0'),
      'Téléphone': val(form, 'et_pb_contact_telephone_0'),
      'email': val(form, 'et_pb_contact_email_0'),
      'Entreprise': val(form, 'et_pb_contact_entreprise_0'),
      'Grandeur de l\'entreprise': val(form, 'et_pb_contact_taille_0'),
      'Besoins': val(form, 'et_pb_contact_besoin_0'),
      'Message': val(form, 'et_pb_contact_message_0')
    };
    var missing = [];
    if (!data['Nom']) missing.push('Nom');
    if (!data['Téléphone']) missing.push('Téléphone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) missing.push('Courriel');
    if (!data['Besoins']) missing.push('Besoins');
    if (missing.length) { showMsg(form, 'Veuillez remplir : ' + missing.join(', ') + '.', true); return; }

    if (!FORM_ENDPOINT) {
      showMsg(form, 'Le formulaire est temporairement indisponible. Appelez-nous au 514 687-9998.', true);
      return;
    }
    data._subject = 'Demande de soumission — corposolutionip.ca — ' + data['Nom'];
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (r.ok) { window.location.href = MERCI; return; }
      throw new Error('HTTP ' + r.status);
    }).catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Soumettre'; }
      showMsg(form, 'Oups, l\'envoi n\'a pas fonctionné. Réessayez ou appelez-nous au 514 687-9998.', true);
    });
  }, true);
})();
