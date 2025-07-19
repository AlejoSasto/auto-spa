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
  try {
    // Configurar el formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Configurar validación de campos
    setupFormValidation();
    
    // Configurar validación de fecha y hora
    setupDateTimeValidation();
  } catch (error) {
    ErrorHandlerUtils.system('Error al inicializar funcionalidades de contacto', error);
  }
}

// Manejar envío del formulario
function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Validar campos requeridos
  if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
    showFormError('Por favor completa todos los campos requeridos');
    return;
  }
  
  // Validar teléfono
  if (!isValidPhone(data.phone)) {
    showFormError('Por favor ingresa un número de teléfono válido');
    return;
  }
  
  // Validar email si se proporciona
  if (data.email && !isValidEmail(data.email)) {
    showFormError('Por favor ingresa un email válido');
    return;
  }
  
  // Validar fecha y hora
  if (!isValidDateTime(data.date, data.time)) {
    showFormError('La fecha y hora seleccionada no está disponible');
    return;
  }
  
  // Generar mensaje de WhatsApp
  const whatsappMessage = generateWhatsAppMessage(data);
  
  // Enviar WhatsApp al administrador
  sendWhatsAppToAdmin(whatsappMessage);
  
  // Enviar WhatsApp de confirmación al cliente
  sendWhatsAppToClient(data);
  
  // Mostrar mensaje de éxito
  showFormSuccess('¡Reserva enviada exitosamente! Te contactaremos pronto por WhatsApp.');
  
  // Limpiar formulario
  e.target.reset();
  resetTimeSelect();
}

// Configurar validación de fecha y hora
function setupDateTimeValidation() {
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  
  if (dateInput && timeSelect) {
    // Establecer fecha mínima (hoy) - CORREGIDO para zona horaria local
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    dateInput.setAttribute('min', todayStr);
    
    // Evento para cuando cambie la fecha
    dateInput.addEventListener('change', function() {
      updateTimeOptions(this.value);
    });
    
    // Evento para cuando cambie la hora
    timeSelect.addEventListener('change', function() {
      validateSelectedDateTime();
    });
  }
}

// Actualizar opciones de hora según la fecha
function updateTimeOptions(selectedDate) {
  const timeSelect = document.getElementById('time');
  const selectedDateTime = new Date(selectedDate + 'T00:00:00');
  const today = new Date();
  
  // Crear fecha de hoy sin hora para comparación correcta
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
  
  // Limpiar opciones actuales
  timeSelect.innerHTML = '<option value="">Selecciona una hora</option>';
  
  // Verificar si es hoy o después
  const isToday = selectedDateOnly.getTime() === todayDate.getTime();
  const dayOfWeek = selectedDateTime.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  
  if (isToday) {
    // Para hoy: solo horarios futuros
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes: 8:00 AM - 6:00 PM
      for (let hour = 8; hour < 18; hour++) {
        if (hour > currentHour || (hour === currentHour && currentMinute < 30)) {
          const timeStr = hour.toString().padStart(2, '0') + ':00';
          const displayStr = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
          addTimeOption(timeSelect, timeStr, displayStr);
        }
      }
    } else {
      // Sábado y Domingo: 7:00 AM - 5:00 PM
      for (let hour = 7; hour < 17; hour++) {
        if (hour > currentHour || (hour === currentHour && currentMinute < 30)) {
          const timeStr = hour.toString().padStart(2, '0') + ':00';
          const displayStr = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
          addTimeOption(timeSelect, timeStr, displayStr);
        }
      }
    }
  } else {
    // Para otros días: horarios completos según el día de la semana
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes: 8:00 AM - 6:00 PM
      addTimeOption(timeSelect, '08:00', '8:00 AM');
      addTimeOption(timeSelect, '09:00', '9:00 AM');
      addTimeOption(timeSelect, '10:00', '10:00 AM');
      addTimeOption(timeSelect, '11:00', '11:00 AM');
      addTimeOption(timeSelect, '12:00', '12:00 PM');
      addTimeOption(timeSelect, '13:00', '1:00 PM');
      addTimeOption(timeSelect, '14:00', '2:00 PM');
      addTimeOption(timeSelect, '15:00', '3:00 PM');
      addTimeOption(timeSelect, '16:00', '4:00 PM');
      addTimeOption(timeSelect, '17:00', '5:00 PM');
    } else {
      // Sábado y Domingo: 7:00 AM - 5:00 PM
      addTimeOption(timeSelect, '07:00', '7:00 AM');
      addTimeOption(timeSelect, '08:00', '8:00 AM');
      addTimeOption(timeSelect, '09:00', '9:00 AM');
      addTimeOption(timeSelect, '10:00', '10:00 AM');
      addTimeOption(timeSelect, '11:00', '11:00 AM');
      addTimeOption(timeSelect, '12:00', '12:00 PM');
      addTimeOption(timeSelect, '13:00', '1:00 PM');
      addTimeOption(timeSelect, '14:00', '2:00 PM');
      addTimeOption(timeSelect, '15:00', '3:00 PM');
      addTimeOption(timeSelect, '16:00', '4:00 PM');
    }
  }
  
  // Habilitar el select de hora solo si hay opciones disponibles
  if (timeSelect.options.length > 1) {
    timeSelect.disabled = false;
  } else {
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
  }
}

