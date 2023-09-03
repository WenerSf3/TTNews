const connection = require("./connection.js");
const moment = require("moment");
let database = connection.promise();

async function insert(evento, status) {
  try {
    const [rows, fields] = await database.execute(
      `INSERT INTO historic (name, active, date, pips, result) VALUES (?, ?, ?, ?, ?);`,
      [
        evento.name,
        evento.active,
        `${moment(evento.date).format("YYYY-MM-DD HH:mm:ss")}`,
        `${evento.pips}`,
        `${status}`,
      ]
    );

    console.log("Registro inserido com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir registro:", error);
  }
}

async function deleteEvent(event) {
  try {
    const [rows, fields] = await database.execute(
      `DELETE FROM events WHERE id = ${event.id};`
    );

    console.log("Registro excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir registro:", error);
  }
}

async function createNewEvent(data) {
  try {
    let newEvent = await database.execute(
      `INSERT INTO events (level, name, active, status, pips, investing, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nivel,
        data.event_name,
        data.cambio,
        data.posicao,
        data.pavil.toString(),
        10,
        data.date,
      ]
    );
    return newEvent;
  } catch (error) {
    console.log("error", error);
  }
}

async function EditEvent(data) {
  try {
    let updatedEvent = await database.execute(
      `UPDATE events SET level=?, nane=?, active=?, status=?, pips=?, investing=?, date=? WHERE id=?`,
      [
        data.nivel,
        data.event_name,
        data.cambio,
        data.posicao,
        data.pavil.toString(),
        10,
        data.date,
        data.id
      ]
    );
    return updatedEvent;
  } catch (error) {
    console.log("error", error);
  }
}


async function enableEvents() {
  try {
    let OK = await database.execute(
      `UPDATE users SET search = '1' WHERE id = 1;`
    );
    return OK;
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
  }
}

async function disableEvents() {
  try {
    const [rows, fields] = await database.execute(
      `UPDATE users SET search = '0' WHERE id = 1;`
    );

    console.log("Registro atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
  }
}

async function enableEvents() {
  try {
    let OK = await database.execute(
      `UPDATE users SET search = '1' WHERE id = 1;`
    );
    return OK;
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
  }
}

async function getStatus() {
  try {
    const [rows, fields] = await database.execute(
      `UPDATE users SET search = '0' WHERE id = 1;`
    );

    console.log("Registro atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
  }
}

exports.insert = insert;
exports.deleteEvent = deleteEvent;
exports.enableEvents = enableEvents;
exports.disableEvents = disableEvents;
exports.getStatus = getStatus;
exports.EditEvent = EditEvent;
exports.createNewEvent = createNewEvent;
