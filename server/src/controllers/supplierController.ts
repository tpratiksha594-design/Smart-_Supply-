import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { Supplier } from '../types';

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const list = mockStore.suppliers.map(s => {
      // Calculate supplier health score
      const healthScore = Math.round((s.rating / 5.0 * 40) + (s.on_time_delivery_rate / 100.0 * 30) + (s.quality_score / 100.0 * 30));
      return {
        ...s,
        health_score: healthScore
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSupplierLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = mockStore.suppliers
      .map(s => {
        const healthScore = Math.round((s.rating / 5.0 * 40) + (s.on_time_delivery_rate / 100.0 * 30) + (s.quality_score / 100.0 * 30));
        return {
          ...s,
          health_score: healthScore
        };
      })
      .sort((a, b) => b.health_score - a.health_score);

    return res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, contact_person, email, phone, address, rating, on_time_delivery_rate, quality_score } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const newSupplier: Supplier = {
      supplier_id: mockStore.suppliers.length + 1,
      name,
      contact_person: contact_person || 'N/A',
      email,
      phone: phone || '',
      address: address || '',
      rating: Number(rating) || 5.0,
      on_time_delivery_rate: Number(on_time_delivery_rate) || 95.0,
      quality_score: Number(quality_score) || 95,
      status: 'ACTIVE',
      total_orders: 0
    };

    mockStore.suppliers.push(newSupplier);
    return res.status(201).json({ success: true, data: newSupplier });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
