import ExcelJS from "exceljs";

/**
 * Exporta un array de objetos a un archivo Excel usando ExcelJS.
 * @param data - Los datos a exportar
 * @param fileName - Nombre del archivo (por defecto "export.xlsx")
 * @param sheetName - Nombre de la hoja (por defecto "Sheet1")
 */
export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  fileName: string = "export.xlsx",
  sheetName: string = "Sheet1",
) {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  const keys = Object.keys(data[0]); // ahora sí compila ✅

  worksheet.columns = keys.map((key) => ({
    header: key,
    key: key,
    width: 20,
  }));

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = globalThis.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  globalThis.URL.revokeObjectURL(url);
}
