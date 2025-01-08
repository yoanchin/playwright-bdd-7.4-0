import assert from "node:assert";
import { describe, it } from "node:test";
import { ExcelUtil, SheetRange } from "../../src/qafbdd/excelUtil";
import * as path from 'path';
import * as XLSX from 'xlsx';

describe('Excel Util File', function() {
    it('should get correct output of getSheetDimensions method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let workbook:XLSX.WorkBook = ExcelUtil.getWorkbook(filePath);
        let worksheet:XLSX.WorkSheet = workbook.Sheets["DataTable1"];
        let sheetRange:SheetRange = ExcelUtil.getSheetDimensions(worksheet);
        assert.equal(sheetRange.startRow, 1);
        assert.equal(sheetRange.endRow, 3);
        assert.equal(sheetRange.startCol, 1);
        assert.equal(sheetRange.endCol, 4);

        let worksheet1:XLSX.WorkSheet = workbook.Sheets["DataTable"];
        let sheetRange1:SheetRange = ExcelUtil.getSheetDimensions(worksheet1);
        assert.equal(sheetRange1.startRow, 7);
        assert.equal(sheetRange1.endRow, 39);
        assert.equal(sheetRange1.startCol, 2);
        assert.equal(sheetRange1.endCol, 20);
    });

    it('should get correct output of getSheetNames method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let sheets:string[] = ExcelUtil.getSheetNames(filePath);
        assert.equal(sheets.length, 8);
    });

    it('should get correct output of getWorkbook method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let workbook:XLSX.WorkBook = ExcelUtil.getWorkbook(filePath);
        assert.equal(workbook.SheetNames.length, 8);
    });

    it('should get correct output of getFirstRow method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let workbook:XLSX.WorkBook = ExcelUtil.getWorkbook(filePath);
        let worksheet:XLSX.WorkSheet = workbook.Sheets["DataTable1"];
        let firstRow:number = ExcelUtil.getFirstRow(worksheet,false);
        assert.equal(firstRow, 1);

        let firstRow2:number = ExcelUtil.getFirstRow(worksheet,true);
        assert.equal(firstRow2, 2);

        let worksheet1:XLSX.WorkSheet = workbook.Sheets["DataTable"];
        let firstRow1:number = ExcelUtil.getFirstRow(worksheet1,false);
        assert.equal(firstRow1, 7);

    });

    it('should get correct output of getFirstCol method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let workbook:XLSX.WorkBook = ExcelUtil.getWorkbook(filePath);
        let worksheet:XLSX.WorkSheet = workbook.Sheets["DataTable1"];
        let firstCol:number = ExcelUtil.getFirstCol(worksheet);
        assert.equal(firstCol, 1);

        let worksheet1:XLSX.WorkSheet = workbook.Sheets["DataTable"];
        let firstCol1:number = ExcelUtil.getFirstCol(worksheet1);
        assert.equal(firstCol1, 3);
    });

    it('should get correct output of findCell method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let workbook:XLSX.WorkBook = ExcelUtil.getWorkbook(filePath);
        let worksheet:XLSX.WorkSheet = workbook.Sheets["DataTable"];
        let cellAddress:XLSX.CellAddress = ExcelUtil.findCell(worksheet, 'Data1', 1, 1);
        assert.equal(cellAddress.r, 7);
        assert.equal(cellAddress.c, 3);

        let cellAddress1:XLSX.CellAddress = ExcelUtil.findCell(worksheet, 'Data2', 1, 1);
        assert.equal(cellAddress1.r, 19);
        assert.equal(cellAddress1.c, 9);

        let worksheet1:XLSX.WorkSheet = workbook.Sheets["DataTable1"];
        let cellAddress2:XLSX.CellAddress = ExcelUtil.findCell(worksheet1, 'Data1', 1, 1);
        assert.equal(cellAddress2.r, 3);
        assert.equal(cellAddress2.c,4);
    });

    it('should get correct output of getTableDataAsMap method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let testData:any[][] = ExcelUtil.getTableDataAsMap(filePath, "Data1", "DataTable2");
        assert.equal(testData[0][0]["searchKey"], "QMetry QAF");
        assert.equal(testData[0][0]["searchResult"], "QMetry Automation Framework");
        assert.equal(testData[0][0]["number"], "10");
        assert.equal(testData[1][0]["searchKey"], "Selenium ISFW");
        assert.equal(testData[1][0]["searchResult"], "Infostretch Test Automation Framework");
        assert.equal(testData[1][0]["number"], "20");

        let testData2:any[][] = ExcelUtil.getTableDataAsMap(filePath, "Data2", "DataTable2");
        assert.equal(testData2[0][0]["searchKey"], "QMetry QAF2");
        assert.equal(testData2[0][0]["searchResult"], "QMetry Automation Framework2");
        assert.equal(testData2[0][0]["number"], "20");
        assert.equal(testData2[1][0]["searchKey"], "Selenium ISFW2");
        assert.equal(testData2[1][0]["searchResult"], "Infostretch Test Automation Framework2");
        assert.equal(testData2[1][0]["number"], "20");


        let testData3:any[][] = ExcelUtil.getTableDataAsMap(filePath, "Data3", "DataTable2");
        assert.equal(testData3[0][0]["searchKey"], "QMetry QAF3");
        assert.equal(testData3[0][0]["searchResult"], "QMetry Automation Framework3");
        assert.equal(testData3[0][0]["number"], "30");
        assert.equal(testData3[1][0]["searchKey"], "Selenium ISFW3");
        assert.equal(testData3[1][0]["searchResult"], "Infostretch Test Automation Framework3");
        assert.equal(testData3[1][0]["number"], "30");

    });

    it('should get correct output of getExcelDataAsMap method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let testData:any[][] = ExcelUtil.getExcelDataAsMap(filePath, "DataTable3");
        assert.equal(testData[0][0]["searchKey"], "QMetry QAF");
        assert.equal(testData[0][0]["searchResult"], "QMetry Automation Framework");
        assert.equal(testData[0][0]["number"], "10");
        assert.equal(testData[1][0]["searchKey"], "Selenium ISFW");
        assert.equal(testData[1][0]["searchResult"], "Infostretch Test Automation Framework");
        assert.equal(testData[1][0]["number"], "20");

        let testData4:any[][] = ExcelUtil.getExcelDataAsMap(filePath, "DataTable4");
        assert.equal(testData4[0][0]["start"], "2");
        assert.equal(testData4[0][0]["end"], "4");
        assert.equal(testData4[1][0]["start"], "3");
        assert.equal(testData4[1][0]["end"], "6");
        assert.equal(testData4[2][0]["start"], "4");
        assert.equal(testData4[2][0]["end"], "8");
    });

    it('should get correct output of getSheetDimensionsFromFileAndSheetName method', function() {
        let filePath = path.resolve(__dirname, 'testdata/testdata.xlsx');
        let range:SheetRange = ExcelUtil.getSheetDimensionsFromFileAndSheetName(filePath, "DataTable3");
        assert(range.startRow,'1');
        assert(range.startCol,'1');
        assert(range.endRow,'3');
        assert(range.endCol,'3');

        let range4:SheetRange = ExcelUtil.getSheetDimensionsFromFileAndSheetName(filePath, "DataTable4");
        assert(range4.startRow,'1');
        assert(range4.startCol,'1');
        assert(range4.endRow,'4');
        assert(range4.endCol,'2');

        const workbook = XLSX.readFile(filePath);
        const sheet3 = workbook.Sheets["DataTable3"];
        let range3:SheetRange = ExcelUtil.getSheetDimensions(sheet3);
        assert(range3.startRow,'1');
        assert(range3.startCol,'1');
        assert(range3.endRow,'3');
        assert(range3.endCol,'3');

        const sheet41 = workbook.Sheets["DataTable4"];
        let range41:SheetRange = ExcelUtil.getSheetDimensions(sheet41);
        assert(range41.startRow,'1');
        assert(range41.startCol,'1');
        assert(range41.endRow,'4');
        assert(range41.endCol,'2');
    });

  });