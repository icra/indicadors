function genera_nav(div_container_id){
  div_container_id = div_container_id || "nav";

  let pagina_actual = window.location.pathname.split("/").at(-1);
  if(pagina_actual==""){
    pagina_actual="index.html";
  }

  let links=[
    {href:"index.html",    nom:"scopus"},
    {href:"centre.html",   nom:"centre"},
    {href:"ips.html",      nom:"IPs"},
    {href:"personal.html", nom:"personal"},
    {href:"impacte.html",  nom:"impacte"},
  ];

  let nav = document.createElement("nav");

  links.forEach(li=>{
    let item = null;
    if(li.href==pagina_actual){
      item = document.createElement("b");
    }else{
      item = document.createElement("a");
    }

    item.setAttribute("href",li.href);

    item.innerHTML=li.nom;
    nav.appendChild(item);
    nav.appendChild((function(){
      let span = document.createElement("span");
      span.innerHTML=" | ";
      return span;
    })())
  });

  let div = document.getElementById(div_container_id);
  div.appendChild(nav);
};

genera_nav();
