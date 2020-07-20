#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const Transform = require("stream").Transform;

const args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "tsv"],
    string: ["file"],
});

const BASEPATH =
    path.resolve(process.env.BASEPATH || __dirname);

const OUTPATH = path.join(BASEPATH, "out.txt");


if (args.help || process.argv.length <= 2) {
    error(null, /*showHelp=*/ true);
} else if (args._.includes("-") || args.in) {
    processFile(process.stdin);
} else if (args.file) {
    let filePath = path.join(BASEPATH, args.file);
    processFile(
        fs.createReadStream(filePath)
    );
} else {
    error("Usage incorrect.", /*showHelp=*/ true);
}




// ************************************

function printHelp() {
    console.log("The CSV Parser Usage Guide:");
    console.log("");
    console.log("--help                      print this help");
    console.log("-, --in                     read file from stdin");
    console.log("--file={FILENAME}           read file from {FILENAME}");
    console.log("--out                       print output");
    console.log("--tsv                       parse TSV");
    console.log("");
    console.log("");
}

function error(err, showHelp = false) {
    process.exitCode = 1;
    console.error(err);
    if (showHelp) {
        console.log("");
        printHelp();
    }
}

function processFile(inputStream) {
    let outStream = inputStream;
    let splitCharacter = ",";
    if (args.tsv) {
        splitCharacter = "\t";
    }
    let targetStream;
    const upperCaseTr = new Transform({
        transform(chunk, encoding, callback) {
            this.push(parseAlgo(chunk.toString(), splitCharacter));
            callback();
        }
    });
    outStream = outStream.pipe(upperCaseTr);
    if (args.out) {
        targetStream = process.stdout;
    } else {
        targetStream = fs.createWriteStream(OUTPATH);
    }
    outStream.pipe(targetStream);
}

function parseAlgo(csv, splitChar) {
    let lines = csv.split("\n");

    let result = [];

    let headers = lines[0].split(splitChar);

    for (let i = 1; i < lines.length; i++) {

        let obj = {};
        let currentline = lines[i].split(splitChar);

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}