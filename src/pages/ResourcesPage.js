import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResources } from '../services/resourcesService';
import DataTable from '../components/DataTable';
import ToastError from '../components/ToastError';

const ResourcesPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ name: '', state: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getResources();
        if (res.data.Success) {
          setData(res.data.Body);
          setFilteredData(res.data.Body);
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
    if (filters.name) {
      result = result.filter(item => item.Name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.state) {
      result = result.filter(item => item.State === filters.state);
    }
    setFilteredData(result);
  }, [filters, data]);

  return (
    <div>
      <h3>Ресурсы</h3>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Фильтр по имени"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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
        <Link to="/resources/create" className="btn btn-primary">Добавить</Link>
      </div>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <DataTable
        data={filteredData}
        columns={[
          { header: 'Имя', accessor: 'Name' },
          { header: 'Статус', accessor: 'State' },
        ]}
        onRowClick={(row) => window.location.href = `/resources/edit/${encodeURIComponent(row.Name)}`}
      />
    </div>
  );
};

export default ResourcesPage;