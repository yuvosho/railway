# Guia de Optimizacion de Imagenes - Valsho.com.ar

## Formato de Imagenes

| Tipo de Imagen | Formato Recomendado | Alternativa |
|----------------|---------------------|-------------|
| Fotos de productos | WebP | JPEG (quality 80-85%) |
| Logos/iconos | SVG | PNG |
| Banners/hero | WebP | JPEG (quality 75-80%) |
| Thumbnails | WebP | JPEG (quality 70%) |
| Imagenes con transparencia | WebP | PNG |

## Tamanos Recomendados

| Uso | Ancho Maximo | Peso Maximo |
|-----|-------------|-------------|
| Hero/Banner desktop | 1920px | 200KB |
| Hero/Banner mobile | 768px | 100KB |
| Foto de producto | 800px | 150KB |
| Thumbnail | 300px | 30KB |
| Logo | 200px | 20KB |
| Iconos | 64px | 5KB |

## Alt Text - Buenas Practicas

### Productos de Bazar
- MAL: "imagen" / "foto" / "product123.jpg"
- BIEN: "Organizador de cocina blanco con 3 compartimentos"
- BIEN: "Set de 4 bowls de ceramica color pastel para ensalada"
- BIEN: "Lampara de escritorio LED con base de madera natural"

### Reglas
1. Describir QUE es el producto
2. Incluir color, material, cantidad si aplica
3. Incluir keyword natural del producto
4. No empezar con "imagen de" o "foto de"
5. Maximo 125 caracteres
6. Imagenes decorativas: alt="" (vacio)

## Lazy Loading
- Aplicar loading="lazy" a todas las imagenes below the fold
- Las primeras 3 imagenes (above the fold) deben cargar inmediato
- Agregar width y height para evitar layout shift (CLS)

```html
<!-- Above the fold (sin lazy) -->
<img src="hero.webp" width="1920" height="600" alt="Bazar moderno Valsho">

<!-- Below the fold (con lazy) -->
<img src="producto.webp" loading="lazy" width="400" height="400" alt="Bowl ceramica pastel">
```

## Naming Convention
- Usar palabras descriptivas separadas por guiones
- Incluir keyword del producto
- Sin espacios, tildes ni caracteres especiales

```
MAL:  IMG_20240315_001.jpg
MAL:  producto (1).png
BIEN: organizador-cocina-blanco-3-niveles.webp
BIEN: bowl-ceramica-pastel-set-4.webp
BIEN: lampara-escritorio-led-madera.webp
```

## Herramientas de Compresion
- Squoosh (web): squoosh.app
- TinyPNG (web): tinypng.com
- Sharp (Node.js): npm install sharp
- ImageOptim (Mac): imageoptim.com

## Checklist Rapido para Fotos de Productos
- [ ] Formato WebP (o JPEG si no hay soporte)
- [ ] Peso < 150KB
- [ ] Ancho maximo 800px para producto individual
- [ ] Alt text descriptivo con keyword
- [ ] Nombre de archivo descriptivo
- [ ] width y height declarados en HTML
- [ ] loading="lazy" si esta below the fold
- [ ] Fondo limpio y buena iluminacion
- [ ] Multiples angulos del producto
