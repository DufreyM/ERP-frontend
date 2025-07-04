
# EconoFarma Frontend

Este es el frontend del sistema de gestión de empresas para **EconoFarma**, desarrollado para gestionar las operaciones de una farmacia localizada en el interior de Guatemala. Esta interfaz gráfica permite visualizar, ingresar y manipular datos en tiempo real a través de una SPA moderna.

---

## Tecnologías Utilizadas

- **React** `^19.0.0`
- **React DOM** `^19.0.0`
- **Vite** `~6.2.0`
- **@vitejs/plugin-react** `^4.3.0`

---

## Instalación

### 1. Clona el repositorio
```bash
git clone https://github.com/DufreyM/ERP-frontend.git
cd src
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Corre el servidor de desarrollo
```bash
npm run dev
```

---

## Scripts útiles

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Buenas prácticas

- Usa componentes reutilizables y bien nombrados.
- Mantén el código limpio y documentado.
- Sigue la estructura modular.
- Cada archivo debe incluir encabezado con nombre, descripción y autoría.

---

## Contribuciones

Las contribuciones deben realizarse mediante ramas tipo `feature/`, y hacer pull request hacia `develop`.

---

## 🐳 Guía para usar Docker en el proyecto

### Inicialización del entorno (Docker)

1. Asegúrate de que **Docker Desktop** esté ejecutándose.  
   > *(Nota: Puedes buscar “Docker Desktop” en el menú de inicio de Windows y abrir la aplicación manualmente, al menos es de esta manera en el caso de windows.)*

2. Abre dos terminales (por ejemplo, utilizando **Windows Terminal** o **CMD/Powershell**):
   - Una ubicada en la carpeta backend
   - Otra en la carpeta frontend

3. En **cada terminal**, ejecuta el siguiente comando:
   
bash
   docker-compose up --build

   Este comando compilará e iniciará los contenedores correspondientes para cada servicio.

4. Espera a que se completen los procesos de construcción e inicio.  
   Docker se encargará del resto automáticamente. ✅

---

### Apagar los contenedores

**Opción 1 – Desde la misma terminal:**  
Presiona Ctrl + C en la terminal donde está corriendo Docker. Luego espera a que los contenedores se detengan correctamente.

**Opción 2 – Desde otra terminal (preferida):**
bash
docker-compose down


> Esta opción es la mejor debido a que detiene los contenedores de forma más ordenada y segura.

---

### Reiniciar sin recompilar

Si no se ha modificado el código fuente y simplemente se desea reiniciar los contenedores, puedes usar el siguiente comando (sin la opción --build):

bash
docker-compose up


Esto reutilizará las imágenes ya construidas, lo que acelera el proceso de inicio.
---

## 📄 Licencia

Proyecto académico desarrollado por estudiantes del Grupo No. 7 del curso de Ingeniería de Software de la Universidad del Valle de Guatemala.

