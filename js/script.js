/* --------------------------
   Utilidades LocalStorage
---------------------------*/
const LS_KEYS = {
  BG: 'perfil:bgColor',
  FORM: 'perfil:formData'
};

function saveBg(color) {
  try { localStorage.setItem(LS_KEYS.BG, color); } catch {}
}
function loadBg() {
  try { return localStorage.getItem(LS_KEYS.BG); } catch { return null; }
}
function saveFormData(data) {
  try { localStorage.setItem(LS_KEYS.FORM, JSON.stringify(data)); } catch {}
}
function loadFormData() {
  try {
    const raw = localStorage.getItem(LS_KEYS.FORM);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ---------------------------------
   Lógica principal (index.html)
----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const bodyRoot = document.getElementById('bodyRoot');
  const btnAlerta = document.getElementById('btnAlerta');
  const btnCambiarFondo = document.getElementById('btnCambiarFondo');
  const btnAgregarMeta = document.getElementById('btnAgregarMeta');
  const btnCambiarParrafo = document.getElementById('btnCambiarParrafo');
  const welcomeText = document.getElementById('welcomeText');
  const profileImg = document.getElementById('profileImg');
  const userForm = document.getElementById('userForm');
  const listaDinamica = document.getElementById('listaDinamica');
  const nuevaMeta = document.getElementById('nuevaMeta');

  // NUEVO: input para el nuevo mensaje de bienvenida
  const nuevoTextoBienvenida = document.getElementById('nuevoTextoBienvenida');
  const nuevoTextoFeedback = document.getElementById('nuevoTextoFeedback');

  const COLOR_A = '#ffffff';
  const COLOR_B = '#f7f8fc';

  // 1) Restaurar color de fondo guardado
  const savedBg = loadBg();
  const startBg = savedBg || COLOR_B;
  bodyRoot.style.backgroundColor = startBg;

  // 2) Restaurar datos del formulario si existen
  if (userForm) {
    const data = loadFormData();
    if (data) {
      document.getElementById('nombre').value = data.nombre ?? '';
      document.getElementById('correo').value = data.correo ?? '';
      document.getElementById('bio').value = data.bio ?? '';
    }
  }

  // 3) Alerta de bienvenida
  if (btnAlerta) {
    btnAlerta.addEventListener('click', () => {
      alert('¡Bienvenido! Esta es tu página de perfil.');
    });
  }

  // 4) Cambiar color de fondo y guardarlo en localStorage
  if (btnCambiarFondo) {
    btnCambiarFondo.addEventListener('click', () => {
      const current = loadBg() || bodyRoot.style.backgroundColor || COLOR_B;
      const next = (current.toLowerCase() === COLOR_A) ? COLOR_B : COLOR_A;
      bodyRoot.style.backgroundColor = next;
      saveBg(next);
    });
  }

  // 5) Cambiar contenido del <p> con un botón usando la caja de texto
  if (btnCambiarParrafo && welcomeText) {
    btnCambiarParrafo.addEventListener('click', () => {
      const nuevo = (nuevoTextoBienvenida?.value || '').trim();
      if (!nuevo) {
        if (nuevoTextoBienvenida) {
          nuevoTextoBienvenida.classList.add('is-invalid');
          nuevoTextoBienvenida.focus();
          if (nuevoTextoFeedback) nuevoTextoFeedback.textContent = 'Ingresa un texto para actualizar el mensaje.';
        }
        return;
      }
      welcomeText.textContent = nuevo;
      welcomeText.style.color = '#0d6efd';
      if (nuevoTextoBienvenida) nuevoTextoBienvenida.classList.remove('is-invalid');
    });
  }

  // Efecto visual al hacer clic en el párrafo (sin cambiar el texto)
  if (welcomeText) {
    welcomeText.addEventListener('click', () => {
      welcomeText.style.transform = 'scale(1.03)';
      setTimeout(() => welcomeText.style.transform = 'scale(1)', 120);
    });
  }

  // 6) Imagen de perfil crece en mouseover
  if (profileImg) {
    profileImg.addEventListener('mouseover', () => profileImg.style.transform = 'scale(1.07)');
    profileImg.addEventListener('mouseout',  () => profileImg.style.transform = 'scale(1)');
  }

  // 7) Agregar dinámicamente elementos a una lista
  if (btnAgregarMeta && listaDinamica && nuevaMeta) {
    btnAgregarMeta.addEventListener('click', () => {
      const texto = nuevaMeta.value.trim();
      if (!texto) return;

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = texto;

      const del = document.createElement('button');
      del.className = 'btn btn-sm btn-outline-danger';
      del.textContent = 'Eliminar';
      del.addEventListener('click', () => li.remove());

      li.appendChild(del);
      listaDinamica.appendChild(li);
      nuevaMeta.value = '';
      nuevaMeta.focus();
    });
  }

  // 8) Validación de formulario + guardado en localStorage
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre');
      const correo = document.getElementById('correo');
      const bio = document.getElementById('bio');

      let valido = true;
      [nombre, correo, bio].forEach(ctrl => {
        if (!ctrl.value.trim()) {
          ctrl.classList.add('is-invalid');
          valido = false;
        } else {
          ctrl.classList.remove('is-invalid');
        }
      });
      if (!valido) return;

      saveFormData({
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        bio: bio.value.trim()
      });

      const ok = document.createElement('div');
      ok.className = 'alert alert-success mt-3';
      ok.textContent = 'Datos guardados correctamente en localStorage.';
      userForm.insertAdjacentElement('afterend', ok);
      setTimeout(() => ok.remove(), 2500);
    });
  }

  /* -------- Interacciones jQuery (requiere js/jquery.min.js) -------- */
  if (typeof $ !== 'undefined') {
    // Atajo: Enter en "Nueva meta" agrega el ítem usando el botón
    $('#nuevaMeta').on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('#btnAgregarMeta').trigger('click');
      }
    });
  }
});