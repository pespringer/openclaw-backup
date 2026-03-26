const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../../data/cards.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cards data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        try {
            const cards = JSON.parse(data);
            res.json(cards);
        } catch (parseError) {
            console.error('Error parsing cards data:', parseError);
            res.status(500).json({ error: 'Data Parse Error' });
        }
    });
};