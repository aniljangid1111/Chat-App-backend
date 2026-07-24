const fs = require("fs");
const path = require("path");

// only send folder name to delete img when update img

// const deleteFile = (fileUrl, folderName) => {
//     if (!fileUrl) return;

//     const fileName = path.basename(fileUrl);

//     const filePath = path.join(
//         process.cwd(),
//         "uploads",
//         folderName,
//         fileName
//     );

//     if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//     }
// };

// module.exports = {
//     deleteFile,
// };

// More Dynamin No send folder name automatic get

const deleteFile = (fileUrl) => {
    if (!fileUrl) return;

    try {
        const relativePath = new URL(fileUrl).pathname.replace(/^\/+/, "");

        const filePath = path.join(process.cwd(), relativePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.log("Delete File Error:", error.message);
    }
};

module.exports = {
    deleteFile,
};