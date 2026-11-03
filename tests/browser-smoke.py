from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce')
 errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.add_init_script('''window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel(){clearTimeout(window._tts)},speak(u){u.onstart?.();window._tts=setTimeout(()=>u.onend?.(),100)}}});''')
 page.goto('http://127.0.0.1:3000')
 page.screenshot(path=str(ROOT / 'home.png'),full_page=True)
 page.get_by_role('button',name='부모 설정',exact=True).click()
 page.locator('#offset').fill('120')
 page.get_by_role('button',name='설정 완료').click()
 assert page.evaluate("JSON.parse(localStorage.getItem('juha-settings')).offset")==120
 page.locator('[data-mode="bakery"]').click()
 assert page.locator('[data-role="2"]:disabled').count()==27
 # Solve mission with the same Unicode formula, clicking cards in order.
 word=page.locator('.mission h2').inner_text().split()[1][:-1]
 initial=list('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'); medial=list('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ')
 for ch in word:
  n=ord(ch)-0xac00
  page.locator(f'[data-jamo="{initial[n//588]}"][data-role="0"]').click()
  page.locator(f'[data-jamo="{medial[(n//28)%21]}"][data-role="1"]').click()
  page.wait_for_timeout(250)
 assert page.locator('.reward').count(), {'word':word,'feedback':page.locator('#feedback').inner_text(),'errors':errors,'plate':page.locator('.word-plate').inner_text()}
 page.locator('[data-level="advanced"]').click()
 assert page.locator('[data-role="2"]:disabled').count()==0
 page.locator('[data-action="home"]').first.click()
 page.locator('[data-mode="playground"]').click()
 assert page.locator('.gift').inner_text().startswith('🎁')
 assert page.locator('.answers .answer').count()==4
 # Only correct card gains hint after two wrong selections.
 for _ in range(2): page.locator('.answer').first.click(); page.wait_for_timeout(10)
 if page.locator('.hint').count():
  correct=page.locator('.hint').inner_text().strip()
  page.locator('.hint').click()
 else:
  # first happened to be correct; advance and reliably identify correct using module data + matching gift is unnecessary.
  correct=page.locator('.answer.correct').inner_text().replace('✓','').strip()
 page.wait_for_timeout(350)
 assert page.locator('.gift.revealed').count()==1
 page.wait_for_timeout(300)
 assert '주하도 읽어봐' in page.locator('#reading-prompt').inner_text()
 page.locator('[data-action="read"]').click()
 page.wait_for_timeout(300)
 assert '별 스탬프' in page.locator('#reading-prompt').inner_text()
 page.screenshot(path=str(ROOT / 'playground.png'),full_page=True)
 page.locator('[data-action="next"]').click()
 assert page.locator('.gift.revealed').count()==0
 page.set_viewport_size({'width':390,'height':844})
 page.screenshot(path=str(ROOT / 'mobile.png'),full_page=True)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 assert not errors, errors
 print(json.dumps({'browser':'Chromium','passed':['home','settings persistence','basic baking mission','advanced final slot','hidden reward','answer feedback','karaoke self-reading','star award','next question','mobile width'],'errors':errors},ensure_ascii=False))
 b.close()
