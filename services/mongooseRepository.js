async function findOne(Model, query) {
  return await Model.findOne(query);
}

async function findById(Model, id) {
  return await Model.findById(id);
}

async function findRandom(Model, query) {
  const documentsCount = await Model.countDocuments(query);
  const skip = Math.floor(Math.random() * documentsCount);

  return await Model.find(query).skip(skip).findOne();
}

async function findMany(Model, query) {
  return await Model.find(query);
}

async function create(Model, object) {
  return await new Model(object).save();
}

async function update(document, object) {
  for (const [key, value] of Object.entries(object)) {
    document[key] = value;
  }
  return await document.save();
}

async function addToArrayField(document, fieldName, object) {
  document[fieldName].push(object);
  return await document.save();
}

module.exports = {
  findOne,
  findById,
  findRandom,
  findMany,
  update,
  create,
  addToArrayField,
};
