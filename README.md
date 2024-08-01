https://velog.io/@nemo/redux-persist
https://notistack.com/api-reference
https://blog.won-jung.kim/mui-x-data-grid-server-side-data

# Redux
https://despiteallthat.tistory.com/237


# UI
https://demos.themeselection.com/marketplace/materio-mui-nextjs-admin-template/demo-1/en/dashboards/analytics







# 파일
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      console.log("Selected file:", selectedFile.type);

      const fileType = selectedFile.type;
      const fileName = selectedFile.name;

      if (fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileContent = e.target?.result;
          console.log("TXT file content:", fileContent);
        };
        reader.readAsText(selectedFile);
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const binaryStr = e.target?.result;
          if (binaryStr) {
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log("Excel file content:", jsonData);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    }
  };

   <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  엑셀 업로드 {file?.name}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                  />
                </Button>