# Botantix

A Discord bot for oLoL Kr3w that records game score in Notion.

## How to use

Type `/score-me` and follow prompts to add the necessary options to the command. The bot will look for you in the player database and create your entry if necessary, and then enter you score in the scoreboard. That's it, really :D

Options are as follow:
* Game `string: Pédantix|Cémantix|Synoptix`: The game you want to record a score of.
* Tries `number`: the number of tries to find the work
* Position `number`: your rank during that game

## Improvements
* add an internal scoring system to add more spices
  * the less tries, the more points for instance
* get list of words, if doesn't exist for the day, create placeholder page and add to the "solution" column (a little tricky, Pédantix changes at a different time)
