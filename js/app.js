(function () {
  "use strict";

  var CLAVE = "tp2-historiadores";

  var TIPOS = [
    { id: "oral", nombre: "Oral" },
    { id: "escrita", nombre: "Escrita" },
    { id: "material", nombre: "Material" },
    { id: "visual", nombre: "Visual" }
  ];

  var PISTAS = [
    {
      id: "mama",
      texto: "«Mi mamá me contó cómo fue mi primer día en la primaria.»",
      tipo: "oral",
      porque: "Es la palabra de un familiar: una memoria contada, no un papel."
    },
    {
      id: "boletin",
      texto: "Un boletín de calificaciones de la primaria.",
      tipo: "escrita",
      porque: "El boletín es un documento escrito que registra el paso por la escuela."
    },
    {
      id: "guardapolvo",
      texto: "El guardapolvo que usaban en el primario.",
      tipo: "material",
      porque: "Es un objeto de la vida escolar: una huella que se puede tocar."
    },
    {
      id: "foto",
      texto: "Una foto del acto del 25 de Mayo en la escuela.",
      tipo: "visual",
      porque: "La fotografía guarda una imagen de ese momento escolar."
    },
    {
      id: "diploma",
      texto: "El diploma de fin de la primaria.",
      tipo: "escrita",
      porque: "El diploma es un documento escrito que certifica un tramo de la trayectoria."
    },
    {
      id: "medalla",
      texto: "Una medalla de un acto escolar.",
      tipo: "material",
      porque: "La medalla es un objeto concreto, testimonio material de un logro."
    },
    {
      id: "video",
      texto: "Un video de una obra de teatro hecha en la escuela.",
      tipo: "visual",
      porque: "El video registra imagen y sonido de un hecho escolar."
    },
    {
      id: "abuela",
      texto: "Una entrevista a la abuela sobre cómo era el jardín.",
      tipo: "oral",
      porque: "La entrevista recoge la palabra de otra persona."
    }
  ];

  var TRAMOS = [
    { id: "jardin", nombre: "nivel inicial" },
    { id: "primaria", nombre: "primaria" },
    { id: "tecnica", nombre: "la técnica" }
  ];

  var EJEMPLO = {
    jardin: [
      "Fui al jardín y todavía recuerdo la canción de la merienda.",
      "La seño nos leía un cuento antes de salir al patio."
    ],
    primaria: [
      "Mi primera maestra y el acto del 25 de Mayo en 1.er grado.",
      "En el boletín de 3.er grado se nota la materia que más me gustaba."
    ],
    tecnica: [
      "Elegí la Escuela Técnica N° 4 por los talleres.",
      "Hasta 4.° año, lo más difícil y lo más gratificante no fueron lo mismo."
    ]
  };

  var MAX_HITOS = 4;
  var state = normalizar(leer());

  document.documentElement.classList.add("js");

  function leer() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) || "null");
    } catch (error) {
      return null;
    }
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(state));
    } catch (error) {
      /* La actividad sigue en memoria si el navegador no guarda. */
    }
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function estadoVacio() {
    return {
      v: 1,
      respuestas: {},
      hitos: { jardin: [], primaria: [], tecnica: [] }
    };
  }

  function normalizar(data) {
    var base = estadoVacio();
    if (!data || typeof data !== "object") return base;

    var ids = {};
    var tipos = {};
    PISTAS.forEach(function (pista) { ids[pista.id] = true; });
    TIPOS.forEach(function (tipo) { tipos[tipo.id] = true; });

    if (data.respuestas && typeof data.respuestas === "object") {
      Object.keys(data.respuestas).forEach(function (id) {
        var tipo = data.respuestas[id];
        if (ids[id] && tipos[tipo]) base.respuestas[id] = tipo;
      });
    }

    TRAMOS.forEach(function (tramo) {
      var lista = data.hitos && data.hitos[tramo.id];
      if (!Array.isArray(lista)) return;
      base.hitos[tramo.id] = lista.slice(0, MAX_HITOS).filter(function (hito) {
        return hito && typeof hito.texto === "string" && hito.texto.trim();
      }).map(function (hito) {
        return {
          id: typeof hito.id === "string" && hito.id ? hito.id : uid(),
          texto: hito.texto.trim().replace(/\s+/g, " ").slice(0, 80)
        };
      });
    });

    return base;
  }

  function pistaPorId(id) {
    return PISTAS.filter(function (pista) { return pista.id === id; })[0];
  }

  function nombreTipo(id) {
    var tipo = TIPOS.filter(function (item) { return item.id === id; })[0];
    return tipo ? tipo.nombre.toLowerCase() : "";
  }

  function renderPistas() {
    var cont = document.getElementById("pistas");
    cont.replaceChildren();
    PISTAS.forEach(function (pista) {
      var art = document.createElement("article");
      art.className = "pista";
      art.dataset.id = pista.id;

      var texto = document.createElement("p");
      texto.className = "pista-texto";
      texto.textContent = pista.texto;

      var grupo = document.createElement("div");
      grupo.className = "tipos";
      grupo.setAttribute("role", "group");
      grupo.setAttribute("aria-label", "Clasificar: " + pista.texto);

      TIPOS.forEach(function (tipo) {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.tipo = tipo.id;
        boton.textContent = tipo.nombre;
        grupo.appendChild(boton);
      });

      var feedback = document.createElement("p");
      feedback.className = "feedback";

      art.append(texto, grupo, feedback);
      cont.appendChild(art);
      pintarPista(pista.id);
    });
  }

  function pintarPista(id) {
    var pista = pistaPorId(id);
    var art = document.querySelector('.pista[data-id="' + id + '"]');
    if (!art || !pista) return;

    var elegido = state.respuestas[id];
    var feedback = art.querySelector(".feedback");
    art.classList.remove("resuelta", "bien", "error");

    art.querySelectorAll("button").forEach(function (boton) {
      boton.disabled = Boolean(elegido);
      boton.classList.remove("ok", "mal", "correcta");
      boton.setAttribute("aria-pressed", boton.dataset.tipo === elegido ? "true" : "false");
      if (!elegido) return;
      if (boton.dataset.tipo === pista.tipo) boton.classList.add("correcta");
      if (boton.dataset.tipo === elegido && elegido === pista.tipo) boton.classList.add("ok");
      if (boton.dataset.tipo === elegido && elegido !== pista.tipo) boton.classList.add("mal");
    });

    if (!elegido) {
      feedback.textContent = "";
      return;
    }

    art.classList.add("resuelta");
    if (elegido === pista.tipo) {
      art.classList.add("bien");
      feedback.textContent = "Acierto. " + pista.porque;
    } else {
      art.classList.add("error");
      feedback.textContent = "Esta pista es una fuente " + nombreTipo(pista.tipo) + ". " + pista.porque;
    }
  }

  function pintarMarcador() {
    var salida = document.getElementById("resultado-fuentes");
    var reintentar = document.getElementById("reintentar");
    var total = PISTAS.length;
    var hechas = Object.keys(state.respuestas).length;

    if (hechas < total) {
      salida.textContent = hechas === 0
        ? "Elijan un tipo para cada pista. Hay 8."
        : "Llevan " + hechas + " de " + total + " pistas.";
      reintentar.hidden = true;
      return;
    }

    var aciertos = PISTAS.filter(function (pista) {
      return state.respuestas[pista.id] === pista.tipo;
    }).length;

    var cierre = aciertos === total
      ? " Las ocho quedaron en su lugar. Así empieza el oficio: reconocer de qué tipo es cada pista."
      : " Pueden reintentar para afinar la mirada.";

    salida.textContent = "Acertaron " + aciertos + " de " + total + "." + cierre;
    reintentar.hidden = false;
  }

  function responder(id, tipo) {
    if (state.respuestas[id]) return;
    state.respuestas[id] = tipo;
    guardar();
    pintarPista(id);
    pintarMarcador();
  }

  function reiniciarClasificador() {
    state.respuestas = {};
    guardar();
    renderPistas();
    pintarMarcador();
  }

  function anunciar(mensaje) {
    var aviso = document.getElementById("aviso-linea");
    aviso.textContent = "";
    window.setTimeout(function () {
      aviso.textContent = mensaje;
    }, 30);
  }

  function renderLinea(animarId) {
    TRAMOS.forEach(function (tramo) {
      var lista = document.querySelector('[data-lista="' + tramo.id + '"]');
      var cupo = document.querySelector('[data-cupo="' + tramo.id + '"]');
      var input = document.getElementById("hito-" + tramo.id);
      var boton = input.form.querySelector("button");
      var items = state.hitos[tramo.id];

      lista.replaceChildren();
      items.forEach(function (hito) {
        var li = document.createElement("li");
        if (hito.id === animarId) li.classList.add("entra");

        var texto = document.createElement("span");
        texto.textContent = hito.texto;

        var quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "quitar";
        quitar.dataset.quitar = hito.id;
        quitar.dataset.tramo = tramo.id;
        quitar.setAttribute("aria-label", "Quitar hito: " + hito.texto);
        quitar.textContent = "Quitar";

        li.append(texto, quitar);
        lista.appendChild(li);
      });

      cupo.textContent = items.length >= MAX_HITOS
        ? "Este tramo ya tiene 4 hitos. Quiten uno si quieren cambiarlo."
        : "Pueden anotar hasta 4 hitos. Van " + items.length + ".";
      input.disabled = items.length >= MAX_HITOS;
      boton.disabled = items.length >= MAX_HITOS;
    });
  }

  function agregarHito(tramo, texto) {
    var limpio = texto.trim().replace(/\s+/g, " ").slice(0, 80);
    if (!limpio || state.hitos[tramo].length >= MAX_HITOS) return null;
    var hito = { id: uid(), texto: limpio };
    state.hitos[tramo].push(hito);
    guardar();
    renderLinea(hito.id);
    var nombre = TRAMOS.filter(function (item) { return item.id === tramo; })[0].nombre;
    anunciar("Hito agregado en " + nombre + ".");
    return hito;
  }

  function quitarHito(tramo, id) {
    state.hitos[tramo] = state.hitos[tramo].filter(function (hito) {
      return hito.id !== id;
    });
    guardar();
    renderLinea();
    anunciar("Hito quitado.");
  }

  function hayHitos() {
    return TRAMOS.some(function (tramo) {
      return state.hitos[tramo.id].length > 0;
    });
  }

  function cargarEjemplo() {
    if (hayHitos() && !window.confirm("Esto reemplaza los hitos que ya escribieron en esta computadora. ¿Siguen?")) {
      return;
    }
    TRAMOS.forEach(function (tramo) {
      state.hitos[tramo.id] = EJEMPLO[tramo.id].map(function (texto) {
        return { id: uid(), texto: texto };
      });
    });
    guardar();
    renderLinea();
    anunciar("Se cargó un ejemplo de muestra.");
  }

  function vaciarLinea() {
    if (!hayHitos()) return;
    if (!window.confirm("¿Vaciar todos los hitos de la línea de tiempo?")) return;
    TRAMOS.forEach(function (tramo) {
      state.hitos[tramo.id] = [];
    });
    guardar();
    renderLinea();
    anunciar("La línea de tiempo quedó vacía.");
  }

  function iniciarRevelado() {
    var nodos = document.querySelectorAll(".revelar");
    if (!("IntersectionObserver" in window)) {
      nodos.forEach(function (nodo) { nodo.classList.add("visible"); });
      return;
    }
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    nodos.forEach(function (nodo) { observador.observe(nodo); });
  }

  document.getElementById("pistas").addEventListener("click", function (event) {
    var boton = event.target.closest("button[data-tipo]");
    if (!boton) return;
    var tarjeta = boton.closest("[data-id]");
    responder(tarjeta.dataset.id, boton.dataset.tipo);
  });

  document.getElementById("reintentar").addEventListener("click", reiniciarClasificador);

  document.getElementById("linea").addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.dataset || !form.dataset.tramo) return;
    event.preventDefault();
    var tramo = form.dataset.tramo;
    var input = form.querySelector("input");
    var error = form.querySelector(".error-campo");
    var hito = agregarHito(tramo, input.value);
    if (!hito) {
      if (state.hitos[tramo].length >= MAX_HITOS) {
        input.value = "";
        return;
      }
      error.textContent = "Escriban un hito corto antes de agregarlo.";
      input.focus();
      return;
    }
    error.textContent = "";
    input.value = "";
    if (!input.disabled) input.focus();
  });

  document.getElementById("linea").addEventListener("click", function (event) {
    var boton = event.target.closest("button[data-quitar]");
    if (!boton) return;
    quitarHito(boton.dataset.tramo, boton.dataset.quitar);
  });

  document.getElementById("ver-ejemplo").addEventListener("click", cargarEjemplo);
  document.getElementById("vaciar-linea").addEventListener("click", vaciarLinea);

  renderPistas();
  pintarMarcador();
  renderLinea();
  iniciarRevelado();
}());
