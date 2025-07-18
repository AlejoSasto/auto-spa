# Configuración de EmailJS para AUTO SPA PRO

## Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [EmailJS.com](https://www.emailjs.com/)
2. Regístrate con tu correo electrónico
3. Confirma tu cuenta

### 2. Configurar el servicio de email
1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona "Gmail" (recomendado) o "Outlook"
4. Conecta tu cuenta de Gmail (sastoque42@gmail.com)
5. Dale el nombre: `service_auto_spa_pro`

### 3. Crear la plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa el siguiente código HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nuevo Contacto - AUTO SPA PRO</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .info-label { font-weight: bold; color: #6b7280; font-size: 14px; }
        .info-value { color: #1f2937; margin-top: 5px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .btn:hover { background: #059669; }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>�� AUTO SPA PRO</h1>
            <p>Nuevo mensaje de contacto recibido</p>
        </div>
        
        <div class="content">
            <h2>Información del Cliente</h2>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nombre completo</div>
                    <div class="info-value">{{from_name}}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Teléfono</div>
                    <div class="info-value">{{from_phone}}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">{{from_email}}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Servicio de interés</div>
                    <div class="info-value">{{service}}</div>
                </div>
            </div>
            
            <div class="message-box">
                <h3>Mensaje del cliente:</h3>
                <p>{{message}}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="tel:{{from_phone}}" class="btn">📞 Llamar al cliente</a>
                <a href="https://wa.me/{{from_phone}}?text=Hola {{from_name}}, gracias por contactarnos. ¿En qué podemos ayudarte?" class="btn">💬 WhatsApp</a>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>📅 Fecha de contacto:</strong> {{date}}<br>
                <strong>🌐 Enviado desde:</strong> Formulario web de AUTO SPA PRO
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 AUTO SPA PRO - Sutatausa, Cundinamarca</p>
            <p>Este email fue generado automáticamente desde el formulario de contacto</p>
        </div>
    </div>
</body>
</html>
```

4. Guarda la plantilla con el nombre: `template_contact_form`

### 4. Obtener las credenciales
1. Ve a "Account" → "API Keys"
2. Copia tu "Public Key" (User ID)
3. Actualiza el archivo `data/config.json` con tu User ID:

```json
{
  "emailjs": {
    "serviceId": "service_auto_spa_pro",
    "templateId": "template_contact_form", 
    "userId": "TU_USER_ID_AQUI"
  }
}
```

### 5. Variables de la plantilla
La plantilla usa estas variables que se envían desde el formulario:
- `{{from_name}}` - Nombre del cliente
- `{{from_phone}}` - Teléfono del cliente
- `{{from_email}}` - Email del cliente
- `{{service}}` - Servicio de interés
- `{{message}}` - Mensaje del cliente
- `{{date}}` - Fecha y hora del contacto

### 6. Probar la configuración
1. Llena el formulario de contacto en tu sitio web
2. Envía el mensaje
3. Verifica que recibas el email en sastoque42@gmail.com
4. Verifica que se abra WhatsApp con el mensaje predefinido

## Notas importantes
- EmailJS tiene un plan gratuito con 200 emails/mes
- Para más emails, considera el plan pago
- Los emails se envían desde tu cuenta de Gmail conectada
- El formulario también abre WhatsApp automáticamente 