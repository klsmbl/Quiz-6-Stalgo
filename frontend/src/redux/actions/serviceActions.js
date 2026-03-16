import { SERVICE_ADD, SERVICE_DELETE, SERVICE_UPDATE } from "../constants/serviceConstants";
import { saveSellerServices } from "../../utils/storage";

export function addService(service, sellerServices) {
  const nextServices = [...sellerServices, service];
  saveSellerServices(nextServices);
  return {
    type: SERVICE_ADD,
    payload: service,
  };
}

export function updateService(service, sellerServices) {
  const nextServices = sellerServices.map((currentService) =>
    currentService.id === service.id ? { ...currentService, ...service } : currentService,
  );
  saveSellerServices(nextServices);
  return {
    type: SERVICE_UPDATE,
    payload: service,
  };
}

export function deleteService(serviceId, sellerServices) {
  const nextServices = sellerServices.filter((service) => service.id !== serviceId);
  saveSellerServices(nextServices);
  return {
    type: SERVICE_DELETE,
    payload: serviceId,
  };
}
