const data = {
    known: {
        e: 4,
        gee: 16,
        dad: 24,
        baba: 18,
        chad: 23,
    },
    unknown: 'figged',
};

const adjacentCharacters = {
    a: 'b',
    b: 'ac',
    c: 'bd',
    d: 'ce',
    e: 'df',
    f: 'eg',
    g: 'fh',
    h: 'gi',
    i: 'h',
};

const result = {
    1: {
        number: 1,
        character: null,
        dissallowed: '',
    },
    2: {
        number: 2,
        character: null,
        dissallowed: '',
    },
    3: {
        number: 3,
        character: null,
        dissallowed: '',
    },
    4: {
        number: 4,
        character: null,
        dissallowed: '',
    },
    5: {
        number: 5,
        character: null,
        dissallowed: '',
    },
    6: {
        number: 6,
        character: null,
        dissallowed: '',
    },
    7: {
        number: 7,
        character: null,
        dissallowed: '',
    },
    8: {
        number: 8,
        character: null,
        dissallowed: '',
    },
    9: {
        number: 9,
        character: null,
        dissallowed: '',
    },
};



function solution(input = data) {
    const { known } = input;
    const unknownWord = input.unknown;
    for (const [word, wordValue] of Object.entries(known)) {
        if (word.length === 1) {
            //adds 4 to value E, With restrictions to adjacent numbers
            addCharacterToResult(word, wordValue);
        }
        else if ([...new Set(unknownChars(word))].length === 1) {
            //if length of unknown characters is 1 add to unknown chars array.
            const unknownChar = unknownChars(word)[0];
            const unknownCharValue = subtractKnown(word, wordValue);
            //unknown/1 or unknown/2 etc.. depending if repeated letters.
            //divides length of repeated unknown chars by unknownCharValue and adds remainder result to data.
            addCharacterToResult(unknownChar, unknownCharValue / countChars(unknownChar, unknownChars(word)));
        } else if (tryFitAvailable(unknownChars(word), subtractKnown(word, wordValue))) {
            break;
        } else {
            fitCharactersWithMath(word, wordValue);
        }
    }
    fitFinalCharacters();
    return calculateUnknownValue(unknownWord);
}

function calculateUnknownValue(unknownWord) {
    let value = 0;
    Array.from(unknownWord).forEach((char) => {
        const resultObj = getCharResult(char);
        if (resultObj) {
            value += resultObj.number;
        } else {
            throw new Error(`Could not find a value for ${char}`);
        }
    });
    return value;
}

function fitFinalCharacters() {
    //checks remainder empty dataslots and checks for restrictions.
    const finalUnknownChars = [];
    Object.keys(adjacentCharacters).forEach((char) => {
        if (!getCharResult(char)) {
            finalUnknownChars.push(char);
        }
    });
    const firstChar = finalUnknownChars[0];
    const secondChar = finalUnknownChars[1];
    Object.values(result).forEach((resultObj) => {
        if (!resultObj.dissallowed.includes(firstChar)) {
            addCharacterToResult(firstChar, resultObj.number);
        } else if (!resultObj.dissallowed.includes(secondChar)) {
            addCharacterToResult(secondChar, resultObj.number);
        }
    });
}

function tryFitAvailable(characters, value) {
    // for time sake just assuming there's only 2 characters given
    const uniqueUnknownChars = [...new Set(characters)];
    const firstChar = uniqueUnknownChars[0];
    const secondChar = uniqueUnknownChars[1];
    Object.values(result).forEach((resultObj) => {
        //checks if current character is disallowed
        if (!resultObj.dissallowed.includes(firstChar)) {
            if (value) {
                const withinBounds = value - resultObj.number >= 1 && value - resultObj.number <= 9;
                //if within bounds and not restricted...
                if (withinBounds && !result[value - resultObj.number].dissallowed.includes(secondChar)) {
                    addCharacterToResult(firstChar, resultObj.number);
                    addCharacterToResult(secondChar, result[value - resultObj.number].number);
                    return true;
                }
            }
        }
    });
    return false;
}

function fitCharactersWithMath(word, wordValue) {
    const unknownCharacters = unknownChars(word);
    const uniqueUnknownChars = [...new Set(unknownCharacters)];
    //console.log(uniqueUnknownChars + " fit chars with math")
    if (uniqueUnknownChars.length === 2) {
        const firstChar = uniqueUnknownChars[0];
        const secondChar = uniqueUnknownChars[1];
        const hasOneChar = countChars(firstChar, unknownCharacters) === 1 ? firstChar : secondChar;
        const hasTwoChar = countChars(firstChar, unknownCharacters) === 2 ? firstChar : secondChar;
        for (const [num, obj] of Object.entries(result)) {
            if ((wordValue - num) % 2 === 0 && (wordValue - num) / 2 <= 9) {
                if (!obj.dissallowed.includes(hasTwoChar)) {
                    addCharacterToResult(hasOneChar, parseInt(num));
                    addCharacterToResult(hasTwoChar, (wordValue - num) / 2);
                    return true;
                }
            }
        }
    }
    return false;
}


function subtractKnown(word, value) {
    let unknownsValue = parseInt(value);
    Array.from(word).forEach((char) => {
        //subtracts current index value with the datas known number
        //obtains unknownsValue by subtraction after each iteration in the array.
        if (getCharResult(char)) {
            unknownsValue -= getCharResult(char).number;
        }
    });
    return unknownsValue;
}

function countChars(character, charArray) {
    //incrementing count to divide by unknownValue...
    let count = 0;
    charArray.forEach((char) => {
        if (char === character) {
            count += 1;
        }
    });
    return count;
}

function addCharacterToResult(character, value) {
    //adds restricted characters adjacent to value and stores them for later checks
    result[value].character = character;
    result[value].dissallowed += Object.keys(adjacentCharacters).join('');
    if (value >= 2) {
        result[value - 1].dissallowed += adjacentCharacters[character];
    }
    if (value <= 8) {
        result[value + 1].dissallowed += adjacentCharacters[character];
    }
}


function getCharResult(char) {
    //Checks current characters data and restrictions
    let charResult = null;
    Object.values(result).forEach((obj) => {
        if (char === obj.character) {
            charResult = obj;
        }
    });
    return charResult;
}

function unknownChars(word) {
    //checks if current array in word contains known letters, if not push that letter.
    const unknown = [];
    Array.from(word).forEach((char) => {
        const known = knownLetters();
        if (!known.includes(char)) {
            unknown.push(char);
        }
    });
    return unknown;
}

function knownLetters() {
    //if result object is not null, Add known letter to the array.
    let letters = [];
    Object.values(result).forEach((obj) => {
        if (obj.character) {
            letters += obj.character;
        }
    });
    return letters;
}

console.log(solution());
