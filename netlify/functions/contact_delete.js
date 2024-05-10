const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to create a contact.' }),
      };
    }



    const { id } = event.queryStringParameters;


    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

   
    const query = 'DELETE FROM contacts WHERE id = ?';

   
    await connection.execute(query, [id]);

   
    await connection.end();

  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact deleted successfully' })
    };
  } catch (error) {

    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete contact', details: error.message })
    };
  }
};


    