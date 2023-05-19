const Discord = require('discord.js');
const sorteio = require('./sorteio');

const client = new Discord.Client();
const token = 'TOKEN DO BOT';
const serverID = 'ID SERVER';
const canalID = 'ID CANAL';
const roleID = 'ID CARGO';
const champsFile = 'champsFile.json';

client.on('ready', () => {
  console.log(`Bot está online e pronto para funfar!`);
  sorteio.loadChamps(champsFile);
  agendarSorteio();
});

function agendarSorteio() {
  const horaSorteio = '12:00';

  const [hora, minutos] = horaSorteio.split(':');
  const horaAtual = new Date();
  const dataAtual = new Date(
    horaAtual.getFullYear(),
    horaAtual.getMonth(),
    horaAtual.getDate(),
    parseInt(hora),
    parseInt(minutos),
    0
  );

  const tempoProxSorteio = dataAtual.getTime() - horaAtual.getTime();
  if (tempoProxSorteio < 0) {
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  setTimeout(() => {
    const server = client.guilds.cache.get(serverID);
    const canal = server.channels.cache.get(canalID);
    const role = server.roles.cache.get(roleID);

    sorteio.iniciarSorteio(server, canal, role);
    agendarSorteio();
  }, tempoProxSorteio);
}

client.login(token);
