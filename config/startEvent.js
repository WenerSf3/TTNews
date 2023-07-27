const moment = require('moment');

async function startEvent(evento, argument, global) {
    if (argument === 'stop') {
      messagee.innerHTML = `<div id="countdown" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 50px;"><div id="estrategia" style="color: green; font-size: 24px; font-weight: bold; margin-bottom: 10px;">PAUSADO!</div><div id="tempoRestante" style="font-size: 18px; margin-bottom: 10px;"></div><div id="evento" style="font-size: 16px;position:relative;top:-15px;">${eventName}</div></div>`;
      clearInterval(intervalo);
      return;
    }
  
    const datee = moment(evento.date,'YYYY-MM-DD HH:mm:ss').subtract(26, 'seconds');
    let estrategia = document.querySelector('#estrategia').value;
    let chamouFuncao = false;
    let chamouFuncao2 = false;
  
    intervalo = setInterval(async () => {
      
      const horarioData = await global.$eval('.server-time.online', element => element.textContent.trim());
      const horarioRegex = /(\d{2}:\d{2}:\d{2})/;
      const match = horarioData.match(horarioRegex);
      const horario = match ? match[1] : null;
  
      const horarioMoment = moment(`${moment().format('YYYY-MM-DD')} ${horario}`, 'YYYY-MM-DD HH:mm:ss');
      const horarioAlvo = moment(datee, 'YYYY-MM-DD HH:mm:ss');
      
      let horario_corretora = document.getElementById('horario_corretora');
      
      if (horarioMoment.isValid() && horarioAlvo.isValid()) {
        horario_corretora.innerHTML = horarioMoment.format('YYYY-MM-DD HH:mm:ss');
        if (horarioMoment.isBefore(horarioAlvo)) {
          const segundosRestantes = horarioAlvo.diff(moment(), 'seconds');
          const duration = moment.duration(segundosRestantes, 'seconds');
          const dias = Math.floor(duration.asDays());
          const horas = String(duration.hours()).padStart(2, '0');
          const minutos = String(duration.minutes()).padStart(2, '0');
          const segundos = String(duration.seconds()).padStart(2, '0');
  
          messagee.innerHTML = `<div id="countdown" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 50px;"><div id="estrategia" style="color: green; font-size: 24px; font-weight: bold; margin-bottom: 10px;">${estrategia}</div><div id="tempoRestante" style="font-size: 18px; margin-bottom: 10px;">${dias} Dias ${horas}:${minutos}:${segundos} para o EVENTO!</div><div id="evento" style="font-size: 16px;position:relative;top:-15px;">${evento.event_name}</div></div>`;
  
          if (segundosRestantes < 20 && !chamouFuncao2) {
            chamouFuncao2 = true;
            cambioGetPrice(ativo);
          }
          if (segundosRestantes === 0 && !chamouFuncao) {
            chamouFuncao = true;
            AllReady(estrategia, evento, pips, ativo, global);
          }
        } else {
          console.log('messsssssssssssss222' ,horarioMoment < horarioAlvo)
  
          console.log('saiu no loop' );
          clearInterval(intervalo);
        }
      }
    }, 1000);
  }

  module.exports = { startEvent };