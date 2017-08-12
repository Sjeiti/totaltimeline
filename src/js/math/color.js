/**
 * A color object to do color calculations
 * @name color
 * @method
 * @param {Number} x
 * @returns {colorInstance}
 * @todo documentation
 */

const FF = Math.pow(2,8)-1
  ,rgb2int = (r,g,b)=>r<<16|g<<8|b
  ,int2rgb = i=>[(i>>16)&FF,(i>>8)&FF,i&FF]
  ,int2hex = i=>'#'+i.toString(16).padStart(6,'0')
  ,fBr = 0.241
  ,fBg = 0.691
  ,fBb = 0.068
  ,brightness = c=>{
    const r = c.r/FF, g = c.g/FF, b = c.b/FF
    return r*r*fBr + g*g*fBg + b*b*fBb
  }
  ,rgb2hsl = (r,g,b)=>{
    const max = Math.max(r,g,b)
      ,min = Math.min(r,g,b)
      ,a = max+min
      ,d = max-min
    let h,s,l = a/2
    if (max===min) {
      h = s = 0
    } else {
      s = l>0.5?d/(2-d):d/a
      switch(max){
        case r: h = (g-b)/d+(g<b?6:0); break;
        case g: h = (b-r)/d+2; break;
        case b: h = (r-g)/d+4; break;
      }
      h /= 6
    }
    return {h,s,l}
  }
  ,hue2rgb = (p,q,t)=>

    {
		if (t<0) t += 1;
		if (t>1) t -= 1;
		if (t<1/6) return p + (q-p)*6*t;
		if (t<1/2) return q;
		if (t<2/3) return p + (q-p)*(2/3-t)*6;
		return p;
	}
  //
  ,writable = true
  ,proto = {
    set(...values){
      const [r,g,b,a] = values
        ,numValues = values.length
      if (numValues===0){
        this.randomize()
      } else if (numValues===1){
        const type = typeof r
        if (type==='string') {
          if (r.match(/^rgb/gi)) {
            setRgbString(r)
          } else {
            this.setHex(r)
          }
        } else if (type==='number'){
          this.setInteger(r)
        }
      } else if (numValues===3){
        this.setRgb(r,g,b)
      }
      return this
    }
    ,setInteger(i){
      this.integer = i
      this.r = (i>>16)&FF
		  this.g = (i>>8)&FF
		  this.b = i&FF
      this.hex = int2hex(i)
      return this
    }
    ,setHex(v){
      let s = v.replace('#','')
      if (s.length===3){
        const [r,g,b] = s
        s = r+r+g+g+b+b
      }
      return this.setInteger(parseInt(s,16))
    }
    ,setRgbString(s){
      const rgbm = v.match(/\d+/g)
        ,rgb = rgbm.map(c=>parseInt(c,10))
        ,[r,g,b] = rgb
      return this.setRgb(r,g,b)
    }
    ,setRgb(r,g,b){
      this.r = r
      this.g = g
      this.b = b
      this.integer = rgb2int(this.r,this.g,this.b)
      this.hex = int2hex(this.integer)
      return this
    }
    ,randomize(){
      return this.setInteger(0xFFFFFF*Math.random()<<0)
    }
    ,clone(){
      return color(this.integer)
    }
    ,add(c){
      if (!isColor(c)) c = color(c)
      return this.setRgb(
        Math.min(this.r+c.r,FF)
        ,Math.min(this.g+c.g,FF)
        ,Math.min(this.b+c.b,FF)
      )
    }
    ,subtract(c){
      if (!isColor(c)) c = color(c)
      return this.setRgb(
        Math.max(this.r-c.r,0)
        ,Math.max(this.g-c.g,0)
        ,Math.max(this.b-c.b,0)
      )
    }
    ,average(c,part=0.5){
      if (!isColor(c)) c = color(c)
      const h = 1-part
      return this.setRgb(
        h*this.r+part*c.r
        ,h*this.g+part*c.g
        ,h*this.b+part*c.b
      )
    }
    ,multiply(f){
      return this.setRgb(
        f*this.r
        ,f*this.g
        ,f*this.b
      )
    }
    ,divide(f){
      return this.multiply(1/f)
    }
    /*,huey(f) {
      if (!bHSL) {
        const {h,s,l} = rgb2hsl(this.r,this.g,this.b)
        Object.assign(this,{h,s,l})
      }
      if (f===undefined) {
        return this.h
      } else {
        this.h = f;
        makeHSL2RGB();
        return oReturn;
      }
    }*/
    /*,saturation
    ,lightness*/
    ,toString(){return this.hex}
  }


function isColor(c){
  return Object.getPrototypeOf(c)===proto
}

export default function color(...values){
  return Object.create(proto,{
    integer: {writable}
    ,r: {writable}
    ,g: {writable}
    ,b: {writable}
    ,h: {writable}
    ,s: {writable}
    ,l: {writable}
    ,hex: {writable}
    ,rgba: {writable}
    ,brightness: {
      get: function(){return brightness(this)}
    }
  }).set(...values)
}
