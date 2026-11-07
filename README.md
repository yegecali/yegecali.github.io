# Yemi Genderson — React Portfolio

React + Vite single-page portfolio with Spanish/English toggle, responsive layout and JSON-driven content.

## Local development

```bash
cd portfolio
npm ci
npm run dev
npm run build
```

## SEO y publicación

`npm run build` comprueba TypeScript, genera el frontend y prerenderiza el contenido del JSON dentro de `dist/index.html`. El resultado es estático y compatible con GitHub Pages: el nombre, la biografía y los proyectos son legibles sin JavaScript. React hidrata ese HTML para conservar el idioma, los filtros, AOS y particles.js. En desarrollo se mantiene el renderizado habitual del cliente.

`build/seo.ts` genera la URL canónica, la directiva de indexación, Open Graph, Twitter Cards, JSON-LD de `ProfilePage` y `Person`, un favicon y `dist/sitemap.xml`. Los valores configurables están en `metadata` del JSON, especialmente `siteUrl`. Esa URL también determina la base de los assets de Vite; actualízala al conectar un dominio propio. No se anuncian URLs alternativas de idioma porque el cambio de idioma actual usa la misma página.

`build/prerender.tsx` comprueba el contenido y los metadatos al terminar. El build falla si faltan la identidad, la biografía, los proyectos, el encabezado principal, el canonical, los datos estructurados o el sitemap. `.prerender/` es una carpeta temporal ignorada por Git; solo se publica `dist/`.

Para que Google conozca la versión publicada:

1. Haz commit y push a `gp-portfolio-build` y espera que termine el Action y la publicación de GitHub Pages.
2. Añade la propiedad de prefijo de URL `https://yegecali.github.io/` en Google Search Console.
3. Si Google solicita una etiqueta HTML, copia únicamente el valor del token en `metadata.searchConsoleVerification`, vuelve a publicar y completa la verificación.
4. Envía `https://yegecali.github.io/sitemap.xml` desde la sección Sitemaps y solicita indexación mediante Inspección de URL.

La indexación y la posición dependen del buscador; el build no confirma la inclusión en Google. En este sitio de proyecto, un archivo en `/yegecali/robots.txt` no controla el rastreo: `robots.txt` debe estar en la raíz del dominio (`https://yegecali.github.io/robots.txt`). El generador solo emite ese archivo si el sitio se configura en la raíz. La ausencia de un robots.txt no bloquea por sí sola este portfolio.

## Estructura y datos

```text
src/
  data/portfolio.json          # Todo el contenido y la configuración visual
  data/portfolio.ts            # Carga y validación de referencias del JSON
  types/                       # Modelos de datos y tipos de particles.js
  context/PortfolioContext.tsx # Datos compartidos, idioma y filtros
  components/                  # Header, perfil y secciones del portfolio
    common/                    # Iconos, enlaces, títulos y etiquetas reutilizables
  hooks/                       # AOS y copia al portapapeles
  App.tsx                      # Composición de la página
  main.tsx                     # Arranque con PortfolioProvider
  styles/                      # SCSS por componente, base y animaciones
```

`PortfolioProvider` importa `src/data/portfolio.json` antes del primer render y lo distribuye mediante `usePortfolio()`. La carga es local e inmediata; no requiere una petición HTTP ni muestra secciones con datos incompletos. Vite incluye el JSON en el build. Después de editarlo, vuelve a compilar para publicar los cambios.

Edita únicamente el JSON para cambiar:

- `profile`, `brand`, `socials`: identidad, monograma y enlaces.
- `navigation`, `sections`: navegación y encabezados compartidos.
- `projects`, `projectFilters`, `skills`: proyectos, categorías y tecnologías.
- `translations.es` y `translations.en`: todos los textos y etiquetas accesibles.
- `metadata`: título y descripción del HTML inicial y de la página al cambiar de idioma.
- `effects`: opciones de AOS y particles.js.

Cada proyecto contiene su propio `id`, `category`, `displayName`, `icon`, `tone`, `url`, `description` e información de etiquetas. No depende de su posición en el arreglo; puedes reordenar o agregar proyectos y el contador se calcula automáticamente. `category` debe coincidir con el `id` de un filtro. Las claves `labelKey`, `descriptionKey` y `actionKey` apuntan a textos de `translations`.

Iconos disponibles en `components/common/Icon.tsx`: `activity`, `cloud`, `code`, `database`, `github`, `layers`, `linkedin`, `shield` y `terminal`. Colores de proyectos: `teal`, `purple`, `amber` y `blue`.

Los iconos se gestionan con `react-icons`: los de interfaz usan la colección `react-icons/lu` y las marcas GitHub/LinkedIn usan `react-icons/fa6`. Todos pasan por el componente común `Icon`, que acepta `size`, `color`, `className`, `title` y props SVG. También están disponibles las claves de interfaz `arrow-right`, `arrow-up-right`, `sparkles`, `map-pin`, `copy`, `check` y `globe`.

