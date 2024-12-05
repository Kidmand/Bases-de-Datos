use("mflix");
db.comments.findOne();
{
  ("_id");
  ObjectId("5a9427648b0beebeb69579cc"), "name";
  "Andrea Le", "email";
  "andrea_le@fakegmail.com", "movie_id";
  ObjectId("573a1390f29313caabcd418c"), "text";
  "Rem officiis eaque repellendus amet eos doloribus...", "date";
  ISODate("2012-03-26T23:20:16Z");
}

// Insertar 5 nuevos usuarios en la colección users.
//Para cada nuevo usuario creado, insertar al menos un comentario realizado por el usuario en la colección comments
use("mflix");
db.users.insertMany([
  { name: "daian", email: "daian@gimenez", password: "aaaaaaaaaa" },
  { name: "daia", email: "daian@gimene", password: "aaaaaaaaa" },
  { name: "dai", email: "daian@gimen", password: "aaaaaaaa" },
  { name: "da", email: "daian@gime", password: "aaaaaaa" },
  { name: "d", email: "daian@gim", password: "aaaaa" },
]);

use("mflix");
db.comments.insertMany([
  {
    name: "daian",
    email: "daian@gimenez",
    movie_id: "1",
    text: "muy buena",
    date: new Date(),
  },
  {
    name: "daia",
    email: "daian@gimene",
    movie_id: "2",
    text: "muy buena",
    date: new Date(),
  },
  {
    name: "dai",
    email: "daian@gimen",
    movie_id: "3",
    text: "muy buena",
    date: new Date(),
  },
  {
    name: "da",
    email: "daian@gime",
    movie_id: "4",
    text: "muy buena",
    date: new Date(),
  },
  {
    name: "d",
    email: "daian@gim",
    movie_id: "5",
    text: "muy buena",
    date: new Date(),
  },
]);

use("mflix");
db.comments.find({
  $or: [
    { name: "daian" },
    { name: "daia" },
    { name: "dai" },
    { name: "da" },
    { name: "d" },
  ],
});

// Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor rating (“imdb.rating”) de la década del 90.
// ¿Cuál es el valor del rating de la película que tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

use("mflix");
db.movies
  .find(
    {
      year: { $gte: 1990, $lt: 2000 },
      "imdb.rating": { $type: "double" },
    },
    {
      _id: 0,
      title: 1,
      year: 1,
      cast: 1,
      directors: 1,
      "imdb.rating": 1,
    }
  )
  .sort({ "imdb.rating": -1 })
  .limit(10);

// Este serían las 10 películas con más rating de las decáda de los 90.
// Para calcular la de mayor rating cambiamos 10 por 1 en limit.

