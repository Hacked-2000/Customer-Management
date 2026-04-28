import { Request, Response } from 'express';
import { validateCustomer } from '../utils/validation.js';

let customers: any[] = [];
let nextId = 1;

export const addCustomer = (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Check if payload exists
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is required and must be a valid JSON object',
        errors: [],
        data: null
      });
    }

    const validation = validateCustomer(payload);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
        data: null
      });
    }

    const newCustomer = {
      id: String(nextId++),
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      createdAt: new Date()
    };

    customers.push(newCustomer);

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: newCustomer
    });
  } catch (error: any) {
    console.error('Error in addCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add customer',
      errors: [error.message],
      data: null
    });
  }
};

export const getAllCustomers = (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (error: any) {
    console.error('Error in getAllCustomers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      errors: [error.message],
      data: null
    });
  }
};

export const getCustomerById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required and must be a string',
        errors: [],
        data: null
      });
    }

    const customer = customers.find(c => c.id === id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`,
        errors: [],
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer
    });
  } catch (error: any) {
    console.error('Error in getCustomerById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      errors: [error.message],
      data: null
    });
  }
};

export const updateCustomer = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required and must be a string',
        errors: [],
        data: null
      });
    }

    // Check if payload exists
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is required and must be a valid JSON object',
        errors: [],
        data: null
      });
    }

    const customer = customers.find(c => c.id === id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`,
        errors: [],
        data: null
      });
    }

    const validation = validateCustomer({ ...customer, ...payload });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
        data: null
      });
    }

    const index = customers.findIndex(c => c.id === id);
    customers[index] = {
      ...customer,
      name: payload.name?.trim() || customer.name,
      email: payload.email?.trim() || customer.email,
      phone: payload.phone?.trim() || customer.phone,
      updatedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customers[index]
    });
  } catch (error: any) {
    console.error('Error in updateCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      errors: [error.message],
      data: null
    });
  }
};

export const deleteCustomer = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required and must be a string',
        errors: [],
        data: null
      });
    }

    const index = customers.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`,
        errors: [],
        data: null
      });
    }

    const deletedCustomer = customers.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      data: deletedCustomer
    });
  } catch (error: any) {
    console.error('Error in deleteCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      errors: [error.message],
      data: null
    });
  }
};
