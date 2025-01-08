import assert from "node:assert";
import { describe, it } from "node:test";
import { QafGherkinFactory } from "../../src/qafbdd/qafGherkinFactory";
import { GherkinFileParser } from "../../src/qafbdd/gherkinFileParser";
import path from "node:path";
import { FeaturesLoader } from "../../src/features/load";

describe('load Features', function() {
    it('should load gherkin document and pickles for excel sheetName and key', async function(){
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-excel-sheetName-key.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,3);

    });

    it('should load gherkin document and pickles for excel sheetName', async function() {
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-excel-sheetName.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,3);

    });

    it('should load gherkin document and pickles for home page', async function() {
        let filePath = path.resolve(__dirname, 'resource/homepage.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,2);

    });


  });