const fs = require('fs');
const path = require('path');

// Specify the directory containing the .png files
const directoryPath = './assets'; // Change this to your folder path

// Function to remove spaces from .png file names
function removeSpacesFromPngFiles(dir) {
    // Read the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }

        // Loop through the files
        files.forEach(file => {
            // Check for .png files
            if (path.extname(file).toLowerCase() === '.png') {
                // Create new file name without spaces
                const newFileName = file.replace(/\s+/g, '_'); // Replace spaces with underscores
                const oldFilePath = path.join(dir, file);
                const newFilePath = path.join(dir, newFileName);

                // Rename the file if the new name is different
                if (newFileName !== file) {
                    fs.rename(oldFilePath, newFilePath, (renameErr) => {
                        if (renameErr) {
                            console.error(`Error renaming file ${file}:`, renameErr);
                        } else {
                            console.log(`Renamed: "${file}" to "${newFileName}"`);
                        }
                    });
                }
            }
        });
    });
}

// Call the function
removeSpacesFromPngFiles(directoryPath);
