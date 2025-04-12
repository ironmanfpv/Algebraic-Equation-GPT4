# Algebraic Equation GPT4

Algebraic Equation GPT4 is latest and most complete version of the project yet. 
This repo combines image text recognition API,Speech to Text API and LLMs.
A photo or an image containing Mathematics equation(s) is fed to the app.
The web application implements OPENAI Vision API to extract text from the source.
Equation(s) to be solved can also be keyed in or written out, to edit the extracted text.
The extracted equation is fed to an LLM which then analyses and solves it.
A solution, together with its comprehensive explanation is output to the user.
This is the MULTI-MODAL version of previous version of Algebraic Equation GPT.

In version 1, users could input equation via camera, photo file, text input via keyboard or (iOS) stylus.<br> 
In version 3.5, Speech to Text capabilities is added as the 5th option of query input.<br>
In this version, exploration of text equation detection by image is accomplished with only 1 API key used.<br> 
Algebraic Equation GPT4 understand equations said in natural English language.<br>
Say the equation as you would read it out and Algebraic Equation GPT4 will transcribe.<br> 

<img src= "https://github.com/ironmanfpv/Algebraic-Equation-GPT-V4/blob/main/img/img%200.jpg">
<img src= "https://github.com/ironmanfpv/Algebraic-Equation-GPT-V4/blob/main/img/img%201.jpg">
<img src= "https://github.com/ironmanfpv/Algebraic-Equation-GPT-V4/blob/main/img/img%202.jpg">

# SETUP STEPS: #

Algebraic Equation GPT V4 was developed modularly and independently from ground up.<br>
Text, Image to Text and Speech to text capabilities were incrementally integrated with the GPT.

- To run a WEB HOSTED version of Algebraic Equation GPT.

  Access https://ironmanfpv.github.io/Algebraic-Equation-GPT4/ in browser.
  Have your OPEN AI API key ready. Follow Section A and B.

- To run a LOCAL HOSTED version of Algebraic Equation GPT4, read all sections below. 

## A. Generate OPENAI API keys ##

1.  Access OPENAI>API via Sign up or Log in.
2.  Click settings (Nut icon on top right, beside profile).
3.  Left Column, under organisation >API Keys> + Create New Secret Key.
4.  Select Key owned by you> Type in Name>Select Default project > Click Create Secret Key.
5.  Click Copy to copy the secret key. Store it somewhere safe to be used in Algebraic Equation GPT V3.5 for log in.

## B. Procedure to use a hosted version of Algebriac Equation GPT ##

1.  Key in your name.
2.  Key in your OPENAI API key and click confirmed. (Ensure both name and API keys are entered.)
3.  In the Extract Equation Window, input Equation for Algebraic Equation GPT V3.5 to solve, analysed and explained.
4.  Alternatively, Click the "Say Equation" button to activate mic and record audio equation input. 
5.  Click the button again to end audio recording and have it transcribed.
6.  In the Solution and Explanation window, Click "Solve, Analyse and Explain" to seek solution.
7.  If solution is cryptic or unclear, repeating Step 7 will regenerate another output.
8.  Click "Exit" to end the app, logging out, resetting application to default.

## C. Download Code IDE and installations  ##

1.  Install VS code and all its relevant extensions. Extensions : Python, node.
2.  In VS Code, run a copy of this project from the GitHub repository.

## D. Procedure to running a local version of Algebriac Equation GPT4 ##

1.  In VS code, ensure Node, NPM are updated extensions.
2.  In VS code project tab, click on index.html, close all other terminals and nodes.
2.  Call up a new terminal.
3.  In your working directory prompt, run node.
4.  In your working directory prompt, install the http-server package : npm install http-server
5.  In your working directory prompt, start a web server: npx http-server -p 8000
6.  In your browser, navigate to http://localhost:8000, or click on one of the 2 generated URL, app will load.
7.  Key in your name.
8.  Key in your OPENAI API key and click confirmed. (Ensure both name and API keys are entered.)
10. In the Upload window, click "Choose file" for camera or select a picture (JPEG or PNG) with a Math equation.
11. In the Extract Equation Window, Click "Read" to extract equation, "Clear" to clear the window.
12. In the Extract Equation Window, Click "Say Equation" to read equation out to the GPT.
13. In the Solution and Explanation window, Click "Solve, Analyse and Explain" to seek solution.
14. If solution is cryptic or unclear, repeating Step 13 will regenerate another output.
15. Click "Exit" to end the app, resetting app to all defaults, clearing all memory.
16. AR device functions are not developed at the time of commit.

## F. Inspiration ##

This project is built with the inspiration of offering learners algebra self-help.
Educators can also generate quick notes on equation solving explanation steps as they deem suitable. 
Educators can scale this repository accordingly. Do reference the originator of this project.
Please refer to LICENSE for details.

If you are interested in my other projects, please search google: Github ironmanfpv. 
For collaboration interests, email me @ akitaishi@gmail.com 👋
Linkedin: www.linkedin.com/in/jason-n-b515a89a  🌍

12/04/2025