// Listar el nombre, email, texto y fecha de los comentarios que la película con id (movie_id) ObjectId("573a1399f29313caabcee886")
// recibió entre los años 2014 y 2016 inclusive. Listar ordenados por fecha.
use("mflix");
db.comments
  .find(
    {
      movie_id: ObjectId("573a1399f29313caabcee886"),
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    { _id: 0, name: 1, email: 1, text: 1, date: 1 }
  )
  .sort({ date: -1 });

// Escribir una nueva consulta (modificando la anterior) para responder ¿Cuántos comentarios recibió?
use("mflix");
const commentsCount = db.comments.countDocuments({
  movie_id: ObjectId("573a1399f29313caabcee886"),
  date: {
    $gte: ISODate("2014-01-01T00:00:00Z"),
    $lte: ISODate("2016-12-31T23:59:59Z"),
  },
});

print(`La cantidad de comentarios de la película es: ${commentsCount}`);

//Listar el nombre, id de la película, texto y fecha de los 3 comentarios más recientes realizados
//por el usuario con email patricia_good@fakegmail.com.
use("mflix");
db.comments
  .find(
    {
      email: "patricia_good@fakegmail.com",
    },
    { _id: 0, name: 1, movie_id: 1, text: 1, date: 1 }
  )
  .sort({ date: -1 })
  .limit(3);

// Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) y número de votos (“imdb.votes”) de las películas de géneros Drama y Action
// (la película puede tener otros géneros adicionales), que solo están disponibles en un único idioma y por último tengan un rating (“imdb.rating”)
// mayor a 9 o bien tengan una duración (runtime) de al menos 180 minutos. Listar ordenados por fecha de lanzamiento y número de votos.
use("mflix");
db.movies
  .find(
    {
      genres: { $in: ["Drama", "Action"] },
      languages: { $size: 1 },
      $or: [{ runtime: { $gte: 3 } }, { "imdb.rating": { gt: 9 } }],
    },
    { _id: 0, title: 1, languages: 1, genres: 1, released: 1, "imdb.votes": 1 }
  )
  .sort({ released: -1 }, { "imdb.votes": -1 });

// Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”)
// de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.
use("mflix");
db.theaters
  .find(
    {
      $and: [
        { "location.address.state": { $in: ["CA", "NY", "TX"] } },
        { "location.address.city": { $regex: /^F/i } },
      ],
    },
    {
      _id: 1,
      theaterId: 1,
      "location.address.state": 1,
      "location.address.city": 1,
      "location.geo.coordinates": 1,
    }
  )
  .sort({ "location.address.state": 1 }, { "location.address.city": 1 });

// Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es
// ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual respectivamente.
use("mflix");
db.comments.updateOne(
  { _id: ObjectId("5b72236520a3277c015b3b73") },
  { $set: { text: "mi mejor comentario", date: new Date() } }
);

// Para ver la modificación de la actualización.
use("mflix");
db.comments.findOne({ _id: ObjectId("5b72236520a3277c015b3b73") });

// Actualizar el valor de la contraseña del usuario cuyo email es joel.macdonel@fakegmail.com a "some password".
// La misma consulta debe poder insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces.
// ¿Qué operación se realiza en cada caso?  (Hint: usar upserts).
use("mflix");
db.users.updateOne(
  { email: "joel.macdonel@fakegmail.com" },
  { $set: { password: "some password" } },
  { upsert: true }
);

// Para ver la modificación de la actualización.
use("mflix");
db.users.findOne({ email: "joel.macdonel@fakegmail.com" });

// La primera operación que se realiza es la insert, y luego update en la segunda ejecución del código.

// Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.
use("mflix");
db.comments.deleteMany({
  email: "victor_patel@fakegmail.com",
  $and: [
    { date: { $gte: ISODate("1980-01-01T00:00:00Z") } },
    { date: { $lt: ISODate("1980-12-31T23:59:59Z") } },
  ],
});

// Para ver la modificación de la actualización.
use("mflix");
db.comments.find({ email: "victor_patel@fakegmail.com" });

//----------------------------------Práctico 2----------------------------------\\

// Cantidad de cines (theaters) por estado.
use("mflix");
db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
]);

// Cantidad de estados con al menos dos cines (theaters) registrados.

use("mflix");
db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
  { $match: { count: { $gte: 2 } } },
  { $count: "cant_estados" },
]);

// Cantidad de películas dirigidas por "Louis Lumière".
// Se puede responder sin pipeline de agregación, realizar ambas queries.
use("mflix");
db.movies.countDocuments({ directors: "Louis Lumière" });

use("mflix");
db.movies.aggregate([
  { $match: { directors: "Louis Lumière" } },
  { $count: "cant_movies" },
]);

// Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959).
// Se puede responder sin pipeline de agregación, realizar ambas queries.
use("mflix");
db.movies.countDocuments({
  released: {
    $gte: ISODate("1950-01-01T00:00:00Z"),
    $lte: ISODate("1959-12-31T23:59:59Z"),
  },
});

use("mflix");
db.movies.aggregate([
  {
    $match: {
      released: {
        $gte: ISODate("1950-01-01T00:00:00Z"),
        $lte: ISODate("1959-12-31T23:59:59Z"),
      },
    },
  },
  { $count: "cant_movies_dec_50" },
]);

// Listar los 10 géneros con mayor cantidad de películas
// (tener en cuenta que las películas pueden tener más de un género).
// Devolver el género y la cantidad de películas. Hint: unwind puede ser de utilidad.
use("mflix");
db.movies.aggregate([
  { $unwind: "$genres" },
  {
    $group: {
      _id: "$genres",
      cant_movies: { $sum: 1 },
    },
  },
  { $sort: { cant_movies: -1 } },
  { $limit: 10 },
]);

