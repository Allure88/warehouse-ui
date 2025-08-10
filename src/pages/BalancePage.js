import React, { useState, useEffect } from 'react';
import { getBalances } from '../services/balancesService';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ToastError from '../components/ToastError';

const BalancePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ resource: '', unit: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBalances();
        if (res.data.Success) {
          setData(res.data.Body.Balances);
          setFilteredData(res.data.Body.Balances);
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка подключения к серверу');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;
    if (filters.resource) {
      result = result.filter(item => item.Resource.Name.toLowerCase().includes(filters.resource.toLowerCase()));
    }
    if (filters.unit) {
      result = result.filter(item => item.UnitOfMeasurement.Name.toLowerCase().includes(filters.unit.toLowerCase()));
    }
    setFilteredData(result);
  }, [filters, data]);

  return (
    <div>
      <h3>Баланс</h3>
      <FilterBar filters={filters} setFilters={setFilters} resourceFilter unitFilter />
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <DataTable
        data={filteredData}
        columns={[
          { header: 'Ресурс', accessor: 'Resource.Name' },
          { header: 'Единица измерения', accessor: 'UnitOfMeasurement.Name' },
          { header: 'Количество', accessor: 'Quantity' },
        ]}
      />
    </div>
  );
};

export default BalancePage;