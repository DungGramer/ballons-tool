const API = "http://10.124.68.178:8008/api/v1";

export const UploadImg = async (files) => {
  if (!files) return;
  if (!Array.isArray(files)) files = [files];
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await fetch(`${API}/project/upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

/**
 * @param {string} projectName
 * @param {{ textdetector: string; ocr: string; inpainter: string; translator: string; enable_ocr: boolean; enable_translate: boolean; enable_inpaint: boolean; translate_source: string; translate_target: string }} params
 */
export const ImgTrans = async (
  projectName,
  params = {
    textdetector: "",
    ocr: "",
    inpainter: "",
    translator: "",
    enable_ocr: true,
    enable_translate: true,
    enable_inpaint: true,
    translate_source: "日本語",
    translate_target: "Tiếng Việt",
  }
) => {
  const response = await fetch(`${API}/ai/imgtrans/${projectName}`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(params),
    redirect: "follow",
  });
  return response.json();
};

export const GetImgTransResult = async (projectName) => {
  const response = await fetch(`${API}/ai/imgtrans/${projectName}/result`);
  return response.json();
};

export const DownloadImageFiles = async (url) => {
  const response = await fetch(
    `${API}${url}`
  );

  return response.blob();
};

export const postPath = async (path) => {
  const response = await fetch(`http://localhost:8008/upload`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ path }),
    redirect: "follow",
  });
  return response.json();
}