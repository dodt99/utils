export const exportExcel = (data, filename) => {
  if (data && filename) {
    const blob = new Blob([data], {
      type: "application/vnd.ms-excel", // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    if (typeof a.download === "undefined") {
      window.location.href = downloadUrl;
    } else {
      a.href = downloadUrl;
      a.download = filename;
      a.setAttribute("download", filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
};

export const base64toBlob = (base64Data, contentType = "") => {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
};
