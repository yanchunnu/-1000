'use strict';
const $=id=>document.getElementById(id),lessonAudios=[$('ko'),$('zh')],audios=[...lessonAudios,$('full-ko'),$('full-zh')],speed=$('speed'),rate=$('rate'),buttons=$('buttons'),status=$('status'),selector=$('lesson');let active=audios[0],currentLesson=1;
function setRate(value){const v=Number(value);speed.value=String(v);rate.textContent=v.toFixed(2)+'×';audios.forEach(a=>{a.playbackRate=v;a.defaultPlaybackRate=v});document.querySelectorAll('[data-rate]').forEach(b=>{const selected=Number(b.dataset.rate)===v;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))})}
[.5,.75,1,1.25,1.5].forEach(v=>{const b=document.createElement('button');b.type='button';b.textContent=v+'×';b.dataset.rate=String(v);b.addEventListener('click',()=>setRate(v));buttons.appendChild(b)});
speed.addEventListener('input',()=>setRate(speed.value));$('repeat').addEventListener('change',e=>audios.forEach(a=>a.loop=e.target.checked));$('pause').addEventListener('click',()=>audios.forEach(a=>a.pause()));$('restart').addEventListener('click',()=>{active.currentTime=0;active.play().catch(()=>{status.textContent='재생 버튼을 눌러 주세요.'})});
audios.forEach(a=>{a.addEventListener('play',()=>{active=a;status.textContent='';status.classList.remove('error');audios.filter(x=>x!==a).forEach(x=>x.pause())});a.addEventListener('loadedmetadata',()=>{a.playbackRate=Number(speed.value)});a.addEventListener('error',()=>{status.textContent='음원을 불러오지 못했어요. 인터넷 연결을 확인하거나 음원 열기 버튼을 눌러 주세요.';status.classList.add('error')})});
for(let i=1;i<=63;i++){const o=document.createElement('option');o.value=String(i);o.textContent='제'+i+'과 · 제'+((i-1)*4+1)+'~'+Math.min(i*4,250)+'구';selector.appendChild(o)}
function add(parent,tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=value;parent.appendChild(e);return e}
function lineText(parent,lines){parent.replaceChildren();lines.forEach((line,i)=>{if(i)parent.appendChild(document.createElement('br'));parent.appendChild(document.createTextNode(line))})}
function selectLesson(value,changeURL=true){
const n=Math.max(1,Math.min(63,Number.isInteger(Number(value))?Number(value):1));currentLesson=n;const part=ROWS.slice((n-1)*4,n*4),label='제'+n+'과 · 제'+part[0].n+'~'+part.at(-1).n+'구';
audios.forEach(a=>a.pause());selector.value=String(n);$('lesson-title').textContent=label;document.title='천자문 '+label+' · 음원 듣기';
const readings=part.map(r=>r.read),hans=part.map(r=>r.simple),pys=part.map(r=>r.py.join(' '));
lineText($('ko-text'),[readings.slice(0,2).join(' · '),readings.slice(2).join(' · ')].filter(Boolean));
lineText($('zh-text'),[hans.slice(0,2).join(' · '),hans.slice(2).join(' · ')].filter(Boolean));
lineText($('pinyin-text'),[pys.slice(0,2).join(' · '),pys.slice(2).join(' · ')].filter(Boolean));
for(const a of lessonAudios){const path='audio/lesson-'+String(n).padStart(2,'0')+'-'+a.id+'.mp3';a.querySelector('source').src=path+(n===1&&a.id==='zh'?'?v=2':'');a.setAttribute('aria-label',label+' '+(a.id==='ko'?'한국어':'중국어')+' 낭독');$('download-'+a.id).href=path;a.load()}
const notes=[];for(const r of part){if(r.n===4)notes.push('宿는 별자리 수, xiù라고 읽어요.');if(r.n===140)notes.push('說은 부열을 가리키며, 중국어로 yuè라고 읽어요.');if(r.n===156)notes.push('禪은 산천 제사를 뜻하며 shàn으로 읽어요.');if(r.n===200)notes.push('屬은 귀를 기울인다는 뜻으로 zhǔ로 읽어요.');if(r.n===232)notes.push('任은 임공자의 성으로 rén으로 읽어요.')}
$('pronunciation-note').textContent=notes.join(' ');$('pronunciation-note').hidden=!notes.length;
$('study').replaceChildren();for(const r of part){const article=add($('study'),'article','verse','');add(article,'strong','','제'+r.n+'구 · '+r.read);add(article,'p','han',r.han);add(article,'p','',r.direct);add(article,'p','explain',r.explain)}
$('previous').disabled=n===1;$('next').disabled=n===63;$('download-lesson').href='cheonjamun-001-250.pdf#page='+n;
status.textContent='';status.classList.remove('error');active=audios[0];setRate(speed.value);
if(changeURL){const u=new URL(location.href);if(n===1)u.searchParams.delete('lesson');else u.searchParams.set('lesson',String(n));history.replaceState(null,'',u)}
}
selector.addEventListener('change',()=>selectLesson(selector.value));$('previous').addEventListener('click',()=>selectLesson(currentLesson-1));$('next').addEventListener('click',()=>selectLesson(currentLesson+1));window.addEventListener('popstate',()=>selectLesson(new URLSearchParams(location.search).get('lesson')||1,false));setRate(1);selectLesson(new URLSearchParams(location.search).get('lesson')||1,false);


