export const yearTillNow =():{value:string,label:string,id:string}[]=>{
const date = new Date()
var currentYear = date.getFullYear()-1
const years = []
while(currentYear>=date.getFullYear()-5){
years.push(currentYear.toString());
currentYear--;
}
return years.map(year=>({value:year,label:year,id:year}));
}