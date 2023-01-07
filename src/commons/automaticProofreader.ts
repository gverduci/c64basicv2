import { crushControlCharsVice } from "../helpers/controlCharsHelper";

const sum = (line: string) =>{
	let sum = 0;
	const crushedLine = crushControlCharsVice(line.toUpperCase());
	for (let index = 0; index < crushedLine.length; index++) {
		sum=sum+crushedLine.toUpperCase().charCodeAt(index);
		if(sum > 255){
			sum = sum % 256;
		}
	}
	return sum;
};

export function automaticProofreader (line: string) {
	let checksum = -1;
	if (line) {
		const trimmedLine = line.trim().replace(/ /g,"");
		checksum = sum(trimmedLine);
	}
	return checksum;
};
