const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ATRAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const EJ = '<span class="ej">por confirmar</span>';

function pintarMarco(actual) {
  const nav = [['index.html', 'Inicio', 'inicio', 'solo-ancho'], ['solicitudes.html', 'Solicitudes', 'solicitudes', ''], ['estado.html', 'Ver mi solicitud', 'estado', '']];
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="barra"><div class="contenedor barra-in">
    <a class="marca" href="index.html"><img src="img/enami-logo-blanco.svg" alt="ENAMI" width="140" height="28"><span>Solicitudes de Fomento<small>Planta Osvaldo Martínez, El Salado</small></span></a>
    <nav class="menu" aria-label="Principal">${nav.map(([h, t, k, c]) => `<a href="${h}" class="${c}" ${k === actual ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="pie"><div class="contenedor pie-in"><img src="img/enami-logo-blanco.svg" alt="ENAMI" width="120" height="24">
    <p>Prototipo de demostración desarrollado por SETROF SpA para el Desafío 2 de TANTAY Atacama 2026. No es un sitio oficial de ENAMI. Los requisitos, plazos y documentos de cada trámite son de ejemplo y se definen en el levantamiento.</p>
  </div></footer>`);
}

const limpiarRut = (v) => v.replace(/[^0-9kK]/g, '').toUpperCase();
function formatearRut(v) {
  const r = limpiarRut(v);
  if (r.length < 2) return r;
  return `${r.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${r.slice(-1)}`;
}
function rutValido(v) {
  const r = limpiarRut(v);
  if (r.length < 8) return false;
  const cuerpo = r.slice(0, -1), dv = r.slice(-1);
  let suma = 0, m = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += +cuerpo[i] * m; m = m === 7 ? 2 : m + 1; }
  const esp = 11 - (suma % 11);
  return dv === (esp === 11 ? '0' : esp === 10 ? 'K' : String(esp));
}
function activarRut(c = document) {
  $$('[data-rut]', c).forEach((i) => i.addEventListener('input', () => { if (!i.readOnly) i.value = formatearRut(i.value); }));
}

const TRAMITES = {
  anticipo: {
    nombre: 'Anticipo', corto: 'Anticipo', resumen: 'Solicita un anticipo por el mineral que entregas a ENAMI.', accion: 'Solicitar anticipo',
    grupo: 1, minutos: 10, respuesta: '10 días hábiles',
    descripcion: '<p>Es un adelanto de dinero sobre el mineral que entregaste en la planta El Salado, antes de que termine el proceso de compra.</p><p>ENAMI revisa tu solicitud en tres etapas: evaluación técnica, evaluación comercial y aprobación de la jefatura. Te avisamos cada vez que avanza.</p>',
    quien: ['Pequeños y medianos productores mineros empadronados en ENAMI.', 'Personas naturales o empresas.', `Que hayan entregado mineral en la planta El Salado. ${EJ}`],
    docs: [['Guía de despacho del mineral', 'La del mineral entregado en planta'], ['Datos de tu cuenta bancaria', 'Foto de la cartola o certificado del banco']],
  },
  arriendo: {
    nombre: 'Arriendo de pertenencia minera', corto: 'Arriendo', resumen: 'Accede a una pertenencia minera para desarrollar tu actividad.', accion: 'Solicitar arriendo',
    grupo: 2, minutos: 15, respuesta: '20 días hábiles',
    descripcion: '<p>Es la solicitud para arrendar a ENAMI una pertenencia minera y explotarla.</p><p>ENAMI revisa el sector, tu plan de trabajo y tus antecedentes antes de aprobar el arriendo.</p>',
    quien: ['Productores mineros, a su nombre o con su empresa.', `Que la pertenencia sea de ENAMI y esté disponible. ${EJ}`],
    docs: [['Coordenadas o plano del sector', 'Puede ser una foto del plano'], ['Plan de trabajo', 'Qué vas a explotar y en qué plazo']],
  },
  certificado: {
    nombre: 'Certificado de venta', corto: 'Certificado de venta', resumen: 'Obtén un certificado de tus ventas de mineral a ENAMI.', accion: 'Obtener certificado',
    grupo: 1, minutos: 5, respuesta: '5 días hábiles',
    descripcion: '<p>Es un certificado con el detalle de lo que le vendiste a ENAMI en el periodo que elijas.</p><p>Te llega por correo, firmado electrónicamente.</p>',
    quien: ['Productores que le hayan vendido mineral a ENAMI.'],
    docs: [],
  },
  empadronamiento: {
    nombre: 'Empadronamiento del productor', corto: 'Empadronamiento', resumen: 'Regístrate como productor minero o actualiza tus antecedentes.', accion: 'Empadronarme',
    grupo: 3, minutos: 15, respuesta: '15 días hábiles',
    descripcion: '<p>Es la inscripción como productor minero en ENAMI. También sirve para actualizar tus datos si algo cambió.</p><p>Estar empadronado es necesario para pedir anticipos y vender tu mineral a ENAMI.</p>',
    quien: ['Personas naturales o empresas que exploten una pertenencia minera.', 'Productores ya inscritos que necesiten actualizar sus datos.'],
    docs: [['Inscripción de la pertenencia o contrato con su dueño', 'Del Conservador de Minas'], ['Resolución de Sernageomin', 'Aprobación del método de explotación']],
  },
};
const DOCS_PERSONA = {
  natural: [['Cédula de identidad', 'Foto por ambos lados']],
  juridica: [['RUT de la empresa', 'Copia del e-RUT'], ['Certificado de vigencia de la sociedad', 'Con menos de 60 días'], ['Cédula del representante legal', 'Foto por ambos lados']],
};
const DEMO_CU = { rut: '12.345.678-5', nombre: 'María Elena Rojas Díaz' };
const param = (k) => new URLSearchParams(location.search).get(k);
