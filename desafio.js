const dados = {
  insurances: [
    {
      id: 3322,
      name: "Amil",
    },
    {
      id: 3293,
      name: "Bradesco",
    },
    {
      id: 99231,
      name: "Hapvida",
    },
    {
      id: 1322,
      name: "CASSI",
    },
    {
      id: 23111,
      name: "Sulamérica",
    },
  ],
  guides: [
    {
      number: "3210998321",
      start_date: "2021-04-23T19:18:47.210Z",
      patient: {
        id: 9321123,
        name: "Augusto Ferreira",
        thumb_url:
          "https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2019/10/04/794834/20191004154953157610i.jpg",
      },
      insurane_id: 1322,
      health_insurance: {
        id: 1322,
        name: "CASSI",
        is_deleted: false,
      },
      price: 5567.2,
    },
    {
      number: "287312832",
      start_date: "2021-04-23T19:18:47.210Z",
      patient: {
        id: 93229123,
        name: "Caio Carneiro",
        thumb_url:
          "http://3.bp.blogspot.com/-XG5bGlqGnJw/T9lIcssnybI/AAAAAAAADTA/B23ezXOkx8Y/s1600/Aang.jpg",
      },
      insurane_id: 1322,
      health_insurance: {
        id: 1322,
        name: "CASSI",
        is_deleted: false,
      },
      price: 213.3,
    },
    {
      number: "283718273",
      start_date: "2021-04-22T19:18:47.210Z",
      patient: {
        id: 213122388,
        name: "Luciano José",
        thumb_url: "https://i.ytimg.com/vi/yUXd-enstO8/maxresdefault.jpg",
      },
      insurane_id: 3293,
      health_insurance: {
        id: 3293,
        name: "Bradesco",
        is_deleted: true,
      },
      price: 88.99,
    },
    {
      number: "009090321938",
      start_date: "2021-04-20T19:18:47.210Z",
      patient: {
        id: 3367263,
        name: "Felício Santos",
        thumb_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSxlYabmRlKk43uvsBMIqjA7Rw_YCwK4TyA&usqp=CAU",
      },
      insurane_id: 3293,
      health_insurance: {
        id: 3293,
        name: "Bradesco",
        is_deleted: true,
      },
      price: 828.99,
    },
    {
      number: "8787128731",
      start_date: "2021-04-01T19:18:47.210Z",
      patient: {
        id: 777882,
        name: "Fernando Raposo",
      },
      insurane_id: 3322,
      health_insurance: {
        id: 3322,
        name: "Amil",
        is_deleted: false,
      },
      price: 772,
    },
    {
      number: "12929321",
      start_date: "2021-04-02T19:18:47.210Z",
      patient: {
        id: 221,
        name: "Paciente com nome grante pra colocar text ellipsis testando nome com paciente grande",
      },
      insurane_id: 3322,
      health_insurance: {
        id: 3322,
        name: "Amil",
        is_deleted: false,
      },
      price: 221,
    },
  ],
};

const inputName = document.getElementById("buscar");
const tbody = document.getElementById("t-body");
const selectConvenio = document.getElementById("selecao");
const checkBox = document.querySelectorAll(".form-check-input");
let inputData = document.getElementById("calendario");
let inputDataa = document.getElementById("calendarioDois");
let dataHoje = document.getElementById("hoje");
let mesAtual = document.getElementById("mes");

const calendarConfig = {
  changeMonth: true,
  dateFormat: "dd/mm/yy",
};

$(function () {
  $("#calendario").datepicker(calendarConfig);
  $("#calendarioDois").datepicker(calendarConfig);
  $("#calendario").datepicker(
    "setDate",
    moment().startOf("days").format("DD/MM/YYYY")
  );
  $("#calendarioDois").datepicker("setDate", moment().format("DD/MM/YYYY"));
});

let fixarUser = {};

const selectUser = (value) => {
  fixarUser[value] = !fixarUser[value];
};

const btnMes = () => {
  inputData.value = moment().startOf("month").format("DD/MM/YYYY");
  inputDataa.value = moment().endOf("month").format("DD/MM/YYYY");
};

const btnHoje = () => {
  inputData.value = moment().startOf("days").format("DD/MM/YYYY");
  inputDataa.value = moment().endOf("days").format("DD/MM/YYYY");
};

