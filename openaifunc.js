const OpenAI = require("openai");
require('dotenv').config();
const fs = require('fs');

// Define a function to generate unit tests based on the provided language and framework
const generateUnitTests = async (framework, code) => {
    // Define the request payload


    // let prompt = `Given a programming language name like ${framework}, suggest list the most appropriate testing framework for that language. Note:return only list of framwork name`

    try {

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // const prompt = `Generate a unit test using ${framework} syntax to thoroughly test the given code snippet (${code}). Ensure the test covers all possible scenarios and contains relevant assertions and necessary packages. Note: remove quotes from response `;

        const prompt = `
        Given a function or class and the ${framework} testing framework, generate framework-specific unit tests. These tests will include coverage for boundary conditions, edge cases, and typical inputs relevant to the function or class. Ensure comprehensive coverage of both positive and negative scenarios using the assertion methods provided by the specified framework. Additionally, provide detailed comments and documentation within the generated tests to enhance understanding and facilitate maintenance Note:remove all comments from response.
        `

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo-0613",
            // tools: tools,
            // tool_choice: "auto", 
            // functions: generateUnitTestFunction,
            // function_call: 'auto'
        });
        console.log(completion.choices[0])
        if (completion.choices[0]) {
            if (completion.choices[0].message.content) {
                fs.writeFileSync('result.txt', completion.choices[0].message.content);

                return ({ success: true, data: completion.choices[0].message.content });
            }
            else {
                return ({ success: false, data: [] });
            }
        }
        else {
            return ({ success: false, error: error.response ? error.response.data : error.message });

        }

    } catch (error) {
        return ({ success: false, error: error.response ? error.response.data : error.message });
    }
};

const getFramworkName = async (language) => {

    // let prompt = `Given a programming language name like ${language}, suggest list the most appropriate testing framework for that language. Note:return only list of framwork name in array`
    // let prompt = `When a user inputs a a programming language ${language}, you must determine and suggest the best suitable testing framework related to that language. For example, when a user inputs 'Python,' you should recommend pytest as an efficient testing framework commonly used within the Python ecosystem due to its simplicity and extensive support. Similarly, for 'JavaScript,' you can suggest Jest as a testing framework widely adopted by developers for its robust testing capabilities and seamless integration with various JS environments. Please provide only the name of the testing framework as output. Note:return only list of framwork name in array`
    let prompt =`
    Given a programming language  ${language}, generate an array containing the names of all commonly used testing frameworks for that language. Ensure the array includes the names of popular testing frameworks that cater to various testing needs within the specified language's ecosystem. For example, if the input language is 'Python', the output array might include frameworks like ["unittest", "pytest", "nose", "doctest", "tox"]. The goal is to provide a comprehensive list  of array testing frameworks relevant to the specified programming language. Note :return only list of framework name in array & remove this from content Here is a list of commonly used testing frameworks for JavaScript:`;
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        if (completion.choices[0]) {
            if (completion.choices[0].message.content) {
                console.log(completion.choices[0].message.content)
                
                return ({ success: true, data: JSON.parse(completion.choices[0].message.content) });
            }
            else {
                return ({ success: false, data: [] });
            }
        }
        else {
            return ({ success: false, error: error.response ? error.response.data : error.message });

        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
};
module.exports = { generateUnitTests, getFramworkName };