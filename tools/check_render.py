"""Replay recorded game shaders/draws with installed EGL/Mesa, without a browser/server.
python tools/check_render.py /tmp/frame.json /tmp/frame.png
Requires libEGL, Mesa with surfaceless GLES, NumPy and Pillow. This does NOT test Safari,
DOM layout, native touch, iPhone GPU compatibility or device FPS.
"""
import os,sys,json,base64,ctypes as C,ctypes.util
from pathlib import Path
import numpy as np
from PIL import Image
os.environ.setdefault('EGL_PLATFORM','surfaceless')
frame=json.loads(Path(sys.argv[1]).read_text());w,h=frame['width'],frame['height']
egl=C.CDLL(ctypes.util.find_library('EGL'));ptr=C.c_void_p;i=C.c_int;u=C.c_uint;f=C.c_float
def ef(name,result,args):
    fn=getattr(egl,name);fn.restype=result;fn.argtypes=args;return fn
display=ef('eglGetDisplay',ptr,[ptr])(None);major=i();minor=i()
assert ef('eglInitialize',u,[ptr,C.POINTER(i),C.POINTER(i)])(display,C.byref(major),C.byref(minor)),'EGL initialization failed'
config=ptr();count=i();attrs=(i*13)(0x3033,1,0x3040,4,0x3024,8,0x3023,8,0x3022,8,0x3025,24,0x3038)
assert ef('eglChooseConfig',u,[ptr,C.POINTER(i),C.POINTER(ptr),i,C.POINTER(i)])(display,attrs,C.byref(config),1,C.byref(count)) and count.value
surface=ef('eglCreatePbufferSurface',ptr,[ptr,ptr,C.POINTER(i)])(display,config,(i*5)(0x3057,w,0x3056,h,0x3038))
assert ef('eglBindAPI',u,[u])(0x30A0)
context=ef('eglCreateContext',ptr,[ptr,ptr,ptr,C.POINTER(i)])(display,config,None,(i*3)(0x3098,2,0x3038))
assert context and ef('eglMakeCurrent',u,[ptr,ptr,ptr,ptr])(display,surface,surface,context)
get_proc=ef('eglGetProcAddress',ptr,[C.c_char_p]);cache={};objects={};locations={};draws=0
def gf(name,result=None,args=()):
    if name not in cache:
        address=get_proc(name.encode());assert address,name+' unavailable';cache[name]=C.CFUNCTYPE(result,*args)(address)
    return cache[name]
def obj(x):return objects[x['id']] if isinstance(x,dict) and 'id' in x else (0 if x is None else x)
def floats(x):
    if isinstance(x,dict):return np.frombuffer(base64.b64decode(x['bytes']),dtype='<f4').copy()
    return np.array(x,dtype='f4')
def status(kind,handle):
    ok=i();gf('glGet'+kind+'iv',None,[u,u,C.POINTER(i)])(handle,0x8B81 if kind=='Shader' else 0x8B82,C.byref(ok))
    if not ok.value:
        text=C.create_string_buffer(16384);gf('glGet'+kind+'InfoLog',None,[u,i,C.POINTER(i),ptr])(handle,len(text),None,text);raise RuntimeError(text.value.decode())
for name,a,result in frame['commands']:
    if name=='createShader':objects[result['id']]=gf('glCreateShader',u,[u])(a[0])
    elif name=='createProgram':objects[result['id']]=gf('glCreateProgram',u,[])()
    elif name=='createBuffer':
        handle=u();gf('glGenBuffers',None,[i,C.POINTER(u)])(1,C.byref(handle));objects[result['id']]=handle.value
    elif name=='shaderSource':
        src=C.c_char_p(a[1].encode());gf('glShaderSource',None,[u,i,C.POINTER(C.c_char_p),ptr])(obj(a[0]),1,C.byref(src),None)
    elif name=='compileShader':gf('glCompileShader',None,[u])(obj(a[0]));status('Shader',obj(a[0]))
    elif name=='attachShader':gf('glAttachShader',None,[u,u])(obj(a[0]),obj(a[1]))
    elif name=='linkProgram':gf('glLinkProgram',None,[u])(obj(a[0]));status('Program',obj(a[0]))
    elif name=='getAttribLocation':locations[result]=gf('glGetAttribLocation',i,[u,C.c_char_p])(obj(a[0]),a[1].encode())
    elif name=='getUniformLocation':objects[result['id']]=gf('glGetUniformLocation',i,[u,C.c_char_p])(obj(a[0]),a[1].encode())
    elif name=='bufferData':
        raw=base64.b64decode(a[1]['bytes']);data=C.create_string_buffer(raw);gf('glBufferData',None,[u,C.c_ssize_t,ptr,u])(a[0],len(raw),data,a[2])
    elif name=='bindBuffer':gf('glBindBuffer',None,[u,u])(a[0],obj(a[1]))
    elif name=='useProgram':gf('glUseProgram',None,[u])(obj(a[0]))
    elif name in ('enableVertexAttribArray','disableVertexAttribArray'):
        if locations[a[0]]>=0:gf('gl'+name[0].upper()+name[1:],None,[u])(locations[a[0]])
    elif name=='vertexAttribPointer':
        if locations[a[0]]>=0:gf('glVertexAttribPointer',None,[u,i,u,C.c_ubyte,i,ptr])(locations[a[0]],*a[1:5],ptr(a[5]))
    elif name=='uniformMatrix4fv':
        data=floats(a[2]);gf('glUniformMatrix4fv',None,[i,i,C.c_ubyte,ptr])(obj(a[0]),len(data)//16,a[1],data.ctypes.data)
    elif name=='uniform3fv':
        data=floats(a[1]);gf('glUniform3fv',None,[i,i,ptr])(obj(a[0]),len(data)//3,data.ctypes.data)
    elif name=='uniform1f':gf('glUniform1f',None,[i,f])(obj(a[0]),a[1])
    elif name in ('enable','disable','depthFunc','clear'):gf('gl'+name[0].upper()+name[1:],None,[u])(*a)
    elif name=='depthMask':gf('glDepthMask',None,[C.c_ubyte])(*a)
    elif name=='blendFunc':gf('glBlendFunc',None,[u,u])(*a)
    elif name=='clearColor':gf('glClearColor',None,[f,f,f,f])(*a)
    elif name=='viewport':gf('glViewport',None,[i,i,i,i])(*a)
    elif name=='drawArrays':gf('glDrawArrays',None,[u,i,i])(*a);draws+=1
    elif name=='drawElements':gf('glDrawElements',None,[u,i,u,ptr])(*a[:3],ptr(a[3]));draws+=1
    else:raise RuntimeError('Unsupported GL command: '+name)
    error=gf('glGetError',u,[])()
    if error:raise RuntimeError(f'{name}: GL error {hex(error)}')
pixels=np.empty((h,w,4),dtype='u1');gf('glReadPixels',None,[i,i,i,i,u,u,ptr])(0,0,w,h,0x1908,0x1401,pixels.ctypes.data)
Image.fromarray(pixels[::-1]).convert('RGB').save(sys.argv[2])
renderer=gf('glGetString',C.c_char_p,[u])(0x1F01).decode()
print(json.dumps({'scene':frame['scene'],'draws':draws,'renderer':renderer,'shader_errors':0,'gl_errors':0,'output':sys.argv[2]}))
