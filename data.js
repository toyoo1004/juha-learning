export const initial=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
export const medial=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
export const final=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
export function compose(a,b,c=''){const i=initial.indexOf(a),m=medial.indexOf(b),f=final.indexOf(c);return i<0||m<0||f<0?'':String.fromCharCode(0xAC00+(i*21+m)*28+f);}
export function decompose(s){const n=s.charCodeAt(0)-0xAC00;if(n<0||n>=11172)return null;return [initial[Math.floor(n/588)],medial[Math.floor(n/28)%21],final[n%28]];}
export function shuffle(a,random=Math.random){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
const rows={basic:[
['가지','🍆','음식'],['가루','🥣','음식'],['나무','🌳','자연'],['나비','🦋','동물'],['바다','🌊','자연'],['바위','🪨','자연'],['사과','🍎','음식'],['사자','🦁','동물'],['고래','🐳','동물'],['고기','🥩','음식'],['오리','🦆','동물'],['오이','🥒','음식'],['포도','🍇','음식'],['포크','🍴','우리집 물건'],['두부','🧊','음식'],['두유','🥛','음식'],['치마','👗','우리집 물건'],['치즈','🧀','음식'],['토끼','🐰','동물'],['토기','🏺','우리집 물건'],['기차','🚂','탈것'],['기구','🎈','탈것'],['우유','🥛','음식'],['우비','🧥','우리집 물건'],['모자','🧢','우리집 물건'],['모래','🏖️','자연'],['구두','👞','우리집 물건'],['구이','🍢','음식'],['비누','🧼','우리집 물건'],['비녀','🪮','우리집 물건'],['소라','🐚','자연'],['소파','🛋️','우리집 물건'],['배추','🥬','음식'],['배지','🏅','우리집 물건'],['거미','🕷️','동물'],['거위','🪿','동물']],
advanced:[
['가방','🎒','우리집 물건'],['가위','✂️','우리집 물건'],['김밥','🍙','음식'],['김치','🥬','음식'],['호랑이','🐯','동물'],['호박','🎃','음식'],['자동차','🚗','탈것'],['자전거','🚲','탈것'],['강아지','🐶','동물'],['강물','🏞️','자연'],['고양이','🐱','동물'],['고슴도치','🦔','동물'],['햄스터','🐹','동물'],['햄버거','🍔','음식'],['딸기','🍓','음식'],['딸기잼','🫙','음식'],['수박','🍉','음식'],['수건','🧺','우리집 물건'],['냉장고','🧊','우리집 물건'],['냉면','🍜','음식'],['비행선','🛩️','탈것'],['비둘기','🕊️','동물'],['눈사람','⛄','자연'],['눈꽃','❄️','자연'],['소방차','🚒','탈것'],['소나무','🌲','자연'],['연필','✏️','우리집 물건'],['연꽃','🪷','자연'],['장난감','🧸','우리집 물건'],['장갑','🧤','우리집 물건'],['버스','🚌','탈것'],['버섯','🍄','음식'],['물고기','🐟','동물'],['물병','🍼','우리집 물건'],['달팽이','🐌','동물'],['달빛','🌙','자연'],['경찰차','🚓','탈것'],['경비행기','🛩️','탈것'],['잠수함','🚢','탈것'],['잠자리','🪰','동물'] ]};
const sentence=(word,category)=> category==='음식'?`맛있는 ${word}${particle(word,'을','를')} 먹어요.`:category==='동물'?`귀여운 ${word}${particle(word,'이','가')} 보여요.`:category==='탈것'?`신나는 ${word}${particle(word,'을','를')} 타요.`:category==='자연'?`아름다운 ${word}${particle(word,'을','를')} 보아요.`:`여기 ${word}${particle(word,'이','가')} 있어요.`;
function particle(w,a,b){return decompose(w.at(-1))?.[2]?a:b;}
// Playground basic is always two syllables. Extra bakery entries remain available separately.
export const words=Object.entries(rows).flatMap(([level,rs])=>rs.map(([word,emoji,category],i)=>({id:`${level}_${i}`,word,emoji,category,level,sentence:sentence(word,category),audioKey:`word_${level}_${i}`,sentenceAudioKey:`sent_${level}_${i}`})));
export const playgroundWords=words.filter(w=>w.level!=='basic'||w.word.length===2);
export function choicesFor(target,pool,count){const peers=pool.filter(w=>w.id!==target.id);const same=shuffle(peers.filter(w=>w.word[0]===target.word[0]));const first=same[0];return shuffle([target,...(first?[first]:[]),...shuffle(peers.filter(w=>w.id!==first?.id)).slice(0,count-1-(first?1:0))]);}
