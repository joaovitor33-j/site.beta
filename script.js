let obras = JSON.parse(localStorage.getItem("obras")) || []
let materiais = JSON.parse(localStorage.getItem("materiais")) || []
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || []

function salvar(){
localStorage.setItem("obras",JSON.stringify(obras))
localStorage.setItem("materiais",JSON.stringify(materiais))
localStorage.setItem("financeiro",JSON.stringify(financeiro))
}

/* NAV */
function mostrar(id){
document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"))
document.getElementById(id).classList.remove("hidden")
}

/* OBRAS */
function addObra(){
obras.push(nomeObra.value)
nomeObra.value=""
salvar()
renderObras()
}

function renderObras(){
listaObras.innerHTML=""
obras.forEach((o,i)=>{
listaObras.innerHTML+=`<li>${o}</li>`
})
}

/* MATERIAIS */
function addMaterial(){
materiais.push({
nome:nomeMat.value,
qtd:Number(qtdMat.value),
valor:Number(valorMat.value),
min:Number(minMat.value),
cat:catMat.value
})

salvar()
renderMat()
}

function renderMat(){
listaMat.innerHTML=""

let total=0

materiais.forEach((m,i)=>{

let totalItem = m.qtd * m.valor
total += totalItem

let status = m.qtd <= m.min ? "⚠" : "OK"

listaMat.innerHTML+=`
<tr>
<td>${m.nome}</td>
<td>R$${totalItem}</td>
<td>${status}</td>
<td><button onclick="delMat(${i})">X</button></td>
</tr>
`
})

totalEstoque.innerText="R$"+total
}

function delMat(i){
materiais.splice(i,1)
salvar()
renderMat()
}

/* FINANCEIRO */
function addFin(){
financeiro.push({
desc:descFin.value,
valor:Number(valorFin.value),
tipo:tipoFin.value,
status:statusFin.value,
data:dataFin.value
})

salvar()
renderFin()
}

function renderFin(lista=financeiro){

listaFin.innerHTML=""

let saldo=0

lista.forEach((f,i)=>{

if(f.tipo==="entrada") saldo+=f.valor
else saldo-=f.valor

listaFin.innerHTML+=`
<tr>
<td>${f.desc}</td>
<td>${f.valor}</td>
<td>${f.tipo}</td>
<td>${f.data}</td>
<td><button onclick="delFin(${i})">X</button></td>
</tr>
`
})

saldo.innerText="R$"+saldo
graficoMensal()
}

function delFin(i){
financeiro.splice(i,1)
salvar()
renderFin()
}

/* FILTRO */
function filtrar(){

let ini=inicio.value
let f=fim.value

let filtrado=financeiro.filter(x=>x.data>=ini && x.data<=f)

renderFin(filtrado)
}

/* PDF */
function exportarPDF(){

const { jsPDF } = window.jspdf
let doc = new jsPDF()

doc.text("Relatório Financeiro",10,10)

financeiro.forEach((f,i)=>{
doc.text(`${f.desc} - ${f.valor}`,10,20+(i*10))
})

doc.save("relatorio.pdf")
}

/* BACKUP */
function backup(){
let blob=new Blob([JSON.stringify({obras,materiais,financeiro})])
let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="backup.json"
a.click()
}

/* GRÁFICO */
function graficoMensal(){

let meses={}

financeiro.forEach(f=>{
let mes=f.data?.slice(0,7)
if(!meses[mes]) meses[mes]=0

meses[mes]+=f.tipo==="entrada"?f.valor:-f.valor
})

new Chart(grafico,{
type:"line",
data:{
labels:Object.keys(meses),
datasets:[{data:Object.values(meses)}]
}
})
}

/* INIT */
renderObras()
renderMat()
renderFin()
