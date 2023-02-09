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
        'Common Name DE': '',
        Subfamily: '',
    };
    const errors = {};
    try {
        const commonNames = root.querySelectorAll('#common-name li');
        details['Common Name'] = commonNames.map((node) => node.innerText).join(', ');
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

    try {
        const factTable = root.querySelector('.smwfacttable');
        if (!factTable) {
            throw new Error('No Fact Table');
        }
        const facts = factTable.querySelectorAll('tr');
        facts.forEach((fact) => {
            const factTitle = fact.querySelector('.smwpropname')?.innerText;
            const factData = fact.querySelector('.smwprops')?.textContent;
            if (factTitle?.includes('Has&#160;drought&#160;tolerance')) {
                const isTolerant = factData.replace('+', '').trim();
                if (isTolerant === 'Tolerant') {
                    details['Has drought tolerance'] = true;
                } else if (isTolerant === 'Intolerant') {
                    details['Has drought tolerance'] = false;
                }
            }
            if (factTitle?.includes('Tolerates&#160;wind')) {
                const isTolerant = factData.replace('+', '').trim();
                if (isTolerant === 'Yes') {
                    details['Tolerates wind'] = true;
                } else if (isTolerant === 'No' || isTolerant === 'FALSE') {
                    details['Tolerates wind'] = false;
                }
            }
        });
    } catch (error) {
        // The following error can occur if there is no fact table on the page
        // errors['Fact Table'] = 'Not Found';
    }

    const plantSections = {
        'Plant References': '#article-references .reference-text',
        // 'Plant Uses': '#plant-uses',
        // 'Plant Functions': '#plant-functions',
        // 'Plant Propagation': '#plant-propagation',
        // 'Plant Cultivation': '#plant-cultivation',
        // 'Plant Crops': '#plant-crops',
        // 'Plant Problems': '#plant-problems',
        // 'Plant Interactions': '#plant-interactions',
        // 'Plant Polycultures': '#plant-polycultures',
        // 'Plant Descedants': '#plant-descendants',
    };

    Object.keys(plantSections).forEach((section) => {
        try {
            const sectionNode = root.querySelectorAll(plantSections[section]);
            details[section] = sectionNode.map((node) => node.innerText).join('///ref///');
        } catch (error) {
            errors[section] = 'Not Found';
        }
    });

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
    console.log('Parsed ' + details.length + ' pages');
    console.log('Encountered ' + errorsArray.length + ' errors');
}

parseAllPages();
