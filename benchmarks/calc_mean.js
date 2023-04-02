const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const reportFolderPath = './report/';

const calculateMean = async (fileName, files, output) => {
    // Filter out non-CSV files and only keep files that end with "-lighthouse-results-shapes.csv"
    const csvFiles = files.filter((file) => file.endsWith('-' + fileName));
    let numFilesProcessed = 0;

    // Loop through each CSV file
    csvFiles.forEach((file) => {
        const filePath = path.join(reportFolderPath, file);
        const fileStream = fs.createReadStream(filePath);
        // Parse the CSV file
        fileStream
            .pipe(csv())
            .on('data', (row) => {
                output.push({
                    testname: row.testname,
                    testrun: numFilesProcessed,
                    firstContentfulPaint: parseFloat(row.firstContentfulPaint),
                    interactive: parseFloat(row.interactive),
                });
            })
            .on('end', () => {
                numFilesProcessed++;
                if (numFilesProcessed === csvFiles.length) {
                    const numFiles = csvFiles.length;
                    const groupedOutput = output.reduce((acc, row) => {
                        if (!acc[row.testname]) {
                            acc[row.testname] = {
                                testname: row.testname,
                                firstContentfulPaint: row.firstContentfulPaint,
                                interactive: row.interactive,
                            };
                        } else {
                            acc[row.testname].firstContentfulPaint += row.firstContentfulPaint;
                            acc[row.testname].interactive += row.interactive;
                        }
                        return acc;
                    }, {});

                    // Calculate the mean
                    const averageOutput = Object.values(groupedOutput).map((row) => ({
                        testname: row.testname,
                        firstContentfulPaint: row.firstContentfulPaint / numFiles,
                        interactive: row.interactive / numFiles,
                    }));

                    // Write the output to a new CSV file
                    const outputPath = path.join(reportFolderPath, fileName);
                    const outputCsv = ['testname,testrun,firstContentfulPaint,interactive']
                        .concat(averageOutput.map((row) => Object.values(row).join(',')))
                        .join('\n');
                    fs.writeFileSync(outputPath, outputCsv);
                }
            });
    });
};

fs.readdir(reportFolderPath, async (err, files) => {
    if (err) throw err;
    const output = [];
    const outputShapes = [];
    await calculateMean('lighthouse-results-shapes.csv', files, outputShapes);

    await calculateMean('lighthouse-results.csv', files, output);
});
