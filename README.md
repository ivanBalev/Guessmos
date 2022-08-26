# Wordle-type api

node.js BE clone

Hello there!

1.  Please run 'node initialSeed.js' before running the app. It will take a while...
    PORT: 3000
2.       POST /guess
        	header: uuid
        	body:
        		{
        			"word": ""
        		}

        Requests without uuid are assigned one in response header

        POST /preference
        	header: uuid
        	body:
        		{
        			"guessLength": 7,
        			"guessLanguage": "bg",
        			"attemptsCount": 7
        		}

        guessLength: max length: 10
        guessLanguage: 'bg', 'en'
        attemptsCount: max: 50

3.       GET /state
        	header: uuid

        1) words entered so far for the day, depending on word length,
        word language & attempts count
