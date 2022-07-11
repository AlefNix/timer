document.addEventListener("DOMContentLoaded", () => {
	const $tiempoRestante = document.querySelector("#tiempoRestante"),
		$btnIniciar = document.querySelector("#btnIniciar"),
		$btnPausar = document.querySelector("#btnPausar"),
		$btnDetener = document.querySelector("#btnDetener"),
		$horas = document.querySelector("#horas")
		$minutos = document.querySelector("#minutos"),
		$segundos = document.querySelector("#segundos"),
		$contenedorInputs = document.querySelector("#contenedorInputs");
	let idInterval = null, diferenciaTemporal = 0,
		fechaFuturo = null;
	const cargarSonido = function (fuente) {
		const sonido = document.createElement("audio");
		sonido.src = fuente;
		sonido.setAttribute("preload", "auto");
		sonido.setAttribute("controls", "none");
		sonido.style.display = "none";
		document.body.appendChild(sonido);
		return sonido;
	};

	const sonido = cargarSonido("timer.wav");
	const ocultarElemento = elemento => {
		elemento.style.display = "none";
	}

	const mostrarElemento = elemento => {
		elemento.style.display = "";
	}

	const iniciarTemporizador = (horas,minutos, segundos) => {
		ocultarElemento($contenedorInputs);
		mostrarElemento($btnPausar);
		ocultarElemento($btnIniciar);
		ocultarElemento($btnDetener);
		if (fechaFuturo) {
			fechaFuturo = new Date(new Date().getTime() + diferenciaTemporal);
			diferenciaTemporal = 0;
		} else {
			const milisegundos = ((horas*60*60)+segundos + (minutos * 60)) * 1000;
			fechaFuturo = new Date(new Date().getTime() + milisegundos);
		}
		clearInterval(idInterval);
		idInterval = setInterval(() => {
			const tiempoRestante = fechaFuturo.getTime() - new Date().getTime();
			if (tiempoRestante <= 0) {
				clearInterval(idInterval);
				sonido.play();
				ocultarElemento($btnPausar);
				mostrarElemento($btnDetener);
			} else {
				$tiempoRestante.textContent = milisegundosAMinutosYSegundos(tiempoRestante);
			}
		}, 50);
	};

	const pausarTemporizador = () => {
		ocultarElemento($btnPausar);
		mostrarElemento($btnIniciar);
		mostrarElemento($btnDetener);
		diferenciaTemporal = fechaFuturo.getTime() - new Date().getTime();
		clearInterval(idInterval);
	};

	const detenerTemporizador = () => {
		clearInterval(idInterval);
		fechaFuturo = null;
		diferenciaTemporal = 0;
		sonido.currentTime = 0;
		sonido.pause();
		$tiempoRestante.textContent = "00:00:00.0";
		init();
	};

	const agregarCeroSiEsNecesario = valor => {
		if (valor < 10) {
			return "0" + valor;
		} else {
			return "" + valor;
		}
	}
	const milisegundosAMinutosYSegundos = (milisegundos) => {
		const minutos = parseInt(milisegundos / 1000 / 60);
		horas = minutos/60;
		milisegundos -= minutos * 60 * 1000;
		segundos = (milisegundos / 1000);
		return `${Math.floor(agregarCeroSiEsNecesario(horas))}:${agregarCeroSiEsNecesario(minutos % 60)}:${agregarCeroSiEsNecesario(segundos.toFixed(1))}`;
	};
	const init = () => {
		$horas.value= "";
		$minutos.value = "";
		$segundos.value = "";
		mostrarElemento($contenedorInputs);
		mostrarElemento($btnIniciar);
		ocultarElemento($btnPausar);
		ocultarElemento($btnDetener);
	};


	$btnIniciar.onclick = () => {
		const horas = parseInt($horas.value)
		const minutos = parseInt($minutos.value);
		const segundos = parseInt($segundos.value);
		if (isNaN(horas) || isNaN(minutos) || isNaN(segundos) || (horas <= 0 && segundos <= 0 && minutos <= 0)) {
			return;
		}
		iniciarTemporizador(horas, minutos, segundos);
	};
	init();
	$btnPausar.onclick = pausarTemporizador;
	$btnDetener.onclick = detenerTemporizador;
});
