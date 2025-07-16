const monthL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const weekL = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const weekD = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "0", "0", "0"];
const chkLeapYear = (y: string) => {
    return (parseInt(y) % 4 === 0 && parseInt(y) % 100 !== 0) || (parseInt(y) % 400 === 0);
};
export { monthL, weekL, weekD, chkLeapYear };