// Top 10 de usuarios con mayor cantidad de comentarios,
// mostrando Nombre, Email y Cantidad de Comentarios.
use("mflix");
db.comments.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "email", // Clave foránea en comments que referencia a la clave "primaria" (email) en users
      foreignField: "email", // Clave "primaria" en users
      as: "user_info",
    },
  },
  { $unwind: "$user_info" }, // Descompone el arreglo user_info para acceder a sus campos directamente
  {
    $group: {
      _id: "$user_info._id", // Agrupa por el _id del usuario
      name: { $first: "$user_info.name" }, // Obtiene el primer nombre del usuario
      email: { $first: "$user_info.email" }, // Obtiene el primer email del usuario
      cant_comments: { $sum: 1 }, // Cuenta la cantidad de comentarios por usuario
    },
  },
  { $sort: { cant_comments: -1 } }, // Ordena los resultados por cantidad de comentarios de forma descendente
  { $limit: 10 }, // Limita a los 10 usuarios con más comentarios
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      cant_comments: 1,
    },
  },
]);

// Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80
// (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año
use("mflix");
db.movies.aggregate([
  {
    $match: {
      year: {
        $gte: 1980,
        $lte: 1989,
      },
    },
  },
  {
    $group: {
      _id: "$year",
      avg: {
        $avg: "$imdb.rating",
      },
      min: {
        $min: "$imdb.rating",
      },
      max: {
        $max: "$imdb.rating",
      },
    },
  },
  { $sort: { avg: -1 } },
]);

// Título, año y cantidad de comentarios de las 10 películas con más comentarios.
use("mflix");
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id", // Clave foránea en comments que referencia a la clave primaria (_id) en movies
      foreignField: "_id", // Clave primaria en movies
      as: "movies_info",
    },
  },
  { $unwind: "$movies_info" },
  {
    $group: {
      _id: "$movies_info._id",
      title: { $first: "$movies_info.title" },
      year: { $first: "$movies_info.year" },
      cant_comments: { $sum: 1 },
    },
  },
  { $sort: { cant_comments: -1 } },
  { $limit: 10 },
]);

// Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.
use("mflix");
db.createView("ViewMaxComments", "comments", [
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movies_info",
    },
  },
  { $unwind: "$movies_info" },
  { $unwind: "$movies_info.genres" },
  {
    $group: {
      _id: "$movies_info.genres",
      cant_comments: { $sum: 1 },
    },
  },
  { $sort: { cant_comments: -1 } },
  { $limit: 5 },
]);

db.ViewMaxComments.find();

// Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por "Jules Bass".
// Devolver el nombre de estos actores junto con la lista de películas (solo título y año)
// dirigidas por “Jules Bass” en las que trabajaron.
use("mflix");
db.movies.aggregate([
  { $unwind: "$cast" },
  { $match: { directors: "Jules Bass" } },
  {
    $group: {
      _id: "$cast",
      movies: {
        $addToSet: { title: "$title", year: "$year" },
      },
      cant_movies: { $sum: 1 },
    },
  },
  {
    $match: {
      cant_movies: { $gte: 2 },
    },
  },
  {
    $project: {
      _id: 0,
      cast: "$_id",
      movies: 1,
    },
  },
]);

// Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento de la película comentada,
// mostrando Nombre, Email, fecha del comentario, título de la película, fecha de lanzamiento. HINT: usar $lookup con multiple condiciones

use("mflix");
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      let: { comment_date: "$date", release_date: "$released" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    { $year: "$$comment_date" },
                    { $year: "$$release_date" },
                  ],
                },
                {
                  $eq: [
                    { $month: "$$comment_date" },
                    { $month: "$$release_date" },
                  ],
                },
              ],
            },
          },
        },
      ],
      as: "movies_info",
    },
  },
  { $unwind: "$movies_info" }, // Descomponemos el array de movies_info
  {
    $lookup: {
      from: "users",
      localField: "email",
      foreignField: "email",
      as: "user_info",
    },
  },
  { $unwind: "$user_info" },
  {
    $project: {
      _id: 0,
      name: "$user_info.name",
      email: "$user_info.email",
      comment_date: "$date",
      title: "$movies_info.title",
      release_date: "$movies_info.released",
    },
  },
]);

