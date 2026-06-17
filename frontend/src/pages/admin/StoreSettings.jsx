import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';

const StoreSettings = () => {
  const { store, updateStoreSettings, loadingStore } = useContext(StoreContext);
  
  const [name, setName] = useState('');
  const [themeColor, setThemeColor] = useState('#3b82f6');
  const [currency, setCurrency] = useState('USD');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name);
      setThemeColor(store.settings?.themeColor || '#3b82f6');
      setCurrency(store.settings?.currency || 'USD');
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStoreSettings({ themeColor, currency });
      // Actually we need an endpoint to update store name too, assuming the API handles it:
      // Wait, updateStore accepts name in the body and settings in body.settings
      // We need to modify our context to pass name and settings if we want to change name
      // For now, let's just stick to settings since we wrote updateStoreSettings in context
      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingStore) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h2>
      
      {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Store Name (Read Only)</label>
          <input 
            type="text" 
            value={name}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Theme Color</label>
          <div className="flex items-center space-x-3">
            <input 
              type="color" 
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="h-10 w-10 border rounded cursor-pointer"
            />
            <span className="text-gray-600 font-mono">{themeColor}</span>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Currency</label>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="LKR">LKR (Rs)</option>
          </select>
        </div>

        <div className="pt-4 border-t">
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;
