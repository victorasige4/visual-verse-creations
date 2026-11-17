import urllib.request, io, json, base64, hashlib
from PIL import Image, ImageOps
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=25) as response: return response.read(10_000_000)
def output(key,data):
    print('META',key,len(data),hashlib.sha256(data).hexdigest(),flush=True)
    encoded=base64.b64encode(data).decode('ascii')
    for i in range(0,len(encoded),6000): print('CHUNK',key,i//6000,encoded[i:i+6000],flush=True)
for name in ('image-generation-loader-demo','image-generation-loader'):
    try:
        data=get('https://ui.aceternity.com/registry/'+name+'.json')
        obj=json.loads(data)
        print('REGISTRY',name, list(obj), obj.get('dependencies'), obj.get('registryDependencies'),flush=True)
        output(name,data)
    except Exception as e: print('REGISTRY_ERROR',name,str(e),flush=True)
for name,id in [('pouring',8791031),('menu',8790962),('waiter',4921154)]:
    try:
        data=get(f'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1200')
        img=ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
        img.thumbnail((1200,1400),Image.Resampling.LANCZOS)
        out=io.BytesIO();img.save(out,format='WEBP',quality=78,method=6)
        print('IMAGE',name,img.size,flush=True)
        output(name,out.getvalue())
    except Exception as e: print('PHOTO_ERROR',name,str(e),flush=True)
