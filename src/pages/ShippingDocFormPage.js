import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShippingDocs} from '../services/shippingDocsService';
import { getResources} from '../services/resourcesService';
import { getClients } from '../services/clientsService';
import { createShippingDoc, updateShippingDoc, signShippingDoc, revocateShippingDoc, deleteShippingDoc } from '../services/shippingDocsService';
import ToastError from '../components/ToastError';

const ShippingDocFormPage = ({ mode }) => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    Number: '',
    Date: '',
    Client: { Name: '' },
    Status: 'Created',
    ResBody: { Resource: { Name: '' }, UnitOfMeasurement: { UnitDescription: '' }, Quantity: 0 },
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resRes, resClients] = await Promise.all([getResources(), getClients()]);
        if (resRes.data.Success) setResources(resRes.data.Body);
        if (resClients.data.Success) setClients(resClients.data.Body);
      } catch (err) {
        setError('Ошибка загрузки данных');
      }

      if (mode === 'edit') {
        const res = await getShippingDocs();
        const doc = res.data.Body.find(d => d.Number === number);
        if (doc) setFormData(doc);
      }
    };
    loadData();
  }, [mode, number]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('ResBody.Resource')) {
      const resource = resources.find(r => r.Name === value);
      setFormData(prev => ({
        ...prev,
        ResBody: {
          ...prev.ResBody,
          Resource: resource || { Name: '' },
          UnitOfMeasurement: { UnitDescription: 'шт' },
        },
      }));
    } else if (name === 'Client.Name') {
      const client = clients.find(c => c.Name === value);
      setFormData(prev => ({ ...prev, Client: client || { Name: '' } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = mode === 'create'
        ? await createShippingDoc(formData)
        : await updateShippingDoc(formData);
      if (res.data.Success) {
        navigate('/shipping');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка сохранения');
    }
  };

  const handleSign = async () => {
    try {
      const res = await signShippingDoc(formData.Number);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, Status: 'Approved' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка подписи');
    }
  };

  const handleRevocate = async () => {
    try {
      const res = await revocateShippingDoc(formData.Number);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, Status: 'Revocated' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка отзыва');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить документ?')) {
      try {
        const res = await deleteShippingDoc(formData);
        if (res.data.Success) {
          navigate('/shipping');
        } else {
          setError(res.data.Errors.join(', '));
        }
      } catch (err) {
        setError('Ошибка удаления');
      }
    }
  };

  return (
    <div>
      <h3>Редактирование документа отгрузки</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Номер</label>
          <input type="text" name="Number" className="form-control" value={formData.Number} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Дата</label>
          <input type="date" name="Date" className="form-control" value={formData.Date.split('T')[0]} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Клиент</label>
          <select name="Client.Name" className="form-control" value={formData.Client.Name} onChange={handleChange} required>
            <option value="">Выберите клиента</option>
            {clients.map(c => <option key={c.Name} value={c.Name}>{c.Name}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label>Ресурс</label>
          <select name="ResBody.Resource" className="form-control" value={formData.ResBody.Resource.Name} onChange={handleChange} required>
            <option value="">Выберите ресурс</option>
            {resources.map(r => <option key={r.Name} value={r.Name}>{r.Name}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label>Количество</label>
          <input type="number" step="0.01" name="ResBody.Quantity" className="form-control" value={formData.ResBody.Quantity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Единица измерения</label>
          <input type="text" className="form-control" value="шт" readOnly />
        </div>
        <div className="mb-3">
          <label>Статус</label>
          <input type="text" className="form-control" value={formData.Status} readOnly />
        </div>
        <button type="submit" className="btn btn-success me-2">Сохранить</button>
        {formData.Status === 'Created' && (
          <button type="button" className="btn btn-primary me-2" onClick={handleSign}>Подписать</button>
        )}
        {formData.Status === 'Approved' && (
          <button type="button" className="btn btn-warning me-2" onClick={handleRevocate}>Отозвать</button>
        )}
        <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>Удалить</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/shipping')}>Отмена</button>
      </form>
    </div>
  );
};

export default ShippingDocFormPage;