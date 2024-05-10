const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to create a contact.' }),
      };
    }

  


    const requestBody = JSON.parse(event.body);
    const { first_name, last_name, email, phone, category_id } = requestBody;

  
    if (!first_name || !last_name || !email || !phone || !category_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters (first_name, last_name, email, phone, category_id).' }),
      };
    }

 
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });


    const query = 'INSERT INTO contacts (first_name, last_name, email, phone, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';

  
    await connection.execute(query, [first_name, last_name, email, phone, category_id]);

 
    await connection.end();


    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact created successfully' })
    };
  } catch (error) {

    console.error('Error creating contact:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create your contact', details: error.message })
    };
  }
};


