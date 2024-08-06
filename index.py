from flask import Flask, render_template, request, redirect, url_for, session
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'tu_secreto_aleatorio' 
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=15) 

@app.route('/')
def home():
    return render_template("Home.html")

@app.route('/nosotros')
def about():
    return render_template("Nosotros.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email == "test@example.com" and password == "password":
            session['usuarioId'] = 'id_del_usuario' 
            return redirect(url_for('alumnos'))
        else:
            return render_template("Login.html", error="Credenciales incorrectas")
    return render_template("Login.html")

@app.route('/logout')
def logout():
    session.pop('usuarioId', None)
    return redirect(url_for('login'))

@app.route('/cursos')
def courses():
    return render_template("Cursos.html")

@app.route('/CambiarContraseña') 
def camb():
    return render_template("cambiarcontrasenia.html")

@app.route('/alumnos')
def alumnos():
    return render_template("Alumnos.html")

@app.route('/perfil')
def profile():
    return render_template("Perfil.html")

@app.route('/tarea')
def task():
    return render_template("Tarea.html")

@app.route('/register')
def register():
    course = request.args.get('course')
    return render_template("Register.html", course=course)

if __name__ == '__main__':
    app.run(debug=True)