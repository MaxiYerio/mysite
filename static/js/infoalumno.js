document.addEventListener('DOMContentLoaded', function () {

  var studentId = localStorage.getItem('usuarioId');

  if (studentId) {
    var url = "https://loginregister-c1df2-default-rtdb.firebaseio.com/registro/" + studentId + ".json";


    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data) {

          document.getElementById("fullname").textContent = data.fullname;
          document.getElementById("fullnamep").textContent = data.fullname;
          document.getElementById("email").textContent = data.email;
          document.getElementById("course").textContent = data.course;
          document.getElementById("coursep").textContent = data.course;

          if (data.foto) {
            document.getElementById("foto").src = data.foto;
          } else {
            document.getElementById("foto").alt = "No se proporcionó una foto.";
          }
        } else {
          alert("No se encontraron datos para este alumno.");
        }
      })
      .catch(function (error) {
        alert("Ha ocurrido un error. Por favor, intenta nuevamente.");
        console.error(error);
      });
  } else {
    alert("No se proporcionó un ID de alumno.");
  }
});
