(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const bar = document.getElementById('bar');
  const toast = document.getElementById('toast');
  const app = document.getElementById('app');
  const musicBtn = document.getElementById('musicBtn');
  const youtubePlayer = document.getElementById('youtubePlayer');
  const MUSIC_URL = 'https://www.youtube.com/embed/mGUjVbsYG6E?autoplay=1&loop=1&playlist=mGUjVbsYG6E&controls=0&disablekb=1&playsinline=1&modestbranding=1&rel=0';
  let musicPlaying = false;
  let step = 0;

  function seedStars(){
    const box = document.getElementById('stars');
    for(let i=0;i<58;i++){
      const s=document.createElement('i');
      s.className='star';
      s.style.left=Math.random()*100+'%';
      s.style.top=Math.random()*100+'%';
      s.style.animationDelay=(Math.random()*3.2)+'s';
      s.style.opacity=.15+Math.random()*.55;
      if(Math.random()>.8){s.style.width=s.style.height='3px'}
      box.appendChild(s);
    }
  }
  seedStars();

  function showToast(text){
    toast.textContent=text;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t=setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function startMusic(showMessage=true){
    if(musicPlaying) return;
    youtubePlayer.src=MUSIC_URL;
    musicPlaying=true;
    musicBtn.classList.add('active');
    musicBtn.textContent='♫';
    musicBtn.setAttribute('aria-label','Müziği kapat');
    if(showMessage) showToast('No. 1 Party Anthem başladı ♫');
  }

  function stopMusic(){
    youtubePlayer.src='about:blank';
    musicPlaying=false;
    musicBtn.classList.remove('active');
    musicBtn.textContent='♪';
    musicBtn.setAttribute('aria-label','Müziği aç');
    showToast('Müzik durduruldu.');
  }

  function go(n){
    screens[step].classList.remove('active');
    step=n;
    screens[step].classList.add('active');
    bar.style.width=((step+1)/screens.length*100)+'%';
    if(step===6){
      setTimeout(()=>document.getElementById('finalCard').classList.add('color'),420);
      heartBurst(innerWidth/2, innerHeight*.28, 16);
    }
  }

  function heartBurst(x,y,count=10){
    const icons=['♥','♡','✦','✨'];
    for(let i=0;i<count;i++){
      const h=document.createElement('i');
      h.className='heart';
      h.textContent=icons[Math.floor(Math.random()*icons.length)];
      h.style.left=(x-25+Math.random()*50)+'px';
      h.style.top=(y-10+Math.random()*20)+'px';
      h.style.color=Math.random()>.5?'#ff7797':'#ad92ff';
      h.style.animationDelay=(Math.random()*.22)+'s';
      app.appendChild(h);
      setTimeout(()=>h.remove(),1700);
    }
  }

  document.getElementById('startBtn').addEventListener('click',e=>{
    startMusic(false);
    heartBurst(e.clientX||innerWidth/2,e.clientY||innerHeight*.72,12);
    showToast('Hediyen açıldı, şarkımız da başladı ♫');
    setTimeout(()=>go(1),280);
  });

  musicBtn.addEventListener('click',()=>{
    if(musicPlaying) stopMusic();
    else startMusic(true);
  });

  document.querySelectorAll('.quiz').forEach((quiz,idx)=>{
    const correct=Number(quiz.dataset.correct);
    const answers=[...quiz.querySelectorAll('.answer')];
    const feedback=quiz.querySelector('.feedback');
    const wrongTexts=[
      'Yaklaştın ama sistem “Hatice bunu bilir” diyor 😌',
      'Olmadı bebişim. Bir daha düşün bakalım.',
      'Bu şık Enes tarafından veto edildi 😄'
    ];
    answers.forEach((btn,i)=>btn.addEventListener('click',()=>{
      if(btn.classList.contains('correct')) return;
      if(i===correct){
        btn.classList.add('correct');
        feedback.style.color='#9df0c2';
        feedback.textContent=idx===0?'Aynen öyle. Mesafe geçici, yerimiz birbirimizin yanı.':idx===1?'Doğru. Sesin onun gününü düzeltiyor.':'Tam paket bulundu: sert kabuk, ev adamı kalbi.';
        answers.forEach(a=>a.disabled=true);
        heartBurst(innerWidth/2,innerHeight*.66,8);
        setTimeout(()=>go(step+1),1200);
      }else{
        btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
        feedback.style.color='#ff9bb3';
        feedback.textContent=wrongTexts[Math.floor(Math.random()*wrongTexts.length)];
      }
    }));
  });

  const reveals=[...document.querySelectorAll('.reveal')];
  const revealNext=document.getElementById('revealNext');
  reveals.forEach((r)=>r.addEventListener('click',()=>{
    r.classList.add('open');
    if(reveals.every(x=>x.classList.contains('open'))){
      revealNext.disabled=false;
      revealNext.style.opacity='1';
      revealNext.textContent='Şimdi son soruya geç ♥';
    }
  }));
  revealNext.addEventListener('click',()=>go(5));

  let littleCount=0;
  const warningBox=document.getElementById('warningBox');
  const littleBtn=document.getElementById('littleBtn');
  littleBtn.addEventListener('click',()=>{
    littleCount++;
    warningBox.classList.remove('show'); void warningBox.offsetWidth; warningBox.classList.add('show');
    if(littleCount===1){
      warningBox.textContent='⚠️ Sistem bu cevabı şüpheli buldu. Parmağın kaymış olabilir; tekrar dene.';
      littleBtn.textContent='Yanlışlıkla bastım';
    }else{
      warningBox.textContent='✅ Hata düzeltildi. Cevabın otomatik olarak “Çok seviyorum” yapıldı.';
      littleBtn.textContent='Çok seviyorum';
      littleBtn.classList.remove('little');
      littleBtn.classList.add('much');
      heartBurst(innerWidth*.3,innerHeight*.58,12);
      setTimeout(()=>go(6),1100);
    }
  });
  document.getElementById('muchBtn').addEventListener('click',e=>{
    heartBurst(e.clientX||innerWidth*.7,e.clientY||innerHeight*.58,15);
    showToast('Cevabın başarıyla kaydedildi. Geri dönüş yok Hatice Hanım.');
    setTimeout(()=>go(6),900);
  });

  document.getElementById('heartRain').addEventListener('click',e=>{
    for(let i=0;i<5;i++) setTimeout(()=>heartBurst(Math.random()*innerWidth, innerHeight*(.65+Math.random()*.25),12),i*140);
    showToast('İyi ki varsın, hayatımın anlamı.');
  });

  Promise.all(['image-1.txt','image-2.txt','image-3.txt','image-4.txt'].map(file=>fetch(file).then(r=>r.text())))
    .then(parts=>{document.getElementById('haticePhoto').src='data:image/jpeg;base64,'+parts.join('');})
    .catch(()=>showToast('Fotoğraf yüklenemedi. Sayfayı yenile.'));

  bar.style.width=(1/screens.length*100)+'%';
})();
