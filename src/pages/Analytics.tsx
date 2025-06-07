
import AIAnalyticsDashboard from '@/components/AIAnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Analytics Dashboard</h1>
        <p className="text-gray-600">Advanced performance insights and AI-powered recommendations</p>
      </div>
      <AIAnalyticsDashboard />
    </div>
  );
};

export default Analytics;
