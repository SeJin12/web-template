export const downloadFile = (fileName: string, downloadFileName: string) => {
    const filePath = fileName;
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', downloadFileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};