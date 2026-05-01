import React, { useState } from 'react';
import { 
  PackageSearch, Activity, ShieldAlert, Award, Package, 
  DollarSign, ChevronRight, CheckCircle2, XCircle, 
  BarChart3, TrendingUp, Hash, Loader2
} from 'lucide-react';
import { evaluateProduct, ProductData, EvaluationResult } from './services/gemini';

export default function App() {
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    category: '',
    price: 0,
    cost_price: 0,
    estimated_sales: 0,
    rating: 0,
    reviews: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Parse numeric fields automatically
    const isNumeric = ['price', 'cost_price', 'estimated_sales', 'rating', 'reviews'].includes(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      setError("Please fill in the product title and category.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const evaluation = await evaluateProduct(formData);
      setResult(evaluation);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <PackageSearch size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">FBA Intelligence</h1>
              <p className="text-[10px] uppercase font-medium text-amber-500 tracking-wider">Multi-Agent System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white tracking-tight">Product Metrics</h2>
                <p className="text-sm text-slate-400 mt-1">Enter target ASIN data to run analysis.</p>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Garlic Press Stainless Steel"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Kitchen & Dining"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Sell Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Cost Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        name="cost_price"
                        value={formData.cost_price || ''}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Est. Monthly Sales</label>
                    <div className="relative">
                      <Activity size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        name="estimated_sales"
                        value={formData.estimated_sales || ''}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Reviews</label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        name="reviews"
                        value={formData.reviews || ''}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Avg Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5.0"
                    name="rating"
                    value={formData.rating || ''}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing Framework...
                    </>
                  ) : (
                    <>
                      Run Intelligence Analysis
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Output / Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-4">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-red-500 font-medium">Analysis Failed</h3>
                  <p className="text-red-300/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!result && !error && !isLoading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                <PackageSearch size={48} className="mb-4 opacity-50" />
                <p className="font-medium text-lg text-slate-400">Awaiting Product Data</p>
                <p className="text-sm max-w-sm text-center mt-2">
                  Enter target product metrics on the left to activate the intelligence scoring system and verify viability.
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="h-full min-h-[400px] border border-slate-800 bg-slate-800/20 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                  <Loader2 size={40} className="text-amber-500 animate-spin relative z-10" />
                </div>
                <p className="mt-6 font-medium tracking-wide animate-pulse">Running Multi-Agent Validation...</p>
                <ul className="text-xs opacity-50 mt-4 space-y-2 text-center">
                  <li>Processing competition velocity...</li>
                  <li>Calculating margin viability...</li>
                  <li>Checking FBA friendliness...</li>
                </ul>
              </div>
            )}

            {result && !isLoading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                {/* Hero Status Card */}
                <div className={`rounded-2xl p-8 border ${result.final_verdict === 'WINNER' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} flex flex-col sm:flex-row sm:items-center justify-between gap-6`}>
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Intelligence Verdict</p>
                    <div className="flex items-center gap-3">
                      {result.final_verdict === 'WINNER' ? (
                        <CheckCircle2 size={40} className="text-emerald-500" />
                      ) : (
                        <XCircle size={40} className="text-rose-500" />
                      )}
                      <h2 className={`text-4xl font-extrabold tracking-tight ${result.final_verdict === 'WINNER' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.final_verdict}
                      </h2>
                    </div>
                    <p className="text-slate-300 max-w-lg mt-2 font-medium">
                      {result.reason}
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center min-w-[140px]">
                    <div className="text-xs uppercase font-semibold text-slate-500 mb-1">Confidence</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{result.confidence_score}</span>
                      <span className="text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <TrendingUp size={16} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Demand</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">{result.demand_score}</span>
                      <span className="text-sm text-slate-500 mb-1">/10</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(result.demand_score / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <ShieldAlert size={16} className="text-rose-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Competition</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">{result.competition_score}</span>
                      <span className="text-sm text-slate-500 mb-1">/10</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${(result.competition_score / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <DollarSign size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Est. Margin</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">{result.estimated_profit_margin}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3">
                      <div className={`h-1.5 rounded-full ${result.estimated_profit_margin >= 30 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, Math.max(0, result.estimated_profit_margin))}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <BarChart3 size={16} className="text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Scalability</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">{result.scalability_score}</span>
                      <span className="text-sm text-slate-500 mb-1">/10</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(result.scalability_score / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Additional Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${result.risk_level === 'Low' ? 'bg-emerald-500/20 text-emerald-500' : result.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">Risk Level Assessment</h4>
                      <p className={`font-bold text-lg mt-0.5 ${result.risk_level === 'Low' ? 'text-emerald-400' : result.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>
                        {result.risk_level} Risk
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${result.fba_friendly ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-500'}`}>
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">Logistics Check</h4>
                      <p className={`font-bold text-lg mt-0.5 ${result.fba_friendly ? 'text-indigo-300' : 'text-slate-400'}`}>
                        {result.fba_friendly ? 'FBA Friendly' : 'Not FBA Friendly (Complex)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Improvements Block */}
                {result.improvement_suggestions && result.improvement_suggestions.length > 0 && (
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                      <Award size={18} /> Wait! How to Improve This Opportunity
                    </h3>
                    <ul className="space-y-3">
                      {result.improvement_suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
