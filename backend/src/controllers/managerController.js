import * as adminController from "./adminController.js";

/**
 * Controller to handle user updates by a Manager.
 * Reuses the core logic from adminController while keeping
 * the manager-specific endpoint separate.
 */
export const UpdateUser = async (req, res) => {
  // You can implement additional manager-specific business logic or
  // validation here before calling the base controller function.

  // Directly calling the reused update logic from adminController
  return adminController.updateUser(req, res);
};

/**
 * Controller to fetch the list of users for the Manager's view.
 * Utilizes the existing pagination and search logic from adminController.
 */
export const GetAllUsers = async (req, res) => {
  // Executes the shared logic to retrieve all users
  return adminController.getAllUsers(req, res);
};
