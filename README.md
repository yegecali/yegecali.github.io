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

## Deployment

Push to `gp-portfolio-build`. GitHub Actions builds `portfolio/dist` and commits only the generated static site to `gp-portfolio`. Set **Settings → Pages → Build and deployment → Deploy from a branch → gp-portfolio / (root)** once. The site is not published until that setting is enabled. No GitHub Pages workflow is required in the publishing branch.

El workflow se ejecuta con cualquier push a `gp-portfolio-build`, sin filtrar archivos modificados. Un commit local se despliega después de hacer push. Los pull requests hacia esa rama compilan y validan sin publicar.

Para desplegar manualmente, abre **Actions → Build React portfolio and publish to gp-portfolio → Run workflow**, selecciona `gp-portfolio-build` y ejecuta. El despliegue manual siempre usa la versión más reciente de esa rama; `create_release` permite generar además una release opcional. También puedes usar `gh workflow run portfolio-pages.yml --ref gp-portfolio-build`.

GitHub requiere que el archivo del workflow con `workflow_dispatch` exista también en la rama predeterminada para habilitar la ejecución manual. Si no aparece el botón, incorpora ese archivo en la rama predeterminada. [Documentación de GitHub](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow?tool=webui).

### Ruta del sitio en GitHub Pages

El repositorio actual, `yegecali/yegecali`, es un sitio de proyecto y su URL predeterminada es `https://yegecali.github.io/`. Elegir `/(root)` en Settings → Pages selecciona la carpeta de la rama que se publica; no elimina el nombre del repositorio de la URL.

Para publicar en `https://yegecali.github.io/`, el repositorio de destino debe llamarse `yegecali.github.io`. Otra opción es configurar un dominio propio en el proyecto actual. Cambiar únicamente `base` a `/` no cambia la URL asignada por GitHub Pages y rompería la resolución de los assets del despliegue actual.

Cuando el destino esté configurado, actualiza `metadata.siteUrl` en el JSON y ajusta el repositorio de publicación del Action si corresponde. La base de Vite, el canonical y el sitemap se calculan desde esa URL. No renombres el repositorio de perfil `yegecali/yegecali` solo para cambiar Pages: también se utiliza para el README de tu perfil.

Referencia: [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart) y [dominios personalizados](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).


## Validation and releases

Pull requests targeting `gp-portfolio-build` build and upload an artifact without
publishing. Pushes retain the existing publication to `gp-portfolio`.
The workflow uses Node.js 22 and `npm ci` with the committed lockfile.

Run the workflow on `gp-portfolio-build` with `create_release` enabled to publish
and then create a `portfolio-<run_id>.<attempt>` release. It targets the exact
source commit and includes `portfolio.tar.gz` and `SHA256SUMS`. Releases are
optional and are not marked as the latest release of the repository.
The existing `PAGES_DEPLOY_TOKEN` remains necessary for branch-based Pages;
release creation uses `GITHUB_TOKEN` with Contents write permission.

## Professional experience

`src/data/portfolio.json` contains the bilingual `experience` entries (employers,
roles, dates, responsibilities, projects and recognition) and `education`.
Use `endYear: null` for an ongoing role. The section appears before personal
projects; technical details expand with native, keyboard-accessible disclosures.
Employer initials are text identifiers, not official logos. Build-time prerender
checks ensure employer, project and education content remains in the static HTML.

The profile's **Download CV** link serves the PDF from `public/cv/`, using Vite's
base URL for GitHub Pages. Replace that file to update the CV; its relative path
and download filename live in `profile.cv` in `src/data/portfolio.json`.

## Temas claro y oscuro

El botón de sol y luna en la cabecera alterna directamente entre claro y oscuro. El monitor permite volver a la preferencia del sistema. La elección se guarda en el navegador, se mantiene al recargar y se sincroniza entre pestañas.

La configuración está en `appearance` del JSON, los textos en `translations`, la lógica en `context/ThemeContext.tsx` y la paleta clara en `styles/themes/_palettes.scss`. La inicialización del tema se genera en la cabecera del HTML para evitar destellos antes de cargar React.