```tsx
import Icon from './common/Icon'

<Icon name="github" size={24} />
```

Para cambiar un icono existente, cambia su asignación en `Icon.tsx`; para agregar una clave, inclúyela también en `iconNames` de `types/portfolio.ts`. TypeScript verifica que cada clave tenga un componente asignado. Los iconos decorativos se ocultan de los lectores de pantalla; puedes darles un nombre accesible con `title` o `aria-label` cuando lo necesiten.

La base de Vite es `/` para GitHub Pages: `https://yegecali.github.io/`.

## TypeScript

Todo el código de la aplicación y la configuración de Vite está en `.ts` o `.tsx`. `tsconfig.json` activa modo estricto, comprobación de accesos indexados y detección de variables y parámetros sin usar.

```bash
npm run typecheck  # Comprueba los tipos sin generar archivos
npm run build      # Comprueba los tipos y genera dist/
```

El Action existente ejecuta `npm run build`, por lo que también comprueba los tipos antes de publicar. `src/types/portfolio.ts` define los modelos del contexto, las props y el contenido a partir del JSON; también limita iconos, colores y claves de traducción. `src/data/portfolio.ts` comprueba las referencias de texto, idiomas, iconos y colores antes de usar los datos. Los tipos de la API global de particles.js están en `src/types/particles.d.ts`.

Los comandos de desarrollo y la edición de `portfolio.json` siguen siendo los mismos.

## Estilos SCSS

`src/main.tsx` importa únicamente `styles/main.scss`, que reúne los módulos con `@use`, incluida la hoja de AOS. Vite compila Sass al ejecutar los comandos habituales; no necesitas generar CSS manualmente.

```text
styles/
  main.scss                 # Entrada de todos los estilos
  abstracts/
    _tokens.scss            # Colores, tipografías, ancho y breakpoints
    _mixins.scss            # Responsive y preferencias de movimiento
    _index.scss             # Exportaciones compartidas con @forward
  base/                     # Reset, keyframes y efectos de interacción
  layout/_page.scss         # Contenedor y distribución de la página
  components/               # Header, perfil, retrato, proyectos, etc.
  vendors/_aos.scss         # Ajustes de las animaciones AOS
```

Los estilos responsive permanecen en el archivo de cada componente. Para cambiar colores o tipografías compartidas, edita `abstracts/_tokens.scss`; para ajustar una sección, abre su archivo en `components/`.

Ejemplo de un módulo:

```scss
@use '../abstracts' as *;

.example {
  color: $accent;

  @include down(mobile) {
    padding: 16px;
  }
}
```

Los breakpoints disponibles son `small`, `mobile`, `tablet` y `wide`. También puedes usar `up(...)`, `fine-pointer`, `motion-safe` y `reduced-motion`.

## Animaciones y fondo

- React Spring (`@react-spring/web`) controla la inclinación, elevación y pulsación de enlaces y tarjetas, las entradas/salidas de proyectos al filtrar y el indicador del filtro seleccionado. Los acentos del título, perfil y contacto flotan durante un número limitado de ciclos.
- `context/MotionContext.tsx` centraliza la preferencia de movimiento reducido y la visibilidad de la pestaña. `components/motion/` contiene los elementos reutilizables y `hooks/useInteractiveSpring.ts` el comportamiento compartido. `styles/vendors/_react-spring.scss` evita que CSS y Spring animen simultáneamente el mismo transform.
- La configuración está en `effects.spring` del JSON: `enabled`, `config` (masa, tensión y fricción), `tiltDegrees`, `hoverLift`, `pressScale`, `transitionOffset`, `trail` y los parámetros `float*`. El movimiento reducido se respeta incluso si `enabled` está activo. La inclinación se limita a punteros precisos; los enlaces también reaccionan al foco del teclado.
- `hooks/useAos.ts` inicializa AOS una vez. Los componentes usan `data-aos="portfolio-up"` y retardos en incrementos de 50 ms; los filtros y el idioma refrescan las posiciones. Recarga la página después de modificar las opciones de inicio de AOS en el JSON.
- `components/ParticlesBackground.tsx` consume `effects.particles`. Ajusta `mobileCount`, `config.particles.number.value`, `color.value`, `line_linked` o `move.speed` desde el JSON. La configuración se clona para evitar que la biblioteca modifique los datos compartidos.
- Las partículas se pausan al ocultar la pestaña y se desactivan con movimiento reducido. El fondo no intercepta clics ni desplazamiento.

## Publicación en GitHub Pages

La rama de trabajo es `develop`. Un push a esa rama ejecuta
`.github/workflows/deploy.yml`, que:

