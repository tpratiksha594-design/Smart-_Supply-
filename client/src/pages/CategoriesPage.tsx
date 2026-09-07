import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { productService } from '../services/api';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Product Categories</h1>
        <p className="text-xs text-slate-500 mt-1">Classification taxonomy for inventory items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.category_id} className="glass-card rounded-2xl p-6 border border-slate-200 shadow-card-soft">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">{c.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{c.description}</p>
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-3">
              /{c.slug}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