// Agregar opción de hora
function addTimeOption(select, value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  select.appendChild(option);
}

// Resetear select de hora
function resetTimeSelect() {
  const timeSelect = document.getElementById('time');
  if (timeSelect) {
    timeSelect.innerHTML = '<option value="">Selecciona una fecha primero</option>';
    timeSelect.disabled = true;
  }
}

// Validar fecha y hora seleccionada
function validateSelectedDateTime() {
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  
  if (dateInput.value && timeSelect.value) {
    const selectedDateTime = new Date(`${dateInput.value}T${timeSelect.value}`);
    const now = new Date();
    
    // Verificar que no sea una fecha pasada (comparación de fechas sin hora)
    const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (selectedDateOnly < todayDate) {
      showFieldError(dateInput, 'No se pueden hacer reservas para fechas pasadas');
      return false;
    }
    
    // Si es hoy, verificar que la hora no sea pasada
    if (selectedDateOnly.getTime() === todayDate.getTime() && selectedDateTime < now) {
      showFieldError(timeSelect, 'No se pueden hacer reservas para horas pasadas');
      return false;
    }
    
    // Verificar horarios según el día
    const dayOfWeek = selectedDateTime.getDay();
    const hour = selectedDateTime.getHours();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes: 8:00 AM - 6:00 PM
      if (hour < 8 || hour >= 18) {
        showFieldError(timeSelect, 'Horario no disponible. Lunes a Viernes: 8:00 AM - 6:00 PM');
        return false;
      }
    } else {
      // Sábado y Domingo: 7:00 AM - 5:00 PM
      if (hour < 7 || hour >= 17) {
        showFieldError(timeSelect, 'Horario no disponible. Sábados y Domingos: 7:00 AM - 5:00 PM');
        return false;
      }
    }
    
    // Limpiar errores si todo está bien
    clearFieldError({ target: dateInput });
    clearFieldError({ target: timeSelect });
    return true;
  }
  
  return false;
}

// Validar fecha y hora
function isValidDateTime(date, time) {
  if (!date || !time) return false;
  
  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  
  // Verificar que no sea una fecha pasada (comparación de fechas sin hora)
  const selectedDateOnly = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (selectedDateOnly < todayDate) {
    return false;
  }
  
  // Si es hoy, verificar que la hora no sea pasada
  if (selectedDateOnly.getTime() === todayDate.getTime() && selectedDateTime < now) {
    return false;
  }
  
  // Verificar horarios según el día
  const dayOfWeek = selectedDateTime.getDay();
  const hour = selectedDateTime.getHours();
  
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Lunes a Viernes: 8:00 AM - 6:00 PM
    return hour >= 8 && hour < 18;
  } else {
    // Sábado y Domingo: 7:00 AM - 5:00 PM
    return hour >= 7 && hour < 17;
  }
}

// Generar mensaje de WhatsApp para el administrador
function generateWhatsAppMessage(data) {
  const serviceName = getServiceName(data.service);
  const servicePrice = getServicePrice(data.service);
  const formattedDate = formatDate(data.date);
  const formattedTime = formatTime(data.time);
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return `🚗 *NUEVA RESERVA - AUTO SPA PRO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *INFORMACIÓN DEL CLIENTE*
• Nombre: ${data.name}
• Teléfono: ${data.phone}
• Email: ${data.email || 'No proporcionado'}

🛠️ *SERVICIO SOLICITADO*
• Tipo: ${serviceName}
• Precio: $${servicePrice}
• Mensaje: ${data.message || 'Sin mensaje adicional'}

📅 *RESERVA SOLICITADA*
• Fecha: ${formattedDate}
• Hora: ${formattedTime}

📅 *SOLICITUD RECIBIDA*
• Fecha: ${currentDate}
• Hora: ${currentTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ *UBICACIÓN:* Cra. 5, Sutatausa, Cundinamarca
⏰ *HORARIOS:* Lun-Vie 8AM-6PM | Sáb-Dom 7AM-5PM
📞 *CONTACTO:* 321 3284627

---
*Mensaje automático del sistema web*`;
}

