In this application, I have used <a href="https://swapi.dev/">The Star Wars API</a>. 
It outputs the names of the characters and the movies in which they were present.

It works so that user gives id’s via command line arguments: 
node index.js 1 2 3 4 5 6 7 8 9 10

And it will output all the names and titles:

[ { name: 'Luke Skywalker',
    movies:
     [ 'The Empire Strikes Back',
       'Revenge of the Sith',
       'Return of the Jedi',
       'A New Hope',
       'The Force Awakens' ] },
  { name: 'C-3PO',
    movies:
     [ 'The Empire Strikes Back',
       'Attack of the Clones',
       'The Phantom Menace',
       'Revenge of the Sith',
       'Return of the Jedi',
       'A New Hope' ] },
  { name: 'R2-D2',
    movies:
     [ 'The Empire Strikes Back',
       'Attack of the Clones',
       'The Phantom Menace',
       'Revenge of the Sith',
       'Return of the Jedi',
       'A New Hope',
       'The Force Awakens' ] },

etc.
