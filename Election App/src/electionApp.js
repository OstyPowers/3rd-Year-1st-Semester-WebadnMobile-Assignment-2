const STORAGE_KEY = 'electionApp'; //default values


// add part
class Vote { // eslint-disable-line no-unused- vars
    constructor(newId, newTitle, newAge) {
        this.id = newId;
        this.title = newTitle;
        this.age = newAge;
        this.completed = false; // default values 
    }
}

//create a whole that acts as facade for parts
class Ballot { // eslint-disable-line no-unused- vars
    constructor() {
        this.allMyVotes = [];
        this.filteredVotes = [];
        this.editedItem = null;
        this.editedVoteIndex = null;
        this.beforeEditedTitle = '';
    }

    getAllVotes() {
        return this.allMyVotes; //get all parts
    }

    getActiveVotes() {
        return this.allMyVotes.filter(vote => !vote.completed); //filter parts
    }

    getCompletedVotes() {
        return this.allMyVotes.filter(function(vote) {
            return vote.completed; //filter parts
        });
    }

    searchForVote(targetVoteTitle) {
        const index = this.allMyVotes.findIndex(vote => vote.id == targetVoteTitle);
        this.filteredVotes = [this.allMyVotes[index]]
    }


    // load all parts from local storage
    load() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    // save all parts to local storage
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allMyVotes));
    }

    // add part
    addVote(newTitle, newAge = 18) { //default value
        let anewTitle = newTitle.trim();
        if (!anewTitle) {
            return;
        }
        const newId = this.allMyVotes.length + 1; // provide default values
        const NewVote = new Vote(newId, anewTitle, newAge);
        this.allMyVotes.push(NewVote);
        this.filteredVotes = this.allMyVotes
    }

    // a calculation across many parts
    remaining() {
        return this.getActiveVotes().length;
    }

    // a calculation across many parts
    getAllDone() {
        return this.remaining() === 0;
    }

    // a calculation within a part
    getAverageAge() {
        let total = 0;
        this.allMyVotes.forEach(vote => {
            total += vote.age;
        });
        let average = total / this.allMyVotes.length;
        return average;
    }

    setAllDone() {
        this.allMyVotes.forEach(function(vote) {
            vote.completed = true;
        });
    }

    // delete a selected part
    removeVote(targetVoteTitle) {
        const index = this.allMyVotes.findIndex(vote => vote.title === targetVoteTitle);
        this.allMyVotes.splice(index, 1);
    }

    // update/edit a part
    startEditing(vote) {
        this.beforeEditedTitle = vote.title;
        this.editedItem = vote;
    }

    // update/edit a part 
    // validate inputs
    doneEditing(vote) {
        if (!vote) {
            return;
        }
        this.editedItem = null;
        vote.title = vote.title.trim();
        if (!vote.title) {
            this.removeVote(vote);
        }
    }

    // discard edits to a part
    cancelEdit(vote) {
        this.editedItem = null;
        vote.title = this.beforeEditedTitle;
    }

    //delete selected part
    removeCompleted() {
        this.allMyVotes = this.getActiveVotes();
    }

    //sort parts
    sortVotesAscending() {
        this.allMyVotes.sort(function(a, b) {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
    }
    sortVotesDec() {
        this.allMyVotes.sort(function(a, b) {
            if (a.title > b.title) {
                return -1;
            }
            if (a.title < b.title) {
                return 1;
            }
            return 0;
        });
    }

    // find a part given a search
    findVote(targetTitle) {
        return this.allMyVotes.find((vote) => vote.title === targetTitle);
    }
}


 