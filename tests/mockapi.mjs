import { createServer } from "node:http";

const plans = [
  { id: "1", name: "Standard", precio: 40, duracion: 365, beneficios: '["Acceso libre","Soporte"]', descripcion: "", activo: true },
  { id: "2", nombre: "Premium", precio: 50, duracion: 365, beneficios: ["Clases"], descripcion: "", activo: true },
];
const example = {
  foto: "", celular: "70012345", genero: "Male", altura: 170, peso: 75, pecho: 90, cintura: 80,
  fechaNacimiento: "1990-01-01", direccion: "", entrenamiento: "Trainer", fechaIngreso: "2026-01-01",
  fechaFinalizacion: "2026-12-31", montoPagado: 20, montoPendiente: 20, metodoPago: "Cash", activo: true,
};
const members = [
  { ...example, id: "1", numeroMiembro: "1", nombre: "Robert Fox", planId: "1", horario: "Mañana" },
  { ...example, id: "2", numeroMiembro: "2", nombre: "Rose Bell", planId: "2", horario: "Tarde" },
  { ...example, id: "3", numeroMiembro: "3", nombre: "Jacob Jones", planId: "999", horario: "Mañana" },
];
let nextId = 4;

createServer(async (request, response) => {
  const parts = new URL(request.url, "http://localhost").pathname.split("/");
  const [, path, id] = parts;
  const records = path === "planes" ? plans : path === "miembros" ? members : undefined;
  const send = (status, data) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  };
  if (path === "health") return send(200, {});
  if (!records) return send(404, {});
  const index = records.findIndex((record) => record.id === id);
  if (id && index < 0) return send(404, {});
  if (request.method === "GET") return send(200, id ? records[index] : records);
  if (request.method === "DELETE") return send(200, records.splice(index, 1)[0]);
  if (request.method !== "POST" && request.method !== "PUT") return send(405, {});

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString());
  if (request.method === "PUT") {
    records[index] = { ...records[index], ...body, id };
    return send(200, records[index]);
  }
  const record = { ...body, id: String(nextId++) };
  records.push(record);
  send(201, record);
}).listen(4191, "127.0.0.1");
