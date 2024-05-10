const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to create a contact.' }),
      };
    }



    const { id, note } = JSON.parse(event.body);


    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });


    const query = 'UPDATE notes SET note = ?, updated_at = NOW() WHERE id = ?';


    await connection.execute(query, [note, id]);


    await connection.end();

 successfully
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note updated successfully" })
    };
  } catch (error) {

    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update note", details: error.message })
    };
  }
};