// Obtener nombre del servicio
function getServiceName(serviceValue) {
  const services = {
    'juagada-moto': '🏍️ Juagada Moto',
    'juagada-carro': '🚗 Juagada Carro',
    'lavada-general': '✨ Lavada General',
    'volquetas': '🚛 Volquetas',
    'doble-troque': '🚚 Doble Troque',
    'buses-busetas': '🚌 Buses y Busetas',
    'tractocamiones': '🚛 Tractocamiones'
  };
  
  return services[serviceValue] || '❓ Servicio no especificado';
}

// Obtener precio del servicio
function getServicePrice(serviceValue) {
  const prices = {
    'juagada-moto': '15.000',
    'juagada-carro': '20.000',
    'lavada-general': '50.000',
    'volquetas': '100.000',
    'doble-troque': '100.000',
    'buses-busetas': '100.000',
    'tractocamiones': '100.000'
  };
  
  return prices[serviceValue] || 'Consultar';
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Formatear hora
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Enviar WhatsApp al administrador
function sendWhatsAppToAdmin(message) {
  const adminPhone = '573213284627';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

// Enviar WhatsApp de confirmación al cliente
function sendWhatsAppToClient(data) {
  const clientPhone = data.phone.replace(/\D/g, '');
  const serviceName = getServiceName(data.service);
  const servicePrice = getServicePrice(data.service);
  const formattedDate = formatDate(data.date);
  const formattedTime = formatTime(data.time);
  
  const confirmationMessage = `🚗 *AUTO SPA PRO - Confirmación de Reserva*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Hola *${data.name}*! 

✅ *Hemos recibido tu reserva exitosamente*

🛠️ *DETALLES DE TU RESERVA*
• Servicio: ${serviceName}
• Precio: $${servicePrice}
• Fecha: ${formattedDate}
• Hora: ${formattedTime}
• Teléfono: ${data.phone}
• Email: ${data.email || 'No proporcionado'}
• Mensaje: ${data.message || 'Sin mensaje adicional'}

📞 *PRÓXIMOS PASOS*
Te contactaremos en las próximas 2 horas para confirmar tu cita y coordinar los detalles.

🗺️ *NUESTRA UBICACIÓN*
Cra. 5, Sutatausa, Cundinamarca
(Google Maps: https://maps.google.com?q=Cra.+5%2C+Sutatausa%2C+Cundinamarca)

⏰ *HORARIOS DE ATENCIÓN*
• Lunes a Viernes: 8:00 AM - 6:00 PM
• Sábados y Domingos: 7:00 AM - 5:00 PM

💬 *CONTACTO DIRECTO*
WhatsApp: 321 3284627
Teléfono: 321 3284627

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*¡Gracias por elegir AUTO SPA PRO!*
*El cuidado profesional que tu auto merece* 🚗✨

---
*Este es un mensaje automático de confirmación*`;
  
  const encodedMessage = encodeURIComponent(confirmationMessage);
  const whatsappUrl = `https://wa.me/57${clientPhone}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

// Configurar validación de formulario
function setupFormValidation() {
  const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
  
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
  } else if (field.type === 'tel' && value && !isValidPhone(value)) {
    showFieldError(field, 'Teléfono inválido');
  } else if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Email inválido');
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
  successDiv.innerHTML = `
    <div class="success-content">
      <i class="fab fa-whatsapp"></i>
      <div>
        <h4>¡Reserva Enviada Exitosamente!</h4>
        <p>${message}</p>
        <small>Se han abierto las conversaciones de WhatsApp para completar el proceso.</small>
      </div>
    </div>
  `;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(successDiv, form);
  
  setTimeout(() => {
    successDiv.remove();
  }, 10000);
}

// Mostrar mensaje de error
function showFormError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <div class="error-content">
      <i class="fas fa-exclamation-circle"></i>
      <div>
        <h4>Error en el Envío</h4>
        <p>${message}</p>
      </div>
    </div>
  `;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(errorDiv, form);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Validar teléfono
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleanPhone.length >= 7;
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
