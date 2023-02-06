import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { parse } from 'node-html-parser';
import { parse as json2csv } from 'json2csv';
import { config } from 'dotenv';
config();

const archivePath = process.env.PRACTICALPLANTSPATH;

function parseSinglePage(fileName) {
    const file = readFileSync(archivePath + '/wiki/' + fileName + '/index.html', 'utf8');
    const root = parse(file);
    const details = {
        'Folder Name': fileName,
        'Common Name': '',
        Synonyms: '',
    };
    const errors = {};
    try {
        const commonNames = root.querySelectorAll('#common-name li');
        details['Common Name'] = commonNames[0].innerText;
        details['Synonyms'] = commonNames
            .slice(1)
            .map((node) => node.innerText)
            .join(', ');
    } catch (error) {
        errors['Folder Name'] = fileName;
        errors['Common Name'] = 'Not Found';
    }
    try {
        const plantDatatable = root.querySelector('#plant-datatable');
        const subsections = plantDatatable.querySelectorAll('.infobox-subsection');

        subsections.forEach((subsection) => {
            const subsectionTitle = subsection.querySelector('.infobox-title').innerText;
            const subsectionData = subsection.querySelector('.infobox-content').innerText;
            details[subsectionTitle] = subsectionData;
        });
    } catch (error) {
        errors['Plant Datatable'] = 'Not Found';
        throw errors;
    }
    return details;
}

function parseAllPages() {
    console.log('Parsing all pages');
    const files = readdirSync(archivePath + '/wiki');
    const details = [];
    const errorsArray = [];
    files
        .filter(
            (fileName) =>
                fileName !== '.DS_Store' &&
                fileName !== 'A-Z_of_all_plants' &&
                fileName !== 'A-Z_of_common_names',
        )
        .forEach((fileName) => {
            try {
                const fileDetails = parseSinglePage(fileName);
                details.push(fileDetails);
            } catch (errors) {
                errorsArray.push(errors);
            }
        });
    console.log('Writing to CSV');
    const csv = json2csv(details);
    writeFileSync('data/detail.csv', csv);
    const errorsCsv = json2csv(errorsArray);
    writeFileSync('data/errors.csv', errorsCsv);
}

parseAllPages();
