# Checklist de Accesibilidad WCAG - Valsho.com.ar

## Contraste de Colores (WCAG AA)
- [ ] Texto normal: ratio minimo 4.5:1
- [ ] Texto grande (>= 18px o 14px bold): ratio minimo 3:1
- [ ] Elementos UI e iconos: ratio minimo 3:1
- [ ] Links diferenciables del texto (no solo por color)

## Imagenes
- [ ] Todas las imagenes de contenido tienen alt text descriptivo
- [ ] Imagenes decorativas tienen alt="" o aria-hidden="true"
- [ ] Alt text describe el producto (ej: "Organizador de cocina blanco con 3 niveles")
- [ ] Iconos con aria-label o aria-hidden segun corresponda

## Formularios
- [ ] Todos los campos tienen label visible asociado
- [ ] Campos requeridos indicados (no solo por color)
- [ ] Mensajes de error claros y descriptivos
- [ ] Autocomplete en campos de contacto/direccion
- [ ] Placeholder no reemplaza al label

## Navegacion
- [ ] Skip-to-content link presente
- [ ] Navegacion por teclado funcional (Tab, Enter, Escape)
- [ ] Focus visible en todos los elementos interactivos
- [ ] Orden de tabulacion logico
- [ ] Menu desplegable accesible por teclado

## Estructura Semantica
- [ ] Elemento header presente
- [ ] Elemento nav para navegacion
- [ ] Elemento main para contenido principal
- [ ] Elemento footer presente
- [ ] Landmarks ARIA cuando no hay HTML5 semantico

## Media
- [ ] Videos con subtitulos o transcripcion
- [ ] Audio con transcripcion
- [ ] Animaciones con opcion de pausa
- [ ] Sin contenido que parpadea mas de 3 veces/segundo

## Responsividad
- [ ] Zoom hasta 200% sin perder funcionalidad
- [ ] Botones/links minimo 44x44px en mobile
- [ ] Texto legible sin zoom (minimo 16px base)
- [ ] Sin scroll horizontal en mobile

## Herramientas de Validacion
- WAVE: wave.webaim.org
- Axe DevTools: extension de navegador
- Lighthouse: pestaña Accessibility
- Contrast Checker: webaim.org/resources/contrastchecker
