const fs = require('fs');

module.exports.unlinkFile = (filepath) => {
    try {
        fs.unlinkSync(filepath);
        
        
        console.log('\x1b[42m <======= Previous file deleted successfully =======> \x1b[0m');
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`\x1b[41m<======= File path does not exist =======>\x1b[0m`);
          } else {
            console.error(`\x1b[41m<======= Previous file didn't delete =======>\x1b[0m`);
          }
        return false;
    }
}