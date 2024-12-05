// Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde al menos una de sus calificaciones
// haya sido realizada entre 2014 y 2015 inclusive, y que tenga una puntuación (score) mayor a 70 y menor o igual a 90.
use("restaurantdb");
db.restaurants.find(
  {
    grades: {
      $elemMatch: {
        date: {
          $gte: ISODate("2014-01-01T00:00:00Z"),
          $lte: ISODate("2015-12-31T23:59:59Z"),
        },
        score: { $gt: 70, $lte: 90 },
      },
    },
  },
  { _id: 0, restaurant_id: 1, grades: 1 }
);

// Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608".
// A continuación se especifican las calificaciones a agregar en una sola consulta.
use("restaurantdb");
db.restaurants.updateMany(
  { restaurant_id: "50018608" },
  {
    $addToSet: {
      grades: {
        $each: [
          {
            date: ISODate("2019-10-10T00:00:00Z"),
            grade: "A",
            score: 18,
          },
          {
            date: ISODate("2020-02-25T00:00:00Z"),
            grade: "A",
            score: 21,
          },
        ],
      },
    },
  }
);

use("restaurantdb");
db.restaurants.findOne({ restaurant_id: "50018608" });

// Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la suma total. Se puede asumir que el restaurant_id es único.
// Resolver con $group y accumulators.
// Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
// Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.
// Resolver con find.
use("restaurantdb");
db.restaurants.aggregate([
  {
    $unwind: "$grades",
  },
  {
    $group: {
      _id: "$restaurant_id",
      name: { $first: "$name" },
      max_score: {
        $max: "$grades.score",
      },
      min_score: {
        $min: "$grades.score",
      },
      sum_total: {
        $sum: "$grades.score",
      },
    },
  },
  {
    $sort: {
      sum_total: -1,
    },
  },
]);

use("restaurantdb");
db.restaurants.aggregate([
  {
    $project: {
      _id: 0,
      restaurant_id: 1,
      name: 1,
      max_score: {
        $max: "$grades.score",
      },
      min_score: {
        $min: "$grades.score",
      },
      sum_total: {
        $sum: "$grades.score",
      },
    },
  },
  {
    $sort: {
      sum_total: -1,
    },
  },
]);

// Actualizar los datos de los restaurantes añadiendo dos campos nuevos.
// "average_score": con la puntuación promedio
// "grade": con "A" si "average_score" está entre 0 y 13,
// con "B" si "average_score" está entre 14 y 27
// con "C" si "average_score" es mayor o igual a 28
// Se debe actualizar con una sola query.
// HINT1. Se puede usar pipeline de agregación con la operación update
// HINT2. El operador $switch o $cond pueden ser de ayuda.

use("restaurantdb");
db.restaurants.updateMany({}, [
  {
    $addFields: {
      average_score: {
        $avg: "$grades.score",
      },
      grade: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $gte: ["$average_score", 0] },
                  { $lte: ["$average_score", 13] },
                ],
              },

              then: "A",
            },
            {
              case: {
                $and: [
                  { $gte: ["$average_score", 14] },
                  { $lte: ["$average_score", 27] },
                ],
              },
              then: "B",
            },
            { case: { $gte: ["$average_score", 28] }, then: "C" },
          ],
          default: "Unknown",
        },
      },
    },
  },
]);

// Listar el nombre (name) y barrio (borough) de todos los restaurantes de cocina
// (cuisine) tipo "Italian" y que entre sus notas (grades) tengan al menos una
// entrada con nota (grade) "A" y puntaje (score) mayor o igual a 10. La lista final
// sólo deberá mostrar 1 entrada por restaurante y deberá estar ordenada de manera
// alfabética por el barrio primero y el nombre después. Hint: Revisar operadores
// $regex y $elemMatch.

use("restaurantdb");
db.restaurants
  .find(
    {
      cuisine: {
        $regex: "Italian",
      },
      grades: {
        $elemMatch: {
          grade: "A",
          score: { $gte: 10 },
        },
      },
    },
    {
      _id: 0,
      name: 1,
      borough: 1,
      cuisine: 1,
    }
  )
  .sort({
    borough: 1,
    name: 1,
  });

//  Actualizar las panaderías (cuisine ~ Bakery) y las cafeterías (cuisine ~
//  Coffee) agregando un nuevo campo discounts que sea un objeto con dos campos:
//  day y amount. Si el local se ubica en Manhattan, el día será "Monday" y el
//  descuento será "%10". En caso contrario el día será "Tuesday" y el descuento será
//  "5%". Hint: Revisar el operador $cond.
use("restaurantdb");
db.restaurants.updateMany({
  $or: [{ cuisine: { $eq: "Bakery" } }, { cuisine: { $eq: "offee" } }],
  $set: {
    discount: {
      day: {
        $cond: {
          if: { $eq: ["$borough", "Manhattan"] },
          then: "Monday",
          else: "Tuesday",
        },
      },
      amount: {
        $cond: {
          if: { $eq: ["$borough", "Manhattan"] },
          then: "%10",
          else: "%5",
        },
      },
    },
  },
});

// Contar la cantidad de restaurantes cuyo address.zipcode se encuentre entre
// 10000 y 11000. Tener en cuenta que el valor original es un string y deberá ser
// convertido. También tener en cuenta que hay casos erróneos que no pueden ser
// convertidos a número, en cuyo caso el valor será reemplazado por 0. Hint: Revisar
// el operador $convert.
use("restaurantdb");
db.restaurants.countDocuments({
  address_zipcode_int: {
    $convert: {
      input: "$address.zipcode",
      to: "int",
      onError: 0, // Si la conversión falla, asignar 0
      onNull: 0, // Si el campo price es null, asignar 0
    },
  },
  address_zipcode_int: {
    $gte: 10000,
    $lte: 11000,
  },
});

// Por cada tipo de cocina (cuisine), contar la cantidad de notas distintas recibidas
// (grades.grade) en el segundo semestre de 2013. Ordenar por tipo de cocina y
// nota.

use("restaurantdb");
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "grades.date": {
        $gte: ISODate("2013-07-01T00:00:00Z"),
        $lte: ISODate("2013-12-31T23:59:59Z"),
      },
    },
  },
  {
    $group: {
      _id: "$cuisine",
      count_grades_neq_array: {
        $addToSet: "$grades.grade",
      },
    },
  },
  {
    $project: {
      _id: "$_id",
      count_grades_cuisine: { $size: "$count_grades_neq_array" },
    },
  },
]);
