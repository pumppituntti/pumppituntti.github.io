In this application, I have used <a href="https://swapi.dev/">The Star Wars API</a>. 
It outputs the names of the characters and the movies in which they were present.

It works so that user gives id’s via command line arguments, for example: <br />
node index.js 1 2 3 4 5 6 7 8 9 10

And it will output all the names and titles:

[ { name: 'Luke Skywalker',<br />
    movies:<br />
     [ 'The Empire Strikes Back',<br />
       'Revenge of the Sith',<br />
       'Return of the Jedi',<br />
       'A New Hope',<br />
       'The Force Awakens' ] },<br />
  { name: 'C-3PO',<br />
    movies:<br />
     [ 'The Empire Strikes Back',<br />
       'Attack of the Clones',<br />
       'The Phantom Menace',<br />
       'Revenge of the Sith',<br />
       'Return of the Jedi',<br />
       'A New Hope' ] },<br />
  { name: 'R2-D2',<br />
    movies:<br />
     [ 'The Empire Strikes Back',<br />
       'Attack of the Clones',<br />
       'The Phantom Menace',<br />
       'Revenge of the Sith',<br />
       'Return of the Jedi',<br />
       'A New Hope',<br />
       'The Force Awakens' ] },

etc.
