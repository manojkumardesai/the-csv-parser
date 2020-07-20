#!/usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs");
var Transform = require("stream").Transform;

var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "tsv"],
    string: ["file"],
});

const BASEPATH =
    path.resolve(process.env.BASEPATH || __dirname);

var OUTPATH = path.join(BASEPATH, "out.txt");


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
    var outStream = inputStream;
    let conversionAlg = csvToJson;
    if (args.tsv) {
        conversionAlg = tsvToJson;
    }
    var targetStream;
    var upperCaseTr = new Transform({
        transform(chunk, encoding, callback) {
            this.push(conversionAlg(chunk.toString()));
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

function csvToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

//var tsv is the TSV file with headers
function tsvToJson(tsv) {

    var lines = tsv.split("\n");

    var result = [];

    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split("\t");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}