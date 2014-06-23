
/*!
 *
 * Sidharth Kapur
 *
 */

/* This variable isn't actually used in this program, because I like pure tempered chords better */
var ratio = Math.pow(2, 1/12);

/* This function isn't actually used in this program, because I like pure tempered chords better */
function interval(pitch, steps) {
  var i;
  if (steps > 0) {
    for (i = 0; i < steps; i++) {
      pitch *= ratio;
    }
  } else {
    for (i = 0; i > steps; i--) {
      pitch /= ratio;
    }
  }
  return pitch;
}

var notes;
setNotes(300);

var currentBeat;

function dsp(t) {
  var root = 300;
  
  // Play each chord for 1 second
  var beatLength = 1;
  var numBeats = 4;
  
  var chordChanges = {
    0: {
      note: root,       // I
      type: 'major'
    },
    1: {
      note: root * minor6th * downOctave, // iii
      type: 'minor'
    },
    2: {
      note: root * perfect4th * downOctave,  // IV
      type: 'major'
    },  
    3: {
      note: root * perfect5th * downOctave,  // V7
      type: 'dominant7'
    }   
  };
  
  var beat = Math.floor( (t % (numBeats * beatLength)) / beatLength);
  
  if (currentBeat != beat && chordChanges.hasOwnProperty(beat)) {
    chord = chordChanges[beat];
    note = chord.note;
    typeOfChord = chords[chord.type];
    
    // Play 6 notes of each chord (you can change/play with this)
    setNotes(note, typeOfChord, 6);
    
    currentBeat = beat;
  }
  
  return arpeggiate(t, beatLength, notes.length);
}

function setNotes(root, pitches, numSubNotes) {

  notes = [];
  
  // first note is always root.
  notes.push(root);
  
  var idx = 0;
  var last = 0;
  
  for (var i = 1; i < numSubNotes; i++) {
    // make sure note is always different from previous note
    while (idx == last)
      idx = Math.floor(Math.random() * pitches.length);
      
    last = idx;
    notes.push(root * pitches[idx]);
  }
}



// multiply intervals to add them
var downOctave = 1/2;
var minor3rd = 6/5;
var major3rd =  5/4;
var perfect4th = 4/3;
var perfect5th = 3/2;
var octave = 2;
var minor6th = 5/3;
var minor7th = 9/5;
var major7th = 15/8;

var chords = {
  
  major: [1, major3rd, perfect5th, octave, octave*major3rd],
  
  minor: [1, major3rd, perfect5th, octave, octave*major3rd],
  
  major7: [1, major3rd, perfect5th, octave, octave*major3rd, major7th],
  
  dominant7: [1, major3rd, perfect5th, octave, octave*major3rd, minor7th],
  
  // Variation #2: chord with both major and minor 3rd
  weird: [1, major3rd, perfect5th, octave, octave * major3rd, octave * minor3rd]
};


function arpeggiate (t, beatLength, numSubBeats) {
  var i = Math.floor((t % beatLength) / (beatLength / numSubBeats));
  var note = notes[i];
  return mySound(t, note);
} 

/* This function is not used in the program. */
function major(t, root) {
  var pitches = [1, 5/4, 3/2, 2, 2 * 5/4];
  sum = 0;
  for (var i in pitches) {
    sum += mySound(t, pitches[i] * root);
  }
  return sum;
}

function mySound(t, freq) {
  var sum = 0;
  sum += 0.05 * square(t, freq);
  sum += 0.05 * sawtooth(t, freq);
  sum += 0.03 * triangle(t, freq);
  sum += 0.06 * sin(t, freq);
  return sum;
}

function sin(t, freq) {
  return Math.sin(2 * Math.PI * t * freq);
}

function square(t, freq) {
  var period = 1/freq;
  if (t % period < period/2)
    return 1;
  else
    return -1;
}

function sawtooth(t, freq) {
  var period = 1/freq;
  var rem = t % period;
  return (2 * rem / period) - 1;
}

function triangle(t, freq) {
  var period = 1/freq;
  var rem = t % period;
  if (rem < period / 2) {
    return (4 * rem / period) - 1;
  } else {
    return 1 - (2 * rem / period);
  }
}