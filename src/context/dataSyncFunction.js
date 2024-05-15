import * as SQLite from 'expo-sqlite';
import { firestore, auth } from '../services/firebaseConfig';

const db = SQLite.openDatabase("manageme");

export const fetchAllDataFromSQLite = async () => {
  const data = {
    tasks: [],
    events: [],
    activities: [],
    blocks: [],
    projects: [],
    groups: [],
    habits: []
  };

  // Fetch data from each table
  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Tarefas', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.tasks.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Eventos', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.events.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Atividades', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.activities.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Blocos', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.blocks.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Projetos', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.projects.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Grupos', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.groups.push(results.rows.item(i));
        }
      });

      tx.executeSql('SELECT * FROM Habitos', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          data.habits.push(results.rows.item(i));
        }
      });

      resolve();
    }, reject);
  });

  return data;
};

export const uploadDataToFirebase = async (data) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = firestore.collection('users').doc(user.uid);

  await userRef.set(data, { merge: true });
};

export const downloadDataFromFirebase = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = firestore.collection('users').doc(user.uid);
  const doc = await userRef.get();

  if (doc.exists) {
    const data = doc.data();

    // Clear current SQLite tables
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM Tarefas');
        tx.executeSql('DELETE FROM Eventos');
        tx.executeSql('DELETE FROM Atividades');
        tx.executeSql('DELETE FROM Blocos');
        tx.executeSql('DELETE FROM Projetos');
        tx.executeSql('DELETE FROM Grupos');
        tx.executeSql('DELETE FROM Habitos');
        resolve();
      }, reject);
    });

    // Insert data into SQLite tables
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        data.tasks.forEach(task => {
          tx.executeSql('INSERT INTO Tarefas (idTarefa, dataConclusao, diasRepeticao) VALUES (?, ?, ?)', 
          [task.idTarefa, task.dataConclusao, task.diasRepeticao]);
        });

        data.events.forEach(event => {
          tx.executeSql('INSERT INTO Eventos (idEvento, nome, descricao, horaInicio, horaFim, diaMes, idPerfil) VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [event.idEvento, event.nome, event.descricao, event.horaInicio, event.horaFim, event.diaMes, event.idPerfil]);
        });

        data.activities.forEach(activity => {
          tx.executeSql('INSERT INTO Atividades (idAtividade, nome, descricao, idPerfil) VALUES (?, ?, ?, ?)', 
          [activity.idAtividade, activity.nome, activity.descricao, activity.idPerfil]);
        });

        data.blocks.forEach(block => {
          tx.executeSql('INSERT INTO Blocos (idBloco, hora_inicio, hora_fim, idAtividade, diaMes, idPerfil) VALUES (?, ?, ?, ?, ?, ?)', 
          [block.idBloco, block.hora_inicio, block.hora_fim, block.idAtividade, block.diaMes, block.idPerfil]);
        });

        data.projects.forEach(project => {
          tx.executeSql('INSERT INTO Projetos (idProjeto, nome, descricao, imageUri) VALUES (?, ?, ?, ?)', 
          [project.idProjeto, project.nome, project.descricao, project.imageUri]);
        });

        data.groups.forEach(group => {
          tx.executeSql('INSERT INTO Grupos (idGrupo, nome) VALUES (?, ?)', 
          [group.idGrupo, group.nome]);
        });

        data.habits.forEach(habit => {
          tx.executeSql('INSERT INTO Habitos (idHabito, nome, descricao, diasRepeticao, idPerfil) VALUES (?, ?, ?, ?, ?)', 
          [habit.idHabito, habit.nome, habit.descricao, habit.diasRepeticao, habit.idPerfil]);
        });

        resolve();
      }, reject);
    });
  }
};
