import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../services/clientsService';
import DataTable from '../components/DataTable';
import ToastError from '../components/ToastError';

const ClientsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ Name: '', Address: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getClients();

        if (res.data.Success) {
          setData(res.data.Body.Clients);
          setFilteredData(res.data.Body.Clients);
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка подключения к серверу1');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;
    if (filters.Name) {
      result = result.filter(item => item.Name.toLowerCase().includes(filters.Name.toLowerCase()));
    }
    if (filters.Address) {
      result = result.filter(item => item.adress.toLowerCase().includes(filters.Address.toLowerCase()));
    }
    setFilteredData(result);
  }, [filters, data]);

  return (
    <div>
      <h3>Клиенты</h3>
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
          <input
            type="text"
            className="form-control"
            placeholder="Фильтр по адресу"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            style={{ width: '200px' }}
          />
        </div>
      </div>
      <Link to="/clients/create" className="btn btn-primary">Добавить</Link>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <DataTable
        data={filteredData}
        columns={[
          { header: 'Имя', accessor: 'Name' },
          { header: 'Адрес', accessor: 'Adress' },
          { header: 'Статус', accessor: 'State' },
        ]}
        onRowClick={(row) =>
        {
          window.location.href = `/clients/edit/${encodeURIComponent(row.Name)}`}
        }
      />
    </div>
  );
};

export default ClientsPage;