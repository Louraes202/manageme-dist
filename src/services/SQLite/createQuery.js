const createTablesQuery = `
CREATE TABLE IF NOT EXISTS Atividades (
    idAtividade INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeAtividade NVARCHAR(100) NOT NULL,
    descricaoAtividade NVARCHAR(255),
    flexivel BOOLEAN NOT NULL,
    idPerfil INTEGER,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Blocos (
    idBloco INTEGER PRIMARY KEY AUTOINCREMENT,
    hora_inicio DATETIME NOT NULL,
    hora_fim DATETIME NOT NULL,
    idAtividade INTEGER,
    diaMes DATE,
    idPerfil INTEGER,
    FOREIGN KEY (idAtividade) REFERENCES Atividades(idAtividade),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Tarefas (
    idTarefa INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    repetir DATETIME,
    notificar DATETIME,
    idGrupo INTEGER,
    diaMes DATE,
    idPerfil INTEGER,
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Grupos (
    idGrupo INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    icone NVARCHAR(),
    idTarefa INTEGER,
    idPerfil INTEGER,
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Categorias (
    idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    cor VARCHAR(7) DEFAULT "#FFFFFF",
    ordena BOOLEAN NOT NULL,
    prioridade INTEGER NOT NULL DEFAULT 1,
    idPerfil INTEGER,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Habitos (
    idHabito INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    frequenciaSemanal INTEGER NOT NULL,
    idPerfil INTEGER,
    idRotina INTEGER,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil),
    FOREIGN KEY (idRotina) REFERENCES Rotinas(idRotina)
);

CREATE TABLE IF NOT EXISTS Perfil (
    idPerfil INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    idade NVARCHAR(2),
    idUtilizador INTEGER,
    FOREIGN KEY (idUtilizador) REFERENCES Utilizador(idUtilizador)
);

CREATE TABLE IF NOT EXISTS Utilizador (
    idUtilizador INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR NOT NULL,
    email NVARCHAR NOT NULL,
    password NVARCHAR NOT NULL,
    idPerfil INTEGER,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Dias_Mes (
    diaMes DATE PRIMARY KEY,
    diaSemana INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Eventos (
    idEvento INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    horaInicio DATETIME NOT NULL,
    horaFim DATETIME NOT NULL,
    diaMes DATE,
    idPerfil INTEGER,
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Ocasioes (
    idOcasiao INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255),
    diaMes DATE,
    idPerfil INTEGER,
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes),
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS ContaFinanceira (
    idConta INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    saldo DECIMAL NOT NULL,
    idPerfil INTEGER,
    FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE IF NOT EXISTS Transacoes (
    idTransacao INTEGER PRIMARY KEY AUTOINCREMENT,
    idContaFinanceira INTEGER,
    valor DECIMAL NOT NULL,
    repetir DATETIME,
    descricao NVARCHAR(255) NOT NULL,
    tipo NVARCHAR(100) NOT NULL,
    diaMes DATE,
    FOREIGN KEY (idContaFinanceira) REFERENCES ContaFinanceira(idConta),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE IF NOT EXISTS Rotinas (
    idRotina INTEGER PRIMARY KEY AUTOINCREMENT,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255)
);

CREATE TABLE IF NOT EXISTS TarefaAte_DiaMes (
    idTarefa INTEGER,
    diaMes DATE,
    PRIMARY KEY (idTarefa, diaMes),
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE IF NOT EXISTS TarefaAssociada_DiaMes (
    idTarefa INTEGER,
    diaMes DATE,
    PRIMARY KEY (idTarefa, diaMes),
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa),
    FOREIGN KEY (diaMes) REFERENCES Dias_Mes(diaMes)
);

CREATE TABLE IF NOT EXISTS CategoriaTarefa (
    idCategoria INTEGER,
    idTarefa INTEGER,
    PRIMARY KEY (idCategoria, idTarefa),
    FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategoria),
    FOREIGN KEY (idTarefa) REFERENCES Tarefas(idTarefa)
);

CREATE TABLE IF NOT EXISTS Habito_Grupo (
    idHabito INTEGER,
    idGrupo INTEGER,
    PRIMARY KEY (idHabito, idGrupo),
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito),
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo)
);

CREATE TABLE IF NOT EXISTS Habito_Rotina (
    idRotina INTEGER,
    idHabito INTEGER,
    PRIMARY KEY (idRotina, idHabito),
    FOREIGN KEY (idRotina) REFERENCES Rotinas(idRotina),
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito)
);

CREATE TABLE IF NOT EXISTS Atividade_Grupo (
    idAtividade INTEGER,
    idGrupo INTEGER,
    PRIMARY KEY (idAtividade, idGrupo),
    FOREIGN KEY (idAtividade) REFERENCES Atividades(idAtividade),
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo)
);

CREATE TABLE IF NOT EXISTS GrupoEvento (
    idGrupo INTEGER,
    idEvento INTEGER,
    PRIMARY KEY (idGrupo, idEvento),
    FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo),
    FOREIGN KEY (idEvento) REFERENCES Eventos(idEvento)
);
`;

export default createTablesQuery;