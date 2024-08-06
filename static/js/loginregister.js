document.addEventListener('DOMContentLoaded', () => {
  const loginToggle = document.getElementById("login-toggle");
  const signupToggle = document.getElementById("signup-toggle");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const signupCourseInput = document.getElementById("signupCourse");

  const urlRegistro = "https://loginregister-c1df2-default-rtdb.firebaseio.com/registro.json";
  const urlCursos = "https://loginregister-c1df2-default-rtdb.firebaseio.com/cursos.json";

  const fetchJSON = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw new Error('Error de red. Inténtalo de nuevo.');
    }
  };

  const updateButtonStyles = (activeButton, inactiveButton) => {
    activeButton.style.backgroundColor = "#1c4c96";
    activeButton.style.color = "#fff";
    inactiveButton.style.backgroundColor = "#fff";
    inactiveButton.style.color = "#222";
  };

  const showForm = (formToShow, formToHide) => {
    formToHide.style.display = "none";
    formToShow.style.display = "block";
  };

  const getCourseFromURL = () => new URLSearchParams(window.location.search).get('course');

  const verificarCompraCurso = () => getCourseFromURL() !== null && getCourseFromURL() !== "";

  window.toggleSignup = async () => {
    if (verificarCompraCurso()) {
      updateButtonStyles(signupToggle, loginToggle);
      showForm(signupForm, loginForm);
      signupCourseInput.value = getCourseFromURL();
    } else {
      alert("Debes comprar un curso primero para poder registrarte.");
    }
  };

  window.toggleLogin = () => {
    updateButtonStyles(loginToggle, signupToggle);
    showForm(loginForm, signupForm);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const data = await fetchJSON(urlRegistro);
      const registro = Object.entries(data).find(([key, value]) => value.email === email && value.password === password);

      if (registro) {
        const [registroId, usuario] = registro;
        localStorage.setItem('usuarioId', registroId);
        localStorage.setItem('usuarioCurso', usuario.course);
        await asignarTareas(usuario.course);
        window.location.href = "alumnos";
      } else {
        alert("Credenciales inválidas. Por favor, intenta nuevamente.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const fullname = document.getElementById("signupFullname").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const course = signupCourseInput.value;
    const foto = "base64fotourllarga";

    if (!fullname || !email || !password || !course) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validatePassword(password)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y una minúscula.");
      return;
    }

    if (!verificarCompraCurso()) {
      alert("Debes comprar un curso antes de poder registrarte.");
      return;
    }

    try {
      const data = await fetchJSON(urlRegistro);
      if (Object.values(data).some(user => user.email === email)) {
        alert("Este usuario ya fue registrado.");
        return;
      }

      const newUser = { fullname, email, password, course, foto };

      const cursosData = await fetchJSON(urlCursos);
      if (!Object.values(cursosData).some(curso => curso.nombre === course)) {
        await fetch(urlCursos, {
          method: 'POST',
          body: JSON.stringify({ nombre: course }),
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await registrarUsuario(newUser);
    } catch (error) {
      alert(error.message);
    }
  };

  const registrarUsuario = async (newUser) => {
    try {
      await fetch(urlRegistro, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' }
      });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      await asignarTareas(newUser.course);
    } catch (error) {
      alert("Ha ocurrido un error al registrar el usuario. Por favor, intenta nuevamente.");
      console.error("Error al registrar usuario:", error);
    }
  };

  const asignarTareas = async (course) => {
    const studentId = localStorage.getItem('usuarioId');
    const urlTareas = `https://loginregister-c1df2-default-rtdb.firebaseio.com/tarea/${studentId}/${course}.json`;

    const tareas = {
      "tarea1": {
        "nombre": `Introducción a ${course}`,
        "descripcion": `Lee el material introductorio y realiza el quiz. Familiarízate con los conceptos básicos de ${course}.`
      },
      "tarea2": {
        "nombre": `Proyecto de ${course}`,
        "descripcion": `Desarrolla un proyecto pequeño utilizando los conocimientos adquiridos en ${course}.`
      },
      "tarea3": {
        "nombre": `Investigación sobre ${course}`,
        "descripcion": `Investiga más a fondo sobre las tecnologías y herramientas utilizadas en ${course}. Prepara un informe detallado.`
      },
      "tarea4": {
        "nombre": `Desafío avanzado en ${course}`,
        "descripcion": `Enfrenta un desafío avanzado en ${course} y pon a prueba tus habilidades.`
      }
    };

    try {
      await fetch(urlTareas, {
        method: 'PUT',
        body: JSON.stringify(tareas),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Tareas asignadas exitosamente.");
    } catch (error) {
      alert("Ha ocurrido un error al asignar tareas. Por favor, intenta nuevamente.");
      console.error("Error al asignar tareas:", error);
    }
  };
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

  document.getElementById('loginButton').addEventListener('click', handleLogin);
  document.getElementById('signupButton').addEventListener('click', handleSignup);
});
