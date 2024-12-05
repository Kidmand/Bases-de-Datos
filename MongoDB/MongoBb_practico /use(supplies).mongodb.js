// Buscar las ventas realizadas en "London", "Austin" o "San Diego"; a un customer con
// edad mayor-igual a 18 años que tengan productos que hayan salido al menos 1000
// y estén etiquetados (tags) como de tipo "school" o "kids" (pueden tener más
// etiquetas).
// Mostrar el id de la venta con el nombre "sale", la fecha (“saleDate"), el storeLocation,
// y el "email del cliente. No mostrar resultados anidados.
use("supplies");
db.sales.find(
  {
    storeLocation: { $in: ["London", "Austin", "San Diego"] },
    "customer.age": { $gte: 18 },
    items: {
      $elemMatch: {
        price: { $gte: 1000 },
        tags: { $in: ["school", "kids"] },
      },
    },
  },
  { sale: "$_id", saleDate: 1, storeLocation: 1, "customer.email": 1 }
);

// Buscar las ventas de las tiendas localizadas en Seattle, donde el método de compra
// sea ‘In store’ o ‘Phone’ y se hayan realizado entre 1 de febrero de 2014 y 31 de enero
// de 2015 (ambas fechas inclusive). Listar el email y la satisfacción del cliente, y el
// monto total facturado, donde el monto de cada item se calcula como 'price *
// quantity'. Mostrar el resultado ordenados por satisfacción (descendente), frente a
// empate de satisfacción ordenar por email (alfabético).
use("supplies");
db.sales.aggregate([
  {
    $match: {
      storeLocation: "Seattle",
      purchaseMethod: { $in: ["In store", "Phone"] },
      saleDate: {
        $gte: ISODate("2014-02-01T00:00:00Z"),
        $lte: ISODate("2015-01-31T23:59:59Z"),
      },
    },
  },
  {
    $addFields: {
      totalSaleCost: {
        $sum: {
          $map: {
            input: "$items",
            as: "item",
            in: { $multiply: ["$$item.price", "$$item.quantity"] },
          },
        },
      },
    },
  },
  {
    $project: {
      "customer.email": 1,
      "customer.satisfaction": 1,
      totalSaleCost: 1,
    },
  },
  {
    $sort: {
      "customer.satisfaction": -1,
      "customer.email": 1,
    },
  },
]);

// Crear la vista salesInvoiced que calcula el monto mínimo, monto máximo, monto
// total y monto promedio facturado por año y mes. Mostrar el resultado en orden
// cronológico. No se debe mostrar campos anidados en el resultado.
use("supplies");
db.createView("salesInvoiced", "sales", [
  {
    $project: {
      year: { $year: "$saleDate" },
      month: { $month: "$saleDate" },
      totalSaleCost: {
        $sum: {
          $map: {
            input: "$items",
            as: "item",
            in: { $multiply: ["$$item.price", "$$item.quantity"] },
          },
        },
      },
    },
  },
  {
    $group: {
      _id: { year: "$year", month: "$month" },
      minSale: { $min: "$totalSaleCost" },
      maxSale: { $max: "$totalSaleCost" },
      avgSale: { $avg: "$totalSaleCost" },
      sumSale: { $sum: "$totalSaleCost" },
    },
  },
  {
    $project: {
      _id: 0,
      year: "$year",
      month: "$month",
      minSale: 1,
      maxSale: 1,
      avgSale: 1,
      sumSale: 1,
    },
  },
  {
    $sort: {
      year: 1,
      month: 1,
    },
  },
]);

// Mostrar el storeLocation, la venta promedio de ese local, el objetivo a cumplir de
// ventas (dentro de la colección storeObjectives) y la diferencia entre el promedio y el
// objetivo de todos los locales
use("supplies");
db.sales.aggregate([
  {
    $addFields: {
      totalSaleCost: {
        $sum: {
          $map: {
            input: "$items",
            as: "item",
            in: { $multiply: ["$$item.price", "$$item.quantity"] },
          },
        },
      },
    },
  },
  {
    $group: {
      _id: "$storeLocation",
      totalSaleCostAvg: { $avg: "$totalSaleCost" },
    },
  },
  {
    $lookup: {
      from: "storeObjetives", // Nombre de la colección tal como lo tienes
      localField: "storeLocation",
      foreignField: "_id",
      as: "storeObjetive_info",
    },
  },
  { $unwind: "$storeObjetive_info" },
  {
    $project: {
      storeLocation: "$_id",
      totalSaleCostAvg: 1,
      objective: "$storeObjetive_info.objective",
      difference: {
        $subtract: ["$totalSaleCostAvg", "$storeObjetive_info.objective"],
      },
    },
  },
]);
