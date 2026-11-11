# Trabajamos como historiadores

Sitio del trabajo práctico de Historia para 4° año 1° de la Escuela Técnica N° 4 de Añatuya (Santiago del Estero), Muestra 2026. Reúne la consigna para el aula y un taller para ensayar el oficio del historiador antes de escribir la carpeta.

## Cómo abrirlo

No hay paso de compilación. Desde la raíz del proyecto, levantá un servidor estático:

```bash
python -m http.server 8080
```

Abrí [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

También podés abrir `index.html` directo en el navegador. Las fuentes Libre Baskerville y Source Sans 3 se cargan desde Google Fonts: hace falta conexión para ver la tipografía prevista. Sin conexión, el navegador usa las fuentes de respaldo.

## Qué incluye

La página recorre la consigna en este orden:

1. Afiche
2. Objetivos
3. Consigna
4. Pasos de la investigación
5. Taller
6. Entrega

El taller tiene dos actividades, y ninguna reemplaza la entrega en carpeta o en Word:

- **Clasificar fuentes.** Ocho pistas para decidir si son orales, escritas, materiales o visuales. Al elegir, la pista se cierra y muestra si la respuesta fue correcta.
- **Línea de tiempo.** Hasta cuatro hitos por tramo: nivel inicial, primaria y técnica. Hay un ejemplo para cargar y un botón para vaciar la línea.

## Dónde queda lo del taller

Las respuestas y los hitos se guardan en `localStorage` del navegador, con la clave `tp2-historiadores`. Quedan solo en ese navegador y en ese equipo. Si el navegador no puede guardar, la actividad sigue en memoria mientras la página esté abierta.

## Estructura

```text
index.html       Textos, secciones y marcado de la página
css/estilos.css  Aspecto: claymorphism, paleta crema y verde bosque
js/app.js        Clasificador de fuentes, línea de tiempo y guardado
```

## Uso en el navegador

La página está en español (`lang="es"`). Incluye un enlace «Saltar al contenido» y un contorno visible al moverse con el teclado.
