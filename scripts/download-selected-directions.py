import urllib.request, io, json, base64, hashlib
from PIL import Image, ImageOps
assets = [["graphic-design",30008706,"Alexander Mass","https://www.pexels.com/photo/creative-workspace-with-designer-at-desk-30008706/","Graphic designer working on visual artwork in a creative studio","https://images.pexels.com/photos/30008706/pexels-photo-30008706.jpeg"],["photography",17647076,"Kamunya","https://www.pexels.com/photo/portrait-of-a-woman-sitting-outdoors-17647076/","An editorial portrait of a woman in Nairobi","https://images.pexels.com/photos/17647076/pexels-photo-17647076/free-photo-of-portrait-of-a-woman-sitting-outdoors.jpeg"],["digital",8021284,"Nathan J Hilton","https://www.pexels.com/photo/a-smartphone-with-mobile-application-on-screen-8021284/","Close-up of a mobile digital interface","https://images.pexels.com/photos/8021284/pexels-photo-8021284.jpeg"],["videography",2773498,"cottonbro studio","https://www.pexels.com/photo/man-holding-video-camera-2773498/","A filmmaker operating a cinema camera outdoors","https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg"],["branding",7598018,"Leeloo The First","https://www.pexels.com/photo/pictures-of-brand-strategy-and-design-7598018/","A brand strategy moodboard with colour palettes and editorial visuals","https://images.pexels.com/photos/7598018/pexels-photo-7598018.jpeg"],["campaigns",8371401,"Ron Lach","https://www.pexels.com/photo/woman-using-an-android-phone-on-a-gimbal-8371401/","A creator filming social content with a smartphone and gimbal","https://images.pexels.com/photos/8371401/pexels-photo-8371401.jpeg"]]
for name,_,_,_,_,url in assets:
    req=urllib.request.Request(url+'?auto=compress&cs=tinysrgb&w=1200',headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=25) as response:
        data=response.read(15_000_000)
    img=ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
    print('ORIGINAL',name,img.size,flush=True)
    crop=ImageOps.pad(img,(720,1280),method=Image.Resampling.LANCZOS,color='#dff2ea',centering=(.5,.5))
    for q in (80,75,70,65,60):
        out=io.BytesIO();crop.save(out,format='WEBP',quality=q,method=6)
        b=out.getvalue()
        if len(b)<78000: break
    encoded=base64.b64encode(b).decode('ascii')
    print('IMAGE_META',name,len(b),hashlib.sha256(b).hexdigest(),flush=True)
    for i in range(0,len(encoded),6000): print('IMAGE_CHUNK',name,i//6000,encoded[i:i+6000],flush=True)
