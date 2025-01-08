import * as XLSX from 'xlsx';
export type SheetRange = { startRow: number, endRow: number, startCol: number, endCol: number };
export class ExcelUtil {

    public static getSheetDimensionsFromFileAndSheetName(file: string, sheetName: string): SheetRange {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const range = XLSX.utils.decode_range(sheet['!ref']?sheet['!ref']:'A1');
        const startRow = range.s.r + 1; //from 0, so need plus 1
        const endRow = range.e.r + 1;
        const startCol = range.s.c + 1;
        const endCol = range.e.c + 1;
        return { startRow, endRow, startCol, endCol };
  }

    public static getSheetDimensions(sheet: XLSX.WorkSheet): SheetRange {
          const range = XLSX.utils.decode_range(sheet['!ref']?sheet['!ref']:'A1');
          const startRow = range.s.r + 1; //from 0, so need plus 1
          const endRow = range.e.r + 1;
          const startCol = range.s.c + 1;
          const endCol = range.e.c + 1;
          return { startRow, endRow, startCol, endCol };
    }

    public static getFirstRow(sheet: XLSX.WorkSheet, skipHeaderRow: boolean): number {
        let sheetRange:SheetRange = this.getSheetDimensions(sheet);
        let rowNumber = sheetRange.startRow;
        for ( ;rowNumber <= sheetRange.endRow ; rowNumber++) {
            let isEmptyRow = true;
            for (let colNumber = sheetRange.startCol; colNumber <= sheetRange.endCol; colNumber++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowNumber - 1, c: colNumber - 1 });
                if (sheet[cellAddress] && sheet[cellAddress].v !== undefined) {
                    isEmptyRow = false;
                    break;
                }
            }
            if (!isEmptyRow) {
                if (!skipHeaderRow) {
                    break;
                } else {
                    skipHeaderRow = false;
                }
            }
        }
        return rowNumber;
    }

    public static getFirstCol(sheet: XLSX.WorkSheet): number {
        let firstrow:number = this.getFirstRow(sheet, false); // to set the first row
        let sheetRange:SheetRange = this.getSheetDimensions(sheet);
        for (let col = sheetRange.startCol; col <= sheetRange.endCol ; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: firstrow-1, c: col - 1 });
            if (sheet[cellAddress] && sheet[cellAddress].v !== undefined) {
               return col;
            }
        }
        return 0;
    }

    public static getSheetNames(file: string): string[] {
        const workbook = XLSX.readFile(file);
        const names = workbook.SheetNames;
        return names;
    }


    public static getExcelDataAsMap(file: string, sheetName: string): any[][] {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        let sheetRange:SheetRange = this.getSheetDimensions(sheet);
        const startRow = sheetRange.startRow;
        const startCol = sheetRange.startCol;
        const endRow = sheetRange.endRow;
        const endCol = sheetRange.endCol;
        const tabArray = new Array(endRow - startRow).fill(null).map(() => new Array(1).fill(null));
        const colNames = new Array(endCol - startCol - 1).fill(null);
        let ci = 0;
        for (let i = startRow; i <= endRow; i++) {
            let cj = 0;
            if (i === startRow) {
                for (let j = startCol; j <= endCol; j++,cj++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: i-1, c: j - 1 });
                    colNames[cj] = sheet[cellAddress].v;
                }
            } else {
                let jsonString = '{';
                for (let j = startCol; j <= endCol; j++,cj++) {
                    if (jsonString.length > 1) {
                        jsonString += ',';
                    }
                    const cellAddress = XLSX.utils.encode_cell({ r: i-1, c: j - 1 });
                    jsonString += `"${colNames[cj]}":"${sheet[cellAddress].v}"`;
                }
                jsonString += '}';
                tabArray[ci++][0] = JSON.parse(jsonString);
            }
        }
        return tabArray;
    }

    public static getWorkbook(file: string): XLSX.WorkBook {
        return XLSX.readFile(file);
    }

    public static getTableDataAsMap(file: string, tableName: string, sheetName: string): any[][] {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const startCell = this.findCell(sheet, tableName, 1, 1)
        const startRow = startCell.r;
        const startCol = startCell.c;
        const endcell = this.findCell(sheet, tableName, startCol + 1, startRow + 1)
        const endRow = endcell.r;
        const endCol = endcell.c;
        const tabArray = new Array(endRow - startRow).fill(null).map(() => new Array(1).fill(null));
        const colNames = new Array(endCol - startCol - 1).fill(null);
        let ci = 0;
        for (let i = startRow; i <= endRow; i++) {
            let cj = 0;
            if (i === startRow) {
                for (let j = startCol + 1; j < endCol; j++,cj++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: i-1, c: j - 1 });
                    colNames[cj] = sheet[cellAddress].v;
                }
            } else {
                let jsonString = '{';
                for (let j = startCol + 1; j < endCol; j++,cj++) {
                    if (jsonString.length > 1) {
                        jsonString += ',';
                    }
                    const cellAddress = XLSX.utils.encode_cell({ r: i-1, c: j - 1 });
                    jsonString += `"${colNames[cj]}":"${sheet[cellAddress].v}"`;
                }
                jsonString += '}';
                tabArray[ci++][0] = JSON.parse(jsonString);
            }
        }
        return tabArray;
    }

    public static findCell(sheet: XLSX.WorkSheet, searchText: string, firstCol: number, firstRow: number): XLSX.CellAddress {
        let sheetRange:SheetRange = this.getSheetDimensions(sheet);
        for (let j = firstRow; j <= sheetRange.endRow ; j++) {
            for (let colNumber = firstCol; colNumber <= sheetRange.endCol; colNumber++) {
                const cellAddress = XLSX.utils.encode_cell({ r: j - 1, c: colNumber - 1 });
                if (sheet[cellAddress] && sheet[cellAddress].v !== undefined && sheet[cellAddress].v === searchText) {
                    return { r: j, c: colNumber };
                }
            }
        }
        return { r: 0, c: 0 };
    }
}
