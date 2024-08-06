document.addEventListener('DOMContentLoaded', function () {
    var studentId = localStorage.getItem('usuarioId');
    var course = localStorage.getItem('usuarioCurso');

    if (studentId && course) {
        var urlTareas = `https://loginregister-c1df2-default-rtdb.firebaseio.com/tarea/${studentId}/${course}.json`;

        fetch(urlTareas)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (data) {
                if (data) {
                    var tareasContainer = document.getElementById('tareas-container');

                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            var tareaItem = document.createElement('div');
                            tareaItem.classList.add('col-md-6', 'tarea-item');

                            var tareaNombre = document.createElement('h3');
                            tareaNombre.textContent = data[key].nombre;
                            tareaNombre.classList.add('tarea-nombre');
                            tareaNombre.addEventListener('click', function () {
                                var descripcionContainer = this.nextElementSibling;
                                descripcionContainer.classList.toggle('show');
                            });
                            tareaItem.appendChild(tareaNombre);

                            var tareaDescripcionContainer = document.createElement('div');
                            tareaDescripcionContainer.classList.add('descripcion', 'hidden');

                            var tituloDescripcion = document.createElement('p');
                            tituloDescripcion.textContent = "Descripción";
                            tituloDescripcion.classList.add('titulo-descripcion');
                            tareaDescripcionContainer.appendChild(tituloDescripcion);

                            var descripcionApi = document.createElement('p');
                            descripcionApi.textContent = data[key].descripcion;
                            tareaDescripcionContainer.appendChild(descripcionApi);

                            var otraDescripcionApi = document.createElement('p');
                            otraDescripcionApi.textContent = data[key].otra_descripcion;
                            tareaDescripcionContainer.appendChild(otraDescripcionApi);

                            if (data[key].video) {
                                var tareaVideo = document.createElement('iframe');
                                tareaVideo.src = data[key].video;
                                tareaVideo.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
                                tareaVideo.allowFullscreen = true;
                                tareaItem.appendChild(tareaVideo);
                            }

                            tareaItem.appendChild(tareaDescripcionContainer);
                            tareasContainer.appendChild(tareaItem);
                        }
                    }
                } else {
                    var mensajeError = document.createElement('p');
                    mensajeError.textContent = "No se encontraron tareas para este alumno.";
                    tareasContainer.appendChild(mensajeError);
                }
            })
            .catch(function (error) {
                console.error('Error fetching tareas:', error);
                var mensajeError = document.createElement('p');
                mensajeError.textContent = "Ha ocurrido un error al obtener las tareas. Por favor, intenta nuevamente.";
                tareasContainer.appendChild(mensajeError);
            });
    } else {
        console.error('No se proporcionó un ID de alumno o curso.');
        var mensajeError = document.createElement('p');
        mensajeError.textContent = "No se proporcionó un ID de alumno o curso.";
        document.getElementById('tareas-container').appendChild(mensajeError);
    }
});
