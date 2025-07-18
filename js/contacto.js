export async function renderContacto() {
  const section = document.querySelector('.contacto-section');
  if (!section) return;
  try {
    const res = await fetch('data/config.json');
    const config = await res.json();
    section.innerHTML = `
      <h2 class="section-title">Contacto</h2>
      <form class="contacto-form">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
        <label for="email">Correo:</label>
        <input type="email" id="email" name="email" required>
        <label for="mensaje">Mensaje:</label>
        <textarea id="mensaje" name="mensaje" rows="4" required></textarea>
        <button type="submit">Enviar</button>
      </form>
      <div style="margin-top:1rem;">
        <strong>Email:</strong> <a href="mailto:${config.email}">${config.email}</a><br>
        <strong>Teléfono:</strong> <a href="tel:${config.telefono}">${config.telefono}</a>
      </div>
    `;
  } catch (e) {
    section.innerHTML = `<div style="color:red;">Error cargando contacto</div>`;
  }
}

// Función de inicialización para el sistema modular
export function initContact() {
  console.log('Inicializando funcionalidades de contacto...');
  
  // Configurar el formulario de contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  // Configurar validación de campos
  setupFormValidation();
}

// Manejar envío del formulario
function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Validar campos requeridos
  if (!data.name || !data.phone) {
    showFormError('Por favor completa los campos requeridos');
    return;
  }
  
  // Simular envío
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    showFormSuccess('¡Mensaje enviado! Te contactaremos pronto.');
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Configurar validación de formulario
function setupFormValidation() {
  const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

// Validar campo individual
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const errorSpan = field.parentNode.querySelector('.error-message');
  
  if (field.hasAttribute('required') && !value) {
    showFieldError(field, 'Este campo es requerido');
  } else if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Email inválido');
  } else if (field.type === 'tel' && value && !isValidPhone(value)) {
    showFieldError(field, 'Teléfono inválido');
  } else {
    clearFieldError(e);
  }
}

// Mostrar error de campo
function showFieldError(field, message) {
  const errorSpan = field.parentNode.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.textContent = message;
    field.classList.add('error');
  }
}

// Limpiar error de campo
function clearFieldError(e) {
  const field = e.target;
  const errorSpan = field.parentNode.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.textContent = '';
    field.classList.remove('error');
  }
}

// Mostrar mensaje de éxito
function showFormSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(successDiv, form);
  
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Mostrar mensaje de error
function showFormError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(errorDiv, form);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar teléfono
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}