1. Instala las dependencias con Node.js 22 y `npm ci`.
2. Ejecuta `npm run build`: genera el CV, comprueba TypeScript, compila y prerenderiza.
3. Verifica que el HTML, los assets y el PDF estén presentes en `dist/`.
4. Publica únicamente los archivos estáticos en `main` y `master`.
5. Solicita una reconstrucción de GitHub Pages mediante su API.

El repositorio `yegecali/yegecali.github.io` está configurado para publicar desde
`master / (root)` con **Deploy from a branch**. El sitio queda disponible en
https://yegecali.github.io/. La ejecución separada **pages build and deployment**
confirma la publicación en Pages; revisa ambas ejecuciones en Actions.

La solicitud explícita del paso 5 evita depender de que un push con `GITHUB_TOKEN`
dispare Pages. El token del workflow usa `contents: write` para las ramas y
`pages: write` para solicitar la reconstrucción. No cambia la configuración ni
las reglas del entorno `github-pages`, que admite únicamente `master`.

El workflow no ejecuta `actions/deploy-pages` desde `develop`: esa rama no está
permitida por las reglas actuales del entorno. El despliegue real lo realiza
Pages desde `master`, conservando la configuración existente.

Los cambios locales necesitan commit y push a `develop`; ejecutar el build local
no publica el sitio. También existe `workflow_dispatch` para ejecución manual,
si GitHub muestra ese workflow en la interfaz. Las rutas de assets, del CV, el
canonical y el sitemap se calculan desde `metadata.siteUrl`.

Referencia: [configuración de la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
y [API de reconstrucción de Pages](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build).

## Professional experience

`src/data/portfolio.json` contains the bilingual `experience` entries (employers,
roles, dates, responsibilities and recognition) and `education`.
Use `endYear: null` for an ongoing role. The section appears before personal
projects; technical details expand with native, keyboard-accessible disclosures.
Employer initials are text identifiers, not official logos. Build-time prerender
checks ensure employer, experience summary and education content remains in the static HTML.

## CV generado automáticamente

El CV se construye con Node.js y PDFKit a partir de `src/data/portfolio.json`.
No requiere Python, un navegador ni servicios externos.

- `npm run dev`: el plugin `build/cv.ts` genera el PDF antes de servir la página.
  Al guardar cambios en el JSON, se regenera también durante los reinicios
  automáticos de configuración de Vite. No requiere un reinicio manual.
- `npm run build`: el hook `prebuild` genera el CV antes del build. Vite copia el
  archivo de `public/` a `dist/`, listo para GitHub Pages.
- `npm run generate:cv`: regenera únicamente el CV, sin iniciar el servidor.

El script está en `scripts/generate-cv.mjs`. Usa `defaultLanguage` para el idioma e
incluye perfil ampliado, habilidades clave, experiencia completa (`highlights`
y `details`), una sección visible de logros y reconocimientos (`recognition`),
competencias técnicas agrupadas y formación. Los proyectos personales se muestran
únicamente en la web. El diseño sigue `public/cv/example.pdf`: formato Letter,
tipografía Times, encabezado centrado, separadores negros y fechas a la derecha.
La paginación se adapta al contenido, sin recortar responsabilidades para
forzarlo a dos páginas. No incluye nombres de proyectos laborales.

`profile.cv.fullName`, `profile.cv.location` y `profile.cv.phone` definen los
datos del encabezado del CV; los valores iniciales proceden del ejemplo.
`profile.cv.content.es/en` contiene el perfil profesional, las habilidades clave
y las competencias ampliadas específicas del CV. Su campo `experience`, por ID
de empresa, conserva las responsabilidades y logros detallados del documento
original; las empresas, cargos y fechas siguen viniendo de `experience`. La web
conserva sus descripciones más breves.

La ruta de salida es `profile.cv.path`, relativa a `public/`; el botón **Descargar
CV** usa esa misma ruta con `import.meta.env.BASE_URL`, también en Pages con un
subdirectorio. `profile.cv.filename` define el nombre de descarga. No edites el
PDF a mano: se reemplaza con cada generación, únicamente al terminar con éxito.
Si los datos son inválidos, el inicio de Vite o `prebuild` fallan; se conserva
siempre el último PDF válido. Corrige los datos y, si Vite se detuvo por un error
de configuración, vuelve a ejecutar `npm run dev`.

El workflow de Pages ejecuta `npm ci` y `npm run build`, y verifica que el PDF
exista en `dist/` antes de publicar. No necesita pasos adicionales de instalación.

## Temas claro y oscuro

El botón de sol y luna en la cabecera alterna directamente entre claro y oscuro. El monitor permite volver a la preferencia del sistema. La elección se guarda en el navegador, se mantiene al recargar y se sincroniza entre pestañas.

La configuración está en `appearance` del JSON, los textos en `translations`, la lógica en `context/ThemeContext.tsx` y la paleta clara en `styles/themes/_palettes.scss`. La inicialización del tema se genera en la cabecera del HTML para evitar destellos antes de cargar React.
