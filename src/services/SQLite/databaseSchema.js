export const databaseSchema = `
CREATE TABLE Utilizador(
    idUtilizador INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email NVARCHAR(255) CHECK (email LIKE '%@%.%') NOT NULL,
    password NVARCHAR(255) NOT NULL
);

CREATE TABLE Perfil(
    idPerfil INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    idade NVARCHAR(2),
    FOREIGN KEY (idUtilizador) REFERENCES Utilizador(idUtilizador)
);

CREATE TABLE Dias_Mes(
    diaMes DATE PRIMARY KEY,
    diaSemana INT NOT NULL -- Podemos guardar o diaSemana como INT provisoriamente, quando inserimos os dados na tabela usaremos o DAYOFWEEK()
);

CREATE TABLE Rotinas(
    idRotina INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255)
);

CREATE TABLE Tarefas(
    idTarefa INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    repetir DATETIME,
    notificar DATETIME,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE Eventos(
    idEvento INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    horaInicio DATETIME NOT NULL,
    horaFim DATETIME NOT NULL,
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE Ocasioes(
    idOcasiao INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE Atividades (
    idAtividade INT AUTO_INCREMENT PRIMARY KEY,
    nomeAtividade NVARCHAR(100) NOT NULL,
    descricaoAtividade NVARCHAR(255),
    flexivel BOOL NOT NULL,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE Atividade_Grupo(
    idAteDia INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idAtividade) REFERENCES Atividades(idAtividade),
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo)
);

CREATE TABLE Blocos (
    idBloco INT AUTO_INCREMENT PRIMARY KEY,   
    hora_inicio DATETIME NOT NULL,
    hora_fim DATETIME NOT NULL,
    FOREIGN KEY (idAtividade) REFERENCES Atividades(idAtividade),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE Grupos(
    idGrupo INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    icone NVARCHAR(),
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE GrupoEvento(
    idAteDia INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo),
    FOREIGN KEY (idEvento) REFERENCES Eventos(idEvento)
);

CREATE TABLE Habitos(
    idHabito INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    frequenciaSemanal INT NOT NULL,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil),
    FOREIGN KEY (idRotina) REFERENCES Rotinas(idRotina)
);

CREATE TABLE Habito_Grupo(
    idGrupoHabito INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito),
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo)
);

CREATE TABLE Habito_Rotina(
    idRotinaHabito INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idRotina) REFERENCES Rotinas(idRotina),
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito)
);

CREATE TABLE Categorias(
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    cor VARCHAR(7) CHECK (cor LIKE "#%%%%%%"),
    ordena BOOL NOT NULL,
    prioridade INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)   
);

CREATE TABLE CategoriaTarefa(
    idCatTarefa INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategoria),
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefas)
);

CREATE TABLE ContaFinanceira(
    idConta INT AUTO_INCREMENT PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    saldo DECIMAL NOT NULL,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)   
);

CREATE TABLE Transacoes(
    idContaFinanceira INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL NOT NULL,
    repetir DATETIME,
    descricao NVARCHAR(255) NOT NULL,
    tipo NVARCHAR(100) NOT NULL,
    FOREIGN KEY (idConta) REFERENCES ContaFinanceira(idConta),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE TarefaAte_DiaMes(
    idAteDia INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE TarefaAssociada_DiaMes(
    idAssociadaDia INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);
`;