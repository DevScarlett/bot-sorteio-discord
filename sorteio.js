const Discord = require('discord.js');
const fs = require('fs');

let arrayVencedorParaSave = [];

function iniciarSorteio(server, canal, role) {
  if (!server || !canal || canal.type !== 'text') {
    console.log(`Canal ou servidor inválido.`);
    return;
  }

  const participantes = server.members.cache.filter((member) => member.roles.cache.has(role.id) && !member.user.bot).array();
  if (participantes.length < 2) {
    console.log(`Número insuficiente de participantes com o cargo específico para participar do sorteio.`);
    return;
  }

  const champ = participantes[Math.floor(Math.random() * participantes.length)];

  //
  const vencedorParaSave = { nome: champ.user.username, data: new Date() };
  arrayVencedorParaSave.push(vencedorParaSave);

  const msgEmbed = new Discord.MessageEmbed()
    .setTitle('Resultado do Sorteio')
    .setDescription(`Parabéns, ${champ.user.username}! Você ganhou o sorteio! 🎉`)
    .setColor('#FF0000');

  canal.send(msgEmbed);
  saveChamps();
}

function saveChamps(champsFile) {
  const data = JSON.stringify(arrayVencedorParaSave, null, 2);

  fs.writeFile(champsFile, data, (err) => {
    if (err) {
      console.error('Erro ao salvar', err);
    } else {
      console.log('Salvo com sucesso.');
    }
  });
}

function loadChamps(champsFile) {
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
}

module.exports = {
  iniciarSorteio,
  saveChamps,
  loadChamps
};