const parseNome = (nome) => {
  return nome.normalize("NFD").toLowerCase();
};

const filtrarDados = () => {
  let isValid = true;
  let pagina = 1;
  let limite = 2;
  let offSet = (pagina - 1) * limite;
  let itens = dados.guides.slice(offSet, offSet + limite);

  if (
    !inputName.value &&
    !selectConvenio.value &&
    !inputData.value &&
    !inputDataa.value
  ) {
    RenderTable(itens);
    return;
  }

  const filterGuides = dados.guides.filter((guides) => {
    let dataInicial = moment($("#calendario").datepicker("getDate")).startOf(
      "days"
    );
    let dataFinal = moment($("#calendarioDois").datepicker("getDate")).endOf(
      "days"
    );
    const datafixed = moment(guides.start_date);

    console.log(dataFinal);

    if (fixarUser[parseInt(guides.number)]) {
      return false;
    }

    if (dataInicial >= datafixed) {
     return false;
    }

    if (dataFinal <= datafixed) {

      return false;
    }

    if (
      inputName.value &&
      !parseNome(guides.patient.name).includes(
        parseNome(inputName.value).replace(/[\u0300-\u036f]/g, "")
      ) &&
      !guides.number.includes(inputName.value)
    ) {
      return false;
    }

    if (selectConvenio.value) {
      isValid = guides.health_insurance.id === ~~selectConvenio.value;
    }

    return isValid;
  });


  paginacao(1, filterGuides.length, 2);
  RenderTable(filterGuides);
};

const RenderTable = (guides) => {
  let html = "";
  const img = "https://via.placeholder.com/150x150.jpg";
  console.log("guides render", guides);
  guides.forEach((dados) => {
    let titulo;
    let classe;

    if (dados.health_insurance.is_deleted) {
      classe = "deletado";
      titulo = "Convenio Apagado";
    } else {
      titulo = dados.health_insurance.name;
    }


    html += `

		<tr>
			<td>
				<input ${
          fixarUser[parseInt(dados.number)] ? "checked" : "unchecked"
        } class="form-check-input" type="checkbox"
						value="${dados.number}" onchange="selectUser(${dados.number})" >
			</td>
			<td>
				${new Date(dados.start_date).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })}
			</td>
			<td>${dados.number}</td>
			<td class="text-truncate" style="max-width: 300px;">
				<img width="30px" height= "30px"class="rounded-circle" src="${
          dados.patient.thumb_url || img
        }">  ${dados.patient.name}
			</td>
			<td class="${classe}" title="${titulo}"> ${dados.health_insurance.name}  </td>
			<td>
				${dados.price.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
			</td>
		</tr>
	`;
  });

  if (!guides.length) {
    html +=
      "<tr><td colspan='6' class='text-center'>Nenhuma guia encontrada</td></tr>";
  }

  tbody.innerHTML = html;
};

const paginacao = (pagina, quantidadesItens) => {
  let pageSize = Math.ceil(quantidadesItens / limite);

  const pagination = {
    pagina,
    quantidadesItens,
    limite,
    pages: pageSize,
  };
  paginacaoItens = document.getElementById("paginacao");

  paginacaoItens.innerHTML = "";

  for (var i = 0; i < pagination.pages; i++) {
    const page = i + 1;
    paginacaoItens.innerHTML += `<a onclick="paginate(${page})"> ${page}</a>`;
  }
};
//paginação
let pagina = 1;
let limite = 2;
let offSet = (pagina - 1) * limite;
let quantidadesItens = dados.guides.length;
let itens = dados.guides.slice(offSet, offSet + limite);

paginacao(pagina, quantidadesItens);

const RenderizarConvenio = () => {
  let html = "<option value=''>Convênio</option>";
  dados.insurances.forEach((dados) => {
    html += `
			<option value="${dados.id}">${dados.name}</option>
		`;
  });
  selectConvenio.innerHTML = html;
};

function paginate(page) {
  let pagina = page;
  let limite = 2;
  let offSet = (pagina - 1) * limite;
  let itens = dados.guides.slice(offSet, offSet + limite);

  RenderTable(itens);
  console.log(page);
}


mesAtual.addEventListener("click", btnMes);
dataHoje.addEventListener("click", btnHoje);
RenderizarConvenio(dados.insurances);
RenderTable(itens);
