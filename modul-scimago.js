/*
  scimago permet tenir ranking de journals
  https://www.scimagojr.com/journalrank.php
*/

//cache year=>obj
let scimagojr={};

//cache per anys no disponibles
let scimagojr_years_not_available=new Set();

//get csv by year and save to cache
async function fetch_scimagocsv(year){
  year = year||"2023";
  year = String(year);

  if(scimagojr[year]) return;

  let res = await fetch(`csv/scimagojr ${year}.csv`);
  if(!res.ok){
    scimagojr_years_not_available.add(year);
    console.warn(`[scimago] ranking ${year} no existeix encara`);
    return;
  }

  let text = await res.text();
  let csv = text.split("\n").map(line=>{
    let row = line.split(";"); //array

    let indexs_to_delete=[];

    //arregla camps entre cometes
    for(let i=0;i<row.length;i++){
      let val = row[i];
      if(val[0]=="\"" && val.at(-1)!="\""){
        let new_val = val;
        let index = 1;
        while(true){
          let next_cell = row[i+index]; //value
          indexs_to_delete.push(i+index);
          new_val += ";"+next_cell; //join values
          if(next_cell.at(-1)=="\""){
            break;
          }else{
            index++;
          }
        }
        row[i] = new_val;
      }
    }

    indexs_to_delete.forEach(index=>{
      row[index]="";
    });

    row = row.filter(cell=>cell!="");

    return row;
  });
  csv.forEach(row=>{
    row.forEach((cell,i)=>{
      if(cell.at(0)=="\"" && cell.at(-1)=="\""){
        row[i] = cell.replaceAll("\"","");
      }
    });
  });
  csv.pop();//delete last row

  //result dictionary to be cached
  let csv_dictionary={};
  csv.forEach((row,i)=>{
    if(i==0) return;
    let obj={};
    csv[0].forEach((field,j)=>{
      obj[field] = row[j];
    });

    csv_dictionary[obj.Title] = obj;
  });

  //save result to cache
  scimagojr[year] = csv_dictionary;

  //calcula els percentils dins de cada journal object
  calcula_percentils_ambits_scimago(csv_dictionary);

  console.log(`[scimago] ok ${year} csv`);
}

//calcula percentils de cada revista i categoria
function calcula_percentils_ambits_scimago(csv){
  let ambits={};

  //classifica journals dins dels ambits
  Object.values(csv).forEach(journal=>{
    journal.Categories.split(";").forEach(cat=>{
      cat = cat.trim();
      cat = cat.replace(" (Q1)","");
      cat = cat.replace(" (Q2)","");
      cat = cat.replace(" (Q3)","");
      cat = cat.replace(" (Q4)","");

      if(ambits[cat]==undefined){
        ambits[cat]=[];
      }
      ambits[cat].push(journal);
    });
  });

  //recorre els ambits i calcula el ranking de cada revista
  Object.entries(ambits).forEach(([key,val])=>{
    let cat      = key; //string
    let journals = val; //array
    let n        = journals.length; //number

    journals.forEach((jou,i)=>{
      let percentil = 100*(i+1)/n; //number
      if(jou.percentils==undefined){
        jou.percentils={};
      }
      jou.percentils[cat]={
        rank:i+1, n,
        percentil,
      }
    });
  });
}

//buscar revista dins un ranking
function busca_a_scimagocsv(nom_revista, issn, eIssn, year){
  if(!year) throw new Error("year not defined");

  //dictionary to search:
  let csv = scimagojr[year];

  //if not exists, search most recent
  if(!csv){
    let max_year = Math.max(...Object.keys(scimagojr));
    max_year = String(max_year);
    csv = scimagojr[max_year];
  }
  if(!csv) return;

  //search by name
  let obj = csv[nom_revista]; //object or undefined
  if(obj) return obj;

  //search by issn
  obj = Object.entries(csv).find(en=>en[1].Issn.includes(issn)); //object or null
  if(obj) return obj[1];

  //search by eIssn
  obj = Object.entries(csv).find(en=>en[1].Issn.includes(eIssn)); //object or null
  if(obj) return obj[1];

  return false; //not found
}

//carregar csvs scimago disponibles (descarregats manualment)
(function(){
  let year_inici = 2023;                       //number
  let year_final = new Date().getFullYear()-1; //number

  console.log(`[scimago] fetching rankings [${year_inici}..${year_final}]`);
  for(let y=year_inici; y<=year_final; y++){
    fetch_scimagocsv(y);
  }
})();
