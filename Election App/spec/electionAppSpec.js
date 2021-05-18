/* globals describe it xdescribe xit beforeEach expect Ballot localStorage STORAGE_KEY */
describe('Ballot', function() {
  var theBallot;

  function getTitles(allVotes) {
      const allTitles = [];
      for (const aVote of allVotes) {
          allTitles.push(aVote.title);
      }
      return allTitles;
  }

  beforeEach(function() {
      theBallot = new Ballot();
  });

  describe('adding votes', function() {
      // FEATURE 1. Create a whole that acts as a Facade for parts
      // FEATURE 2. Add a part
      describe('when a single vote with a title of "National" is added', function() {
          var theVote;
          beforeEach(function() {
              theBallot.addVote('National');
              theVote = theBallot.allMyVotes[0];
          });

          describe('the added single vote', function() {
              it('should have an id of 1', function() {
                  expect(theVote.id).toBe(1);
              });

              it('should have a title of "National"', function() {
                  expect(theVote.title).toBe('National');
              });

              it('should not be completed', function() {
                  expect(theVote.completed).toBeFalsy();
              });
          });

          describe('the election app', function() {
              it('should have one vote', function() {
                  expect(theBallot.allMyVotes.length).toBe(1);
              });

              it('should have 1 active vote remaining', function() {
                  expect(theBallot.remaining()).toBe(1);
              });

              it('should not be "all done"', function() {
                  expect(theBallot.getAllDone()).toBeFalsy();
              });
          });
      });

      describe('when three votes are added', function() {
          it('should have 3 votes', function() {
              theBallot.addVote('National');
              theBallot.addVote('Greens');
              theBallot.addVote('Labour');
              expect(theBallot.allMyVotes.length).toBe(3);
          });
      });
  });

  // FEATURE 6. Save all parts to LocalStorage
  describe('save', function() {
      it('should save a vote in localStorage when it has a single item', function() {
          localStorage.clear();
          theBallot = new Ballot();
          theBallot.addVote('ACT');
          theBallot.save();
          var itemJSON = localStorage.getItem(STORAGE_KEY);
          expect(itemJSON).toBeTruthy();
      });

      it('should have the correct JSON for the correct vote in localStorage', function() {
          localStorage.clear();
          theBallot = new Ballot();
          theBallot.addVote('Green');
          theBallot.save();
          var itemJSON = localStorage.getItem(STORAGE_KEY);
          expect(itemJSON).toBe('[{"id":1,"title":"Green","age":18,"completed":false}]');
      });
  });

  // FEATURE 7. Load all parts from LocalStorage
  describe('load', function() {
      it('should load a vote from localStorage when it has a single vote', function() {
          // save something
          localStorage.clear();
          theBallot = new Ballot();
          theBallot.addVote('National');
          theBallot.save();
          // the start the model again
          theBallot = new Ballot();
          // and load
          theBallot.load();
          var itemJSON = localStorage.getItem(STORAGE_KEY);
          expect(itemJSON).toBeTruthy();
      });

      it('should have the correct JSON for the loaded item', function() {
          // save something
          localStorage.clear();
          theBallot = new Ballot();
          theBallot.addVote('ACT');
          theBallot.save();
          // the start the model again
          theBallot = new Ballot();
          // and load
          theBallot.load();
          var itemJSON = localStorage.getItem(STORAGE_KEY);
          expect(itemJSON).toBe('[{"id":1,"title":"ACT","age":18,"completed":false}]');
      });
  });

  // FEATURE 3. Sort parts
  describe('sorting tasks', function() {
      it('should put tasks into alphabetic title order', function() {
          var theBallot = new Ballot();
          theBallot.addVote('Green');
          theBallot.addVote('National');
          theBallot.addVote('ACT');
          theBallot.addVote('Maori');
          theBallot.addVote('Labour');
          theBallot.sortVotes();
          const actualOrderedVoteTitles = getTitles(theBallot.allMyVotes);
          const expectedSortedVoteTitles = ['ACT', 'Green', 'Labour', 'Maori', 'National'];
          expect(expectedSortedVoteTitles).toEqual(actualOrderedVoteTitles);
      });
  });

  // FEATURE 4. Filter parts
  describe('filtering votes', function() {
      var theBallot = new Ballot();
      theBallot.addVote('Green');
      theBallot.addVote('National');
      theBallot.addVote('ACT');
      theBallot.allMyVotes[1].completed = true;

      it('should be able to return only active/remaining votes', function() {
          const expectedActiveCount = 2;
          const expectedActiveVoteTitles = ['Green', 'ACT'];
          const actualActiveList = theBallot.getActiveVotes();
          const actualActiveCount = actualActiveList.length;
          const actualActiveVoteTitles = getTitles(actualActiveList);

          expect(actualActiveCount).toBe(expectedActiveCount);
          expect(actualActiveVoteTitles).toEqual(expectedActiveVoteTitles);
      });

      it('should be able to return only completed votes', function() {
          const expectedCompletedCount = 1;
          const expectedCompletedVoteTitles = ['National'];
          const actualCompletedList = theBallot.getCompletedVotes();
          const actualCompletedCount = actualCompletedList.length;
          const actualCompletedVoteTitles = getTitles(actualCompletedList);
          expect(actualCompletedCount).toBe(expectedCompletedCount);
          expect(actualCompletedVoteTitles).toEqual(expectedCompletedVoteTitles);
      });

      it('should correctly calculate the number of remaining votes', function() {
          const expectedRemainingCount = 2;
          const actualRemainingCount = theBallot.remaining();
          expect(actualRemainingCount).toBe(expectedRemainingCount);
      });
  });

  // FEATURE 5. Delete a selected part
  describe('deleting a vote', function() {
      var theBallot = new Ballot();
      theBallot.addVote('Green');
      theBallot.addVote('National');
      theBallot.addVote('ACT');
      theBallot.removeVote('National');
      it('should remove that vote', function() {
          const expectedVoteTitles = ['Green', 'ACT'];
          const actualVoteTitles = getTitles(theBallot.allMyVotes);
          expect(actualVoteTitles).toEqual(expectedVoteTitles);
      });

      it('should reduce the vote count', function() {
          const expectedRemainingCount = 2;
          const actualRemainingCount = theBallot.allMyVotes.length;
          expect(actualRemainingCount).toBe(expectedRemainingCount);
      });
  });

  describe('removing all completed votes', function() {
      var theBallot = new Ballot();
      theBallot.addVote('Green');
      theBallot.addVote('National');
      theBallot.addVote('ACT');
      theBallot.addVote('Labour');
      theBallot.allMyVotes[1].completed = true;
      theBallot.allMyVotes[2].completed = true;
      theBallot.removeCompleted();
      it('should remove all of the completed votes', function() {
          const expectedVoteTitles = ['Green', 'Labour'];
          const actualVoteTitles = getTitles(theBallot.allMyVotes);
          expect(actualVoteTitles).toEqual(expectedVoteTitles);
      });

      it('should reduce the vote count', function() {
          const expectedRemainingCount = 2;
          const actualRemainingCount = theBallot.allMyVotes.length;
          expect(actualRemainingCount).toBe(expectedRemainingCount);
      });
  });

  // FEATURE 8. Update/edit a part
  describe('editing a vote', function() {
      var theBallot = new Ballot();
      theBallot.addVote('Green');
      theBallot.addVote('National');
      theBallot.addVote('Labour');
      theBallot.startEditing(theBallot.allMyVotes[1]);
      theBallot.allMyVotes[1].title = 'ACT';
      theBallot.doneEditing(theBallot.allMyVotes[1]);
      it('should change the title of that vote', function() {
          expect(theBallot.allMyVotes[1].title).toBe('ACT');
      });
  });

  // FEATURE 9. Discard /revert edits to a part
  describe('discarding edits to a vote', function() {
      it('should not change the title of that vote', function() {
          var theBallot = new Ballot();
          theBallot.addVote('Green');
          theBallot.addVote('National');
          theBallot.addVote('Labour');
          theBallot.startEditing(theBallot.allMyVotes[1]);
          theBallot.allMyVotes[1].title = 'ACT';
          theBallot.cancelEdit(theBallot.allMyVotes[1]);
          expect(theBallot.allMyVotes[1].title).toBe('National');
      });
  });

  // FEATURE 10. Validate inputs
  describe('validating inputs to a vote', function() {
      it('should not allow empty titles', function() {
          var theBallot = new Ballot();
          theBallot.addVote('National');
          theBallot.addVote('');
          theBallot.addVote(' ');
          theBallot.addVote('Labour');
          const expectedVoteTitles = ['National', 'Labour'];
          const actualVoteTitles = getTitles(theBallot.allMyVotes);
          expect(actualVoteTitles).toEqual(expectedVoteTitles);
      });
  });

  // FEATURE 11. A calculation within a part
  describe('a calculation within a part', function() {
      it('should calculate the average age of voters', function() {
          var theBallot = new Ballot();
          theBallot.addVote('Natioanl', 18);
          theBallot.addVote('Labour', 33);
          theBallot.addVote('National', 39);
          theBallot.getAverageAge();
          const expectedAverageAge = 30;
          const actualAverageAge = theBallot.getAverageAge(theBallot.allMyVotes);
          expect(actualAverageAge).toEqual(expectedAverageAge);
      });
  });
  // FEATURE 12. A calculation across many parts
  describe('working out if all votes are done', function() {
      it('should return true for an empty list', function() {
          var theBallot = new Ballot();
          expect(theBallot.getAllDone()).toBeTrue();
      });

      it('should return false for a list with active votes in it', function() {
          var theBallot = new Ballot();
          theBallot.addVote('National');
          theBallot.addVote('Labour');
          expect(theBallot.getAllDone()).toBeFalse();
      });

      it('should return true for a list with only completed votes in it', function() {
          var theBallot = new Ballot();
          theBallot.addVote('National');
          theBallot.addVote('Labour');
          theBallot.allMyVotes[0].completed = true;
          theBallot.allMyVotes[1].completed = true;
          expect(theBallot.getAllDone()).toBeTrue();
      });
  });

  describe('counting active votes', function() {
      it('should return the correct number of remaining votes as votes are added or completed', function() {
          var theBallot = new Ballot();
          expect(theBallot.remaining()).toBe(0);
          theBallot.addVote('National');
          expect(theBallot.remaining()).toBe(1);
          theBallot.addVote('Labour');
          expect(theBallot.remaining()).toBe(2);
          theBallot.addVote('Green');
          expect(theBallot.remaining()).toBe(3);
          theBallot.allMyVotes[1].completed = true;
          expect(theBallot.remaining()).toBe(2);
      });
  });

  // FEATURE 13. Provide default values
  describe('the default value for new votes', function() {
      it('should allocate a sequentially incrementing id to all new votes', function() {
          var theBallot = new Ballot();
          for (let expectedId = 1; expectedId < 5; expectedId += 1) {
              theBallot.addVote('Green');
              var actualId = theBallot.allMyVotes[theBallot.allMyVotes.length - 1].id;
              expect(actualId).toBe(expectedId);
          }
      });

      it('should make all new votes not completed', function() {
          var theBallot = new Ballot();
          theBallot.addVote('National');
          const actualCompleted = theBallot.allMyVotes[0].completed;
          expect(actualCompleted).toBeFalse();
      });
  });

  // FEATURE 14. Find a part given a search criterion
  describe('finding a vote', function() {
      it('should find nothing with an empty vote list', function() {
          var theBallot = new Ballot();
          const actualFoundVote = theBallot.findVote('Labour');
          expect(actualFoundVote).toBeUndefined();
      });

      it('should find the only vote with a title when that title is unique', function() {
          var theBallot = new Ballot();
          theBallot.addVote('Green');
          theBallot.addVote('National');
          theBallot.addVote('Labour');
          const actualFoundVote = theBallot.findVote('National');
          expect(actualFoundVote).toBeDefined();
          const expectedFoundTitle = 'National';
          const actualFoundTitle = actualFoundVote.title;
          expect(actualFoundTitle).toBe(expectedFoundTitle);
      });

      it('should find the first vote with that title when there is more than one vote with the same title', function() {
          var theBallot = new Ballot();
          theBallot.addVote('Green');
          theBallot.addVote('National');
          theBallot.addVote('Labour');
          theBallot.addVote('Labour');
          const actualFoundVote = theBallot.findVote('Labour');
          expect(actualFoundVote).toBeDefined();
          const expectedFoundTitle = 'Labour';
          const actualFoundTitle = actualFoundVote.title;
          expect(actualFoundTitle).toBe(expectedFoundTitle);
          const expectedFoundId = 3;
          const actualFoundId = actualFoundVote.id;
          expect(actualFoundId).toBe(expectedFoundId);
      });
  });
});
