const connection = require("./connection.js");
const moment = require("moment");
let database = connection.promise();

async function insert(evento , status) {
  try {
    const [rows, fields] = await database.execute(
      `INSERT INTO Historico (evento, cambio, horario, pavil, resultado) VALUES (?, ?, ?, ?, ?);`,
      [evento.event_name, evento.cambio , `${moment(evento.date).format('YYYY-MM-DD HH:mm:ss')}`, `${evento.pavil}`, `${status}`]
    );

    console.log('Registro inserido com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir registro:', error);
  }
}

async function deleteEvent(event) {
    try {
      const [rows, fields] = await database.execute(
        `DELETE FROM Eventos WHERE id = ${event.id};`
      );
  
      console.log('Registro excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
    }
  }

  async function enableEvents() {
    try {
      const [rows, fields] = await database.execute(
        `UPDATE users SET search = '1' WHERE id = 1;`
      );
  
      console.log('Registro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
    }
  }

  async function disableEvents() {
    try {
      const [rows, fields] = await database.execute(
        `UPDATE users SET search = '0' WHERE id = 1;`
      );
  
      console.log('Registro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
    }
  }
  
exports.insert = insert;
exports.deleteEvent = deleteEvent;
exports.enableEvents = enableEvents;
exports.disableEvents = disableEvents;
