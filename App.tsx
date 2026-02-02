
import React, { useState, useEffect } from 'react';
import { Search, History, MessageSquarePlus, Activity, LayoutDashboard, AlertCircle, CheckCircle2, Shield, X, ArrowUpRight, TrendingUp, Info, User, Bell, Menu, Plus } from 'lucide-react';
import { CustomerHistory, ExperienceEntry, ViewType } from './types';
import { analyzeRiskInsight } from './services/geminiService';

const MOCK_HISTORY: Record<string, CustomerHistory> = {
  '01711223344': { phone: '01711223344', successCount: 45, returnCount: 2, successRate: 95.7, lastOrderDate: '2023-11-20' },
  '01911223344': { phone: '01911223344', successCount: 5, returnCount: 8, successRate: 38.4, lastOrderDate: '2023-11-15' },
};

const MOCK_EXPERIENCES: ExperienceEntry[] = [
  { id: '1', merchantName: 'Shopify Pro', customerPhone: '01911223344', rating: 'negative', comment: 'Always makes excuses after arrival. Beware.', timestamp: '2023-11-25 10:30 AM' },
  { id: '2', merchantName: 'Gadget BD', customerPhone: '01711223344', rating: 'positive', comment: 'Excellent customer, prompt payment.', timestamp: '2023-11-24 02:15 PM' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('fraud-check');
  const [searchPhone, setSearchPhone] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState<CustomerHistory | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(MOCK_EXPERIENCES);
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({ phone: '', rating: 'positive' as any, comment: '' });

  const handleSearch = async () => {
    if (!searchPhone) return;
    setLoading(true);
    setInsight(null);
    
    const history = MOCK_HISTORY[searchPhone] || {
      phone: searchPhone,
      successCount: Math.floor(Math.random() * 20),
      returnCount: Math.floor(Math.random() * 5),
      successRate: 0,
      lastOrderDate: 'N/A'
    };
    
    const total = history.successCount + history.returnCount;
    history.successRate = total > 0 ? Number(((history.successCount / total) * 100).toFixed(1)) : 0;
    
    setCurrentCustomer(history);
    const smartInsight = await analyzeRiskInsight(history);
    setInsight(smartInsight);
    setLoading(false);
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      merchantName: 'My Store',
      customerPhone: newExp.phone,
      rating: newExp.rating,
      comment: newExp.comment,
      timestamp: new Date().toLocaleString(),
    };
    setExperiences([entry, ...experiences]);
    setShowAddExp(false);
    setNewExp({ phone: '', rating: 'positive', comment: '' });
  };

  // SVG Trust Meter Constants
  const circleSize = 100;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-900 font-sans pb-10 max-w-md mx-auto shadow-2xl overflow-x-hidden border-x border-slate-100 relative">
      
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-dark-blue rounded-xl flex items-center justify-center shadow-lg shadow-dark-blue/20">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="font-black text-xl tracking-tight text-dark-blue">TrustShield</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-dark-blue transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full border-2 border-white"></span>
          </button>
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-white shadow-sm">
            <User className="text-slate-400" size={20} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6">
        
        {/* Horizontal Scrollable Tabs */}
        <div className="mb-8 -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 w-max bg-white p-2 rounded-[2rem] border border-slate-100/50 shadow-sm">
            <button
              onClick={() => setActiveView('fraud-check')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all duration-500 whitespace-nowrap font-bold text-sm ${
                activeView === 'fraud-check' 
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutDashboard size={18} strokeWidth={activeView === 'fraud-check' ? 2.5 : 2} />
              Analyze
            </button>
            <button
              onClick={() => setActiveView('my-entries')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all duration-500 whitespace-nowrap font-bold text-sm ${
                activeView === 'my-entries' 
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <History size={18} strokeWidth={activeView === 'my-entries' ? 2.5 : 2} />
              My Contributions
            </button>
            <button
              onClick={() => setActiveView('recent-activity')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all duration-500 whitespace-nowrap font-bold text-sm ${
                activeView === 'recent-activity' 
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Activity size={18} strokeWidth={activeView === 'recent-activity' ? 2.5 : 2} />
              Network Feed
            </button>
          </div>
        </div>

        {activeView === 'fraud-check' && (
          <div className="space-y-6">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-dark-blue tracking-tight">Search Identity</h2>
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Verify global reputation</p>
              </div>
              {/* Orange Plus Button next to the title */}
              <button 
                onClick={() => setShowAddExp(true)}
                className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-orange/30 hover:scale-105 active:scale-95 transition-all border border-white/20"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Mobile Search Widget */}
            <div className="relative group animate-in slide-in-from-top-4 duration-500">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-slate-300 group-focus-within:text-brand-orange transition-colors" size={20} />
              </div>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                className="w-full pl-14 pr-16 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm shadow-slate-200/50 outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange transition-all font-bold text-xl text-dark-blue placeholder:text-slate-200"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-14 h-14 bg-dark-blue text-white rounded-[1.4rem] flex items-center justify-center hover:bg-brand-orange transition-all shadow-lg active:scale-95"
              >
                {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUpRight size={22} />}
              </button>
            </div>

            {/* Analysis Results */}
            {currentCustomer ? (
              <div className="space-y-5 animate-in fade-in duration-700">
                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center text-center gap-6">
                  <div className="relative" style={{ width: circleSize * 1.2, height: circleSize * 1.2 }}>
                    <svg width={circleSize * 1.2} height={circleSize * 1.2} className="transform -rotate-90">
                      <circle cx={(circleSize * 1.2)/2} cy={(circleSize * 1.2)/2} r={radius * 1.2} stroke="#F8FAFC" strokeWidth={strokeWidth} fill="transparent" />
                      <circle 
                        cx={(circleSize * 1.2)/2} cy={(circleSize * 1.2)/2} r={radius * 1.2} 
                        stroke={currentCustomer.successRate >= 80 ? '#10B981' : '#F43F5E'} 
                        strokeWidth={strokeWidth} 
                        fill="transparent" 
                        strokeDasharray={circumference * 1.2}
                        strokeDashoffset={(circumference * 1.2) - ((circumference * 1.2) * currentCustomer.successRate) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${currentCustomer.successRate >= 80 ? '#10b98166' : '#f43f5e66'})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-dark-blue tracking-tighter">{currentCustomer.successRate}%</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Trust Score</span>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight ${currentCustomer.successRate >= 80 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {currentCustomer.successRate >= 80 ? 'Safe Profile' : 'High Risk'}
                    </h4>
                    <p className="text-slate-400 text-sm font-medium mt-1">Global Verification ID: {currentCustomer.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-3xl font-black text-dark-blue">{currentCustomer.successCount}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Successful</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl mb-3">
                      <History size={24} />
                    </div>
                    <p className="text-3xl font-black text-rose-500">{currentCustomer.returnCount}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Returned</p>
                  </div>
                </div>

                {insight && (
                  <div className="bg-dark-blue p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                        <Activity size={14} className="text-white animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">AI Strategic Counsel</span>
                    </div>
                    <p className="text-xl font-bold leading-relaxed italic opacity-95">"{insight}"</p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <Shield size={64} className="mb-6 text-dark-blue" strokeWidth={1} />
                <p className="font-bold text-center text-slate-400 px-10">Enter a customer's phone number to retrieve global history.</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'my-entries' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-dark-blue mb-6">Archive</h2>
            {experiences.filter(e => e.merchantName === 'My Store').map(exp => (
              <div key={exp.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${exp.rating === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-lg font-black text-dark-blue tracking-tight">{exp.customerPhone}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase">{exp.timestamp.split(',')[0]}</span>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl italic text-sm text-slate-600 font-medium">
                   "{exp.comment}"
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'recent-activity' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-dark-blue mb-6">Network Pulse</h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-5 hover:border-brand-orange/20 transition-all">
                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${exp.rating === 'positive' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-600'}`}>
                  {exp.rating === 'positive' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-sm font-black text-dark-blue truncate">{exp.merchantName}</h4>
                    <span className="text-[9px] font-bold text-slate-300">{exp.timestamp.split(',')[0]}</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 italic leading-snug">"{exp.comment}"</p>
                  <p className="text-[10px] font-black text-brand-orange mt-3 uppercase tracking-tighter">Verified ID: {exp.customerPhone.slice(0, 5)}***</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Modal / Sheet */}
      {showAddExp && (
        <div className="fixed inset-0 bg-dark-blue/60 backdrop-blur-md z-[60] flex items-end justify-center animate-in fade-in duration-300 p-0">
          <div className="bg-white w-full rounded-t-[3rem] shadow-2xl p-10 animate-in slide-in-from-bottom-20 duration-500 max-w-md border-t border-slate-100">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-dark-blue tracking-tight">Post Feed</h3>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Broadcast to network</p>
              </div>
              <button onClick={() => setShowAddExp(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddExperience} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Details</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none font-black text-xl text-dark-blue focus:ring-4 focus:ring-brand-orange/5"
                  placeholder="01XXXXXXXXX"
                  value={newExp.phone}
                  onChange={(e) => setNewExp({...newExp, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Behavior Weight</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setNewExp({...newExp, rating: 'positive'})}
                    className={`py-5 rounded-[1.5rem] border-2 font-black text-xs uppercase tracking-widest transition-all ${newExp.rating === 'positive' ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white border-slate-50 text-slate-300 hover:border-slate-200'}`}
                  >
                    Successful
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewExp({...newExp, rating: 'negative'})}
                    className={`py-5 rounded-[1.5rem] border-2 font-black text-xs uppercase tracking-widest transition-all ${newExp.rating === 'negative' ? 'bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-white border-slate-50 text-slate-300 hover:border-slate-200'}`}
                  >
                    Returned
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context Brief</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none resize-none text-slate-700 font-bold text-lg italic leading-relaxed focus:ring-4 focus:ring-brand-orange/5"
                  placeholder="Details of the interaction..."
                  value={newExp.comment}
                  onChange={(e) => setNewExp({...newExp, comment: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-dark-blue text-white py-6 rounded-[1.8rem] font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-dark-blue/20 active:scale-95 transition-all"
              >
                Sync Intel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
