import docx, os, sys, io
from docx.oxml.ns import qn
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

doc = docx.Document('../ANALIZA PRIJENOSA BOJE KOD VIŠEBOJNIH REPRODUKCIJA S UV-SUŠEĆIM I KONVENCIONALNIM TISKARSKIM BOJAMA_Sara_Iva_Merlić_v2.docx')
rels = doc.part.rels
rid_to_image = {rid: os.path.basename(rel.target_ref) for rid, rel in rels.items() if 'image' in rel.reltype}

def para_images(p):
    imgs = []
    for blip in p._element.iter(qn('a:blip')):
        embed = blip.get(qn('r:embed'))
        if embed and embed in rid_to_image:
            imgs.append(rid_to_image[embed])
    return imgs

for i, p in enumerate(doc.paragraphs):
    if 252 < i < 283:
        style = p.style.name if p.style else ''
        text = p.text.strip()
        imgs = para_images(p)
        if text or imgs:
            print(f'[{i:04d}] [{style}] {text}')
            for im in imgs:
                print(f'  IMG: {im}')
