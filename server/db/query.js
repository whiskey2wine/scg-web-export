const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: '172.29.0.143',
  database: 'SMWebApp',
  parseJSON: true,
};

let query = `
  select * from [Export_Transaction];
`;

const q = (Query) => {
  query = Query;
  console.log(query);
};

let updateQuery;
const updateQ = (Query) => {
  updateQuery = Query;
  // console.log(updateQuery);
};

const data = async () => {
  try {
    sql.close();
    console.log('sql connecting......');
    const pool = await sql.connect(config);
    const doc = await pool.request().query(query);
    // sql.close();

    const result = doc.recordset;
    query = `
      select * from [Export_Transaction];
    `;
    return result;
  } catch (err) {
    sql.close();
    console.log(err);
  }
};

const update = async () => {
  try {
    sql.close();
    console.log('sql connecting......');
    const pool = await sql.connect(config);
    const doc = await pool.request().query(updateQuery);
    // sql.close();

    const result = doc.recordset;
    return result;
  } catch (err) {
    sql.close();
    console.log(err);
  }
};

sql.on('error', (err) => {
  console.log(JSON.stringify(err, undefined, 2));
});

module.exports = {
  data, q, update, updateQ,
};
