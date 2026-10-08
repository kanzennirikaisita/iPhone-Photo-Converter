from pathlib import Path
import html
root=Path(__file__).resolve().parent
license_text=(root.parent/'licenses/THIRD_PARTY.txt').read_text()
shell=(root/'shell.html').read_text()
for key,path in [('DECODER','vendor/libheif-bundle.js'),('WORKER','worker.js'),('FFLATE','vendor/fflate.js'),('APP','app.js')]:
    shell=shell.replace('__'+key+'__',(root/path).read_text().replace('</script','<\\/script'))
shell=shell.replace('__LICENSES__',html.escape(license_text))
(root.parent/'index.html').write_text(shell,encoding='utf-8')
