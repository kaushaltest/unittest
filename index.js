const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getFramworkName, generateUnitTests } = require('./openaifunc');
const app = express();
const PORT = process.env.PORT || 9999;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get-framwork-name', async (req, res) => {
    try{
        const { languageName } = req.body;
        // const result = await main(storageName, fileName, email, schoolName, subject, body, orgName);
        const result = await getFramworkName(languageName);
        if (result?.success) {
            res.json(result);
        } else {
            res.status(500).json({ success: true, error: result?.error });
        }
    }catch(e)
    {
        res.status(500).json({ success: true, error: e });
    }
});

app.post('/generate-unittest', async (req, res) => {
    try{
        const { framworkName,code } = req.body;
        const result = await generateUnitTests(framworkName,code);
        console.log(result)
        if (result?.success) {
            res.json(result);
        } else {
            res.status(500).json({ success: true, error: result?.error });
        }
    }catch(e)
    {
        res.status(500).json({ success: true, error: e });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
