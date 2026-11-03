from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page()
 page.goto('http://127.0.0.1:3000')
 result=page.evaluate('''async()=>{const {Narrator}=await import('./speech.js');let timer;Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){clearTimeout(timer)},getVoices:()=>[],speak(u){u.onstart();timer=setTimeout(()=>u.onend(),1100)}}});let log=[];let ended=0;const n=new Narrator(()=>({offset:0,charMs:250}));await n.say('가나다라',{karaoke:true,onProgress:(i,f)=>log.push([i,f]),onEnd:()=>ended++});await new Promise(r=>setTimeout(r,1250));if(ended!==1||!log.some(x=>x[0]>0&&x[0]<4)||log.at(-1)[0]!==4)throw Error('estimated timing failed');let cancelled=0;await n.say('취소 테스트',{karaoke:true,onProgress:()=>cancelled++});await new Promise(r=>setTimeout(r,100));n.cancel();let count=cancelled;await new Promise(r=>setTimeout(r,1200));if(cancelled!==count)throw Error('cancel leaked progress');return {fallback:true,completion:true,cancellation:true};}''')
 print(result)
 b.close()
