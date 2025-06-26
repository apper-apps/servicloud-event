import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';
import clientService from '@/services/api/clientService';

const clientSchema = yup.object().shape({
  companyName: yup.string().required('Nombre de empresa es requerido'),
  contactName: yup.string().required('Nombre de contacto es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  phone: yup.string().required('Teléfono es requerido'),
  address: yup.string().required('Dirección es requerida')
});

const ClientForm = ({ isModal = false, onClose, onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      notes: ''
    }
  });

  const isEdit = Boolean(id);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let result;
      if (isEdit) {
        result = await clientService.update(id, data);
        toast.success(t('clientUpdated', 'Cliente actualizado exitosamente'));
      } else {
        result = await clientService.create(data);
        toast.success(t('clientCreated', 'Cliente creado exitosamente'));
      }

      if (onSuccess) {
        onSuccess(result);
      }

      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/clients');
      }
    } catch (err) {
      toast.error(err.message || t('errorSavingClient', 'Error al guardar el cliente'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/clients');
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="companyName"
          label={t('companyName', 'Nombre de Empresa')}
          required
          error={errors.companyName?.message}
          {...register('companyName')}
        />

        <FormField
          name="contactName"
          label={t('contactName', 'Nombre de Contacto')}
          required
          error={errors.contactName?.message}
          {...register('contactName')}
        />

        <FormField
          name="email"
          label={t('email', 'Email')}
          type="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          name="phone"
          label={t('phone', 'Teléfono')}
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <FormField
        name="address"
        label={t('address', 'Dirección')}
        required
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {t('status', 'Estado')}
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="active">{t('active', 'Activo')}</option>
            <option value="inactive">{t('inactive', 'Inactivo')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {t('notes', 'Notas')}
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={t('addNotes', 'Agregar notas adicionales...')}
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          {t('cancel', 'Cancelar')}
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          icon={isEdit ? 'Save' : 'UserPlus'}
        >
          {isEdit ? t('updateClient', 'Actualizar Cliente') : t('createClient', 'Crear Cliente')}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">
              {isEdit ? t('editClient', 'Editar Cliente') : t('addNewClient', 'Agregar Nuevo Cliente')}
            </h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {formContent}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/clients')}
          >
            {t('back', 'Volver')}
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">
              {isEdit ? t('editClient', 'Editar Cliente') : t('addNewClient', 'Agregar Nuevo Cliente')}
            </h1>
            <p className="text-surface-600 mt-1">
              {isEdit ? t('updateClientInfo', 'Actualizar información del cliente') : t('createNewClientAccount', 'Crear una nueva cuenta de cliente')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        {formContent}
      </Card>
    </div>
  );
};

export default ClientForm;