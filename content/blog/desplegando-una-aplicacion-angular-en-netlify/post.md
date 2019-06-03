---
image: ./main.png
title: Desplegando una aplicación Angular en Netlify
author: Santiago Marcano
date: 05/16/2019
punchline: Simplificar las tareas de despliegue y testing ya sea automatizado o manual es beneficioso para agilizar el flujo de trabajo en el desarrollo. En este artículo veremos como Netlify nos puede ayudar con el despligue con una configuracion prácticamente mínima y unos pocos clicks.
tags: Netlify, Angular, Casquade
---

[Netlify](https://www.netlify.com) es una increíble plataforma para desplegar sitios web estáticos con unos pocos clicks. Una gran ventaja de usar Netlify es la posibilidad de hacer **CI/CD** (continous integration / continous deployment) con una configuración completamente trivial, por no decir nula. También tendremos la posibilidad de tener los certificados SSL en nuestro servidor sin esfuerzo alguno.

Existen plataformas como **CircleCI** para realizar esta tarea en cualquier proveedor de servidores que queramos para personalizar los pipelines de despliegue a conveniencia pero, para proyectos pequeños o personales es más que suficiente. 

En este artículo vamos a servir una aplicación web creada con Angular en un servidor Netlify y que tan simple es realizar **CI/CD** linkeando nuestro servidor de Netlify (completamente gratis) con un repositorio de GitHub.

También es posible apuntar un dominio a este servidor ya sea con un proveedor de dominios externo o con los mismos servicios de Netlify (que no son del todo económicos pero tienen sus ventajas)

Solo hará falta una cuenta en GitHub con algún repositorio con una app de Angular para poder registrarnos en Netlify y desplegar nuestra app.

Primero, ingresamos en la página web de Netlify y nos registramos con GitHub, GitLab o Bickbucket. En mi caso usaré GitHub.

-- imagen del registro de Netlify con Github --

Hacemos click en **New site from Git** y agregamos el repositorio que tengamos en la cuenta y queremos desplegar. En mi caso para este artículo he hecho un fork a un repositorio con una app de Hello World de Angular y será lo que voy a desplegar. 

-- imagen del fork y la integracion del repositorio con netlify --

Una vez conectamos el repositorio con Netlify, debemos ingresar el comando de build, que en nuestro caso será `ng build --prod` y el directorio de publicación será `./dist`.

Con todo configurado, Netlify dispara el comando del bundle de nuestra aplicación cada vez que detecte un commit en la branch master de nuestro repositorio. La branch puede ser cambiada en cualquier momento. Netlify asignará automáticamente un subdominio (con un nombre bastante ocurrente) para nuestro servidor y dispará nuestro primer deploy.

Si el bundle ha sido ejecutado correctamente y la carpeta con los arvichos estáticos es correcta, podremos ver nuestra app en producción en la ruta asignada por Netlify.

Ahora solo tocará crear un archivo para que Netlify sepa a donde redireccionar en caso de no encontrar una ruta. Como lo más común es utilizar el router que trae Angular, lo configuraremos para que todas las rutas desconocidas sean redireccionadas al `index.html` de nuestra aplicación y asi el router de Angular haga su trabajo.

Necesitaremos crear un archivo con nombre `_redirects` en la carpeta `src` de nuestra aplicacion y escribir el siguiente trozo de código

```_redirects

/* /index.html 200

```

Y en nuestro `angular.json` agregar la siguiente línea para incluir el redirect como archivo estático

```
"assets": ["src/_redirects"]
```

Con esto informaremos a nuestro servidor de Netlify que todas las rutas redericcionen al index.html de nuestra app y así usar el router de Angular.

Ahora solo queda seguir desarrollado y cada vez que hagamos commits al branch que este configurado, tendremos el deployment activo en producción. En caso de fallar, Netlify nos informará con un failed en el deployment log y si entramos, veremos cual ha sido el error que se ha producido para así poder corregirlo.

También es posible hacer nuevos deployments sin la necesidad de hacer commit a nuestro repositorio con sólo arrastrar la carpeta de archivos estáticos al final del log de los deployments.

Con esto ya tendremos nuestra aplicación de Angular desplegada en un servidor de Netlify con esfuerzo nulo y con la posibilidad de hacer **CI/CD** con simples commits.

¿Te ha gustado el artículo? 

Déjame un comentario y conversemos de como haces tus despliegues y que plataformas utilizas.

¡Hasta la próxima!










