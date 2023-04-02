const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const reportFolderPath = './report/';

const output = [
    { testcase: '100 circles', firstContentfulPaint: null, interactive: null },
    { testcase: '100 stars', firstContentfulPaint: null, interactive: null },
    { testcase: '100 rectangles', firstContentfulPaint: null, interactive: null },
    { testcase: '100 polygons', firstContentfulPaint: null, interactive: null },
];

const calculateMean = async (fileName, files) => {
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
                const foundTestcase = output.find((testcase) => testcase.testcase === row.testname);
                if (foundTestcase) {
                    foundTestcase.firstContentfulPaint += Number(row.firstContentfulPaint);
                    foundTestcase.interactive += Number(row.interactive);
                }
            })
            .on('end', () => {
                numFilesProcessed++;
                if (numFilesProcessed === csvFiles.length) {
                    // Divide the sum of each value by the number of CSV files to get the mean value
                    const numFiles = csvFiles.length;
                    output.forEach((row) => {
                        row.firstContentfulPaint = (row.firstContentfulPaint /= numFiles).toFixed(
                            2,
                        );
                        row.interactive = (row.interactive /= numFiles).toFixed(2);
                    });

                    // Write the output to a new CSV file
                    const outputPath = path.join(reportFolderPath, fileName);
                    const outputCsv = ['testname,firstContentfulPaint,interactive']
                        .concat(output.map((row) => Object.values(row).join(',')))
                        .join('\n');
                    fs.writeFileSync(outputPath, outputCsv);
                }
            });
    });
};

fs.readdir(reportFolderPath, async (err, files) => {
    if (err) throw err;

    await calculateMean('lighthouse-results-shapes.csv', files);

    await calculateMean('lighthouse-results.csv', files);
});
