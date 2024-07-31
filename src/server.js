const pool = require('./database');

async function getClients() {
  try {
    const result = await pool.query('SELECT * FROM clients');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getClientAddress() {
  try {
    const result = await pool.query('SELECT * FROM clientaddress');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getInvoice(pageNumber) {
  try {
    const pageSize = 15;
    const offset = (pageNumber - 1) * pageSize;

     // Query to get the total number of rows
     const countQuery = 'SELECT COUNT(*) FROM invoicedb';
     const countResult = await pool.query(countQuery);
     const totalRows = parseInt(countResult.rows[0].count, 10);
 
     // Calculate the total number of pages
     const totalPages = Math.ceil(totalRows / pageSize);

    const query = `SELECT * FROM invoicedb LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [pageSize, offset]);
    return { data: result.rows, totalPages:totalPages };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getInvoiceReg(pageNumber) {
  try {
    const pageSize = 15;
    const offset = (pageNumber - 1) * pageSize;

     // Query to get the total number of rows
     const countQuery = 'SELECT COUNT(*) FROM invoicemaster';
     const countResult = await pool.query(countQuery);
     const totalRows = parseInt(countResult.rows[0].count, 10);
 
     // Calculate the total number of pages
     const totalPages = Math.ceil(totalRows / pageSize);


    const query = `SELECT * FROM invoicemaster LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [pageSize, offset]);
    return { data: result.rows, totalPages:totalPages };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function addClients(clientInfo) {
  try {
    const { clientName, bankName, ifsc, accountNo, branchName, gstin, sac } = clientInfo;
    const query = `
      INSERT INTO clients (clientname, bankname, bankifsc, bankaccountnumber, bankbranch, clientgstin, sacforclient)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const values = [clientName, bankName, ifsc, accountNo, branchName, gstin, sac];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
}

async function getClient(id) {
  try {
    const query = 'SELECT * FROM clients WHERE clientid = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

async function getInvoiceByInvoiceNo(invoiceNo) {
  try {

    // Query to get the total number of rows for the provided invoice number
    const countQuery = 'SELECT COUNT(*) FROM invoicedb WHERE invoiceno::text LIKE $1';
    const countResult = await pool.query(countQuery, [invoiceNo]);
    const totalRows = parseInt(countResult.rows[0].count, 10);
    
    // Calculate the total number of pages (either 0 or 1)
    const totalPages = totalRows > 0 ? 1 : 0;

    const query = 'SELECT * FROM invoicedb WHERE invoiceno::text LIKE $1';
    const result = await pool.query(query, [invoiceNo]);
    return {
      totalPages: totalPages,
      data: result.rows
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
}

async function getInvoicesByDateRange(dateFrom, dateTo, pageNumber) {
  try {
    const pageSize = 15;
    const offset = (pageNumber - 1) * pageSize;

    // Query to get the total number of rows for the provided date range
    const countQuery = 'SELECT COUNT(*) FROM invoicedb WHERE date BETWEEN $1 AND $2';
    const countResult = await pool.query(countQuery, [dateFrom, dateTo]);
    const totalRows = parseInt(countResult.rows[0].count, 10);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRows / pageSize);

    // Query to get the data within the provided date range with pagination
    const query = 'SELECT * FROM invoicedb WHERE date BETWEEN $1 AND $2 ORDER BY date LIMIT $3 OFFSET $4';
    const result = await pool.query(query, [dateFrom, dateTo, pageSize, offset]);

    return {
      totalPages: totalPages,
      data: result.rows
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

async function getParticulars(id) {
  try {
    const query = `SELECT srno, invoiceno, particulars, quantity, rate, rowsubtotal, cgst, sgst, rowtotal, submitdate FROM invoicemaster WHERE invoiceno = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

async function getInvoiceDetails(){
  try{
    const latest_invoice = await pool.query('SELECT invoiceno, date from invoicedb ORDER BY srno DESC LIMIT 1');
  const all_clients = await pool.query('SELECT * from clients');
  return {latest_invoice:latest_invoice.rows[0], all_clients:all_clients.rows};

  }catch (error){
    console.log('Error querying database:', error)
    throw error
  }
  
}

async function getAddressList(id){
  try{
    const query = 'SELECT srno, address, clientname FROM clientaddress WHERE clientid = $1';
    const values = [id];
    const result = await pool.query(query, values);
    
    return result.rows;
  } catch (error){
    console.log('Error querying database:', error)
    throw error
  }
}

async function addInvoice(invoiceDetails) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert data into invoicedb table
    const insertInvoiceQuery = `
      INSERT INTO invoicedb (invoiceno,date, clientname, address, gstin, sacforclient, bankname, bankbranch, bankaccno, bankifsc, subtotal, cgst, sgst, total, remark)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15)
      RETURNING invoiceno
    `;
    const invoiceValues = [
      invoiceDetails.invoiceno,
      invoiceDetails.invoicedate,
      invoiceDetails.clientname,
      invoiceDetails.address,
      invoiceDetails.clientgstin,
      invoiceDetails.sacforclient,
      invoiceDetails.bankname,
      invoiceDetails.bankbranch,
      invoiceDetails.bankaccountnumber,
      invoiceDetails.bankifsc,
      invoiceDetails.subtotal,
      invoiceDetails.cgst,
      invoiceDetails.sgst,
      invoiceDetails.total,
      invoiceDetails.remark
    ];

    const invoiceResult = await client.query(insertInvoiceQuery, invoiceValues);
    const invoiceno = invoiceResult.rows[0].invoiceno;

    // Insert data into invoicemaster table
    const insertParticularsQuery = `
      INSERT INTO invoicemaster (invoiceno, particulars, quantity, rate, rowsubtotal, cgst, sgst, rowtotal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    for (const item of invoiceDetails.perticulars) {
      const particularsValues = [
        invoiceno,
        item.description,
        item.quantity,
        item.rate,
        item.subtotal,
        item.cgst,
        item.sgst,
        item.total
      ];
      await client.query(insertParticularsQuery, particularsValues);
    }

    await client.query('COMMIT');
    return { success: true, invoiceno };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    client.release();
  }
}


module.exports = { getClients, getClientAddress, getInvoice, getInvoiceReg, addClients, getClient, getInvoiceByInvoiceNo,getInvoicesByDateRange, getParticulars,getInvoiceDetails,getAddressList, addInvoice };