db.comments.aggregate([
  {
    $lookup: {
      from: "movies", // Unimos con la colección de películas
      let: { comment_date: "$date", movie_id: "$movie_id" }, // Definimos las variables locales
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [{ $year: "$$comment_date" }, { $year: "$released" }], // Compara el año
                },
                {
                  $eq: [{ $month: "$$comment_date" }, { $month: "$released" }], // Compara el mes
                },
              ],
            },
          },
        },
      ],
      as: "movies_info", // Los datos de la película se almacenarán en este campo
    },
  },
  { $unwind: "$movies_info" }, // Descompone el array de "movies_info"
  {
    $lookup: {
      from: "users", // Unimos con la colección de usuarios
      localField: "email", // Campo en comentarios
      foreignField: "email", // Campo en usuarios
      as: "user_info", // Los datos del usuario se almacenarán aquí
    },
  },
  { $unwind: "$user_info" }, // Descompone el array de "user_info"
  {
    $project: {
      _id: 0,
      name: "$user_info.name", // Nombre del usuario
      email: "$user_info.email", // Email del usuario
      comment_date: "$date", // Fecha del comentario
      title: "$movies_info.title", // Título de la película
      release_date: "$movies_info.released", // Fecha de lanzamiento de la película
    },
  },
]);

// Faltan los últimos dos ejercicos: después los haré.

//----------------------------------Práctico 3----------------------------------\\

// Especificar en la colección users las siguientes reglas de validación:
// El campo name (requerido) debe ser un string con un máximo de 30 caracteres,
// email (requerido) debe ser un string que matchee con la expresión regular:
// "^(.*)@(.*)\\.(.{2,4})$" , password (requerido) debe ser un string con al menos 50 caracteres.
use("mflix");
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 30,
          description: "El nombre(name) para esta colección es obligatorio.",
        },
        email: {
          bsonType: "string",
          pattern: "^(.*)@(.*)\\.(.{2,4})$",
          description: "El email para esta colección es obligatorio.",
        },
        password: {
          bsonType: "string",
          minLength: 50,
          description:
            "La contraseña(password) para esta colección es obligatorio.",
        },
      },
    },
  },
});

// Obtener metadata de la colección users que garantice que las reglas de validación fueron correctamente aplicadas.
use("mflix");
db.getCollectionInfos({ name: "users" });

// Ejmplos para que falle:
use("mflix");
db.users.insertOne({
  email: "john.doe@example.com",
  password: "supersecurepassword",
});

use("mflix");
db.users.insertOne({
  name: "John Doe",
  email: "john.doeexample.com", // No sigue el formato de email
  password: "thisisaverylongpasswordthatcontainsmorethan50characters",
});

// Ejmplos para que no falle:
use("mflix");
db.users.insertOne({
  name: "John Doe",
  email: "john.doe@example.com",
  password: "thisisaverylongpasswordthatcontainsmorethan50characters",
});

use("mflix");
db.users.insertOne({
  name: "Alice Smith",
  email: "alice.smith@example.org",
  password: "anotherlongpasswordthatmeetsrequirements1234567890",
});

// Especificar en la colección theaters las siguientes reglas de validación: El campo theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:
// un campo address (requerido) que sea un object con campos street1, city, state y zipcode todos de tipo string y requeridos
// un campo geo (no requerido) que sea un object con un campo type, con valores posibles “Point” o null y coordinates que debe ser una lista de 2 doubles
// Por último, estas reglas de validación no deben prohibir la inserción o actualización de documentos que no las cumplan sino que solamente deben advertir.
use("mflix");
db.runCommand({
  collMod: "theaters",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["theaterId", "location"],
      properties: {
        theaterId: {
          bsonType: "int",
          description: "El campo theaterId es obligatorio.",
        },
        location: {
          bsonType: "object",
          required: ["address"],
          properties: {
            address: {
              bsonType: "object",
              required: ["street1", "city", "state", "zipcode"],
              properties: {
                street1: {
                  bsonType: "string",
                  description: "El campo street1 de address es obligatorio.",
                },
                city: {
                  bsonType: "string",
                  description: "El campo city de address es obligatorio.",
                },
                state: {
                  bsonType: "string",
                  description: "El campo state de address es obligatorio.",
                },
                zipcode: {
                  bsonType: "string",
                  description: "El campo zipcode de address es obligatorio.",
                },
              },
              description: "El campo address de location es obligatorio.",
            },
            geo: {
              bsonType: "object",
              properties: {
                type: {
                  bsonType: "string",
                  enum: ["Point", null],
                  description: "El campo type puede ser 'Point' o null.",
                },
                coordinates: {
                  bsonType: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: { bsonType: "double" },
                  description:
                    "El campo coordinates debe ser una lista de 2 doubles.",
                },
              },
              description: "El campo geo de location es opcional.",
            },
          },
          description: "El campo location es obligatorio.",
        },
      },
    },
  },
  validationLevel: "moderate", // Se aplica solo a documentos nuevos o modificados
  validationAction: "warn", // Emitir advertencias en lugar de errores
});

