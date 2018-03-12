const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: '172.29.0.143',
  database: 'SMWebApp',
  parseJSON: true,
};

const kraft = `
    select * from [Export_ConfirmLocation_Kraft] 
    `;

const DupGyp = `
    select * from [Export_ConfirmLocation_DupGyp] 
    `;
// const kraft = `
//     select * from [Export_ConfirmLocation_Kraft]
//     where [posting_date] = dateadd(day,datediff(day,1,GETDATE()),0);
//     `;

// const DupGyp = `
//     select * from [Export_ConfirmLocation_DupGyp]
//     where [posting_date] = dateadd(day,datediff(day,1,GETDATE()),0);
//     `;

const data = async () => {
  try {
    sql.close();
    console.log('sql connecting......');
    const pool = await sql.connect(config);
    const resultKraft = await pool.request().query(kraft);
    const resultDupGyp = await pool.request().query(DupGyp);
    sql.close();

    let result = resultKraft.recordset;
    result = result.concat(resultDupGyp.recordset);
    return result;
  } catch (err) {
    sql.close();
    console.log(err);
  }
};

sql.on('error', (err) => {
  console.log(JSON.stringify(err, undefined, 2));
});

module.exports.data = data;
