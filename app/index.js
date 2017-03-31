'use strict';

const async = require('async');
const replace = require('replace-in-file');
const shell = require('shelljs');
const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const FROM = [/\r\n/g, /#/g];
const TO = ['\\.br\\', '\\#'];

const APPEND_TEXT = 'OBX|1|FT|||';


const _fixChars = (flags, done) => {
	if (flags && flags.inDir) {
		const inputDir = flags.inDir;
		const outDir = flags.outDir || `${inputDir}_processed_${new Date().getTime}`;
		const backupDir = `/data/backup/originals`;
		shell.mkdir('-p',backupDir);
		// create a backup of originals
		shell.cp('-R', inputDir, backupDir);
		// get all files with extn .txt
		const options = {
			files: [`${inputDir}/*.txt`],
			from: FROM,
			to: TO
		}
		replace(options, (err, changedFiles)=>{
			if(err){
				console.log(err)
			} else{
				console.log(`Modified  ${changedFiles.length} files:', ${changedFiles.join(', ')}`);
			}
		})
		
	} else {
		done(new Error('--in-dir is missing'), null);
	}

};

const _appendHl7 = (flags, done) => {

	if (flags && flags.inDir) {
		const inputDir = flags.inDir;
		const outDir = flags.outDir || `${inputDir}_processed_${new Date().getTime}`;
		
		// get all files with extn .txt
		const options = {
			files: [`${inputDir}/*.txt`],
			from: FROM,
			to: TO
		}
		glob(`${inputDir}/*.hl7`,(err, files)=>{
			if(err){
				console.log(err)
			} else{
				
				let modified = [];
				_.each(files, (file)=>{
					let apd_text = APPEND_TEXT, txt_file_content;
					
					try {
						txt_file_content = fs.readFileSync(`${file.split('.')[0]}.txt`);
						fs.appendFileSync(file,`${apd_text}${txt_file_content}`);
						modified.push(file);
					} catch(err){
						console.log(err);
					}
					
				});
				console.log(`Modified  ${modified.length} files:', ${modified.join(', ')}`);
			}
		})
		
	} else {
		done(new Error('--in-dir is missing'), null);
	}


};






const fixHL7Cli = (input, flags) => {
	// console.log(input);
	// console.log(flags);

	const _processOutput = (err, result) => {
		if (err) {
			console.error(err);

		} else {
			console.log(result);
		}
	}
	if (input) {
		switch (input) {
			case 'fix-chars':
				_fixChars(flags, _processOutput);
				break;
			case 'append-hl7':
				_appendHl7(flags, _processOutput);
				break;
			default:
				console.log('not a valid input')
		}
	} else {
		console.error(`input not provided`);
		process.exit();
	}
}
module.exports = exports = fixHL7Cli;
