const sql = require('mssql');
const moment = require('moment');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: '172.29.0.143',
  database: 'SMWebApp',
  parseJSON: true,
};

let query = `
  select * from [Export_Transaction] as t1
  where load_date = '${moment().format('YYYY-MM-DD')}'
  and t1.timestamp = (select max(t2.timestamp) from [Export_Transaction] as t2 where t2.PINo = t1.PINo and t2.location = t1.location);
`;
// let query = `
//   select * from [Export_Transaction] as t1
//   where load_date = '${moment().format('YYYY-MM-DD')}'
//   and t1.timestamp = (select max(t2.timestamp) from [Export_Transaction] as t2 where t2.PINo = t1.PINo);
// `;

const q = (Query) => {
  query = Query;
  // console.log(query);
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
      select * from [Export_Transaction] as t1
      where load_date = '${moment().format('YYYY-MM-DD')}'
      and t1.timestamp = (select max(t2.timestamp) from [Export_Transaction] as t2 where t2.PINo = t1.PINo and t2.location = t1.location);
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
    console.log('sql connecting...... (update)');
    const pool = await sql.connect(config);
    const doc = await pool.request().query(updateQuery);
    // sql.close();

    const result = doc;
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
  data,
  q,
  update,
  updateQ,
};
