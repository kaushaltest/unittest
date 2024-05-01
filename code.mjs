import inquirer from 'inquirer';
import fs from 'fs';
import axios from 'axios';
import OpenAI from "openai";
import ora from 'ora';
import dotenv from 'dotenv';
dotenv.config();
// Set up your OpenAI API key



const findExtension = async (content) => {
  const extensionRegex = /'(?:e|E)xtension'\s*:\s*'(\.\w+)'/i;

  // Executing the regular expression to extract the extension
  const extensionMatch = content.match(extensionRegex);

  // Extracting the extension value
  const extension = extensionMatch ? extensionMatch[1] : null;

  return extension; // Output: .kt
}

// Define a function to generate unit tests based on the provided language and framework
const generateUnitTests = async (framework) => {
  const testCode = fs.readFileSync('input.js', 'utf8');
  // Define the prompt based on the selected language and framework

  // Define the request payload
  let prompt = `Generate a unit test using ${framework} syntax to thoroughly test the given code snippet (${testCode}). Ensure the test covers all possible scenarios and contains relevant assertions and necessary packages. Additionally, provide the file extension for the framework in the following format: 'extension': 'extension name' (e.g., 'extension': '.js').Note: this 'extension': 'extension name' return lowercase`;


  // let prompt = `Given a programming language name like ${framework}, suggest list the most appropriate testing framework for that language. Note:return only list of framwork name`

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    // console.log(completion.choices[0])
    return completion.choices[0];

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

const getFramworkName = async (language) => {

  // let prompt = `Given a programming language name like ${language}, suggest list the most appropriate testing framework for that language. Note:return only list of framwork name in array`
  let prompt = `When a user inputs a a programming language ${language}, you must determine and suggest the best suitable testing framework related to that language. For example, when a user inputs 'Python,' you should recommend pytest as an efficient testing framework commonly used within the Python ecosystem due to its simplicity and extensive support. Similarly, for 'JavaScript,' you can suggest Jest as a testing framework widely adopted by developers for its robust testing capabilities and seamless integration with various JS environments. Please provide only the name of the testing framework as output. Note:return only list of framwork name in array`

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    // console.log(completion.choices[0])
    return completion.choices[0];

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return null;
  }
};


// Prompt the user for the programming language
inquirer
  .prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Select the programming language:',
      choices: ['Dart', 'C#', 'C++', 'Go', 'Java', 'JavaScript', 'Kotlin', 'Node.js', 'PHP', 'Python', 'R', 'React', 'Ruby', 'Rust', 'Scala', 'Shell', 'Swift', 'TypeScript'] // Add more languages as needed
    }
  ])
  .then(languageAnswer => {
    var languageList
    getFramworkName(languageAnswer.language)
      .then(cod => {
        let framworkList = JSON.parse(cod.message.content)
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'template',
              message: 'Select the testing framwork:',
              choices: framworkList // Add more languages as needed
            }
          ])
          .then(frameworkAnswer => {
            const spinner = ora('Loading...').start();
            // Generate unit tests based on the selected language and framework
            generateUnitTests(frameworkAnswer.template)
              .then(async unitTests => {
                // console.log(unitTests)
                const cnt = unitTests.message.content;
                let fileExtension = await findExtension(cnt)
                console.log(fileExtension)
                // fs.writeFileSync('result'+fileExtension, unitTests.message.content);
                spinner.succeed('Generated unit tests');
              })
              .catch(error => {
                console.log(error)
                spinner.fail('Failed to generate unit tests');
              });
          })
          .catch(error => {
            console.log(error)
          });
      })

    // Prompt the user for the testing framework

  })
  .catch(error => {
    console.error('Error:', error);
  });
