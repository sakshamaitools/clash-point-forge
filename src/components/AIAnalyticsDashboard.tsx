
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIAnalytics } from '@/hooks/useAIAnalytics';
import { Brain, TrendingUp, Target, Lightbulb, BarChart } from 'lucide-react';

const AIAnalyticsDashboard = () => {
  const { analytics, performance, loading, analyzePerformance } = useAIAnalytics();

  if (loading) {
    return <div className="text-center py-4">Loading AI analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Performance Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.skill_metrics?.kill_death_ratio?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">Avg K/D Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.skill_metrics?.average_placement?.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Avg Placement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.skill_metrics?.damage_per_game?.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Damage/Game</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analytics.skill_metrics?.consistency_score?.toFixed(0) || '0'}%
                  </div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Improvement Areas
                  </h3>
                  <div className="space-y-2">
                    {analytics.improvement_areas?.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analytics.ai_recommendations?.map((rec, index) => (
                      <div key={index} className="text-sm text-gray-700 p-2 bg-blue-50 rounded">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No analysis available yet</p>
            </div>
          )}

          <Button onClick={analyzePerformance} className="w-full">
            <BarChart className="h-4 w-4 mr-2" />
            Generate AI Analysis
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {performance.length > 0 ? (
            <div className="space-y-3">
              {performance.slice(0, 5).map((perf) => (
                <div key={perf.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div className="text-center">
                      <div className="font-semibold">{perf.kills}</div>
                      <div className="text-xs text-gray-600">Kills</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">#{perf.placement}</div>
                      <div className="text-xs text-gray-600">Placement</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{perf.damage_dealt}</div>
                      <div className="text-xs text-gray-600">Damage</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{perf.accuracy_percentage}%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No performance data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalyticsDashboard;
