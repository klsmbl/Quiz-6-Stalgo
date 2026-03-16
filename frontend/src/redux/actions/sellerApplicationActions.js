import {
  SELLER_APPLICATION_ADD,
  SELLER_APPLICATION_REVIEW,
  SELLER_APPLICATION_SET_ALL,
} from "../constants/sellerApplicationConstants";
import { saveSellerApplications, saveUsers, syncCurrentUser } from "../../utils/storage";

export function setSellerApplications(applications) {
  saveSellerApplications(applications);
  return {
    type: SELLER_APPLICATION_SET_ALL,
    payload: applications,
  };
}

export function addSellerApplication(application, applications) {
  const nextApplications = [...applications, application];
  saveSellerApplications(nextApplications);
  return {
    type: SELLER_APPLICATION_ADD,
    payload: application,
  };
}

export function reviewSellerApplication({ email, status, merchantId = "", reasonForDecline = "" }, applications, users) {
  const nextApplications = applications.map((application) => {
    if (application.email !== email) {
      return application;
    }

    return {
      ...application,
      status,
      merchantId,
      reasonForDecline,
      reviewedAt: new Date().toISOString(),
    };
  });

  saveSellerApplications(nextApplications);

  let nextUsers = users;
  if (status === "Approved") {
    nextUsers = users.map((user) => (user.email === email ? {
      ...user,
      role: "Seller",
    } : user));
    saveUsers(nextUsers);
    syncCurrentUser(nextUsers);
  }

  return {
    type: SELLER_APPLICATION_REVIEW,
    payload: {
      email,
      status,
      merchantId,
      reasonForDecline,
      users: nextUsers,
    },
  };
}
