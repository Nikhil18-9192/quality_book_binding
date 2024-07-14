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


module.exports = { getClients, getClientAddress, getInvoice, getInvoiceReg, addClients, getClient, getInvoiceByInvoiceNo,getInvoicesByDateRange }