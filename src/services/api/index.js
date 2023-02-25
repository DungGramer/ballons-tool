const API = 'http://10.124.68.184:8008/api/v1';

export const UploadImg = async (files) => {
  if (!files) return;
  if (!Array.isArray(files)) files = [files];
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const response = await fetch(`${API}/project/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

/**
 * @param {string} projectName
 * @param {{ textdetector: string; ocr: string; inpainter: string; translator: string; enable_ocr: boolean; enable_translate: boolean; enable_inpaint: boolean; translate_source: string; translate_target: string }} params
 */
export const ImgTrans = async (projectName, params) => {
  const response = await fetch(`${API}/ai/imgtrans/${projectName}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.json();
};

export const GetImgTransResult = async (projectName) => {
  const response = await fetch(`${API}/ai/imgtrans/${projectName}/result`);
  return response.json();
};

export const DownloadImageFiles = async (projectName, fileName) => {
  const response = await fetch(`${API}/ai/imgtrans/${projectName}/result/inpainted/${fileName}`);

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};
