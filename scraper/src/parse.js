import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { parse } from 'node-html-parser';
import { parse as json2csv } from 'json2csv';
import { config } from 'dotenv';
config();

const archivePath = process.env.PRACTICALPLANTSPATH;

function createDistinctFamilyDetails(details) {
    const detailsCopy = JSON.parse(JSON.stringify(details));
    const distinctFamilyDetails = [];
    const distinctFamilyList = [];
    detailsCopy.forEach((detail) => {
        const family = detail['Family'];
        if (!distinctFamilyList.includes(family)) {
            distinctFamilyList.push(family);
            Object.keys(detail).forEach((key) => {
                if (key !== 'Family') {
                    detail[key] = null;
                }
            });
            distinctFamilyDetails.push(detail);
        }
    });
    return distinctFamilyDetails;
}

function createDistinctGenusDetails(details) {
    const detailsCopy = JSON.parse(JSON.stringify(details));
    const distinctGenusDetails = [];
    const distinctGenusList = [];

    detailsCopy.forEach((detail) => {
        const genus = detail['Genus'];
        if (!distinctGenusList.includes(genus)) {
            distinctGenusList.push(genus);
            Object.keys(detail).forEach((key) => {
                if (key !== 'Genus') {
                    detail[key] = null;
                }
            });
            distinctGenusDetails.push(detail);
        }
    });
    return distinctGenusDetails;
}

function processData(details) {
    try {
        const mature_size = details['Mature Size']
            .replace('metres', '')
            .replace('meters', '')
            .replace('?', '');
        const arr = mature_size.split('x');
        const mature_size_height = arr[0]?.trim() || null;
        const mature_size_width = arr[1]?.trim() || null;
        details['To check'] = isNaN(mature_size_height) || isNaN(mature_size_width);
        details['Mature Size Height'] = mature_size_height;
        details['Mature Size Width'] = mature_size_width;
        delete details['Mature Size'];
    } catch (error) {
        console.log(error);
    }

    Object.keys(details).forEach((key) => {
        if (details[key] === '?') {
            details[key] = null;
        } else if (details[key] === 'None listed.') {
            details[key] = null;
        }

        if (
            details['Herbaceous or Woody'] === 'Herbaceous' &&
            details['Life Cycle'] === 'Perennial'
        ) {
            details['Is Tree'] = true;
        }

        if (key == 'Environmental Tolerances' && details[key].includes('Nutritionally poor soil')) {
            details['Nutrition Demand'] = 'light feeder';
        }
    });
}

function parseSinglePage(fileName) {
    const file = readFileSync(archivePath + '/wiki/' + fileName + '/index.html', 'utf8');
    const root = parse(file);
    const details = {
        'Folder Name': fileName,
        'Common Name': '',
        'Common Name DE': '',
        Subfamily: '',
        'To check': false,
        'Is Tree': null,
        'Mature Size Height': null,
        'Mature Size Width': null,
        'Nutrition Demand': null,
        License: 'CC BY-SA 3.0',
        'Article Last Modified': null,
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

    try {
        const footerInfo = root.querySelector('#mw-footer-info');
        const listElements = footerInfo.querySelectorAll('li');
        listElements.forEach((listElement) => {
            const text = listElement.innerText;
            if (text.includes('last modified')) {
                // Use a regular expression to extract the date and time strings
                const datePattern = /(\d{1,2}\s\w+\s\d{4}), at (\d{1,2}):(\d{2})/;
                const matches = datePattern.exec(text);

                const date = new Date(matches[1]);
                const hours = parseInt(matches[2], 10);
                const minutes = parseInt(matches[3], 10);
                date.setHours(hours);
                date.setMinutes(minutes);
                details['Article Last Modified'] = date.toISOString();
            }

            if (!text.includes('Creative Commons Attribution-NonCommercial-ShareAlike')) {
                details['License'] = null;
            }
        });
    } catch (error) {
        // errors['Footer Info'] = 'Not Found';
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

    processData(details);

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

    const distinctGenusDetails = createDistinctGenusDetails(details);
    const distinctFamilyDetails = createDistinctFamilyDetails(details);

    console.log('Writing to CSV');
    const csv = json2csv(details);
    writeFileSync('data/detail.csv', csv);

    const errorsCsv = json2csv(errorsArray);
    writeFileSync('data/errors.csv', errorsCsv);

    const distinctGenusCsv = json2csv(distinctGenusDetails);
    writeFileSync('data/distinctGenus.csv', distinctGenusCsv);

    const distinctFamilyCsv = json2csv(distinctFamilyDetails);
    writeFileSync('data/distinctFamily.csv', distinctFamilyCsv);

    console.log('Parsed ' + details.length + ' pages');
    console.log('Encountered ' + errorsArray.length + ' errors');
}

parseAllPages();
