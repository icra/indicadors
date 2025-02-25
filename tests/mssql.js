const sql = require('mssql');

//configuration for the SQL Server
const config={
  user:     'indicadors',
  password: 'in234ca234dor$',
  server:   'srv-apps-03.icra.local', //'localhost' or 'yourserver.database.windows.net'
  database: 'ICRA',
  options:{
    encrypt: false,          //default:true, //required for Azure SQL
    trustServerCertificate: false, //default:true // Change to false in production
  },
};

async function queryDatabase() {
  try{
    //connect to the database
    await sql.connect(config);
    console.log('Connected to SQL Server');

    //query the table
    const result = await sql.query(`SELECT * FROM dbo.C_llistat_project4`);

    console.log('Query results:', result.recordset);

    //close the connection
    await sql.close();
  }catch(err){
    console.error('SQL error', err);
  }
}

//execute the query
queryDatabase();
