const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to create a contact.' }),
      };
    }


    const { id, first_name, last_name, email, phone, category_id } = JSON.parse(event.body);

  
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });


    const query = 'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, category_id = ?, updated_at = NOW() WHERE id = ?';


    await connection.execute(query, [first_name, last_name, email, phone, category_id, id]);


    await connection.end();


    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact updated successfully' })
    };
  } catch (error) {

    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update contact', details: error.message })
    };
  }
};


