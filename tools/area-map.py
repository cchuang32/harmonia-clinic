# ---------------------------------------------------------------------------
# 產生「君禾診所．周邊地圖」示意圖 → assets/img/area-map.svg
#   用法：python3 tools/area-map.py assets/img/area-map.svg
#
# 這是示意圖：道路一律畫成直線、間距等分，不按實際比例。
# 但每條街的「順序」與「相對位置」是真的——YA / XA 兩張對照表裡的數字，
# 左邊是實測的公尺（診所為原點，正值代表北方或東方），右邊是畫布座標。
# 例如 (73,470) 代表達生二街在診所北方 73 公尺，畫在畫布 y=470 的位置。
# 地標只要給實際公尺座標，程式會自動換算到對應的街廓裡，不會擺錯邊。
#
# 網站 build 不會用到這支程式，改完要自己重跑，再 npm run build。
# ---------------------------------------------------------------------------
import io,sys,math
W,H=1240,980
BG="#FBF7F2"; ROAD="#3F5247"; INK="#2E3A22"; SUB="#5B6357"
BRAND="#9CAB80"; GOLD="#C68A3E"; CREAM="#FFFDF7"; LINE="#DCD6C8"
TV,TH=math.tan(math.radians(12)),math.tan(math.radians(11))
YC=600                       # 診所所在的畫布高度

# 真實座標（公尺）→ 畫布座標，用實測交叉點當錨點、等距排開
YA=[(314,150),(204,290),(73,470),(0,YC),(-58,700),(-149,840),(-252,960)]
XA=[(-339,60),(-188,225),(-113,345),(0,520),(69,700),(176,900),(339,1150)]
def interp(v,tab):
    tab=sorted(tab)
    if v<=tab[0][0]:  (a,A),(b,B)=tab[0],tab[1]
    elif v>=tab[-1][0]:(a,A),(b,B)=tab[-2],tab[-1]
    else:
        for (a,A),(b,B) in zip(tab,tab[1:]):
            if a<=v<=b: break
    return A+(v-a)*(B-A)/(b-a)
def mapy(y): return interp(y,YA)
def mapx(x): return interp(x,XA)
def place(mx,my):
    """真實公尺 → 畫布座標（含道路傾斜）"""
    x=mapx(mx)+(YC-mapy(my))*TV
    y=mapy(my)-(x-520)*TH
    x=mapx(mx)+(YC-y)*TV
    return x,y

o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
   f'font-family="\'Noto Sans TC\',\'PingFang TC\',\'Microsoft JhengHei\',sans-serif">',
   f'<rect width="{W}" height="{H}" rx="22" fill="{BG}"/>']

VROADS=[('中山五街',-339,18),('中山二街',-188,18),('中山一街',-113,18),
        ('中山路一段',0,32),('中正七街',69,22),('中正六街',176,18),('中正五街',339,18)]
HROADS=[('溪南二街',314,18),('達生路',204,26),('達生二街',73,22),('達生五路',-58,24),
        ('達生六街',-149,20),('達生八街',-252,18)]

def vx(mx,y): return mapx(mx)+(YC-y)*TV          # 縱向路在某高度的 x
def hy(my,x): return mapy(my)-(x-520)*TH         # 橫向路在某 x 的 y

for n,mx,w in VROADS:
    o.append(f'<path d="M{vx(mx,H+30):.0f} {H+30} L{vx(mx,-30):.0f} -30" stroke="{ROAD}" stroke-width="{w}" stroke-linecap="round"/>')
for n,my,w in HROADS:
    o.append(f'<path d="M-30 {hy(my,-30):.0f} L{W+30} {hy(my,W+30):.0f}" stroke="{ROAD}" stroke-width="{w}" stroke-linecap="round"/>')

def rlabel(name,at,ang,size=18):
    n=len(name)
    o.append(f'<g transform="translate({at[0]:.0f},{at[1]:.0f}) rotate({ang})">'
             f'<rect x="{-n*size/2-8:.0f}" y="{-size*0.82:.0f}" width="{n*size+16}" height="{size*1.55:.0f}" rx="7" fill="{BG}" opacity=".95"/>'
             f'<text y="{size*0.36:.0f}" font-size="{size}" font-weight="700" fill="{ROAD}" text-anchor="middle" letter-spacing="2">{name}</text></g>')

for n,mx,y in [('中山五街',-339,300),('中山二街',-188,300),('中山一街',-113,200),
               ('中山路一段',0,900),('中山路一段',0,140),('中正七街',69,900),
               ('中正六街',176,650),('中正五街',339,760)]:
    rlabel(n,(vx(mx,y),y),-78)
for n,my,x in [('溪南二街',314,980),('達生路',204,200),('達生二街',73,150),('達生一街',73,1090),
               ('達生五路',-58,150),('達生三街',-58,1050),('達生六街',-149,300),('達生八街',-252,780)]:
    rlabel(n,(x,hy(my,x)),-11)

