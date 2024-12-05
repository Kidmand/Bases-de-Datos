// Buscar los documentos donde el alumno tiene:
// (i) un puntaje mayor o igual a 80  en "exam" o bien un puntaje mayor o igual a 90 en "quiz" y
// (ii) un puntaje mayor o igual a 60 en todos los "homework" (en otras palabras no tiene un puntaje menor a 60 en algún "homework")
// Las dos condiciones se tienen que cumplir juntas (es un AND)
// Se debe mostrar todos los campos excepto el _id, ordenados por el id de la clase y id del alumno en orden descendente y ascendente respectivamente
use("university");
db.grades
  .find(
    {
      $and: [
        {
          $or: [
            {
              scores: {
                $elemMatch: {
                  type: "exam",
                  score: {
                    $gte: 80,
                  },
                },
              },
            },
            {
              scores: {
                $elemMatch: {
                  type: "quiz",
                  score: {
                    $gte: 90,
                  },
                },
              },
            },
          ],
        },
        {
          scores: {
            $not: {
              $elemMatch: {
                type: "homework",
                score: {
                  $gte: 60,
                },
              },
            },
          },
        },
      ],
    },
    { _id: 0, student_id: 1, class_id: 1, scores: 1 }
  )
  .sort({ student_id: 1, class_id: -1 });

// Calcular el puntaje mínimo, promedio, y máximo que obtuvo el alumno en las clases 20, 220, 420.
// El resultado debe mostrar además el id de la clase y el id del alumno, ordenados por alumno y clase en orden ascendentes.
use("university");
db.grades.aggregate([
  {
    $match: {
      class_id: {
        $in: [20, 220, 420],
      },
    },
  },
  {
    $addFields: {
      max_puntaje: {
        $max: "$scores.score",
      },
      min_puntaje: {
        $min: "$scores.score",
      },
      avg_puntaje: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $sort: {
      student_id: 1,
      class_id: 1,
    },
  },
  {
    $project: {
      _id: 0,
      student_id: 1,
      class_id: 1,
      max_puntaje: 1,
      min_puntaje: 1,
      avg_puntaje: 1,
    },
  },
]);

// Para cada clase listar el puntaje máximo de las evaluaciones de tipo "exam" y el puntaje máximo de las evaluaciones de tipo "quiz".
// Listar en orden ascendente por el id de la clase. HINT: El operador $filter puede ser de utilidad.
use("university");
db.grades.aggregate([
  {
    $addFields: {
      max_score_exam: {
        $max: {
          $filter: {
            input: "$scores",
            as: "score",
            cond: {
              $eq: ["$$score.type", "exam"],
            },
          },
        },
      },
      max_score_quiz: {
        $max: {
          $filter: {
            input: "$scores",
            as: "score",
            cond: {
              $eq: ["$$score.type", "quiz"],
            },
          },
        },
      },
    },
  },
  {
    $limit: 100,
  },
  {
    $sort: {
      class_id: 1,
    },
  },
]);

use("university");
db.grades.aggregate([
  {
    $addFields: {
      max_score_exam: {
        $max: {
          $map: {
            input: {
              $filter: {
                input: "$scores",
                as: "score",
                cond: { $eq: ["$$score.type", "exam"] },
              },
            },
            as: "score",
            in: "$$score.score", // Extraemos el puntaje de las evaluaciones tipo "exam"
          },
        },
      },
      max_score_quiz: {
        $max: {
          $map: {
            input: {
              $filter: {
                input: "$scores",
                as: "score",
                cond: { $eq: ["$$score.type", "quiz"] },
              },
            },
            as: "score",
            in: "$$score.score", // Extraemos el puntaje de las evaluaciones tipo "quiz"
          },
        },
      },
    },
  },
  {
    $limit: 100,
  },
  {
    $sort: { class_id: 1 }, // Ordenar por class_id de manera ascendente
  },
]);

// Crear una vista "top10students" que liste los 10 estudiantes con los mejores promedios.
use("university");
db.createView("top10students", "grades", [
  {
    $addFields: {
      avg_student_class: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $group: {
      _id: "$student_id",
      avg_total_class: {
        $avg: "$avg_student_class",
      },
    },
  },
  {
    $sort: {
      avg_total_class: -1,
    },
  },
  {
    $limit: 10,
  },
]);

use("university");
db.top10students.find();

// Actualizar los documentos de la clase 339, agregando dos nuevos campos: el campo "score_avg" que almacena el puntaje promedio y el campo "letter" que tiene el valor "NA" si el puntaje promedio está entre [0, 60), el valor "A" si el puntaje promedio está entre [60, 80) y el valor "P" si el puntaje promedio está entre [80, 100].
// HINTS: (i) para actualizar se puede usar pipeline de agregación. (ii) El operador $cond o $switch pueden ser de utilidad.
use("university");
db.grades.updateMany({ class_id: 339 }, [
  {
    $addFields: {
      score_avg: {
        $avg: "$scores.score",
      },
      letter: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $lt: ["$score_avg", 60] },
                  { $gte: ["$score_avg", 0] },
                ],
              },
              then: "NA",
            },
            {
              case: {
                $and: [
                  { $lt: ["$score_avg", 80] },
                  { $gte: ["$score_avg", 60] },
                ],
              },
              then: "A",
            },
            {
              case: {
                $and: [
                  { $lte: ["$score_avg", 100] },
                  { $gte: ["$score_avg", 80] },
                ],
              },
              then: "P",
            },
          ],
          default: "F",
        },
      },
    },
  },
]);

// a) Especificar reglas de validación en la colección grades para todos sus campos y subdocumentos anidados.
// Inferir los tipos y otras restricciones que considere adecuados para especificar las reglas a partir de los documentos de la colección.
// (b) Testear la regla de validación generando dos casos de fallas en la regla de validación y un caso de éxito en la regla de validación.
// Aclarar en la entrega cuales son los casos y por qué fallan y cuales cumplen la regla de validación. Los casos no deben ser triviales, es decir los ejemplos deben contener todos los campos..
use("university");
db.runCommand({
  collMod: "grades",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "class_id"],
      properties: {
        student_id: {
          bsonType: "int",
        },
        class_id: {
          bsonType: "int",
        },
        scores: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "score"],
            properties: {
              type: {
                bsonType: "string",
                enum: ["exam", "quiz", "homework"],
              },
              score: {
                bsonType: "double",
              },
            },
          },
          uniqueItems: true,
        },
      },
    },
  },
});

/*
{
  "_id": {
    "$oid": "56d5f7eb604eb380b0d8d8ce"
  },
  "student_id": 0,
  "scores": [
    {
      "type": "exam",
      "score": 78.40446309504266
    },
    {
      "type": "quiz",
      "score": 73.36224783231339
    },
    {
      "type": "homework",
      "score": 46.980982486720535
    },
    {
      "type": "homework",
      "score": 76.67556138656222
    }
  ],
  "class_id": 339,
  "score_avg": 68.8558137001597,
  "letter": "A"
}*/