// Obtener metadata de la colección theaters que garantice que las reglas de validación fueron correctamente aplicadas.
use("mflix");
db.getCollectionInfos({ name: "theaters" });

// Especificar en la colección movies las siguientes reglas de validación:
// El campo title (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000,
// y que tanto cast, directors, countries, como genres sean arrays de strings sin duplicados.
// Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora de insertar documentos.
// Recordar que mongo shell es un intérprete javascript y en javascript los literales numéricos son de tipo Number (double).
use("mflix");
db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "year"],
      properties: {
        title: {
          bsonType: "string",
          description: "El campo title es obligatorio.",
        },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 3000,
          description: "El campo year es obligatorio.",
        },
        cast: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
          description: "El campo cast es opcional.",
        },
        directors: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
          description: "El campo directors es opcional.",
        },
        countries: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
          description: "El campo countries es opcional.",
        },
        genres: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
          description: "El campo genres es opcional.",
        },
      },
    },
  },
});

// Obtener metadata de la colección movies que garantice que las reglas de validación fueron correctamente aplicadas.
use("mflix");
db.getCollectionInfos({ name: "movies" });

// Crear una colección userProfiles con las siguientes reglas de validación:
// Tenga un campo user_id (requerido) de tipo “objectId”, un campo language (requerido)
// con alguno de los siguientes valores [ “English”, “Spanish”, “Portuguese” ]
// y un campo favorite_genres (no requerido) que sea un array de strings sin duplicados.
use("mflix");
db.createCollection("userProfiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "language"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "El campo user_id es obligatorio.",
        },
        language: {
          bsonType: "string",
          enum: ["English", "Spanish", "Portuguese"],
          description:
            "El campo language es obligatorio y puede tomar algunos de los siguientes valores en esta lista ['English', 'Spanish', 'Portuguese']",
        },
        favorite_genres: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
          description:
            "El campo favorite_genres es opcional y es una lista de genres sin duplicados",
        },
      },
    },
  },
});

// Obtener metadata de la colección userProfiles que garantice que las reglas de validación fueron correctamente aplicadas.
use("mflix");
db.getCollectionInfos({ name: "userProfiles" });

// Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
// Cantidad de libros por categorías
// Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado.
// Debe crear el modelo de datos en mongodb aplicando las estrategias “Modelo de datos anidados” y Referencias.
// El modelo de datos debe permitir responder las queries de manera eficiente.

use("mflix");
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["category_id", "category_name"],
      properties: {
        category_id: { bsonType: "int" },
        category_name: { bsonType: "string", maxLength: 70 },
        books: {
          bsonType: "object",
          required: ["book_id", "title", "author", "price"],
          properties: {
            book_id: { bsonType: "int" },
            title: { bsonType: "string", maxLength: 70 },
            author: { bsonType: "string", maxLength: 70 },
            price: { bsonType: "double" },
          },
        },
      },
    },
  },
});

// { $strLenCP: "$username" } Para contar números de caracteres de un string.

// Esquema de comments.
// {
//   "_id": {
//     "$oid": "5a9427648b0beebeb69579ce"
//   },
//   "name": "Patricia Good",
//   "email": "patricia_good@fakegmail.com",
//   "movie_id": {
//     "$oid": "573a1390f29313caabcd418c"
//   },
//   "text": "Harum earum non inventore vel et. Veniam molestias voluptas architecto error. Eligendi ipsum consequatur fugit illo.",
//   "date": {
//     "$date": "2011-12-01T22:18:54Z"
//   }
// }

