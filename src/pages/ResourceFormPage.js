import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourcesService';
import { createResource, updateResource, archiveResource, returnToWorkResource, deleteResource } from '../services/resourcesService';
import ToastError from '../components/ToastError';

const ResourceFormPage = ({ mode }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    State: 'Active'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit') {
      const loadResource = async () => {
        try {
          const res = await getResources();
          if (res.data.Success) {
            const resource = res.data.Body.find(r => r.Name === decodeURIComponent(name));
            if (resource) setFormData(resource);
          }
        } catch (err) {
          setError('Не удалось загрузить ресурс');
        }
      };
      loadResource();
    }
  }, [mode, name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = mode === 'create'
        ? await createResource(formData)
        : await updateResource(formData);
      if (res.data.Success) {
        navigate('/resources');
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка сохранения');
    }
  };

  const handleArchive = async () => {
    try {
      const res = await archiveResource(formData);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, State: 'Archived' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка архивации');
    }
  };

  const handleReturnToWork = async () => {
    try {
      const res = await returnToWorkResource(formData);
      if (res.data.Success) {
        setFormData(prev => ({ ...prev, State: 'Active' }));
      } else {
        setError(res.data.Errors.join(', '));
      }
    } catch (err) {
      setError('Ошибка возврата в работу');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить ресурс?')) {
      try {
        const res = await deleteResource(formData);
        if (res.data.Success) {
          navigate('/resources');
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
      <h3>{mode === 'create' ? 'Добавить ресурс' : 'Редактировать ресурс'}</h3>
      {error && <ToastError message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Имя</label>
          <input
            type="text"
            name="Name"
            className="form-control"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Статус</label>
          <input
            type="text"
            className="form-control"
            value={formData.State}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Сохранить</button>
        {formData.State === 'Active' && (
          <button type="button" className="btn btn-warning me-2" onClick={handleArchive}>В архив</button>
        )}
        {formData.State === 'Archived' && (
          <button type="button" className="btn btn-info me-2 text-white" onClick={handleReturnToWork}>В работу</button>
        )}
        <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>Удалить</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/resources')}>Отмена</button>
      </form>
    </div>
  );
};

export default ResourceFormPage;