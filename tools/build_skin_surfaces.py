"""Bake compact CC0 MakeHuman skin detail maps; no game-state or user data.
Usage: python3 tools/build_skin_surfaces.py /tmp/skin-sources
Sources are pinned and SHA-256 verified before conversion.
"""
import base64,hashlib,json,sys,urllib.request
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
COMMIT='8cf9645b975a98eea056b140df11a1d278da0d10'
HASHES={'female':'96aa4a96b247fc90d371587bb88e6ae3bfc77e83f5126f17e6bbb713aa200470','male':'e3f0dbb634e4c68561338f0087f7a122444e84ec56df102212f1222aa12e4d50'}
folder=Path(sys.argv[1]);folder.mkdir(parents=True,exist_ok=True)
output={'size':512,'sourceCommit':COMMIT,'channels':3,'maps':{}}
for sex,sha in HASHES.items():
 p=folder/(sex+'.png')
 url=f'https://media.githubusercontent.com/media/s20220526/makehuman-assets/{COMMIT}/base/skins/textures/young_darkskinned_{sex}_diffuse.png'
 data=p.read_bytes() if p.exists() else urllib.request.urlopen(url,timeout=45).read()
 if hashlib.sha256(data).hexdigest()!=sha:raise ValueError('Skin source checksum: '+sex)
 p.write_bytes(data)
 im=Image.open(p).convert('RGB').resize((512,512),Image.Resampling.LANCZOS)
 rgb=np.asarray(im,dtype=np.float32)
 luma=rgb@np.array([.299,.587,.114])
 valid=(rgb[:,:,0]>rgb[:,:,2]*1.12)&(luma>35)&(luma<180)
 reference=np.median(rgb[valid],axis=0)
 detail=np.clip(rgb/reference,.48,1.52)
 pixels=np.flipud(np.rint(detail*127.5).astype(np.uint8)).copy()
 output['maps'][sex]={'sha256':sha,'reference':[round(float(x),3) for x in reference],'pixels':base64.b64encode(pixels.tobytes()).decode()}
(ROOT/'assets/skin-surfaces.js').write_text('/* CC0 MakeHuman skin tonal maps. See ASSETS.md. */\nconst SkinSurfaces='+json.dumps(output,separators=(',',':'))+';\n')
print('Skin maps:',sum(len(base64.b64decode(m['pixels'])) for m in output['maps'].values()),'bytes packed; 2 MiB shared GPU RGBA')
