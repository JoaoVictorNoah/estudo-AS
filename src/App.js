import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input, Select } from 'antd';

const App = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/tarefas');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/api/tarefas/${id}`);
      message.success('Tarefa excluída com sucesso');
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error.message);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (values.id) {
        // Atualização
        await axios.patch(`http://localhost:3030/api/tarefas/${values.id}`, values);
        message.success('Tarefa atualizada com sucesso');
      } else {
        // Cadastro
        await axios.post('http://localhost:3030/api/tarefas', values);
        message.success('Tarefa adicionada com sucesso');
      }
      setModalVisible(false);
      fetchData(); // Atualiza a tabela imediatamente após a edição ou adição
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Concluída',
      dataIndex: 'concluida',
      key: 'concluida',
      render: (concluida) => (concluida ? 'Sim' : 'Não'),
    },
    {
      title: 'Ação',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="danger" style={{ marginLeft: 8 }} onClick={() => handleDelete(record.id)}>
            Excluir
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Adicionar Tarefa
      </Button>
      <Table dataSource={data} columns={columns} />

      <Modal
        title="Adicionar/Editar Tarefa"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            handleSave(values);
          });
        }}
      >
        <Form form={form} layout="vertical" name="tarefa_form">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome da tarefa' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="concluida"
            label="Concluída"
            rules={[{ required: true, message: 'Por favor, escolha uma opção' }]}
          >
            <Select placeholder="Selecione">
              <Select.Option value={1}>Sim</Select.Option>
              <Select.Option value={0}>Não</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
