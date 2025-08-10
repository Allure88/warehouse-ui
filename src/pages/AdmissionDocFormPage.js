import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdmissionDocs } from '../services/admissionDocsService';
import { getResources } from '../services/resourcesService';
import { getUnits } from '../services/unitsService';
import { createAdmissionDoc, updateAdmissionDoc, deleteAdmissionDoc } from '../services/admissionDocsService';
import ToastError from '../components/ToastError';

const AdmissionDocFormPage = ({ mode }) => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    Number: '',
    Date: '',
    ResBody: {
      Resource: { Name: '', State: '' },
      UnitOfMeasurement: { Name: '', State: '' },
      Quantity: 0,
    },
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const res = await getResources();
        if (res.data.Success) {
          setResources(res.data.Body.Resources);
        }
      } catch (err) {
        setError('Не удалось загрузить ресурсы');
      }
    };

    const loadUnits = async () => {
      try {
        const res = await getUnits();
        if (res.data.Success) {
          setUnits(res.data.Body.Units);
        }
      } catch (err) {
        setError('Не удалось загрузить единицы');
      }
    };

    const loadDoc = async () => {
      try {
        const res = await getAdmissionDocs();
        if (res.data.Success) {
          const doc = res.data.Body.AdmissionDocs.find(d => d.Number === number);
          if (doc) setFormData(doc);
        }
      } catch (err) {
        setError('Не удалось загрузить документ');
      }
    };

    loadResources();
    loadUnits();
    if (mode === 'edit') loadDoc();
  }, [mode, number]);

  const handleChange = (e) => 
  {
    const { name, value } = e.target;
    if (name.startsWith('ResBody.')) 
    {
      const [_, field] = name.split('.');
      if (field === 'Resource') 
      {
        const resource = resources.find(r => r.Name === value);
        setFormData(prev => ({
          ...prev,
          ResBody: {
            ...prev.ResBody,
            Resource: resource || { Name: '', State: 'Active' },
            UnitOfMeasurement: prev.ResBody.UnitOfMeasurement || { Name: '' , State: 'Active'},
          },
        }));
      } 
      else if(field === 'UnitOfMeasurement')
      {
        const unit = units.find(u=>u.Name === value);
         setFormData(prev => ({
          ...prev,
          ResBody: {
            ...prev.ResBody,
            Resource: prev.ResBody.Resource || { Name: '', State: 'Active' },
            UnitOfMeasurement: unit || { Name: 'шт.', State: 'Active' },
          },
        }));

      }

      else
      {
        setFormData(prev => ({
          ...prev,
          ResBody: { ...prev.ResBody, [field]: value },
        }));
      }
    } 
    else
    {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = mode === 'create'
        ? await createAdmissionDoc(formData)
        : await updateAdmissionDoc(formData);

      if (res.data.Success) {
        navigate('/admission');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить документ?')) {
      try {
        const res = await deleteAdmissionDoc(formData);
        if (res.data.Success) {
          navigate('/admission');
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
      <h3>{mode === 'create' ? 'Создать документ поступления' : 'Редактировать документ'}</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Номер</label>
          <input
            type="text"
            name="Number"
            className="form-control"
            value={formData.Number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Дата</label>
          <input
            type="date"
            name="Date"
            className="form-control"
            value={formData.Date.split('T')[0]}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Ресурс</label>
          <select
            name="ResBody.Resource"
            className="form-control"
            value={formData.ResBody.Resource.Name}
            onChange={handleChange}
            required
          >
            <option value="">Выберите ресурс</option>
            {resources.map(r => (
              <option key={r.Name} value={r.Name}>{r.Name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Единица измерения</label>
          <select
            type="text"
            name="ResBody.UnitOfMeasurement"
            className="form-control"
            value={formData.ResBody.UnitOfMeasurement.Name}
             onChange={handleChange}
            required
          >
             <option value="">Выберите единицу измерения</option>
            {units.map(r => (
              <option key={r.Name} value={r.Name}>{r.Name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Количество</label>
          <input
            type="number"
            step="0.01"
            name="ResBody.Quantity"
            className="form-control"
            value={formData.ResBody.Quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Сохранить</button>
        {mode === 'edit' && (
          <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>Удалить</button>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admission')}>Отмена</button>
      </form>
    </div>
  );
};

export default AdmissionDocFormPage;