def cloud(cx,cy,w,h,t,sub=None,fs=19):
    r=h/2; n=max(5,int(w/(r*0.95)))
    xs=[cx-w/2+w*i/(n-1) for i in range(n)]
    c=''.join(f'<circle cx="{x:.0f}" cy="{cy-h/2:.0f}" r="{r*0.66:.0f}"/><circle cx="{x:.0f}" cy="{cy+h/2:.0f}" r="{r*0.66:.0f}"/>' for x in xs)
    c+=f'<circle cx="{cx-w/2:.0f}" cy="{cy:.0f}" r="{r*0.76:.0f}"/><circle cx="{cx+w/2:.0f}" cy="{cy:.0f}" r="{r*0.76:.0f}"/>'
    c+=f'<rect x="{cx-w/2:.0f}" y="{cy-h/2:.0f}" width="{w}" height="{h}" rx="{r*0.4:.0f}"/>'
    o.append(f'<g fill="{CREAM}" stroke="{GOLD}" stroke-width="3" stroke-linejoin="round">{c}</g><g fill="{CREAM}">{c}</g>')
    o.append(f'<text x="{cx}" y="{cy+(fs*0.36 if not sub else -3):.0f}" font-size="{fs}" font-weight="700" fill="{INK}" text-anchor="middle">{t}</text>')
    if sub: o.append(f'<text x="{cx}" y="{cy+fs*1.2:.0f}" font-size="{fs-5}" fill="{SUB}" text-anchor="middle">{sub}</text>')

def mark(name,mx,my,dx,dy,size=18):
    x,y=place(mx,my); tx,ty=x+dx,y+dy
    o.append(f'<path d="M{x:.0f} {y:.0f} L{tx:.0f} {ty:.0f}" stroke="#8C9384" stroke-width="2" fill="none"/>')
    o.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="7" fill="{ROAD}"/>')
    w=len(name)*size+22
    o.append(f'<rect x="{tx-w/2:.0f}" y="{ty-size-8:.0f}" width="{w}" height="{size+16}" rx="9" fill="{CREAM}" stroke="{LINE}" stroke-width="1.8"/>')
    o.append(f'<text x="{tx:.0f}" y="{ty+size*0.2:.0f}" font-size="{size}" fill="{INK}" text-anchor="middle">{name}</text>')

mark('康是美',-26,111,-190,-40)
mark('星巴克',-27,94,-190,26)
mark('蝦皮店到店',-33,20,-205,10)
mark('石二鍋',-58,-36,-190,44)
mark('7-ELEVEN',-77,-81,-180,60)
mark('湖心公園',68,125,150,-40)
mark('全聯福利中心',107,292,190,10)
mark('麥當勞',93,370,-330,44)

px_,py_=place(69,2)
o.append(f'<rect x="{px_-20:.0f}" y="{py_-20:.0f}" width="40" height="40" rx="9" fill="{ROAD}"/>')
o.append(f'<text x="{px_:.0f}" y="{py_+10:.0f}" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">P</text>')
o.append(f'<path d="M{px_+22:.0f} {py_-12:.0f} L{px_+150:.0f} {py_-72:.0f}" stroke="{GOLD}" stroke-width="2.6" fill="none"/>')
cloud(px_+300,py_-96,230,66,'王爺壟停車場','24 小時．診所大樓後方')

cx_,cy_=place(0,0); cx_+=26
o.append(f'<g transform="translate({cx_:.0f},{cy_:.0f})">'
         f'<circle r="12" fill="#B4442F" stroke="#fff" stroke-width="4"/>'
         f'<path d="M-12 -8 L-64 -48" stroke="{ROAD}" stroke-width="3"/></g>')
o.append(f'<g transform="translate({cx_-158:.0f},{cy_-66:.0f})">'
         f'<rect x="-122" y="-31" width="244" height="54" rx="12" fill="{BRAND}" stroke="{CREAM}" stroke-width="5"/>'
         f'<text y="9" font-size="28" font-weight="700" fill="#22301A" text-anchor="middle" letter-spacing="2">君禾診所</text></g>')

ax,ay=place(0,430)
o.append(f'<g transform="translate({ax:.0f},{max(ay,66):.0f})">'
         f'<path d="M0 46 L0 0" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>'
         f'<path d="M0 -16 L13 6 L-13 6 Z" fill="{GOLD}"/>'
         f'<text x="22" y="12" font-size="18" font-weight="700" fill="#8A6A2F">往台鐵湖口車站</text>'
         f'<text x="22" y="36" font-size="15" fill="#8A6A2F">約 1 公里</text></g>')

o.append(f'<g transform="translate({W-78},92)"><circle r="34" fill="{CREAM}" stroke="{LINE}" stroke-width="2"/>'
         f'<path d="M0 -21 L8 9 L0 2 L-8 9 Z" fill="{ROAD}"/>'
         f'<text y="-27" font-size="13" font-weight="700" fill="{ROAD}" text-anchor="middle">N</text></g>')

o.append(f'<rect x="26" y="24" width="360" height="82" rx="14" fill="{CREAM}" stroke="{LINE}" stroke-width="1.8"/>')
o.append(f'<text x="46" y="62" font-size="27" font-weight="700" fill="{INK}">君禾診所．周邊地圖</text>')
o.append(f'<text x="46" y="90" font-size="15" fill="{SUB}">新竹縣湖口鄉中山路一段 596 號</text>')
o.append(f'<rect x="{W-286}" y="{H-52}" width="260" height="30" rx="9" fill="{CREAM}" opacity=".95"/>')
o.append(f'<text x="{W-156}" y="{H-31}" font-size="14" fill="#8B9184" text-anchor="middle">※ 示意圖，未按實際比例繪製</text>')
o.append('</svg>')
io.open(sys.argv[1],'w',encoding='utf-8').write("\n".join(o))
print('已輸出')
