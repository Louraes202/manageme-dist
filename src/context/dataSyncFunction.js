// dataSyncFunctions.js
import { db } from "../services/firebaseConfig";
import * as SQLite from "expo-sqlite";
import firebase from 'firebase/compat/app';

const sqliteDb = SQLite.openDatabase("manageme");

const fetchAllDataFromSQLite = () => {
  return new Promise((resolve, reject) => {
    const data = {};
    sqliteDb.transaction(
      (tx) => {
        // Fetch Tarefas
        tx.executeSql(
          "SELECT * FROM Tarefas",
          [],
          (_, { rows: { _array } }) => {
            data.tarefas = _array;
          }
        );
        // Fetch Eventos
        tx.executeSql(
          "SELECT * FROM Eventos",
          [],
          (_, { rows: { _array } }) => {
            data.eventos = _array;
          }
        );
        // Fetch Atividades
        tx.executeSql(
          "SELECT * FROM Atividades",
          [],
          (_, { rows: { _array } }) => {
            data.atividades = _array;
          }
        );
        // Fetch Blocos
        tx.executeSql("SELECT * FROM Blocos", [], (_, { rows: { _array } }) => {
          data.blocos = _array;
        });
        // Fetch Projetos
        tx.executeSql(
          "SELECT * FROM Projetos",
          [],
          (_, { rows: { _array } }) => {
            data.projetos = _array;
          }
        );
        // Fetch Grupos
        tx.executeSql("SELECT * FROM Grupos", [], (_, { rows: { _array } }) => {
          data.grupos = _array;
        });
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(data);
      }
    );
  });
};

const uploadDataToFirebase = async (data) => {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const userId = user.uid;
  const userDoc = db.collection("users").doc(userId);

  await userDoc.set({
    tarefas: data.tarefas,
    eventos: data.eventos,
    atividades: data.atividades,
    blocos: data.blocos,
    projetos: data.projetos,
    grupos: data.grupos,
  });

  const saveDataToSQLite = (data) => {
    return new Promise((resolve, reject) => {
      sqliteDb.transaction(
        (tx) => {
          // Clear existing data
          tx.executeSql("DELETE FROM Tarefas");
          tx.executeSql("DELETE FROM Eventos");
          tx.executeSql("DELETE FROM Atividades");
          tx.executeSql("DELETE FROM Blocos");
          tx.executeSql("DELETE FROM Projetos");
          tx.executeSql("DELETE FROM Grupos");

          // Insert new data
          data.tarefas.forEach((tarefa) => {
            tx.executeSql(
              "INSERT INTO Tarefas (idTarefa, dataConclusao, diasRepeticao, idPerfil) VALUES (?, ?, ?, ?)",
              [
                tarefa.idTarefa,
                tarefa.dataConclusao,
                tarefa.diasRepeticao,
                tarefa.idPerfil,
              ]
            );
          });
          data.eventos.forEach((evento) => {
            tx.executeSql(
              "INSERT INTO Eventos (idEvento, nome, descricao, horaInicio, horaFim, diaMes, idPerfil) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                evento.idEvento,
                evento.nome,
                evento.descricao,
                evento.horaInicio,
                evento.horaFim,
                evento.diaMes,
                evento.idPerfil,
              ]
            );
          });
          data.atividades.forEach((atividade) => {
            tx.executeSql(
              "INSERT INTO Atividades (idAtividade, nome, descricao, cor, idPerfil) VALUES (?, ?, ?, ?, ?)",
              [
                atividade.idAtividade,
                atividade.nome,
                atividade.descricao,
                atividade.cor,
                atividade.idPerfil,
              ]
            );
          });
          data.blocos.forEach((bloco) => {
            tx.executeSql(
              "INSERT INTO Blocos (idBloco, hora_inicio, hora_fim, idAtividade, diaMes, idPerfil) VALUES (?, ?, ?, ?, ?, ?)",
              [
                bloco.idBloco,
                bloco.hora_inicio,
                bloco.hora_fim,
                bloco.idAtividade,
                bloco.diaMes,
                bloco.idPerfil,
              ]
            );
          });
          data.projetos.forEach((projeto) => {
            tx.executeSql(
              "INSERT INTO Projetos (idProjeto, nome, descricao, imageUri) VALUES (?, ?, ?, ?)",
              [
                projeto.idProjeto,
                projeto.nome,
                projeto.descricao,
                projeto.imageUri,
              ]
            );
          });
          data.grupos.forEach((grupo) => {
            tx.executeSql(
              "INSERT INTO Grupos (idGrupo, nome, descricao) VALUES (?, ?, ?)",
              [grupo.idGrupo, grupo.nome, grupo.descricao]
            );
          });
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  };

  const downloadDataFromFirebase = async () => {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const userId = user.uid;
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    const data = userDoc.data();
    await saveDataToSQLite(data);
  };
};
