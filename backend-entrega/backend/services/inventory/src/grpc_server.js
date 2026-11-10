const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/inventory_service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const inventoryProto = grpc.loadPackageDefinition(packageDefinition).inventory;

function reservarStock(call, callback) {
  const { pedido_id, items } = call.request;
  callback(null, {
    exito: true,
    mensaje: `Stock reservado para el pedido ${pedido_id}`,
    tiempo_expiracion_segundos: 900
  });
}

function startGrpcServer(port = 50051) {
  const server = new grpc.Server();
  server.addService(inventoryProto.InventoryService.service, { ReservarStock: reservarStock });
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (!err) server.start();
  });
}

module.exports = { startGrpcServer };
