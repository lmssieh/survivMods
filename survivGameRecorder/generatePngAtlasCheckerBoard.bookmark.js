javascript: if (!window.once)
{
  window.once = 1;

  var a = document.createElement('canvas');
  a.width = 4096;
  a.height = 4096;
  0 && document.body.append(a);
  var ac = a.getContext('2d');
  var ad = ac.createImageData(512, 512);

  for (var i = 0; i < ad.height; i++)
  {
    for (var j = 0; j < ad.width; j++)
    {
      ad.data[4 * (j + i * ad.width) + 0] = (((i >> 5) ^ (j >> 5)) & 1) * 255;
      ad.data[4 * (j + i * ad.width) + 1] = ((i ^ j) << 7) & 255;
      ad.data[4 * (j + i * ad.width) + 2] = (((i >> 7) ^ (j >> 7)) & 1) * 255;
      ad.data[4 * (j + i * ad.width) + 3] = 127;
    }
  }
  for (var y = 0; y < a.height; y += ad.height)
  {
    for (var x = 0; x < a.width; x += ad.width)
    {
      ac.putImageData(ad, x, y);
    }
  }
  window.destURLemptyatlas = a.toDataURL();


  var oldsrc = Object.getOwnPropertyDescriptor(Image.prototype, "src");

  var prop2 = {
    configurable: true,
    value: undefined,
    writeable: true
  };

  var prop;
  prop = {
    configurable: true,
    writeable: true,
    get: function ()
      {
        console.log(this.__src);
        return this.__src;
      }

      ,
    set: function (e)
    {

      if (!e.includes('loadout'))
      {
        if (e.includes('-100-'))
        {
          e = destURLemptyatlas;
        }
        if (!e.includes('-50-'))
        {
          e = destURLemptyatlas;
        }
      }

      console.info(e);

      Object.defineProperty(Image.prototype, 'src', oldsrc);

      this.src = e;
      this.__src = e;
      Object.defineProperty(Image.prototype, 'src', prop);
    }
  };

  Object.defineProperty(Image.prototype, 'src', prop);
  confirm("ye" + document.location.href);
}
void 0;
