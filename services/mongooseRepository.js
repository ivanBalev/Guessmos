async function findOne(Model, query) {
  return await Model.findOne(query);
}

async function findById(Model, id) {
  return await Model.findById(id);
}

async function findRandom(Model, query) {
  // Get total number of documents
  const documentsCount = await Model.countDocuments(query);
  // Skip random number of documents
  const skip = Math.floor(Math.random() * documentsCount);
  // Get random document
  return await Model.find(query).skip(skip).findOne();
}

async function findMany(Model, query) {
  return await Model.find(query);
}

async function create(Model, object) {
  return await new Model(object).save();
}

async function update(document, object) {
  // Iterate through object and update document fields
  for (const [key, value] of Object.entries(object)) {
    document[key] = value;
  }
  return await document.save();
}

async function addToArrayField(document, fieldName, object) {
  // Update array field in document (dayWord date)
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
