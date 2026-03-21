const { DATABASE_URL } = require("../../config");
const { createPostgresAdapter } = require("./adapters/postgres");
const { createMongoAdapter } = require("./adapters/mongo");
const { createMysqlAdapter } = require("./adapters/mysql");

function detectDbType(url) {
  if (url.startsWith("postgresql://") || url.startsWith("postgres://"))
    return "postgres";
  if (url.startsWith("mongodb://") || url.startsWith("mongodb+srv://"))
    return "mongo";
  if (url.startsWith("mysql://")) return "mysql";
  throw new Error(
    "Unsupported DATABASE_URL. Use postgresql://, mongodb://, or mysql://",
  );
}

const DB_TYPE = detectDbType(DATABASE_URL);
let _db = null;

async function initDB() {
  const label = { postgres: "Postgres", mongo: "MongoDB", mysql: "MySQL" }[
    DB_TYPE
  ];
  console.log(`🗄️  Connecting to ${label} Database...`);

  if (DB_TYPE === "postgres") _db = await createPostgresAdapter(DATABASE_URL);
  else if (DB_TYPE === "mongo") _db = await createMongoAdapter(DATABASE_URL);
  else _db = await createMysqlAdapter(DATABASE_URL);

  console.log(`✅ ${label} Database Ready`);
}

function getDB() {
  if (!_db) throw new Error("Database not initialized. Call initDB() first.");
  return _db;
}

module.exports = {
  initDB,
  getDB,
  DB_TYPE,
};
