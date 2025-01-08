import * as Types from '@cucumber/messages';
import { IdGenerator } from '@cucumber/messages';
export class GherkinDocumentUtil {

    public static getUriFromGherkinDocument(gherkinDocument: Types.GherkinDocument): string {
        return gherkinDocument.uri as string;
    }

    public static getNameFromScenario(scenario: Types.Scenario): string {
        return scenario.name as string;
    }

    public static genPickle( uri: string,name: string,language: string,
        astNodeIdsForSteps: string[][],types: Types.PickleStepType[], text: string[],
        tagNames: string[], astNodeIds: string[],
        ids: string[]
    ): Types.Pickle {
        return {
            id: IdGenerator.uuid()(),
            uri: uri,//source.uri
            name: name,//scenario.name
            language: language, 
            steps: this.genPickleSteps(astNodeIdsForSteps,types,text),// tablebody ids and step ids
            tags: this.genPickleTags(tagNames,astNodeIds),// feature tags and scenario tags
            astNodeIds: this.genAstNodeIds(ids)// scenario id and step id
        }
    }

    public static genPickleTags(tagNames: string[], astNodeIds: string[]): Types.PickleTag[] {
        let pickleTags: Types.PickleTag[] = [];
        for(let i = 0; i < tagNames.length; i++){
            pickleTags.push({name : tagNames[i], astNodeId: astNodeIds[i]});
        }
        return pickleTags;
    }

    public static genPickleSteps(astNodeIds: string[][],types: Types.PickleStepType[], texts: string[]): Types.PickleStep[]{
        let pickleSteps: Types.PickleStep[] = [];
        for(let i = 0; i < astNodeIds.length; i++){
            pickleSteps.push(this.genPickleStep(astNodeIds[i],types[i],texts[i]));
        }
        return pickleSteps;
    }
    //The context in which the step was specified: context (Given), action (When) or outcome (Then).
    // \n\nNote that the keywords `But` and `And` inherit their meaning from prior steps and 
    // the `*` 'keyword' doesn't have specific meaning (hence Unknown)
    //export declare enum PickleStepType {
    //    UNKNOWN = "Unknown",
    //    CONTEXT = "Context",//Given
    //    ACTION = "Action",//When
    //    OUTCOME = "Outcome"//Then
    //}
    public static genPickleStep(astNodeIds: string[],type: Types.PickleStepType, text: string): Types.PickleStep{
        return {
            astNodeIds: astNodeIds,
            id: IdGenerator.uuid()(),
            type: type,
            text: text
        }
    }

    public static genAstNodeIds(ids: string[]): string []{
        return ids;
    }

    public static genTableHeader(values: string[],lineforCells: number[],lineforHeader: number): Types.TableRow {
        return this.genTableRow(values,lineforCells,lineforHeader);
    }

    public static genTableBody(values: string[][],lineforCells: number[][],lineforHeader: number[]): Types.TableRow[] {
        let rows: Types.TableRow[] = [];
        for(let i = 0; i < values.length; i++){
            rows.push(this.genTableRow(values[i],lineforCells[i],lineforHeader[i]));
        }
        return rows;
    }
    
    public static genTableRow(values: string[],lineforCells: number[],lineforHeader: number): Types.TableRow {
        return {
            id: IdGenerator.uuid()(),
            location: this.genLocation(lineforHeader),
            cells: this.genTableCells(values,lineforCells)
        }
    }

    public static genTableCells(value: string[],line: number[]): Types.TableCell []{
        let cells: Types.TableCell[] = [];
        for(let i = 0; i < value.length; i++){
            cells.push(this.genTableCell(value[i],line[i]));
        }
        return cells;
    }

    public static genTableCell(value: string,line: number): Types.TableCell {
        return {
            location: this.genLocation(line),
            value: value
        }
    }

    public static genLocation(line: number): Types.Location {
        return {
            line: line,
            column: line
        };
    }
}