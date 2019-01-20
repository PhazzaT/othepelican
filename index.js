"use strict";

var changeCase = function(c) {
    let lower = c.toLowerCase();
    if (lower != c) {
        return lower;
    }
    return c.toUpperCase();
};

var makePelican = function(s) {
    var lettersDict = {};
    var lettersArray = [];
    for (var i = 0; i < s.length; i++) {
        var letter = s[i];
        if (!lettersDict[letter]) {
            lettersDict[letter] = true;
            lettersArray.push(letter);
        }
    }

    var oldDict = {};

    var pelicanSequence = [];
    for (var i = s.length - 1; i >= 0; i--) {
        var newDict = {};
        for (var j = 0; j < lettersArray.length; j++) {
            var c = lettersArray[j];
            if (oldDict[c] !== undefined) {
                newDict[c] = oldDict[c];
            }
        }
        newDict[s[i]] = i;
        pelicanSequence.push(newDict);
        oldDict = newDict;
    }

    pelicanSequence.reverse();
    return {
        originalSequence: s,
        findSubsequence: function(subs, caseSensitive) {
            if (pelicanSequence.length == 0) {
                if (subs.length == 0) {
                    return [];
                }
                return null;
            }

            if (caseSensitive === undefined) {
                caseSensitive = true;
            }
            var positions = [];
            var currPos = -1;
            for (var i = 0; i < subs.length; i++) {
                if (subs[i] == " ") {
                    continue;
                }

                var c = subs[i];
                // Check if there were some spaces before
                var spacesBefore = (i > 0) ? (subs[i - 1] == " ") : false;
                var desiredPos = currPos + (spacesBefore ? 1 : 0) + 1;
                var nextPos = pelicanSequence[desiredPos][c];
                if (!caseSensitive) {
                    var maybeNextPos = pelicanSequence[desiredPos][changeCase(c)];
                    if (nextPos === undefined || (maybeNextPos !== undefined && nextPos > maybeNextPos)) {
                        nextPos = maybeNextPos;
                    }
                }
                if (nextPos === undefined) {
                    return null;
                }
                positions.push(nextPos);
                currPos = nextPos;
            }
            return positions;
        },
    };
};

// // console.log(makePelican("ala ma kota"));
// console.log(makePelican("ala ma kota").findSubsequence("kota"));

var updatePelican = function() {
    var source = document.getElementById("original-text").value;
    var substring = document.getElementById("looked-up-text").value;
    var caseSensitive = document.getElementById("case-sensitive").checked;

    var resultDiv = document.getElementById("arena");

    var result = makePelican(source).findSubsequence(substring, caseSensitive);
    if (result === null) {
        resultDiv.className = "not-found";
        resultDiv.innerText = source;
        // console.log("Not found");
        return;
    }
    resultDiv.className = "found";

    var positionsDict = {};
    for (var i = 0; i < result.length; i++) {
        positionsDict[result[i]] = true;
    }

    var charArray = [];
    for (var i = 0; i < source.length; i++) {
        var c = source[i];
        if (positionsDict[i]) {
            charArray.push("<span>" + c + "</span>");
        }
        else {
            charArray.push(c);
        }
    }

    resultDiv.innerHTML = charArray.join("");
    // console.log(charArray);
};

window.onload = function(e) {
    var source = document.getElementById("original-text");
    var substring = document.getElementById("looked-up-text");
    var caseSensitive = document.getElementById("case-sensitive");

    source.oninput = updatePelican;
    substring.oninput = updatePelican;
    caseSensitive.onclick = updatePelican;
    updatePelican();
};
