const sum = (line: string) =>{
	let sum = 0;
	for (let index = 0; index < line.length; index++) {
		sum=sum+line.toUpperCase().charCodeAt(index);
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
