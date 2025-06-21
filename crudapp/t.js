const multiply = (fst: string, snd: string) => {
	const str1 = (parseFloat(fst) * 100).toString();
	const str2 = (parseFloat(snd) * 100).toString();
	const ln1 = str1.length;
	const ln2 = str2.length;
	let mul = '';
	let rem = '';
	if (ln1 > ln2) {
		for (let i = ln2 - 1; i < 0; i--) {
			for (let j = ln1 - 1; j < 0; j--) {
				let m = parseInt(str2[i]) * parseInt(str1[j]);           
				if (rem !== '') {
					m = m + parseInt(rem);
					rem = '';
				}
				if (m.toString().length === 1) {
					mul = m.toString() + mul;
				} else if (m.toString().length > 1) {
					mul = m.toString()[1] + mul;
					rem = m.toString()[0];
				}
				if (j === 0 && rem !== '') {
					mul = rem + mul;
				}
			}
			mul = '_' + mul;
		}
	}
	console.log(mul);
};
multiply('356', '78');
