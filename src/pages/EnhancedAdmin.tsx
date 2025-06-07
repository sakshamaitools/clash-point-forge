
import EnhancedUserManagement from '@/components/EnhancedUserManagement';

const EnhancedAdmin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enhanced Admin Dashboard</h1>
        <p className="text-gray-600">Advanced user management with AI analytics and economic insights</p>
      </div>
      <EnhancedUserManagement />
    </div>
  );
};

export default EnhancedAdmin;
