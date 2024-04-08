# FusiumFulnes

## Installation:

Para empezar, es necesario instalar las dependencias. Puede hacerlo ejecutando el siguiente comando en su terminal: Este comando instalará automáticamente todas las dependencias requeridas para el proyecto. Asegúrese de tener Node.js y npm (Node Package Manager) instalados en su máquina antes de ejecutar este comando.

```
npm install
```
## Ejecutar el backend
Una vez que se completa la instalación, puede ejecutar el backend de la aplicación con el siguiente comando:

```
npm run dev
```
## End-points 
Estos son los endpoints que utiliza la aplicación, donde se pueden realizar diversas consultas:

### Crear user
```
localhost:3000/user
```
1. Post: Register a user 
```
{
"email": "",
"password":""
}
```
2. Get: Obtener todos los usuarios registrados
3. Get/:id Obtener usuario por id
4. Delete/:id Eliminar usuario por id

### Crear blog
```
localhost:3000/blog
```
1. Post: Register a blog
```
{
"email": "",
"password":""
}
```
2. Get: Obtener todos los blogs registrados
3. Get/:id Obtener blog por id
4. Delete/:id Eliminar blog por id

### Crear type
```
localhost:3000/type
```
1. Post: Register a type
```
{
"email": "",
"password":""
}
```
2. Get: Obtener todos los types registrados
3. Get/:id Obtener type por id
4. Delete/:id Eliminar type por id

### Crear comment
```
localhost:3000/comment
```
1. Post: Register a comment
```
{
"email": "",
"password":""
}
```
2. Get: Obtener todos los comment registrados
3. Get/:id Obtener comment por id
4. Delete/:id Eliminar comment por id

### Crear register
```
localhost:3000/register
```
1. Post: Register a register
```
{
"email": "",
"password":""
}
```
2. Get: Obtener todos los register registrados
3. Get/:id Obtener register por id
4. Delete/:id Eliminar register por id


#


- Los endpoints de [CREATE, UPDATE, STATUS and DELETE] solo pueden ser utilizados por usuarios administradores, por lo tanto en la cabezera habra que enviarle el role del usuario, si es "admin" entonces podra usar el endpoint, sino arrojara un error de acceso.
Asi se leera el role desde el backend : "req.headers.authorization"