// Esquema de Movies.
// {
//   "_id": {
//     "$oid": "573a1390f29313caabcd413b"
//   },
//   "title": "The Arrival of a Train",
//   "year": 1896,
//   "runtime": 1,
//   "released": {
//     "$date": {
//       "$numberLong": "-2335219200000"
//     }
//   },
//   "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
//   "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
//   "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
//   "lastupdated": "2015-08-15 00:02:53.443000000",
//   "type": "movie",
//   "directors": [
//     "Auguste Lumière",
//     "Louis Lumière"
//   ],
//   "imdb": {
//     "rating": 7.3,
//     "votes": 5043,
//     "id": 12
//   },
//   "countries": [
//     "France"
//   ],
//   "genres": [
//     "Documentary",
//     "Short"
//   ],
//   "tomatoes": {
//     "viewer": {
//       "rating": 3.7,
//       "numReviews": 59
//     },
//     "lastUpdated": {
//       "$date": "2015-09-11T17:46:29Z"
//     }
//   },
//   "num_mflix_comments": 1
// }

// Esquema de users.
// {
//   "_id": {
//     "$oid": "59b99db6cfa9a34dcd7885bc"
//   },
//   "name": "Jorah Mormont",
//   "email": "iain_glen@gameofthron.es",
//   "password": "$2b$12$K8bKkwnpkrjsBPzASZxO/.yj7d9kvupiVtO6JA3Xl106AKXr3pXFK"
// }

// Esquema de theaters.
// {
//   "_id": {
//     "$oid": "59a47286cfa9a3a73e51e734"
//   },
//   "theaterId": 1009,
//   "location": {
//     "address": {
//       "street1": "6310 E Pacific Coast Hwy",
//       "city": "Long Beach",
//       "state": "CA",
//       "zipcode": "90803"
//     },
//     "geo": {
//       "type": "Point",
//       "coordinates": [
//         -118.11414,
//         33.760353
//       ]
//     }
//   }
// }//

// Parcial recuperatorio 2023.

// Identificar los tres géneros con el tiempo promedio de duración más alto de sus
// películas. Incluir el nombre del género y el tiempo promedio, y ordenar el resultado
// según el tiempo promedio en orden descendente. Si una película pertenece a varios
// géneros, contar esa película para cada uno de ellos.
use("mflix");
db.movies.aggregate([
  {
    $unwind: "$genres",
  },
  {
    $group: {
      _id: "$genres",
      avg_time_movie: {
        $avg: "$runtime",
      },
    },
  },
  {
    $sort: {
      avg_time_movie: -1,
    },
  },
  {
    $project: {
      _id: 0,
      genres: "$_id",
      avg_time_movie: 1,
    },
  },
  {
    $limit: 3,
  },
]);

// Calcular el número promedio de caracteres en los títulos de las películas para cada
// género. Incluye el nombre del género y el número promedio de caracteres, y ordena
// el resultado en orden descendente según este número. Si una película pertenece a
// varios géneros, contar esa película para cada uno de ellos.
use("mflix");
db.movies.aggregate([
  {
    $unwind: "$genres",
  },
  {
    $addFields: {
      cant_caracter_title: {
        $strLenCP: "$title",
      },
    },
  },
  {
    $group: {
      _id: "$genres",
      avg_caracter_title: {
        $avg: "$cant_caracter_title",
      },
    },
  },
  {
    $sort: {
      avg_caracter_title: -1,
    },
  },
  {
    $project: {
      _id: 0,
      genres: "$_id",
      avg_caracter_title: 1,
    },
  },
]);

// Identificar a los usuarios que tienen un gusto diverso en películas. Considerar la
// diversidad como la cantidad de películas de años diferentes a las que un usuario ha
// comentado. Es decir, si un usuario tiene comentarios en Titanic (1997), Forrest
// Gump (1994) y Pulp Fiction (1994), la diversidad es 2 porque hay exactamente dos
// años distintos entre todas las películas. Incluir el correo electrónico y la cantidad de
// años únicos que ha comentado. Ordena el resultado por la cantidad de años únicos
// descendentemente y por email alfabéticamente.
use("mflix");
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie_info",
    },
  },
  {
    $unwind: "$movie_info",
  },
  {
    $group: {
      _id: "$email",
      diversidad_array: {
        $addToSet: "$movie_info.year",
      },
    },
  },
  {
    $addFields: {
      diversidad: {
        $size: "$diversidad_array",
      },
    },
  },
  {
    $sort: {
      diversidad: -1,
      _id: 1,
    },
  },
  {
    $project: {
      _id: 0,
      diversidad: 1,
      email: "$_id",
    },
  },
]);
