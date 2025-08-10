import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUnits } from '../services/unitsService';
import DataTable from '../components/DataTable';
import ToastError from '../components/ToastError';

const UnitsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ unit: '', state: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUnits();
        if (res.data.Success) {
          setData(res.data.Body.Units);
          setFilteredData(res.data.Body.Units);
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка подключения');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;
    if (filters.unit) {
      result = result.filter(item => item.Name.toLowerCase().includes(filters.unit.toLowerCase()));
    }
    if (filters.state) {
      result = result.filter(item => item.State === filters.state);
    }
    setFilteredData(result);
  }, [filters, data]);

  return (
    <div>
      <h3>Единицы измерения</h3>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Фильтр по названию"
            value={filters.unit}
            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
            style={{ width: '200px' }}
          />
          <select
            className="form-control"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            style={{ width: '150px' }}
          >
            <option value="">Все статусы</option>
            <option value="Active">Активные</option>
            <option value="Archived">В архиве</option>
          </select>
        </div>
      </div>
        <Link to="/units/create" className="btn btn-primary">Добавить</Link>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <DataTable
        data={filteredData}
        columns={[
          { header: 'Название', accessor: 'Name' },
          { header: 'Статус', accessor: 'State' },
        ]}
        onRowClick={(row) =>{
           window.location.href = `/units/edit/${encodeURIComponent(row.Name)}`
          }
      }
      />
    </div>
  );
};

export default UnitsPage;