import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Avatar, Row, Col, message, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminLayout from '../components/AdminLayout';
import api from '../lib/api';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    void fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile');

      if (!response.data || !response.data.name || !response.data.email) {
        console.error('Invalid profile data:', response.data);
        message.error('Profile data is incomplete');
        return;
      }

      setAdminInfo(response.data);
      form.setFieldsValue({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);

      if (error.response?.status === 401) {
        message.error('Please sign in on the web app first');
      } else if (error.response?.status === 404) {
        message.error('User profile not found');
      } else if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Unable to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (values: { name: string }) => {
    try {
      setSaving(true);
      const response = await api.patch('/api/profile', { name: values.name });

      message.success('Profile saved');
      setAdminInfo((prev) => (prev ? { ...prev, name: response.data.name } : response.data));
      form.setFieldsValue({ name: response.data.name });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      message.error(error.response?.data?.error || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ margin: '0 0 24px 0', fontSize: 24, fontWeight: 600 }}>My Profile</h1>

        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={adminInfo?.image || undefined}
                icon={<UserOutlined />}
                style={{
                  marginBottom: 16,
                  backgroundColor: '#1890ff',
                  fontSize: 48,
                }}
              />
              <h2 style={{ marginBottom: 8 }}>{adminInfo?.name}</h2>
              <p style={{ color: '#888', marginBottom: 16 }}>{adminInfo?.email}</p>
              <Divider />
              <p style={{ color: '#666', fontSize: 12 }}>
                Created at:
                <br />
                {adminInfo?.createdAt ? new Date(adminInfo.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card title="Edit profile">
              <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
                <Form.Item
                  label="Admin name"
                  name="name"
                  initialValue={adminInfo?.name}
                  rules={[
                    { required: true, message: 'Please enter a name' },
                    { min: 2, message: 'Name must be at least 2 characters' },
                  ]}
                >
                  <Input placeholder="Enter name" />
                </Form.Item>

                <Form.Item label="Email" name="email" initialValue={adminInfo?.email}>
                  <Input placeholder="Email" readOnly disabled />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Save changes
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12}>
                <Card hoverable>
                  <p style={{ color: '#666' }}>Role</p>
                  <p style={{ fontSize: 18, fontWeight: 600 }}>Administrator</p>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card hoverable>
                  <p style={{ color: '#666' }}>Account status</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>Active</p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
