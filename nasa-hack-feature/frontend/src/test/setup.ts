import '@testing-library/jest-dom';

// Mock window.requestAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
};

window.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Create a comprehensive WebGL context mock
const createWebGLContextMock = () => ({
  // WebGL constants
  VERSION: 0x1F02,
  RENDERER: 0x1F01,
  VENDOR: 0x1F00,
  VIEWPORT: 0x0BA2,
  SCISSOR_BOX: 0x0C10,
  MAX_VERTEX_UNIFORM_VECTORS: 0x8B8C,
  MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x8DFD,
  MAX_TEXTURE_SIZE: 0x0D33,
  MAX_CUBE_MAP_TEXTURE_SIZE: 0x851C,

  canvas: {},
  drawingBufferWidth: 800,
  drawingBufferHeight: 600,
  getContextAttributes: () => ({}),
  isContextLost: () => false,
  getSupportedExtensions: () => [],
  getExtension: () => null,
  activeTexture: () => {},
  attachShader: () => {},
  bindAttribLocation: () => {},
  bindBuffer: () => {},
  bindFramebuffer: () => {},
  bindRenderbuffer: () => {},
  bindTexture: () => {},
  blendColor: () => {},
  blendEquation: () => {},
  blendEquationSeparate: () => {},
  blendFunc: () => {},
  blendFuncSeparate: () => {},
  bufferData: () => {},
  bufferSubData: () => {},
  checkFramebufferStatus: () => 36053,
  clear: () => {},
  clearColor: () => {},
  clearDepth: () => {},
  clearStencil: () => {},
  colorMask: () => {},
  compileShader: () => {},
  compressedTexImage2D: () => {},
  compressedTexSubImage2D: () => {},
  copyTexImage2D: () => {},
  copyTexSubImage2D: () => {},
  createBuffer: () => ({}),
  createFramebuffer: () => ({}),
  createProgram: () => ({}),
  createRenderbuffer: () => ({}),
  createShader: () => ({}),
  createTexture: () => ({}),
  cullFace: () => {},
  deleteBuffer: () => {},
  deleteFramebuffer: () => {},
  deleteProgram: () => {},
  deleteRenderbuffer: () => {},
  deleteShader: () => {},
  deleteTexture: () => {},
  depthFunc: () => {},
  depthMask: () => {},
  depthRange: () => {},
  detachShader: () => {},
  disable: () => {},
  disableVertexAttribArray: () => {},
  drawArrays: () => {},
  drawElements: () => {},
  enable: () => {},
  enableVertexAttribArray: () => {},
  finish: () => {},
  flush: () => {},
  framebufferRenderbuffer: () => {},
  framebufferTexture2D: () => {},
  frontFace: () => {},
  generateMipmap: () => {},
  getActiveAttrib: () => ({ size: 1, type: 35664, name: '' }),
  getActiveUniform: () => ({ size: 1, type: 35664, name: '' }),
  getAttachedShaders: () => [],
  getAttribLocation: () => 0,
  getBufferParameter: () => null,
  getParameter: (param: number) => {
    // Mock WebGL VERSION
    if (param === 0x1F02) return 'WebGL 2.0';
    // Mock VIEWPORT - returns [x, y, width, height]
    if (param === 0x0BA2) return new Int32Array([0, 0, 800, 600]);
    // Mock SCISSOR_BOX - returns [x, y, width, height]
    if (param === 0x0C10) return new Int32Array([0, 0, 800, 600]);
    // Mock other common parameters
    if (param === 0x8B8C) return 16; // MAX_VERTEX_UNIFORM_VECTORS
    if (param === 0x8DFD) return 32; // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    // Mock MAX_TEXTURE_SIZE
    if (param === 0x0D33) return 4096;
    // Mock MAX_CUBE_MAP_TEXTURE_SIZE
    if (param === 0x851C) return 4096;
    return null;
  },
  getError: () => 0,
  getFramebufferAttachmentParameter: () => null,
  getProgramParameter: () => true,
  getProgramInfoLog: () => '',
  getRenderbufferParameter: () => null,
  getShaderParameter: () => true,
  getShaderPrecisionFormat: () => ({ rangeMin: 127, rangeMax: 127, precision: 23 }),
  getShaderInfoLog: () => '',
  getShaderSource: () => '',
  getTexParameter: () => null,
  getUniform: () => null,
  getUniformLocation: () => ({}),
  getVertexAttrib: () => null,
  getVertexAttribOffset: () => 0,
  hint: () => {},
  isBuffer: () => false,
  isEnabled: () => false,
  isFramebuffer: () => false,
  isProgram: () => false,
  isRenderbuffer: () => false,
  isShader: () => false,
  isTexture: () => false,
  lineWidth: () => {},
  linkProgram: () => {},
  pixelStorei: () => {},
  polygonOffset: () => {},
  readPixels: () => {},
  renderbufferStorage: () => {},
  sampleCoverage: () => {},
  scissor: () => {},
  shaderSource: () => {},
  stencilFunc: () => {},
  stencilFuncSeparate: () => {},
  stencilMask: () => {},
  stencilMaskSeparate: () => {},
  stencilOp: () => {},
  stencilOpSeparate: () => {},
  texImage2D: () => {},
  texParameterf: () => {},
  texParameteri: () => {},
  texSubImage2D: () => {},
  uniform1f: () => {},
  uniform1fv: () => {},
  uniform1i: () => {},
  uniform1iv: () => {},
  uniform2f: () => {},
  uniform2fv: () => {},
  uniform2i: () => {},
  uniform2iv: () => {},
  uniform3f: () => {},
  uniform3fv: () => {},
  uniform3i: () => {},
  uniform3iv: () => {},
  uniform4f: () => {},
  uniform4fv: () => {},
  uniform4i: () => {},
  uniform4iv: () => {},
  uniformMatrix2fv: () => {},
  uniformMatrix3fv: () => {},
  uniformMatrix4fv: () => {},
  useProgram: () => {},
  validateProgram: () => {},
  vertexAttrib1f: () => {},
  vertexAttrib1fv: () => {},
  vertexAttrib2f: () => {},
  vertexAttrib2fv: () => {},
  vertexAttrib3f: () => {},
  vertexAttrib3fv: () => {},
  vertexAttrib4f: () => {},
  vertexAttrib4fv: () => {},
  vertexAttribPointer: () => {},
  viewport: () => {},
});

// Create a 2D context mock
const create2DContextMock = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  fillStyle: '',
  textAlign: '',
  textBaseline: '',
  font: '',
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {},
});

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = function (contextType: string) {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return createWebGLContextMock() as any;
  }
  if (contextType === '2d') {
    return create2DContextMock() as any;
  }
  return null;
};
