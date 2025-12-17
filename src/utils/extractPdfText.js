const { PDFParse } = require('pdf-parse');

const extractTextFromResume = async (buffer) => {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText({
        parseHyperlinks: true,
    });
    await parser.destroy();
    return {
        text: data.text,
        links: data.links || [],
    }
}


module.exports = { extractTextFromResume };

