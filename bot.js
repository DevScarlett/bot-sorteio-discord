const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'TOKEN DO BOT';
const serverID = 'ID SERVER';
const canalID = 'ID CANAL';
const roleID = 'ID CARGO';
const fs = require('fs');
const champsFile = 'champsFile.json';
let arrayVencedorParaSave = [];

client.on('ready', () => {
  console.log(`Bot está online e pronto para funfar!`);
  agendarSorteio();
});

function agendarSorteio() {
  const horaSorteio = '12:00';

  const [hora, ninutos] = horaSorteio.split(':');
  const horaAtual = new Date();
  const dataAtual = new Date(
    horaAtual.getFullYear(),
    horaAtual.getMonth(),
    horaAtual.getDate(),
    parseInt(hora),
    parseInt(ninutos),
    0
  );

  const tempoProxSorteio = dataAtual.getTime() - horaAtual.getTime();
  if (tempoProxSorteio < 0) {
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  setTimeout(() => {
    iniciarSorteio();
    agendarSorteio();
  }, tempoProxSorteio);
}

function iniciarSorteio() {
  const server = client.guilds.cache.get(serverID);
  const canal = server.channels.cache.get(canalID);

  if (!server || !canal || canal.type !== 'text') {
    console.log(`Canal ou servidor inválido.`);
    return;
  }

  const role = server.roles.cache.get(roleID);
  if (!role) {
    console.log(`Cargo inválido.`);
    return;
  }

  const participantes = server.members.cache.filter((member) => member.roles.cache.has(roleID) && !member.user.bot).array();
  if (participantes.length < 2) {
    console.log(`Número insuficiente de participantes com o cargo específico para participar do sorteio.`);
    return;
  }

  const champ = participantes[Math.floor(Math.random() * participantes.length)];

  //
  const vencedorParaSave = { nome: champ, data: new Date() };
  arrayVencedorParaSave.push(vencedorParaSave);

  const msgEmbed = new Discord.MessageEmbed()
  .setTitle('Resultado do Sorteio')
  .setDescription(`Parabéns, ${champ}! Você ganhou o sorteio! 🎉`)
  .setColor('#FF0000');

canal.send(msgEmbed);
saveChamps();
}

function saveChamps() {
  const data = JSON.stringify(arrayVencedorParaSave, null, 2);

  fs.writeFile(champsFile, data, (err) => {
    if (err) {
      console.error('Erro ao salvar', err);
    } else {
      console.log('Salvo com sucesso.');
    }
  });
}

fs.readFile(champsFile, (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo', err);
  } else {
    try {
      arrayVencedorParaSave = JSON.parse(data);
      console.log('Carregado', arrayVencedorParaSave);
    } catch (error) {
      console.error('Erro ao fazer o parse do arquivo', error);
    }
  }
});

client.login(token);
