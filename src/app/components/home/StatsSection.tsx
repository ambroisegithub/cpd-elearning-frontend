import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '15,000+',
      label: 'Active Learners',
      color: '#2D6A4F'
    },
    {
      icon: BookOpen,
      value: '187',
      label: 'Expert Courses',
      color: '#E76F51'
    },
    {
      icon: Award,
      value: '32,456',
      label: 'Certificates Issued',
      color: '#1E2F5E'
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: 'Completion Rate',
      color: '#E9C46A'
    }
  ];

  return (
    <section className="py-12 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl text-center border border-[rgba(30,47,94,0.1)] hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: stat.color }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#1E2F5E] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#6C757D]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
