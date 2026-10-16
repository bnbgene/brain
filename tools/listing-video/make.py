import subprocess, sys, os
S = sys.argv[1]  # scratchpad
P = f"{S}/photos"; O = f"{S}/build"
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FL = "/usr/share/fonts/opentype/inter/Inter-Light.otf"
if not os.path.exists(FL): FL = "/usr/share/fonts/opentype/inter/Inter-Thin.otf"
shots = [  # photo, caption, motion
 (55,"Welcome to Desert Oasis","in"),(56,"Step inside","in"),
 (9,"Game room · full-size pool table","right"),(13,"Open living room","left"),
 (15,"Chef's kitchen","in"),(17,"Breakfast nook with pool views","right"),
 (20,"Dining for the whole crew","left"),(22,"Primary suite · king bed","in"),
 (39,"Spa-style primary bath","right"),(26,"Bedroom 2 · king","left"),
 (33,"Bedroom 3 · two beds","right"),(44,"Covered patio","left"),
 (45,"Resort-style pool & spa","in"),(8,"Fire pit lounge","right"),
 (46,"Nights by the pool","out"),(3,"","out")]
D=3.4; X=0.7; FPS=30; N=int(D*FPS)
def esc(t): return t.replace("'", "’").replace(":", "\\:")
clips=[]
for i,(p,cap,m) in enumerate(shots):
    z = {"in":"1+0.10*on/%d"%N, "out":"1.10-0.10*on/%d"%N}.get(m,"1.08")
    x = {"right":"(iw-iw/zoom)*on/%d"%N, "left":"(iw-iw/zoom)*(1-on/%d)"%N}.get(m,"(iw-iw/zoom)/2")
    vf = (f"scale=1440:960,crop=1440:810,scale=5760:3240,"
          f"zoompan=z='{z}':x='{x}':y='(ih-ih/zoom)/2':d={N}:s=1920x1080:fps={FPS},"
          "eq=saturation=1.06:contrast=1.03")
    if cap:
        vf += (f",drawbox=x=0:y=ih-220:w=iw:h=220:color=black@0.28:t=fill,"
               f"drawtext=fontfile={FB}:text='{esc(cap)}':fontsize=58:fontcolor=white:x=90:y=h-150:"
               f"alpha='min(1,max(0,(t-0.5)/0.5))':shadowcolor=black@0.5:shadowx=2:shadowy=2")
    if i==0:
        vf += (f",drawtext=fontfile={FL}:text='SCOTTSDALE, ARIZONA':fontsize=34:fontcolor=white@0.9:x=92:y=h-205:alpha='min(1,max(0,(t-0.3)/0.5))'")
    if i==len(shots)-1:
        vf += (",drawbox=x=0:y=0:w=iw:h=ih:color=black@0.45:t=fill,"
               f"drawtext=fontfile={FB}:text='Desert Oasis':fontsize=110:fontcolor=white:x=(w-tw)/2:y=h/2-130:alpha='min(1,max(0,(t-0.4)/0.6))',"
               f"drawtext=fontfile={FL}:text='4 bedrooms  ·  sleeps 10  ·  pool, spa & fire pit':fontsize=40:fontcolor=white:x=(w-tw)/2:y=h/2+10:alpha='min(1,max(0,(t-0.8)/0.6))',"
               f"drawtext=fontfile={FB}:text='★ 4.98  ·  Book your stay':fontsize=44:fontcolor=0xF6C66B:x=(w-tw)/2:y=h/2+90:alpha='min(1,max(0,(t-1.2)/0.6))'")
    out=f"{O}/c{i:02d}.mp4"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",f"{P}/{p:02d}.jpg","-vf",vf,"-frames:v",str(N),
                    "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out],check=True)
    clips.append(out)
inp=[]; [inp.extend(["-i",c]) for c in clips]
fc=[]; prev="[0:v]"; off=0
for i in range(1,len(clips)):
    off += D-X
    fc.append(f"{prev}[{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}[v{i}]"); prev=f"[v{i}]"
total = D*len(clips)-X*(len(clips)-1)
fc.append(f"{prev}fade=t=in:st=0:d=0.6,fade=t=out:st={total-0.8:.2f}:d=0.8[v]")
subprocess.run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map","[v]",
  "-c:v","libx264","-preset","slow","-crf","20","-pix_fmt","yuv420p","-movflags","+faststart",f"{O}/walkthrough.mp4"],check=True)
print("total", total)
