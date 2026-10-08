self.onmessage = async ({data}) => {
  try {
    const mod = await libheif({print:()=>{},printErr:()=>{}});
    const decoder = new mod.HeifDecoder();
    const images = decoder.decode(new Uint8Array(data.buffer));
    if (!images.length) throw new Error('画像を読み取れません。破損・未対応の圧縮形式の可能性があります。');
    const image = images.find(i=>i.is_primary()) || images[0];
    const width = image.get_width(), height = image.get_height();
    if (width * height > 65000000) throw new Error('画像が大きすぎます。上限は6500万画素です。');
    const pixels = new ImageData(width,height);
    await new Promise((resolve,reject)=>image.display(pixels,result=>result?resolve():reject(new Error('画像の展開に失敗しました。'))));
    const canvas = new OffscreenCanvas(width,height);
    canvas.getContext('2d').putImageData(pixels,0,0);
    const blob = await canvas.convertToBlob({type:data.type,quality:data.quality});
    images.forEach(i=>i.free());
    self.postMessage({blob,width,height,count:images.length});
  } catch (error) { self.postMessage({error:error.message || String(error)}); }
};
