const serviceGroups=[
 {title:'Диагностика и электрооборудование',items:['Компьютерная диагностика автомобилей','Ремонт электронных систем авто','Ремонт стартеров и генераторов','Установка и ремонт автооптики']},
 {title:'Двигатель и трансмиссия',items:['Ремонт бензиновых двигателей','Ремонт МКПП','Ремонт инжекторов','Ремонт выхлопных систем','Ремонт карданных валов']},
 {title:'Ходовая часть и тормоза',items:['Ремонт ходовой части автомобиля','Ремонт стоек','Проточка тормозных дисков','Ремонт рулевых реек','Развал-схождение','Замена колодок']},
 {title:'Масла и обслуживание',items:['Замена масла','Обслуживание автомобильных климатических систем']},
 {title:'Шины и диски',items:['Шиномонтаж','Сварка дисков','Выездной шиномонтаж','Мотошиномонтаж','Ремонт порезов','Правка / Прокатка дисков']},
 {title:'Сварочные работы',items:['Сварочные работы']}
];
const productGroups={parts:['Запчасти для иномарок','Запчасти для отечественных авто','Топливная система','Тормозная система','Трансмиссия','Электрика','Расходные материалы','Автозеркала'],oils:['Автомасла','Масла на розлив','Спецжидкости','Автохимия','Автокосметика'],accessories:['Шины и диски','Легковые шины','Автомобильные аккумуляторы','Автоэмали','Автоаксессуары','EVA коврики','Автоароматизаторы','Автобагажники','Автоинструмент','Автоковрики','Авточехлы']};
function renderProducts(filter='all'){
 const items=filter==='all'?Object.values(productGroups).flat():productGroups[filter];
 document.querySelector('#product-list').replaceChildren(...items.map(text=>{const tag=document.createElement('span');tag.textContent=text;return tag}));
 document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>renderProducts(button.dataset.filter)));
document.querySelectorAll('[data-product]').forEach(link=>link.addEventListener('click',()=>renderProducts(link.dataset.product)));
const normalize=s=>s.toLocaleLowerCase('ru').replaceAll('ё','е').trim();
function renderServices(query=''){
 const normalized=normalize(query);const list=document.querySelector('#service-list');list.replaceChildren();let count=0;
 serviceGroups.forEach((group,index)=>{
  const items=group.items.filter(item=>normalize(item).includes(normalized)||normalize(group.title).includes(normalized));if(!items.length)return;count+=items.length;
  const details=document.createElement('details');details.open=!!normalized||index===0;
  const summary=document.createElement('summary');const title=document.createElement('span');title.className='service-group-title';title.textContent=group.title;summary.append(title);
  const ul=document.createElement('ul');items.forEach(item=>{const li=document.createElement('li');li.textContent=item;ul.append(li)});details.append(summary,ul);list.append(details);
 });
 document.querySelector('#service-count').textContent=normalized?`Найдено услуг: ${count}`:'Все услуги из карточки 2ГИС';
 if(!count){const empty=document.createElement('div');empty.className='service-empty';const p=document.createElement('p');p.textContent='Услуга не найдена. Попробуйте другое название.';const reset=document.createElement('button');reset.textContent='Сбросить поиск';reset.addEventListener('click',()=>{document.querySelector('#service-search').value='';renderServices();document.querySelector('#service-search').focus()});empty.append(p,reset);list.append(empty)}
}
document.querySelector('#service-search').addEventListener('input',event=>renderServices(event.target.value));
const menuButton=document.querySelector('.menu-toggle');const menu=document.querySelector('#mobile-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menu.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню')});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
const galleryButtons=[...document.querySelectorAll('[data-image]')];const lightbox=document.querySelector('#lightbox');let photoIndex=0;
function showPhoto(index){photoIndex=(index+galleryButtons.length)%galleryButtons.length;const source=galleryButtons[photoIndex];lightbox.querySelector('img').src=source.dataset.image;lightbox.querySelector('img').alt=source.dataset.caption;lightbox.querySelector('p').textContent=`${source.dataset.caption} · ${photoIndex+1} / ${galleryButtons.length}`}
galleryButtons.forEach((button,index)=>button.addEventListener('click',()=>{showPhoto(index);lightbox.showModal()}));
lightbox.querySelector('.close-dialog').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(photoIndex-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(photoIndex-1);if(event.key==='ArrowRight')showPhoto(photoIndex+1)});
let installPrompt;const installButton=document.querySelector('#install-app');window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.hidden=false});installButton.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;installButton.hidden=true});window.addEventListener('appinstalled',()=>{installButton.hidden=true;installPrompt=null});
renderProducts();renderServices();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
